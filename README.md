# Amplify AI Retreat

Marketing site for the **Amplify AI Retreat** — a 3-day immersive AI implementation retreat for business owners. Built with **Astro** and **React** islands.

## Quick start

```bash
npm install
cp .env.example .env   # optional for local dev
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Local dev server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build |

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PUBLIC_SITE_URL` | Production | Canonical domain (e.g. `https://retreat.amplifyai.dev`). Used for SEO, sitemap, and Open Graph. |
| `PUBLIC_APPLICATION_WEBHOOK` | Production | n8n (or other) webhook URL for the `/apply` form. |
| `PUBLIC_WEBINAR_WEBHOOK` | Production | n8n webhook URL for the `/workshop` webinar registration form. |

Copy `.env.example` to `.env` for local development. **Do not commit `.env`.**

## SEO

- Meta tags, Open Graph, and Twitter cards in `src/layouts/BaseLayout.astro`
- JSON-LD structured data (`Event`, `Organization`, `FAQPage`) in `src/components/StructuredData.astro`
- Auto-generated sitemap via `@astrojs/sitemap` (homepage only; `/apply` excluded)
- `public/robots.txt` — update the sitemap URL if your production domain differs from `retreat.amplifyai.dev`
- Site copy and defaults in `src/config/site.ts`

## Deploy to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Amplify AI Retreat site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/amplify-ai-retreat.git
git push -u origin main
```

`hero-assets/`, `react-source/`, and the template zip are gitignored (local reference only).

## Deploy to Vercel

1. Import the GitHub repository in [Vercel](https://vercel.com/new).
2. Framework preset: **Astro** (auto-detected).
3. Add environment variables:
   - `PUBLIC_SITE_URL` → your production URL (no trailing slash)
   - `PUBLIC_APPLICATION_WEBHOOK` → your n8n webhook URL
4. Deploy.

`vercel.json` is included with the correct build settings. After connecting a custom domain, set `PUBLIC_SITE_URL` to match and update `public/robots.txt` sitemap URL if needed.

## Application form → GoHighLevel

The `/apply` form posts to n8n (`PUBLIC_APPLICATION_WEBHOOK`). The n8n workflow in `n8n/amplify-retreat-application.workflow.ts` then:

1. Normalizes the submission
2. **POSTs JSON to your GHL Inbound Webhook** (creates/updates the contact)
3. Sends the team notification email
4. Returns `{ success: true }` to the browser

### GoHighLevel setup

1. In GHL, create a workflow with trigger **Inbound Webhook** and copy the webhook URL.
2. Send a test POST (or submit the live form once n8n is updated) and map incoming fields in **Create/Update Contact** — at minimum **email** and **phone**.
3. Suggested field mapping from the n8n payload:

| GHL field | Webhook key |
|-----------|-------------|
| First name | `firstName` |
| Last name | `lastName` |
| Email | `email` |
| Phone | `phone` |
| Source | `source` |
| Notes (optional) | `applicationNotes` |

Additional keys (`companyWebsite`, `businessDescription`, `bottleneck`, `aiUsage`, `successOutcome`, `submittedAt`) can map to custom fields if you create them in GHL.

### n8n setup

1. Deploy or update the workflow from `n8n/amplify-retreat-application.workflow.ts` in your n8n instance (path: `amplify-retreat-application`).
2. In n8n **Settings → Variables** (or instance env), set:
   - `GHL_INBOUND_WEBHOOK_URL` → your GHL inbound webhook URL
3. Keep **Gmail** credentials on the email node and **activate** the workflow.

If GHL is misconfigured, the form still succeeds for applicants; email notification continues because the GHL step uses `onError: continueRegularOutput`.

## Project layout

```
src/
  config/site.ts      # SEO & site metadata
  layouts/            # HTML shell
  pages/              # Routes (/, /apply, /workshop)
  components/         # React islands + Astro components
public/
  logo.png            # Favicon & header logo
  pitch-deck/         # Sales deck (HTML, keyboard-nav)
  robots.txt
```

## Sales pitch deck

Interactive HTML deck for live sales conversations (**17 slides**, value-stack narrative + market data):

- **Local:** `http://localhost:4321/pitch-deck/` after `npm run dev` (served via `src/pages/pitch-deck/`)
- **Production:** `https://retreat.amplifyai.dev/pitch-deck/`
- **Source:** `src/deck/sales-deck.html`

**Controls:** Arrow keys, Space, or click (left 25% = back). **Press N** to toggle speaker notes for reps.

**Slide flow:** Title → Market gap (SMB stats) → Problem → Cost of waiting → Conference contrast → Solution → Who it's for → Experience → Guides → Proof → Outcomes → Value stack → Objections → Scarcity → CTA.

**Deck backgrounds** (AI-generated, on-brand): `public/media/deck/` — market, shift, operators, Logan scenic, proof, value stack, objections, intimacy, and more.

**Pricing on deck:** Retreat investment **$4,000** (value stack slide).

### Download PDF (shareable deck)

```bash
npm install          # first time
npx playwright install chromium   # first time only
npm run export:deck
```

Creates **`public/downloads/Amplify-AI-Retreat-Sales-Deck.pdf`** (17 slides, 16:9). After deploy, share:

`https://retreat.amplifyai.dev/downloads/Amplify-AI-Retreat-Sales-Deck.pdf`

From the live deck, use **Download PDF** (after export) or **Print / Save as PDF** (browser print → Save as PDF).
