# FitStreak – Human-First Training OS

FitStreak is our HackNYU 2025 project: a calmer fitness companion that blends mindful coaching, adaptive programming, and gentle accountability. The monorepo contains everything needed to ship the experience—polished marketing/UX flows in Next.js 16 on the frontend, and a TypeScript Express API that powers onboarding, Google OAuth, Supabase persistence, and OpenRouter AI helpers.

## Highlights
- ✨ **Cinematic landing + onboarding** – marketing hero, multi-step onboarding, and personalization flows built with Tailwind, shadcn/ui, and Lucide iconography.
- 📊 **Live dashboards & rituals** – streak widgets, XP tracking, workout planners, progress views, and check-ins synced to per-user JSON documents in Supabase.
- 🤝 **Secure auth** – Google OAuth via Passport.js plus cookie sessions, with optional CORS locking per environment.
- 🧠 **AI + voice accents** – OpenRouter-backed coaching copy and ElevenLabs-powered voice journaling/voice prompts exposed through Next API routes.
- 🧱 **Batteries-included backend** – structured data store, logging/error middleware, REST routes, and simulation utilities for seeding realistic athlete data.

## Repository layout

| Path | Description |
| --- | --- |
| `frontend/` | Next.js 16 + React 19 app (App Router) with Tailwind, shadcn/ui, hooks, voice APIs, and all marketing/dashboard pages. Uses `pnpm`. |
| `backend/` | Express + TypeScript server with Supabase integration, Google OAuth, OpenRouter proxy, and mock data store. Runs with `pnpm` or `npm`. |
| `LICENSE` | MIT-style license for HackNYU submission. |

The backend folder ships with a detailed README; frontend docs are currently being tracked separately and will be added later.

## Tech stack
- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui, Radix primitives, Recharts, Embla carousel, Sonner toasts, Axios.
- **Backend**: Node 20+, Express 5, TypeScript, Passport (Google OAuth), Supabase client (via service role key), OpenRouter SDK, Nodemon/ts-node for dev.
- **Voice/AI**: ElevenLabs Text-to-Speech via Next API routes, OpenRouter LLM completions proxied by the backend.

## Prerequisites
- Node.js **20.x** (Next 16 + Express 5 require native fetch & web streams).
- `pnpm` **10.x** (matches the `packageManager` field in both workspaces).
- Supabase project (or use the in-memory mock store during early prototyping).
- Google Cloud OAuth client (Web application) for real authentication.
- Optional: ElevenLabs API key + voice ID for audio responses.

## Getting started

```bash
# install dependencies
pnpm install --dir frontend
pnpm install --dir backend
```

Create environment files:

### Backend (`backend/.env`)
```
PORT=8000
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:8000
SESSION_SECRET=change-me
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=service-role-key
SUPABASE_TABLE=user_data   # optional override
OPENROUTER_API_KEY=sk-or-...
```

> The Supabase table just needs two columns: `id text primary key, data jsonb not null`. Mock data in `src/data` is used automatically if Supabase credentials are missing.

### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_GOOGLE_AUTH_URL=http://localhost:8000/auth/google
ELEVENLABS_API_KEY=optional-elevenlabs-key
ELEVENLABS_VOICE_ID=optional-voice-id
```

`NEXT_PUBLIC_GOOGLE_AUTH_URL` is only required if the backend runs on a non-standard origin; otherwise the computed `/auth/google` route is used.

### Run the stacks

```bash
# backend API on http://localhost:8000
cd backend && pnpm dev

# frontend app on http://localhost:3000
cd frontend && pnpm dev
```

Open `http://localhost:3000` to explore the landing page → onboarding flow → authenticated dashboard. The frontend reads/writes through `NEXT_PUBLIC_API_BASE_URL`; when logged in with Google the session cookie lets the backend resolve `req.user.id` and persist data per athlete.

## API surface

The Express server exposes REST routes under `/api` (see `backend/src/routes`). Key endpoints:

| Method | Route | Purpose |
| --- | --- | --- |
| `GET /api/users` | Profile summary (goal, XP, totals, level). |
| `GET /api/users/dashboard` | Dashboard streaks, achievements, focus areas, recommended sessions. |
| `GET /api/users/workouts` | Week plan, next workout, habit tiles, workout stats. |
| `GET /api/users/progress` | Readiness score trends, milestone deltas, body composition data. |
| `GET /api/users/profile` | Personal metrics + preference payload used during onboarding. |
| `POST /api/users/check-ins` | Records a daily check-in and returns updated dashboard data. |
| `POST /api/users/onboarding` | Stores onboarding answers (goals, context, focus). |
| `PATCH /api/users/profile` | Update parts of the profile/preferences payload. |
| `GET /auth/google` / `GET /auth/google/callback` | Google OAuth handshake (redirects to `CLIENT_URL`). |
| `POST /auth/logout` | Clear the active session. |

AI routes live at `/api/ai/...` and proxy requests to OpenRouter with server-side API keys so the frontend does not expose secrets.

## Frontend flows
- `/` – hero marketing page with CTA + Google OAuth.
- `/welcome` – handoff after signup with short ritual suggestions.
- `/onboarding/*` – multi-step wizard (body metrics, goals, preferences).
- `/dashboard`, `/workouts`, `/workout`, `/profile`, `/simulate` – authenticated experiences displaying typed responses from the backend.
- `/api/voice` + `/api/voice-stream` – server actions that turn text journaling into ElevenLabs audio, keeping keys out of the browser.

Shared UI primitives live in `frontend/components/ui`, while `hooks/` (e.g., `useDashboardData`) handle SWR-style fetching, optimistic updates, and error messaging so pages stay declarative.

## Useful scripts

| Location | Script | Description |
| --- | --- | --- |
| `frontend` | `pnpm dev` | Next dev server with hot reload + Tailwind. |
|  | `pnpm build` / `pnpm start` | Production build and Node server. |
|  | `pnpm lint` | ESLint over the entire app dir. |
| `backend` | `pnpm dev` | Nodemon + ts-node running `src/server.ts`. |
|  | `pnpm build` | Emit JS to `dist/`. |
|  | `pnpm start` | Run compiled server. |

## Deployment notes
- Frontend can be deployed on Vercel/Netlify; set env vars in the hosting console and point `NEXT_PUBLIC_API_BASE_URL` to the deployed backend.
- Backend ships cleanly to services like Fly.io, Render, Railway, or a traditional VM. Remember to supply environment variables/secrets and configure the OAuth callback URLs to match `SERVER_URL`.
- For production Supabase, rotate service keys regularly and consider swapping session storage from memory to Redis or a database.

## License

Released under the MIT license (`LICENSE`). Feel free to fork/customize for hackathons or future FitStreak iterations—just remove vendor keys before publishing your own builds.
