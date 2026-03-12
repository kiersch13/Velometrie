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
# Uses a lightweight Node static server to reliably bind Railway's dynamic PORT
# ──────────────────────────────────────────────
FROM node:20-alpine AS runtime

WORKDIR /app

# Default port for environments that do not inject PORT.
ENV PORT=80

# Install static file server with SPA fallback support
RUN npm install -g serve

# Copy compiled Angular app
COPY --from=build /app/dist/frontend /app

# Default port; Railway overrides this via the $PORT env variable at runtime.
# Docker's EXPOSE does not support variable substitution, so 80 is the fallback.
EXPOSE 80

CMD ["sh", "-c", "serve -s /app -l ${PORT}"]
