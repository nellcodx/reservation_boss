# Deploying the Lovable `/reservation` design

The narrow-column Lovable layout with the bottom nav and red **Reserve** button
lives in this repo at:

- Code: `packages/web/src/app/reservation/page.tsx`
- Component: `packages/web/src/components/customer/CustomerReservationForm.tsx`
- Layout: `packages/web/src/components/layouts/CustomerLayout.tsx`

It is a **Next.js 16** route. The page only ships when the Next.js app is
deployed to a host that runs Node (Vercel, Netlify, Coolify, a VPS, etc.).
The static `docs/` folder you see on **GitHub Pages** is intentionally a
plain HTML landing page — Pages cannot host a Next.js server, so it is not
the same application.

## Run locally

```bash
npm ci
npm run dev -w @rr/web
# open http://localhost:3000/reservation
```

## Deploy to Vercel (recommended)

1. Push the repo to GitHub (already done if you are reading this on GitHub).
2. Go to <https://vercel.com/new>, **Import Git Repository**, pick this repo.
3. Vercel reads the root [`vercel.json`](./vercel.json) and uses:
   - Install command: `npm ci`
   - Build command: `npm run build -w @rr/web`
   - Output directory: `packages/web/.next`
   - Framework: Next.js
4. (Optional, only if you use the `/api/*` DB routes) add an environment
   variable `DATABASE_URL` pointing at a reachable Postgres instance.
5. Click **Deploy**. After the first build, the Lovable design is at
   `https://<your-project>.vercel.app/reservation`.

If you prefer the Vercel dashboard route instead of `vercel.json`:
set **Root Directory** to `packages/web` and leave the rest on defaults.

## Deploy to Netlify

1. Push the repo to GitHub.
2. Go to <https://app.netlify.com/start>, **Add new site → Import from Git**,
   pick this repo.
3. Netlify reads [`netlify.toml`](./netlify.toml) and uses:
   - Build command: `npm ci && npm run build -w @rr/web`
   - Publish directory: `packages/web/.next`
   - Plugin: `@netlify/plugin-nextjs` (auto-installed for Next sites)
4. (Optional) add `DATABASE_URL` under **Site settings → Environment
   variables** if you exercise the `/api/*` DB routes.
5. After deploy: `https://<your-site>.netlify.app/reservation`.

## Self-host with Docker / Coolify / VPS

The repo also publishes images to GHCR via
[`.github/workflows/publish-ghcr.yml`](./.github/workflows/publish-ghcr.yml):

- `ghcr.io/<owner>/<repo>/rr-web:latest`
- `ghcr.io/<owner>/<repo>/rr-api:latest`

Run with `docker compose up`, or wire `rr-web` into Coolify / Dokku / Fly.io
behind a Postgres service. The Lovable page is at `/reservation` on whatever
hostname you bind to the `rr-web` container.

## Why GitHub Pages is not enough

GitHub Pages serves static files only. It cannot:

- run Next.js Server Components or `app/` route handlers,
- evaluate the Tailwind / `CustomerLayout` runtime,
- talk to the Prisma + Postgres backend that powers `/api/*`.

The static page in `docs/` is just a marketing/landing surface that links
back to this repo and out to whichever Vercel/Netlify URL you deploy.
