# 🎯 PlannerAI — Viral Pinterest Micro-SaaS

> AI Planner, Checklist & Guide Generator with Programmatic SEO, viral sharing, and ad monetization.
> **Zero cost to launch. Deploy in under 10 minutes.**

---

## 🚀 10-Minute Deploy Guide

### Step 1 — Get Your API Keys (5 min)

#### OpenAI
1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Click **"Create new secret key"**
3. Copy the key → save it as `OPENAI_API_KEY`
4. Add $5 credit (gpt-4o-mini costs ~$0.002/generation — you get 2,500 generations per $5)

#### Supabase
1. Go to [supabase.com](https://supabase.com) → Create a new project (free tier)
2. Wait ~2 minutes for provisioning
3. Go to **Project Settings > API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** (click to reveal) → `SUPABASE_SERVICE_ROLE_KEY`

#### Set Up Database
1. Go to **SQL Editor > New Query**
2. Paste the entire contents of `supabase-schema.sql`
3. Click **Run** — you'll see both tables created with proper indexes and RLS

---

### Step 2 — Deploy to Vercel (3 min)

#### Option A: GitHub + Vercel (Recommended)
```bash
# 1. Create a new GitHub repo and push this code
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/plannerai.git
git push -u origin main

# 2. Go to vercel.com → New Project → Import from GitHub
# 3. Select your repo → click Deploy
# 4. Add environment variables (see below)
```

#### Option B: Vercel CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

#### Add Environment Variables in Vercel
In your Vercel project → **Settings > Environment Variables**, add:

| Variable | Value |
|----------|-------|
| `OPENAI_API_KEY` | `sk-your-key` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGc...` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGc...` |
| `NEXT_PUBLIC_SITE_URL` | `https://your-app.vercel.app` |

Then **Redeploy** your project. ✅

---

### Step 3 — Test Your Deployment (1 min)

1. Visit your Vercel URL
2. Type "Morning Routine for Productivity" → click Generate
3. Should generate in ~3-5 seconds
4. Verify the URL changes to `/planners/your-slug`
5. Check Supabase Table Editor → `planners` table for your first row

---

## 💰 Monetization Setup

### Google AdSense
Replace the 3 `<AdBanner>` skeleton placeholders in the components with your AdSense code:

```jsx
// In components/AdBanner.js — replace the skeleton div with:
<ins
  className="adsbygoogle"
  style={{ display: 'block' }}
  data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
  data-ad-slot="XXXXXXXXXX"
  data-ad-format="auto"
/>
```

Add to `app/layout.js` head:
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXX" crossorigin="anonymous" />
```

### Revenue Projections
| Monthly Visitors | RPM | Monthly Ad Revenue |
|-----------------|-----|-------------------|
| 10,000 | $3 | ~$30 |
| 50,000 | $4 | ~$200 |
| 200,000 | $5 | ~$1,000 |
| 1,000,000 | $6 | ~$6,000 |

---

## 📁 Project Structure

```
plannerai/
├── app/
│   ├── layout.js              # Root layout + global metadata
│   ├── page.js                # Home page (generator)
│   ├── globals.css            # Tailwind + custom CSS
│   ├── sitemap.js             # Dynamic XML sitemap
│   ├── robots.js              # robots.txt
│   └── api/
│       ├── generate/route.js  # 🤖 AI generation endpoint
│       ├── save-lead/route.js # 📧 Email capture endpoint  
│       └── og-image/route.js  # 🖼️ Dynamic OG image (SVG)
│   └── planners/[slug]/
│       └── page.js            # Dynamic p-SEO pages
├── components/
│   ├── PlannerGenerator.js    # Main interactive tool
│   ├── PlannerView.js         # Static slug page view
│   ├── ChecklistDisplay.js    # Interactive checklist
│   ├── SEOArticle.js          # Markdown article renderer
│   ├── ShareButtons.js        # Pinterest/X/Copy + PDF
│   ├── LeadMagnet.js          # Email capture widget
│   ├── AdBanner.js            # Ad placeholder skeletons
│   └── UnlockModal.js         # Credits paywall modal
├── lib/
│   ├── supabase.js            # Supabase client (client + server)
│   └── credits.js             # LocalStorage credit tracking
├── supabase-schema.sql        # 📊 Copy-paste DB setup
├── .env.example               # Template for env vars
└── README.md                  # This file
```

---

## 🗄️ Database Tables

### `planners` table
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `slug` | TEXT | URL-safe identifier (indexed) |
| `topic` | TEXT | User's input topic |
| `title` | TEXT | Generated planner title |
| `subtitle` | TEXT | Short subtitle |
| `emoji` | TEXT | Single emoji |
| `sections` | JSONB | `[{heading, items: [{text, priority}]}]` |
| `tips` | JSONB | Array of pro tip strings |
| `time_estimate` | TEXT | e.g. "2-3 hours" |
| `difficulty` | TEXT | Beginner / Intermediate / Advanced |
| `tags` | JSONB | Array of tag strings |
| `seo_article` | TEXT | Full markdown article (500+ words) |
| `meta_description` | TEXT | SEO meta description |
| `how_to_steps` | JSONB | Schema.org HowTo steps |
| `view_count` | INTEGER | Page view counter |
| `share_count` | INTEGER | Share counter |
| `created_at` | TIMESTAMPTZ | Creation timestamp |

### `leads` table
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `email` | TEXT | Lead's email address |
| `planner_slug` | TEXT | Which planner they signed up from |
| `planner_title` | TEXT | For context in email tools |
| `source` | TEXT | Lead source tag |
| `subscribed` | BOOLEAN | For GDPR unsubscribe tracking |
| `created_at` | TIMESTAMPTZ | Signup timestamp |

---

## 🔁 Viral Loop Architecture

```
Pinterest User sees Pin
        ↓
Clicks → Landing Page (p-SEO page)
        ↓
Sees Planner → Shares back to Pinterest (+3 credits)
        ↓
New Pinterest users see new Pin → Loop repeats
        ↓
Email captured via Lead Magnet → Email list grows
        ↓
Email list → Promote Pro tier when you add it
```

---

## 🎯 Pinterest Strategy

1. **Enable Rich Pins**: Submit your site at [developers.pinterest.com/tools/url-debugger](https://developers.pinterest.com/tools/url-debugger/)
2. **OG Image is auto-optimized**: Each planner generates a 1200×630 SVG with title, emoji, tags, and a "Save" button — perfect for Pinterest click-through
3. **Pre-filled Pin**: The "Pin on Pinterest" button pre-fills the OG image URL + description
4. **Board Strategy**: Create boards like "Morning Routine Planners", "Business Checklists", "Fitness Trackers"

---

## 💡 Cost Optimization Notes

- **gpt-4o-mini**: ~$0.002 per generation (2,000 tokens avg). $1 = ~500 generations
- **Supabase free tier**: 50MB DB, 2GB bandwidth — handles ~100k planners
- **Vercel free tier**: 100GB bandwidth, unlimited deployments
- **LocalStorage credits**: No auth system needed, zero DB reads for credit checks
- **SVG OG images**: No Puppeteer or headless Chrome needed — pure SVG, cached 24h

---

## 🔧 Customization Tips

### Change Daily Credits
In `lib/credits.js`, change `const DAILY_LIMIT = 2` to any number.

### Change AI Model
In `app/api/generate/route.js`, change `model: 'gpt-4o-mini'` to:
- `'gpt-4o'` — Better quality, ~10x more expensive
- `'gpt-3.5-turbo'` — Cheaper but lower quality

### Add More Categories
In `components/PlannerGenerator.js`, extend the `EXAMPLE_TOPICS` array.

### Connect Email Service
In `app/api/save-lead/route.js`, after saving to Supabase, add a call to:
- **Resend** (free 3k/month): `await resend.emails.send({...})`
- **Mailchimp API**: Add subscribers to a list
- **ConvertKit**: Add to a sequence
