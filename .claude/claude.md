# Bikewear App – Agent Context

<!--
  TEMPLATE GUIDE
  ==============
  Sections marked [PROJECT] are project-specific — edit them for each new project.
  Sections marked [UNIVERSAL] apply to all projects using this template — keep as-is or adjust team-wide.
  Agents: read this file before generating, testing, or reviewing code.
-->

---

## [PROJECT] Overview

A bike wear-part tracking app. Users track their bikes and the wear parts installed on each bike (tyres, chains, cassettes, etc.), including install/removal mileage and dates. Strava OAuth is implemented; automatic odometer sync via webhook is planned.

- Domain language is **German** (user-facing terms, model properties, enum values).
- Source for original requirements: `bikewear_app/docs/prompts/startprompt.txt`

---

## [PROJECT] Tech Stack

| Layer | Technology |
|---|---|
| Backend | C# / ASP.NET Core / .NET 10 |
| Database | EF Core with SQLite (`bikewear.db`) — auto-migrated on startup via `db.Database.MigrateAsync()` |
| Frontend | Angular 17 / TypeScript ~5.2 |
| Icons | `lucide-angular` — imported via `LucideAngularModule.pick({})`, tree-shakeable |
| CSS plugins | `@tailwindcss/forms` — polishes default form input appearance |
| Auth | Strava OAuth 2.0 — `GET /api/auth/strava/redirect-url` + `POST /api/auth/strava/callback`; user stored in DB with `StravaId`, `AccessToken`, `RefreshToken`, `TokenExpiresAt`, `Vorname`; frontend stores user in `localStorage` |
| Testing (backend) | xUnit + `Microsoft.EntityFrameworkCore.InMemory` — test project at `bikewear_app/backend.tests/` |
| Testing (frontend) | Jest (`jest.config.js`) — spec files co-located with services (e.g. `bike.service.spec.ts`) |

> Dependency details (NuGet packages, Angular modules) live in `Backend.csproj` and `app.module.ts` respectively — do not duplicate them here.

---

## [PROJECT] Dev Environment

```bash
# Backend  (from bikewear_app/backend/)
dotnet run
# → http://localhost:5059  |  https://localhost:7122

# Frontend  (from bikewear_app/frontend/)
npm start
# → http://localhost:4200
```

Frontend calls backend at `http://localhost:5059`. The backend API URL is configured via `environment.apiBaseUrl` in the Angular environment files — never hardcode it.

CORS allowed origins are read from the `AllowedOrigins` config section (overridable via environment variable in production). Local default is `http://localhost:4200`.

---

## [PROJECT] Architecture Decisions

These are deliberate choices that are **not visible from the code alone**. Follow them unless a prompt explicitly changes them.

- **No DTOs** — models are used directly as API contracts. Don't introduce DTOs without a prompt requesting it.
- **Backend namespace is `App.*`** — not `Backend.*`, even though the project folder is `backend/`.
- **No EF navigation properties** — `WearPart.RadId` is a manual FK. Joins are done in service code.
- **No auth middleware yet** — `[Authorize]` attributes and Angular route guards are intentionally absent (Strava OAuth flow is implemented, but route protection is not).
- **Scoped DI** — all services are registered as `Scoped`.
- **Async throughout** — every service method and controller action must be `async Task<…>`.
- **Frontend enums are string-typed** and their values must match the C# enum member names exactly.
- **Full CRUD for domain entities** — `Rad` and `WearPart` must always expose all four CRUD operations (Create, Read, Update, Delete) in both backend (controller + service interface + service implementation) and frontend (service + UI). Partial implementations are considered incomplete. `User` and `StravaGear` are exempt: `User` is lifecycle-managed via Strava OAuth, and `StravaGear` is a transient API wrapper without its own DB table.

---

## [PROJECT] Naming Conventions

| Category | Convention |
|---|---|
| Domain model properties | German (`Kilometerstand`, `Einbau/Ausbau`, `Rad`, `Kategorie`) |
| Infrastructure identifiers | English (`Controller`, `Service`, `DbContext`, `Id`) |
| C# enums | German values — `BikeCategory`: `Rennrad`, `Gravel`, `Mountainbike`; `WearPartCategory`: `Reifen`, `Kassette`, `Kettenblatt`, `Kette`, `Sonstiges` |
| Angular components | kebab-case matching feature name (`bike-list`, `wear-part-form`) |

---

## [PROJECT] Frontend Style Guide

### Styling Approach
- **CSS framework:** Tailwind CSS
- **No inline styles** — use Tailwind utility classes only; never `style="..."` attributes
- **No emojis** anywhere in the UI
- **Icons**: use `lucide-angular` — `<lucide-icon name="icon-name" [size]="16">`. Import only used icons in `NgIconsModule.pick({})` in `app.module.ts`. Icon names are kebab-case (e.g. `arrow-left`, `check-circle-2`). Browse at https://lucide.dev/icons/
- **Font**: Inter via Google Fonts (`<link>` in `index.html`), registered in Tailwind as `fontFamily.sans`
- **Spacing:** follow the 4/8px grid — prefer Tailwind's default spacing scale (`p-2`, `p-4`, `gap-4`, etc.)
- **Mobile-first** — write base styles for mobile, extend with `md:` / `lg:` breakpoints
- **Dark mode:** use Tailwind's `dark:` variant; dark mode is class-based (`class="dark"` on `<html>`)

