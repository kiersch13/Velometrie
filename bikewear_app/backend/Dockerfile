# ──────────────────────────────────────────────
# Stage 1: Build
# Uses the full .NET SDK to compile and publish
# ──────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy the project file first and restore dependencies.
# Docker caches this layer — restoring only reruns when .csproj changes.
COPY Backend.csproj ./
RUN dotnet restore

# Copy everything else and publish a Release build
COPY . .
RUN dotnet publish -c Release -o /app/publish --no-restore

# ──────────────────────────────────────────────
# Stage 2: Runtime
# Uses the smaller ASP.NET runtime image (~200 MB vs ~800 MB for SDK)
# ──────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

# Copy only the published output from the build stage
COPY --from=build /app/publish .

# Create the data directory where the SQLite database file will live.
# Without this, the app crashes on first start because MigrateAsync()
# cannot create the .db file in a non-existent directory.
RUN mkdir -p /app/data

# The SQLite database file will live in /app/data
# (mount this directory as a volume in production so data persists)
ENV ConnectionStrings__DefaultConnection="Data Source=/app/data/bikewear.db"

# Railway auto-injects a $PORT environment variable.
# We use shell form of CMD so $PORT is expanded at container startup.
# Falls back to 8080 if PORT is not set (e.g. local docker-compose).
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

CMD ASPNETCORE_URLS=http://+:${PORT:-8080} dotnet Backend.dll
