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

# Default port for environments that do not inject PORT.
ENV PORT=80

# Copy compiled Angular app into Nginx's web root
COPY --from=build /app/dist/frontend /usr/share/nginx/html

# Copy Nginx config template (handles Angular client-side routing)
# The runtime startup script injects the PORT value before nginx starts.
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Create config deterministically from PORT and then start nginx in foreground.
RUN printf '%s\n' \
	'#!/bin/sh' \
	'set -eu' \
	': "${PORT:=80}"' \
	'sed "s/__PORT__/${PORT}/g" /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf' \
	'nginx -t' \
	'exec nginx -g "daemon off;"' \
	> /docker-entrypoint-custom.sh \
	&& chmod +x /docker-entrypoint-custom.sh

# Default port; Railway overrides this via the $PORT env variable at runtime.
# Docker's EXPOSE does not support variable substitution, so 80 is the fallback.
EXPOSE 80

CMD ["/docker-entrypoint-custom.sh"]
