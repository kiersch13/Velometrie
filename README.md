# Bikewear App

A bike wear-part tracking app. Users can track their bikes and the wear parts installed on them (tyres, chains, cassettes, etc.), including install/removal mileage and dates. Integrates with Strava to authenticate users and sync odometer readings.

---

## Features

- **Bike management** — add, view, and update bike odometer readings
- **Wear-part tracking** — log install/removal dates and mileage for each component
- **Strava OAuth login** — authenticate via Strava; user profile and access tokens stored locally
- **Category filters** — bikes (`Rennrad`, `Gravel`, `Mountainbike`) and parts (`Reifen`, `Kassette`, `Kettenblatt`, `Kette`, `Sonstiges`)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | C# / ASP.NET Core / .NET 10 |
| Database | EF Core + SQLite (auto-migrated on startup) |
| Frontend | Angular 17 / TypeScript ~5.2 |
| Styling | Tailwind CSS + `@tailwindcss/forms` |
| Icons | `lucide-angular` |
| Auth | Strava OAuth 2.0 |

---

## Project Structure

```
bikewear_app/
├── backend/           # ASP.NET Core API
│   ├── Controllers/   # BikeController, WearPartController, AuthController
│   ├── Models/        # Bike, WearPart, User, StravaGear
│   ├── Services/      # Service interfaces + implementations
│   ├── Data/          # EF Core DbContext
│   └── Migrations/    # EF Core migrations
├── backend.tests/     # xUnit tests (in-memory EF Core)
│   └── Services/      # BikeServiceTests, WearPartServiceTests
└── frontend/          # Angular 17 SPA
    └── src/app/
        ├── components/ # add-bike, bike-list, bike-detail, wear-part-form, …
        ├── models/     # TypeScript interfaces matching backend models
        └── services/   # BikeService, WearPartService, AuthService
```

---

## Getting Started

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/)

### Backend

```bash
cd bikewear_app/backend
dotnet run
# API available at http://localhost:5059
```

### Frontend

```bash
cd bikewear_app/frontend
npm install
npm start
# App available at http://localhost:4200
```

The frontend reads the API base URL from `src/environments/environment.ts` — no hardcoded ports anywhere.

---

## Strava OAuth Setup

1. Create a Strava API application at https://www.strava.com/settings/api
2. Set the **Authorization Callback Domain** to `localhost`
3. Add your credentials to `bikewear_app/backend/appsettings.Development.json`:

```json
{
  "Strava": {
    "ClientId": "YOUR_CLIENT_ID",
    "ClientSecret": "YOUR_CLIENT_SECRET"
  }
}
```

---

## API Endpoints

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/bike` | List all bikes |
| `GET` | `/api/bike/{id}` | Get a single bike |
| `POST` | `/api/bike` | Create a bike |
| `PUT` | `/api/bike/{id}/kilometerstand` | Update odometer |
| `GET` | `/api/wearpart` | List all wear parts |
| `GET` | `/api/wearpart/bike/{radId}` | Wear parts for a bike |
| `GET` | `/api/wearpart/{id}` | Get a single wear part |
| `POST` | `/api/wearpart` | Create a wear part |
| `GET` | `/api/auth/strava/redirect-url` | Get Strava OAuth redirect URL |
| `POST` | `/api/auth/strava/callback` | Handle OAuth callback |

> Delete and general Update endpoints for `Bike` and `WearPart` are planned but not yet implemented.

---

## Running Tests

```bash
# Backend (xUnit)
cd bikewear_app/backend.tests
dotnet test

# Frontend (Jest)
cd bikewear_app/frontend
npm test -- --watchAll=false
```

---

## Configuration

| Key | Description | Default |
|---|---|---|
| `ConnectionStrings:DefaultConnection` | SQLite database path | `Data Source=bikewear.db` |
| `AllowedOrigins` | CORS allowed origins (array) | `["http://localhost:4200"]` |
| `Strava:ClientId` | Strava app client ID | — |
| `Strava:ClientSecret` | Strava app client secret | — |

Override via environment variables in production (e.g. on Railway).

---

## Roadmap

- [ ] Full CRUD for `Bike` (delete, general update)
- [ ] Full CRUD for `WearPart` (update, delete)
- [ ] Angular route guards for authenticated routes
- [ ] Automatic Strava odometer sync via webhook
- [ ] Strava access-token auto-refresh
- [ ] PostgreSQL support for production hosting
