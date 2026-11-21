# TMJ Pain & Headaches — redesign

The TMJ Pain & Headaches page rebuilt with a dark / beige UI inspired by Spa Dental Sydney CBD. All text and images are the clinic's own; no reference-site content is included.

Stack: Next.js 15 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui (Radix), Lenis, Framer Motion, GSAP + ScrollTrigger.

```bash
npm install
npm run dev      # http://localhost:3000
```

> Don't run `npm run build` while `npm run dev` is running. Both write to `.next`, and the dev server will start returning 500 errors.
> If that happens, stop the dev server, delete `.next`, and start it again.

## Layout system

Every section is wrapped in `<Section tone="dark" | "light">` (`src/components/section.tsx`):
- a rounded panel with a 12px gap above it, so each section's start and end is obvious
- dark and light tones alternate down the page
- consistent padding (`py-24 md:py-32`) and content width (`.container-site`, 1140px)

Every section header uses `<SectionHeading eyebrow title accent />`.
Body text uses `.copy`, which is 16px at 1.75 line-height and switches colour automatically for dark and light panels.

| Token | Hex | Use |
|---|---|---|
| `night` | `#0A0A0A` | page canvas (visible in the gaps) |
| `surface` / `panel` | `#151515` / `#1E1E20` | dark section / card on dark |
| `beige` / `paper` | `#E8DED0` / `#F6F1EA` | light section / card on light |
| `cream` | `#F5F0EB` | text on dark |
| `gold` / `gold-deep` | `#DCC072` / `#8A6A17` | accent on dark / on light |
| `ink` / `ink-soft` | `#121212` / `#45413A` | text on light |

Fonts: Antic Didone (headings) + Lato (body), self-hosted via `next/font`.

## Sections

| # | Section | Tone | Effect |
|---|---|---|---|
| 1 | Hero | dark | Headline reveal; anatomy image widens on scroll (GSAP) |
| 2 | The basics | light | Fade-in |
| 3 | Contributing factors | dark | Staggered cards |
| 4 | Signs of bruxism | light | Pinned horizontal card gallery on desktop (GSAP), swipe row on mobile |
| 5 | Neck & shoulders | dark | Sticky text column |
| 6 | Headaches + stats | light | Count-up numbers (GSAP) |
| 7 | Could it be something else? | dark | — |
| 8 | Is stress related? | dark | Pinned scroll story, one line at a time (Framer) |
| 9 | How we assess (`#diagnosis`) | light | Accordion |
| 10 | How we manage | dark | Tabs with sliding indicator |
| 11 | Monitoring your progress | light | Fade-in |
| 12 | Take the first step (`#contact`) | dark | Call / enquiry buttons |

Smooth scrolling comes from Lenis, synced with GSAP ScrollTrigger. All motion respects `prefers-reduced-motion`.

## Where things live

- `src/app/globals.css`: tokens and shared classes
- `src/lib/site.ts`: phone, address, email, navigation
- `src/content/tmj.ts`: page copy
- `src/components/sections/*`: one file per section
- `src/components/layout/*`: header and footer
