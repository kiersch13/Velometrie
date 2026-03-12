# ──────────────────────────────────────────────
# Stage 1: Build
# Uses Node to compile the Angular app into static files
# ──────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies first (cached unless package.json changes)
COPY package*.json ./
RUN npm ci

# Copy source and build for production
# --configuration production swaps environment.ts → environment.prod.ts
COPY . .
RUN npm run build:prod

# ──────────────────────────────────────────────
# Stage 2: Serve
# Uses Nginx to serve the compiled static files (~25 MB image)
# ──────────────────────────────────────────────
FROM nginx:alpine AS runtime

# Copy compiled Angular app into Nginx's web root
COPY --from=build /app/dist/frontend /usr/share/nginx/html

# Copy Nginx config (handles Angular client-side routing)
# Uses the nginx template mechanism so the PORT env variable (injected by Railway)
# is substituted at container startup via 20-envsubst-on-templates.sh.
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Default port; Railway overrides this via the $PORT env variable at runtime.
# Docker's EXPOSE does not support variable substitution, so 80 is the fallback.
EXPOSE 80
