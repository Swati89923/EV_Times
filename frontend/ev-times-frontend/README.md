# EV Times — Frontend

React 19 + Vite SPA for the EV Times platform. See the [project root README](../../README.md)
for full architecture, Docker, and environment variable documentation —
this file covers frontend-only local development.

## Local development

```bash
cp .env.example .env   # adjust VITE_API_BASE_URL if your backend isn't on localhost:8080
npm install
npm run dev
```

Runs on http://localhost:5173 by default.

## Build

```bash
npm run build       # outputs to dist/
npm run preview     # serve the production build locally
```

## Project structure

```
src/
├── components/    Reusable UI (NewsCard, Navbar, SearchBar, FilterBar, Skeleton, Toast, ...)
├── context/       ThemeContext, ToastContext, AuthContext
├── hooks/         useDebounce, useInfiniteScroll
├── pages/         Route-level views
├── services/      API client + per-resource service modules
└── utils/         storage.js (bookmarks/likes/recent searches), news.js (formatting helpers)
```

## Environment variables

| Variable | Default |
|---|---|
| `VITE_API_BASE_URL` | `http://127.0.0.1:8080` |

Vite inlines env vars into the build at build time — changing this requires
a rebuild, not just a restart, once deployed.
