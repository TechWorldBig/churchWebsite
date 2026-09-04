# churchWebsite

## JSC Youth Development Ministry

React + TypeScript + Vite + Tailwind CSS + Framer Motion site built from the five supplied JSC campus screenshots.

## Run

```bash
npm install
npm run dev
```

The local Vite development server deliberately blocks the database-backed member, attendance, gallery, and update routes. It never loads those production records. Only `/api/assistant` is forwarded to the deployed Vercel function so AI answers can be tested without exposing the server-side OpenAI key.

## Production build

```bash
npm run build
```

On Vercel, members and attendance are stored through the server-side Neon API. No member, attendance, login, or metadata data is stored in browser `localStorage`.

## Neon and Vercel setup

The app now includes Vercel serverless API routes for shared members and attendance data. In the Vercel project settings, add this environment variable for Production, Preview, and Development:

```env
DATABASE_URL=your_neon_postgres_connection_string
# POSTGRES_URL also works if that is the variable provided by Vercel/Neon
```

The value must be the Neon Postgres connection string and must never be placed in `VITE_` variables or committed to Git. The first API request creates the `members`, `attendance`, and `system_metadata` tables automatically.

## YDM assistant setup

The scoped YDM and Bible assistant uses the OpenAI Responses API with web search. Add this server-side environment variable in the Vercel project settings for Production, Preview, and Development:

```env
OPENAI_API_KEY=your_openai_api_key
# Optional; defaults to gpt-5.4-mini
OPENAI_MODEL=gpt-5.4-mini
```

Never expose the key through a `VITE_` variable. The dedicated Bible-reference lookup, member lookup, and attendance lookup continue to use their existing data sources.
