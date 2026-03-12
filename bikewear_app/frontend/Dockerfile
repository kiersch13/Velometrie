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
# Uses Nginx to serve the compiled static files
# ──────────────────────────────────────────────
FROM nginx:alpine AS runtime

# Default port for environments that do not inject PORT.
ENV PORT=8080

# Copy compiled Angular app into Nginx web root
COPY --from=build /app/dist/frontend /usr/share/nginx/html

# Copy Nginx config directly
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Default port; Railway overrides this via the $PORT env variable at runtime.
# Docker's EXPOSE does not support variable substitution, so 80 is used.
EXPOSE 80

