backend/ 
├── src/ 
│ ├── data/ # In-memory store powering the mock APIs
│ ├── middleware/ # Custom middleware 
│ │ ├── errorHandler.ts # Global error handling 
│ │ └── logger.ts # Request/response logging 
│ ├── routes/ # Route definitions 
│ │ ├── ai/ # OpenRouter proxy
│ │ ├── user/ # Product APIs
│ │ └── index.ts # Routes entry point 
│ ├── app.ts # Express application setup 
│ └── server.ts # Entrypoint used by nodemon/ts-node
├── .env.example # Example environment variables 
├── package.json 
├── tsconfig.json 
└── README.md

## Getting started

```bash
cd backend
npm install
npm run dev
```

The API listens on `PORT` (8000 by default). Set `CLIENT_URL` in `.env` if you need to lock CORS to a specific origin.

## REST endpoints

| Method | Route | Description |
| ------ | ----- | ----------- |
| `GET` | `/api/health` | Lightweight health check |
| `GET` | `/api/users` | Profile summary (name, goal, totals) |
| `GET` | `/api/users/dashboard` | Dashboard snapshot (streak, achievements, focus areas) |
| `GET` | `/api/users/workouts` | Weekly plan, next workout, recent sessions, and workout stats |
| `GET` | `/api/users/progress` | Readiness scores, milestone deltas, and lift/body composition data |
| `GET` | `/api/users/profile` | Detailed profile (personal info, body metrics, and preferences) |
| `POST` | `/api/users/check-ins` | Records a daily check-in and returns the refreshed dashboard payload |
| `POST` | `/api/users/onboarding` | Persists onboarding data and updates the dashboard/store |
| `PATCH` | `/api/users/profile` | Updates portions of the profile/preferences payload |
| `GET` | `/auth/google` | Initiates Google OAuth |
| `GET` | `/auth/google/callback` | OAuth callback that redirects to `CLIENT_URL` on success |
| `POST` | `/auth/logout` | Ends the passport session |

### OAuth configuration

Set these environment variables (see `.env.example`) to enable Google login:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `CLIENT_URL` – the frontend URL used after signing in
- `SERVER_URL` – the public origin of this backend (used for callback URLs)
- `SESSION_SECRET`

The OAuth responses are backed by an in-memory map in `src/auth/passport.ts`. Replace it with a database-backed store when you need persistence.

### Supabase storage

User-specific data (dashboard stats, workouts, progress, and profile details) lives in Supabase. Create the following table and supply the environment variables from `.env.example`:

```sql
create table if not exists public.user_data (
  id text primary key,
  data jsonb not null
);
```

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_TABLE` (defaults to `user_data`)

Each authenticated request uses `req.user.id` (the Google profile ID) to fetch or seed a JSON payload in that table. On the frontend you’ll now see your own streaks, workouts, and preferences instead of the old “Alex” placeholder once you sign in with Google.