> Tailwind is already installed and configured. `tailwind.config.js` contains the full color palette, custom `boxShadow` tokens (`shadow-card`, `shadow-card-hover`), and Inter font family.
> `@tailwindcss/forms` is installed — it auto-styles `<input>`, `<select>`, `<textarea>` elements.
> Reusable class aliases are defined in `@layer components` inside `src/styles.css`: `.btn-primary`, `.btn-secondary`, `.btn-danger`, `.form-input`, `.badge`, `.card`, `.page-title`.

---

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| Primary | `#1E3932` | Branding, headers, major UI components |
| Accent | `#E85D00` | Buttons, links, calls-to-action |
| Background Light | `#F8F7F4` | Page background (light mode) |
| Background Dark | `#1F292E` | Page background (dark mode) |
| Text Light | `#1C1C1E` | Main text (light mode) |
| Text Dark | `#E4E2E0` | Main text (dark mode) |
| Success | `#2A9D5F` | Confirmation messages, positive states |
| Warning | `#F4A261` | Caution messages, alerts |
| Error | `#E63946` | Error messages, destructive actions |

In Tailwind config, register these as custom colors under `theme.extend.colors`:
```js
colors: {
  primary:    '#1E3932',
  accent:     '#E85D00',
  'bg-light':    '#F8F7F4',
  'bg-dark':     '#1F292E',
  'text-light':  '#1C1C1E',
  'text-dark':   '#E4E2E0',
  success:    '#2A9D5F',
  warning:    '#F4A261',
  error:      '#E63946',
}
```

---

## [PROJECT] Roadmap & Constraints

**Implemented:**
- Strava OAuth 2.0 login flow (redirect URL + callback)
- Full CRUD for `Bike` (Create, Read, UpdateKilometerstand, UpdateBike, Delete) — backend + frontend + UI
- Full CRUD for `WearPart` (Create, Read, Update, Delete) — backend + frontend + UI (inline edit form in bike-detail)

**Planned (not yet implemented):**
- Angular route guards (OAuth is done; guards just haven't been added yet)
- Automatic `Kilometerstand` sync via Strava webhook
- Strava token refresh (token is stored, but auto-refresh is not yet triggered)
- Swap SQLite for PostgreSQL when hosting (provider swap only — no service/model changes needed)

**Hard constraints for agents:**
- Do **not** swap the database provider unless explicitly asked.
- Do **not** add Angular route guards without an explicit prompt.
- Do **not** introduce a DTO layer without an explicit prompt.
- Do **not** change the German domain naming without an explicit prompt.

---

## [UNIVERSAL] Available Subagents

- `backend` — C# / ASP.NET Core / EF Core expert. Generates and modifies backend services, controllers, and models.
- `frontend` — Angular 17 / TypeScript / Tailwind expert. Generates and modifies components, services, and models.
- `code-reviewer` — Code review against project conventions. Returns issues by severity with a PASS/FAIL verdict.
- `qa` — Generates tests for a code snippet, runs them, and reports pass/fail results.
- `research` — Deep research via web search, file reads, and codebase exploration. Returns concise sourced findings.

---

## [UNIVERSAL] Design & Build Workflow

When building or modifying any non-trivial feature, follow this loop:

1. **Write/edit the code** — Spawn `backend` and/or `frontend`.
2. **Code Review** — Spawn `code-reviewer` with the changed file(s). It reports issues back — it does NOT fix anything itself.
3. **QA** — Spawn `qa` with the changed code. It generates tests, runs them, and reports results back — it does NOT fix anything itself.
4. **Fix** — Read the review and QA reports and give fix instructions back to `backend` and/or `frontend`.
5. **Ship** — Only after review passes and all tests pass.

For research-heavy tasks, spawn `research` first to gather context without polluting the main conversation.

**Parallel execution:** When reviewing + QA'ing independent files, spawn both subagents in parallel.

**Update this file** — if a task changes an architectural decision or adds a new convention, update the relevant `[PROJECT]` section before finishing.

---

## [UNIVERSAL] Definition of Done

A code change is complete when:

- [ ] The backend builds without errors (`dotnet build`).
- [ ] The frontend compiles without errors (`npm run build`).
- [ ] No new lint warnings are introduced.
- [ ] All affected API endpoints are consistent between backend controller, service interface, service implementation, and frontend service.
- [ ] Frontend model interfaces match backend model properties (names and types).
- [ ] The Roadmap constraints above are not violated.
- [ ] Domain entities `Rad` and `WearPart` have full CRUD coverage (backend controller + service + frontend service + UI).
- [ ] Every new or changed service method has a corresponding test (backend: xUnit; frontend: Jest).
- [ ] All tests pass (`dotnet test` for backend, `npm test -- --watchAll=false` for frontend).


