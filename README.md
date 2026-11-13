# EV Times — Electric Vehicle News Platform

A full-stack EV news platform: React 19 + Vite frontend, Spring Boot 3
backend, MySQL, Redis, and an optional local AI assistant via Ollama.

```
├── frontend/ev-times-frontend/   React + Vite SPA
├── backend/evtime-backend/       Spring Boot 3 REST API
├── docker-compose.yml            Full local/prod-shaped stack
└── .env.example                  Copy to .env before running compose
```

## Architecture at a glance

- **Frontend**: React 19, React Router 7, Axios, Framer Motion. Talks to the
  backend over REST via a single configured `api` client
  (`src/services/api.js`) that attaches the JWT automatically.
- **Backend**: Spring Boot 3, Spring Security (JWT, stateless), Spring Data
  JPA (MySQL), Spring Cache (Redis), Spring AI (Ollama) for the AI
  assistant/summary features, a scheduled job that pulls EV news from
  NewsAPI.org hourly.
- **Data**: MySQL for persistent data, Redis for cached read-heavy queries
  (news listings, popular/category views).

## Prerequisites

- Docker + Docker Compose (easiest path — see below), **or**
- Java 17, Node 20+, a local MySQL 8 instance, and Redis, for running each
  service directly.

## Quickest start: Docker Compose

```bash
cp .env.example .env
# edit .env — at minimum set DB_PASSWORD, DB_ROOT_PASSWORD, and JWT_SECRET
# generate a JWT secret with: openssl rand -base64 48

docker compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8080
- MySQL: localhost:3306
- Redis: localhost:6379

The `ollama` service pulls a fairly large image and isn't needed unless
you're using the AI chat/summary features. To skip it:

```bash
docker compose up --build --scale ollama=0
```

If you do want AI features working locally, pull the model once the
container is up:

```bash
docker compose exec ollama ollama pull qwen2.5:0.5b
```

### Rebuilding after a change

```bash
docker compose up --build backend   # backend only
docker compose up --build frontend  # frontend only
```

Note: the frontend's API base URL is **baked in at build time** (Vite
inlines env vars into the static bundle — there's no server to read a
runtime env var from). If you change `VITE_API_BASE_URL` in `.env`, you
need to rebuild the frontend image, not just restart the container.

## Running without Docker

### Backend

```bash
cd backend/evtime-backend
cp .env.example .env   # then export these, or set them in your run config —
                        # Spring Boot does not read .env files on its own
./gradlew bootRun
```

You'll need a local MySQL database matching `DB_URL`/`DB_USERNAME`/
`DB_PASSWORD`, and Redis running on `REDIS_HOST`/`REDIS_PORT`. Both default
to `localhost` with standard ports if unset.

### Frontend

```bash
cd frontend/ev-times-frontend
cp .env.example .env   # defaults to http://127.0.0.1:8080, adjust if needed
npm install
npm run dev
```

## Environment variables reference

### Backend (`backend/evtime-backend`)

| Variable | Required | Default | Notes |
|---|---|---|---|
| `DB_URL` | no | `jdbc:mysql://localhost:3306/evtimesdb` | |
| `DB_USERNAME` | no | `root` | |
| `DB_PASSWORD` | **yes** in any non-local env | `changeme` | |
| `DDL_AUTO` | no | `update` | Use `validate` in production once your schema is stable — `update` auto-altering tables against a live production DB is risky |
| `NEWS_API_KEY` | no | empty | Get one at newsapi.org. Scheduled fetch no-ops without it |
| `NEWS_FETCH_ENABLED` | no | `true` | |
| `NEWS_FETCH_CRON` | no | `0 0 * * * *` (hourly) | |
| `JWT_SECRET` | **yes** | dev-only fallback | Must be ≥32 chars. App fails to start without a valid one |
| `JWT_EXPIRATION_MS` | no | `3600000` (1h) | |
| `CORS_ALLOWED_ORIGINS` | **yes** in any non-local env | `http://localhost:5173` | Comma-separated exact origins, never `*` |
| `REDIS_HOST` / `REDIS_PORT` | no | `localhost` / `6379` | |
| `OLLAMA_BASE_URL` / `OLLAMA_MODEL` | no | `http://localhost:11434` / `qwen2.5:0.5b` | Only used by the AI features |
| `LOG_LEVEL` | no | `INFO` | Application package log level |

### Frontend (`frontend/ev-times-frontend`)

| Variable | Required | Default |
|---|---|---|
| `VITE_API_BASE_URL` | no | `http://127.0.0.1:8080` |

## Production deployment notes

This is a real checklist, not a formality — several of these matter a lot:

1. **Rotate every secret that was ever committed to the repo or shared in
   plaintext.** If a NewsAPI key or DB password ever lived in
   `application.properties` in git history, it's compromised regardless of
   what the file contains now.
2. **Set `DDL_AUTO=validate`** once your schema is stable. `update` is
   convenient for development but will silently alter a production table
   structure based on entity changes — that's not something you want
   running unattended against real data.
3. **`JWT_SECRET` must be a real, random, ≥32-character value** — generate
   with `openssl rand -base64 48`. The app refuses to start with a short or
   missing one, but a *default-looking* long string is just as bad as a
   short one; don't reuse the example value.
4. **Put the backend behind HTTPS** (a reverse proxy like nginx or a cloud
   load balancer terminating TLS) — this app has no TLS termination of its
   own, and JWTs sent over plain HTTP are visible to anyone on the network
   path.
5. **`CORS_ALLOWED_ORIGINS`** must be your real frontend origin(s), not
   `localhost`.
6. **File uploads** (`FileUploadController`) currently write to a local
   `uploads/` directory (mounted as a Docker volume in this compose setup).
   That works for a single instance; it will not survive a redeploy or work
   correctly if you scale the backend horizontally without moving to object
   storage (S3-compatible, etc.) — this refactor hasn't done that migration.
7. **Redis and MySQL should be managed services or have their own backup /
   persistence strategy** in production — the compose volumes here are
   sufficient for local development, not a production data guarantee.
8. **Rate limiting** is not implemented anywhere in this API. If you expose
   it publicly, put a rate limiter in front (API gateway, nginx
   `limit_req`, or a Spring filter) — this is a known, real gap, not an
   oversight to ignore.

## Known gaps (honest status)

- `BlogController`/`VideoController`/`NewsletterController`/
  `AnalyticsController` bind entities directly rather than going through
  DTOs like `News`/`Comment` do.
- The `Category` entity exists but isn't wired to any controller.
- No automated test suite exists for either the frontend or backend beyond
  the default Spring Boot test scaffold.
- File uploads are local-disk only (see deployment note #6 above).

## License

This project is for learning and personal use.
