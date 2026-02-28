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

# Copy the config template (contains ${PORT} placeholder)
COPY nginx.conf /etc/nginx/templates/default.conf.template

# At container startup, envsubst replaces ${PORT} with Railway's injected PORT
# value, writes the result to the active Nginx config, then starts Nginx.
# Falls back to port 80 if PORT is not set (e.g. local docker-compose).
ENV PORT=80
CMD ["/bin/sh", "-c", "envsubst '${PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
