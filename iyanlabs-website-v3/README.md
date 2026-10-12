# iyanLabs — Digital Experience (v3, AI edition)

This is a single-page website for iyanLabs. It presents six services: Salesforce, MuleSoft, mobile apps, websites, AI agents and chatbots. The site uses a multi-colour, futuristic AI design.

- **Stack:** React 19, TypeScript and Vite.
- **Animation:** GSAP 3.13 with ScrollTrigger for scroll scenes, Lenis for smooth scrolling, and CSS/SVG for small effects.
- **AI core:** a custom WebGL shader with no 3D library.

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
| Endpoint | `VITE_CONTACT_ENDPOINT` is set in `.env` | Sends the form as JSON `{ name, email, company, topic, message, source }`. A 2xx response shows the success state; anything else shows an error with an email fallback. |
| Email hand-off (default) | No endpoint set | Opens the visitor's email app addressed to `reachus@iyanlabs.com` with the message pre-filled. It never claims the message was sent. |

To set up an endpoint, run `cp .env.example .env` and set `VITE_CONTACT_ENDPOINT` (for example, a Formspree URL, a serverless function or a MuleSoft lead API). If the endpoint is on another domain, it must allow CORS from your site's domain.

## WebGL without React Three Fiber

The AI core is a single dependency-free fragment shader (`components/visuals/AICore.tsx`, about 4 KB) instead of Three.js, which would add roughly 150 KB+ gzipped.
- **Behaviour:** it is lazy-loaded, caps device pixel ratio at 1.5, and only renders while visible. It also stops when the tab is hidden or motion is paused.
- **Fallback:** a generated orb image (`public/ai-core*.webp`) shows on mobile, low-power devices, reduced motion, or when WebGL is unavailable.

## Where things live

```
src/
  content/site.ts            all copy, six services, service colours, demo Q&A, verified links
  styles/tokens.css          AI palette, gradients, DESIGN.md type/spacing/radius, motion tokens
  styles/base.css            aurora mesh, grid, grain, glass, border beams, spotlights, gradient text
  motion/                    GSAP setup, useMotion hook, GlobalMotion (Lenis + reveals), boot coordination
  lib/                       decode text effect, contact pre-fill events, env config
  components/layout/         Header, Intro (boot), Chrome (progress, cursor, pause), Footer
  components/sections/       Hero, Marquee, Challenge, Services, AIShowcase, Ecosystem, Process, Work, About, Contact
  components/visuals/        AICore (WebGL), ParticleField (canvas), ServiceVisuals (six mini-animations)
public/                      favicon.svg, og-image.png, ai-core.webp, ai-core-sm.webp
```

## Accessibility and motion

- **Reduced motion:** the boot sequence, smooth scrolling, WebGL, pinned sections, parallax, custom cursor, typing effects and loops are all off. Content shows in its final state.
- **Pause motion:** the button at the bottom-right pauses all animation.
- **Interaction:** the service panels, ecosystem diagram and chatbot demo work with keyboard, mouse and touch.

## Content guardrails

- **Verified details:** email, LinkedIn, the Varavu link, leadership names and roles, and the "20+" figures all come from iyanlabs.com or the official LinkedIn page.
- **Labelled examples:** portfolio cards are marked *Illustrative concept*. The chatbot demo is marked as a demo and says no live AI is connected.
- **Privacy and terms:** there are no links, because those pages couldn't be verified.
- **Logo:** the logo and favicon are provisional. Replace them with the approved brand files.
