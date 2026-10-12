# iyanLabs — Digital Experience (v2, premium + motion)

This is a single-page corporate website for iyanLabs, built from `PROMPT.json` (prompt v2) and `DESIGN.md`.
- **Stack:** React 19, TypeScript and Vite. Animation uses **GSAP 3.13 + ScrollTrigger** and **Lenis** for smooth scrolling.
- **Colours:** the premium charcoal, terracotta and ivory palette. These replace the DESIGN.md colours.
- **Layout:** type scale, spacing, radius and grid follow DESIGN.md.

## Run

```bash
npm install
npm run dev          # http://localhost:5173
npm run check        # type-check + production build
npm run preview      # serve dist/ at http://localhost:4173
```

You need Node 18.18 or later (20 LTS recommended).

## Contact form

| Mode | When | Behaviour |
|---|---|---|
| Endpoint | `VITE_CONTACT_ENDPOINT` is set in `.env` | POSTs JSON `{ name, email, company, topic, message, source }`. A 2xx response shows the success state; anything else shows an error state with an email fallback. |
| Email hand-off (default) | No endpoint set | Opens the visitor's email app addressed to `reachus@iyanlabs.com` with the message pre-filled. It never claims the message was sent. |

To set up an endpoint, run `cp .env.example .env` and set `VITE_CONTACT_ENDPOINT` (for example, a Formspree form URL). If the endpoint is on another domain, it must allow CORS from your site's domain.

## Where things live

```
src/
  content/site.ts            all copy and verified links ({braces} = serif accent words)
  styles/tokens.css          premium palette + DESIGN.md type/spacing/radius + motion tokens
  styles/base.css            stages (dark/light), film grain, grid, split-text masks, pills
  motion/gsap.ts             GSAP + ScrollTrigger registration, motion tokens, breakpoints, loop registry
  motion/useMotion.ts        gsap.matchMedia() hook (auto-cleanup, skipped for reduced motion)
  motion/GlobalMotion.tsx    Lenis, stage colour morph, data-attribute reveals, anchor scrolling
  motion/intro.ts            first-visit intro ↔ hero entrance coordination
  components/layout/         Header, Footer, Intro, Chrome (progress bar, cursor, pause control)
  components/sections/       Hero, Marquee, Challenge, Services, Ecosystem, Process, Work, About, Contact
  components/visuals/        CRM / API network / mobile illustrations (HTML + SVG)
```

## Motion map

| Area | Desktop | Tablet / mobile |
|---|---|---|
| Global | Intro (once per session, ≤1.6s, skippable), Lenis, progress bar, custom cursor + spotlight, magnetic buttons, split-text reveals, clip-path wipes, stage colour morph, film grain | Reveals, colour morph and grain. No cursor or magnetic buttons. |
| Hero | Modules assemble in 3D, paths draw, packets flow, nodes pulse, three-layer parallax, scrubbed scroll-out, word ticker | Same entrance in a lighter form, without parallax |
| Marquee | Speeds up with scroll velocity, pauses on hover, has a pause button | Same |
| Challenge | **Pinned** scene: fragments snap into a grid, lines draw, label morphs | Plays once when scrolled into view and reverses on scroll-up |
| Services | Counter rail (01→03). CRM: clip wipe, steps light up, modules align, 3D tilt. MuleSoft: **pinned**, scrubbed data path through the API layers. Mobile: phones fan out, screen cycle, checkmark draw | Reveals; the API diagram becomes a vertical stack |
| Ecosystem | Nodes pop in, edges draw, nodes orbit gently, connections highlight on hover/focus/tap | Vertical cards with a connector line that draws on scroll |
| Process | **Pinned horizontal scroll** with a filling progress line and flipping numbers | Vertical timeline with a line that fills on scroll |
| Varavu | Devices fly in, chart draws, rows stagger in, toast appears, figures count up, concept cards tilt | Lighter version of the same |
| About / Contact / Footer | Icon and monogram line-draws; animated frame path, floating labels, shimmer and check on submit, error shake; footer curtain + wordmark slide | Same, without tilt |

**Reduced motion:** the intro, Lenis, pins, parallax, cursor and loops are all off. Content shows in its final state.
**Pause motion:** the button at the bottom-right pauses all loops and CSS animations.
**If JavaScript fails:** hidden states are only applied by GSAP at runtime, so all content stays visible.

## Content guardrails

- **Verified details:** email, LinkedIn, the Varavu link, leadership names and roles, and the "20+" delivery figures all come from iyanlabs.com or the official LinkedIn page.
- **Portfolio:** the cards are labelled *Illustrative concept*. There are no client names, logos, testimonials or invented metrics.
- **Privacy and terms:** there are no links, because those pages couldn't be verified. Add them in `Footer.tsx` once they exist.
- **Logo:** the logo and favicon are provisional. Replace `public/favicon.svg` and `components/ui/Logo.tsx` with the approved asset.

## Known trade-off

The prompt specifies an ivory label on a `#C8643B` button. That combination has a contrast ratio of 3.7:1, which is below WCAG AA (4.5:1) for 15–16px text. To pass, change `--bg` in `components/ui/Button.css` to `var(--tc-deep)` (`#A64B26`, 5.4:1) and use `#C8643B` for hover.
