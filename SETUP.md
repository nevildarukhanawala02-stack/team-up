# Team Up Website — Setup Guide

This project was originally built on the Manus platform. It has been
de-coupled from Manus-specific infrastructure so it now runs anywhere:
locally, on GitHub, and on Railway. See "What changed" at the bottom for
details.

## 1. Local setup

Requirements: Node 20+ and pnpm (`npm install -g pnpm` if you don't have it).

```bash
cd team-up-homepage        # this folder
pnpm install
pnpm run dev                # starts Vite dev server on http://localhost:3000
```

To test a production build locally:

```bash
pnpm run build               # builds client (dist/public) + server (dist/index.js)
pnpm run start                # NODE_ENV=production node dist/index.js
```

Other useful scripts:

```bash
pnpm run check                # TypeScript check, no emit
pnpm run format                # prettier --write .
```

## 2. Push to GitHub

If you already extracted this folder into your `TeamUp Github` directory,
just run these from inside it:

```bash
git init
git add .
git commit -m "Initial commit — Team Up website"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

If the repo doesn't exist yet on GitHub, create it first (empty, no README/
license) at github.com/new, then run the commands above.

`.gitignore` already excludes `node_modules/`, `dist/`, `.env*`, and other
generated files — you don't need to touch it.

## 3. Deploy to Railway

Easiest path — deploy straight from the GitHub repo you just pushed:

1. Go to railway.app → **New Project** → **Deploy from GitHub repo**.
2. Select your `team-up-homepage` repo (authorize Railway's GitHub app if
   prompted).
3. Railway auto-detects Node/pnpm via `package.json` and the included
   `railway.json`. It will run `pnpm install`, then `pnpm run build`
   (defined as the build command), then start with `pnpm start`.
4. Railway sets `PORT` automatically — the server already reads
   `process.env.PORT`, so no config needed there.
5. Once deployed, Railway gives you a `*.up.railway.app` URL. Add a custom
   domain under **Settings → Networking** if you have one.

Every future `git push` to `main` will trigger an automatic redeploy.

Alternative: the Railway CLI (`npm i -g @railway/cli`, then `railway login`,
`railway init`, `railway up`) works the same way if you'd rather not go
through GitHub first — but GitHub-linked deploys are recommended since you're
already setting that up.

## What changed from the original Manus export

The backup was built and previously hosted on Manus's platform, which wires
in some infrastructure that only exists inside Manus and would silently
break (or fail to install) anywhere else. These were removed or replaced:

- **Images**: page content referenced images through `/manus-storage/...`,
  a dev-only proxy to Manus's storage backend. Replaced with the real files
  (already included in your backup's `source-assets/`) served from
  `client/public/images/`.
- **Login dialog / OAuth helper** (`ManusDialog.tsx`, `getLoginUrl`): dead
  code, not referenced anywhere in the app. Removed.
- **Debug/analytics tooling**: the Manus debug-log collector, the
  `vite-plugin-manus-runtime` and `@builder.io/vite-plugin-jsx-loc` dev
  plugins, and the Manus analytics `<script>` tag (pointed at
  manus-analytics.com with a Manus-account website ID) were removed. Add
  your own analytics snippet in `client/index.html` if you want one.
- **`wouter` patch**: patched `wouter` only to expose route paths to
  Manus's own visual editor (`window.__WOUTER_ROUTES__`). Removed along
  with the patch file.
- **`.project-config.json`**: this file held live Manus/Forge secrets
  (API keys, JWT secret, a scoped git token). It was already gitignored so
  it was never at risk of being pushed, but it's been dropped from this
  build entirely since it's Manus-account-specific and not needed to run
  the site elsewhere.
- **`template.json`, `ideas.md`, `todo.md`**: Manus scaffold/planning
  files, not needed to run the site. Removed.

Nothing about the actual page content, design, or copy changed — Home,
Experiences, About, Our Stories, How We Celebrate, and Contact all render
exactly as before.

## Known prototype flows (per the original backup note)

The **Contact page form** and the **WhatsApp action** are still visual
prototypes — they don't submit anywhere real yet. Wire these up to an
actual form endpoint / WhatsApp link before launch.

There's also an unused `MapView` component (`client/src/components/Map.tsx`)
left over from the original build — it's not imported by any page, so it's
harmless, but if you ever wire it in you'll need your own Google Maps API
key (it currently expects one via `VITE_FRONTEND_FORGE_API_KEY`, which was
a Manus-proxied key and won't work as-is).
