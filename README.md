# churchWebsite

## JSC Youth Development Ministry

React + TypeScript + Vite + Tailwind CSS + Framer Motion site built from the five supplied JSC campus screenshots.

## Run

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

The admin attendance page currently persists records to browser `localStorage`. Replace that persistence layer with authenticated backend APIs before production.

## Neon and Vercel setup

The app now includes Vercel serverless API routes for shared members and attendance data. In the Vercel project settings, add this environment variable for Production, Preview, and Development:

```env
DATABASE_URL=your_neon_postgres_connection_string
```

The value must be the Neon Postgres connection string and must never be placed in `VITE_` variables or committed to Git. The first API request creates the `members`, `attendance`, and `system_metadata` tables automatically.
