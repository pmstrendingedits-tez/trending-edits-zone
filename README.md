# Trending Edits Zone

A full blog site + admin panel, inspired by the layout/features of niche "editing presets & prompts" blogs (trending strip, category labels, post grid, download links, search) — built with Next.js and a free database.

## Stack

- **Next.js 14** (App Router) — hosts perfectly on Vercel's free tier
- **MongoDB Atlas free tier (M0)** — 512MB free forever, no credit card cold-start issues
- **Tailwind CSS**
- **JWT + httpOnly cookie** for a single admin login (no separate users database needed)

## Features

**Public site**
- Homepage with a "Trending" strip and a "Read More" post grid
- Category pages (`/category/[slug]`) — same as the original's "Labels"
- Post detail pages with markdown content, thumbnail, tags, and download buttons
- Full-text search (`/search?q=...`)
- Static pages: About, Contact, Privacy Policy, Disclaimer, Terms & Conditions (edit in `lib/staticPages.js`)

**Admin panel** (`/admin`)
- Secure login (single admin account, credentials in environment variables)
- Dashboard with post/category stats and most-viewed posts
- Create / edit / delete posts (title, slug, category, thumbnail URL, excerpt, markdown content, tags, multiple download links, published/trending toggles)
- Create / rename / delete categories

---

## 1. Get a free database (MongoDB Atlas)

1. Go to https://www.mongodb.com/cloud/atlas/register and create a free account.
2. Create a new **free M0 cluster** (pick any region close to you).
3. Under **Database Access**, create a database user (username + password).
4. Under **Network Access**, click **Add IP Address** → **Allow Access From Anywhere** (`0.0.0.0/0`) — required since Vercel's serverless functions use dynamic IPs.
5. Click **Connect** on your cluster → **Drivers** → copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Add a database name to the path, e.g.:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/trending-edits-zone?retryWrites=true&w=majority
   ```
   This is your `MONGODB_URI`.

## 2. Configure environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in:

- `MONGODB_URI` — from step 1 above
- `ADMIN_USERNAME` — whatever username you want to log in with, e.g. `admin`
- `ADMIN_PASSWORD_HASH` — generate this by running:
  ```bash
  node scripts/hash-password.js YourStrongPassword123
  ```
  Copy the printed hash into `.env.local`.
- `JWT_SECRET` — any long random string (e.g. generate one at https://generate-secret.vercel.app/32)
- `NEXT_PUBLIC_SITE_NAME` — e.g. `Trending Edits Zone`
- `NEXT_PUBLIC_SITE_URL` — your final Vercel URL, e.g. `https://trending-edits-zone.vercel.app`

## 3. Install and run locally

```bash
npm install
npm run dev
```

Visit http://localhost:3000 for the public site and http://localhost:3000/admin/login for the admin panel.

### Optional: seed sample content

```bash
npm run seed
```

This creates a few sample categories and posts so the site isn't empty. Edit/delete them from the admin panel afterward.

## 4. Deploy to Vercel (free)

1. Push this project to a GitHub repository.
2. Go to https://vercel.com, click **Add New → Project**, and import the repo.
3. In **Environment Variables**, add the same variables from your `.env.local`:
   - `MONGODB_URI`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD_HASH`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_SITE_NAME`
   - `NEXT_PUBLIC_SITE_URL` (set to your actual `*.vercel.app` URL, or custom domain)
4. Click **Deploy**.
5. Once live, visit `https://your-project.vercel.app/admin/login` and log in with the admin credentials you set.

## Notes on images

This project doesn't include file uploads (Vercel's serverless functions have no persistent disk). Instead, the admin post form takes an **image URL** for thumbnails. Easiest free options:

- Upload images to a free image host like **Cloudinary** (free tier, 25 credits/month) or **imgbb.com**, then paste the resulting URL.
- Or use any publicly accessible image URL.

## Project structure

```
app/                    → Next.js routes (pages + API)
  admin/                → Admin panel pages (protected by middleware.js)
  api/                  → API routes (public + /api/admin/* protected)
  category/[slug]/      → Category listing page
  post/[slug]/          → Post detail page
  page/[slug]/          → Static pages (About, Privacy, etc.)
  search/               → Search results page
components/             → Shared React components
lib/                    → DB connection, auth helpers, static page content
models/                 → Mongoose schemas (Post, Category)
scripts/                → hash-password.js, seed.js
middleware.js           → Protects /admin and /api/admin routes
```

## Customizing

- **Site name / colors**: edit `NEXT_PUBLIC_SITE_NAME` env var and `brand` color in `tailwind.config.js`.
- **Static pages content**: edit `lib/staticPages.js`.
- **Logo**: replace the "T" circle in `components/Header.js` with an `<Image>` pointing to your logo URL.
