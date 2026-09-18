# Trending Edits Zone - Lightweight Next.js Admin

This package adds a lightweight admin panel to an existing Next.js App Router project.

## Install

```bash
npm install @neondatabase/serverless jose bcryptjs
```

## Environment variables

Create/update `.env.local`:

```env
DATABASE_URL="YOUR_NEON_DATABASE_URL"
AUTH_SECRET="replace-with-a-long-random-secret"
ADMIN_EMAIL="admin@tez.com"
ADMIN_PASSWORD_HASH="GENERATE_A_BCRYPT_HASH"
```

Generate a password hash:

```bash
node -e "const bcrypt=require('bcryptjs'); console.log(bcrypt.hashSync('Tez@2111', 12))"
```

Copy the output into `ADMIN_PASSWORD_HASH`.

## Neon SQL

Run this SQL in the Neon SQL Editor:

```sql
create table if not exists posts (
  id serial primary key,
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  category text default 'AI Prompts',
  type text default 'prompt',
  cover_image text,
  external_url text,
  prompt_text text,
  alight_motion_url text,
  status text default 'published',
  featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

## Files

Copy the files into your existing project, preserving your existing app.

Admin URL:

`/admin/login`

Default credentials:

- Email: `admin@tez.com`
- Password: `Tez@2111`

Change the password hash before production.

## Run

```bash
npm run dev
```

## Vercel deployment

1. Push the project to GitHub.
2. Import it into Vercel.
3. Add `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD_HASH` under Vercel Project Settings > Environment Variables.
4. Deploy.
