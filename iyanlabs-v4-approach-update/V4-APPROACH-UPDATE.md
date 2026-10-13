# iyanLabs v4: Our Approach page (update pack)

These files go into your existing **iyanlabs-website-v3** project. Nothing else changes, and you don't need any new npm packages.

## 1. Copy the files
Unzip this pack and copy its contents over your project root. Matching paths overwrite the old files; all other files are new.

| File | Status | What it does |
|---|---|---|
| `src/App.tsx` | **Replaced** | Shared layout + routes: `/` (Home), `/approach` (Our Approach), anything else → 404 |
| `src/router.tsx` | New | Small built-in router (History API): handles `/approach`, `/#contact`, browser back/forward, per-page title/description/canonical |
| `src/pages/HomePage.tsx` | New | Your existing one-page site, unchanged, moved into a page |
| `src/pages/ApproachPage.tsx` | New | Our Approach page (10 sections in the agreed order) |
| `src/pages/NotFoundPage.tsx` | New | Branded 404 |
| `src/components/approach/ApproachSections.tsx` | New | All Our Approach sections |
| `src/components/approach/approach.css` | New | Styles + animations for the page |
| `src/content/approach.ts` | New | **All page text lives here**; edit copy here |
| `src/styles/approach-tokens.css` | New | v4 "Precision Intelligence" palette (scoped to this page) |
| `src/components/layout/Header.tsx` | **Replaced** | Our Approach → `/approach` with active state; other links go to home sections |
| `src/components/layout/Footer.tsx` | **Replaced** | Links work from any page |
| `src/components/layout/PageTransition.tsx` + `.css` | New | Curtain transition between pages |
| `public/_redirects`, `vercel.json` | New | So `/approach` works on refresh when hosted (Netlify / Vercel) |

## 2. Run
```bash
npm run dev       # open http://localhost:5173/approach
npm run check
```
The Vite dev server already handles `/approach` on refresh.

## 3. Before going live
1. **Third testimonial:** only the two testimonials with confirmed names are shown. To add the Malaysia (Salesforce + MuleSoft) quote, add it to `TESTIMONIALS.items` in `src/content/approach.ts` with the full name and company.
2. **Industries:** all 10 are listed. Remove any without real projects (in `INDUSTRIES.items`).
3. **Certifications and experience:** shown as "4 MuleSoft and 10 Salesforce certifications across our architects" and "14 years of experience".

## Note: router choice
The prompt suggested `react-router-dom`. I used a ~100-line built-in router instead (`src/router.tsx`). It covers everything this site needs and adds no new package. If you'd rather use react-router later, only `App.tsx` and `router.tsx` need to change.
