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
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
