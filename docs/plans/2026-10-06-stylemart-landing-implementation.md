# Stylemart Landing Mockups Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Two interactive, deployable landing page mockups for stylemart.sg: `/classic` ("Refined") and `/couture` ("Couture"), plus a pitch index at `/`.

**Architecture:** One Vite + React + TypeScript app with React Router. Shared data (products, story, press) and a cart store live in `src/shared/`. Each mockup lives in its own folder (`src/classic/`, `src/couture/`) with its own components and styling, and they share only data and cart logic. Media is optimized to WebP in `public/media/`.

**Tech Stack:** Vite 6, React 19, TypeScript, Tailwind CSS v4 (`@tailwindcss/vite`), `motion` (motion.dev, `motion/react`), `react-router-dom` v7, `zustand` (cart), `lucide-react` (icons), Vitest (cart store tests).

**Design doc:** `docs/plans/2026-10-06-stylemart-landing-design.md`

---

## Real data captured from stylemart.sg (2026-10-06)

14 products. Prices are real where listed; the rest are bespoke/enquiry ("Price on request").

| id | Name | Price (SGD) | Category | Images |
|---|---|---|---|---|
| p1 | The Peach & Mint Brocade High-Low Gown | on request | Indo-Western | 1.1 / look1 |
| p2 | The Metallic Glamour Dhoti Saree | on request | Indo-Western | 2.1 / 2 |
| p3 | The Ombré Evening Gown with Kashmiri Gara Embroidery | on request | Gown | 3.1 / 3 |
| p4 | The Indo-Western Rose-Gold Embroidered Sherwani | on request | Menswear | 4 |
| p5 | The Pink Fusion Cocktail Dress | 490 | Indo-Western | 5.1 / 5 |
| p6 | The Midnight Metallic Readymade Saree | 415 | Readymade Saree | 6.1 / 6 |
| p7 | The Silver Mist Saree Gown | 890 | Indo-Western | 7.1 / 7 |
| p8 | The Embellished Lengha with Scalloped Blouse | on request | Lengha | 8 |
| p9 | The Sequin Lengha with Full-Sleeve Blouse | 2,690 | Lengha | 9 |
| p10 | The Mirrorwork and Sequins Pants Set | 480 | Pants Suit | 10.2 / 10 |
| p11 | The Gold Draped Gown with Handcrafted Kashmiri Gara Pallu | 3,500 | Indo-Western | 11.1 / 11 |
| p12 | The Sequin Jacket Set with Satin Trousers | 540 | Pants Suit | 12 |
| p13 | The Lion Suit – SG60 Black Indo-Western Tuxedo | 890 | Menswear | 13.1 / 13 |
| p14 | The Black and Gold Ombré Saree | 655 | Readymade Saree | 14 |

"On request" items get a **Book a Fitting** CTA instead of Add to Bag. This is the hybrid model, and it matches how the site actually works today.

## Tasks

### Task 1: Scaffold
- `npm create vite@latest` (react-ts) in repo root; add tailwind v4, motion, react-router-dom, zustand, lucide-react, vitest.
- `src/main.tsx` router: `/` → `PitchIndex`, `/classic` → `ClassicHome`, `/couture` → `CoutureHome`.
- `vercel.json` SPA rewrite.
- Verify: `npm run build` passes.

### Task 2: Media pipeline
- `scripts/optimize-media.py` (Pillow): raw → `public/media/<semantic-name>.webp`, max 2000px long edge (products 900px), q=80.
- Semantic names: `product-p1-front.webp`, `product-p1-alt.webp`, `editorial-gramophone.webp`, `runway-*.webp`, `kavita-portrait.webp`, `press-*.webp`, etc.
- Verify: total `public/media` < 15 MB.

### Task 3: Shared data + cart (TDD for cart)
- `src/shared/data/products.ts`, `story.ts`, `press.ts`, `testimonials.ts` (testimonials flagged `sample: true`).
- `src/shared/cart.ts` (zustand): `add(id)`, `remove(id)`, `setQty`, `count`, `subtotal`, `open/close`.
- `src/shared/cart.test.ts`: add increments qty, remove deletes, subtotal ignores on-request items, count sums qty.
- `src/shared/format.ts`: `formatSGD`.
- `src/shared/Sample.tsx`: tiny "sample" badge.
- Verify: `npx vitest run` passes.

### Task 4: Pitch index (`/`)
- Two large cards linking to each mockup, using Stylemart branding.

### Task 5: Mockup 1, Classic (`src/classic/`)
- Sections per design doc §Mockup 1. Fonts: Playfair Display + Poppins. Charcoal `#2B2B2B`, gold `#C59D5F`, off-white `#FAFAF7`.
- Verify: build + screenshot desktop 1440 and mobile 390.

### Task 6: Mockup 2, Couture (`src/couture/`)
- Sections per design doc §Mockup 2. Fonts: Bodoni Moda + Manrope. Ink `#0E0C0A`, bone `#EFE7DA`, gold `#B8955A`, oxblood `#5A1A1F`.
- Pinned chapters via `useScroll` + `useTransform` on a tall section with a sticky inner; horizontal lookbook via sticky + translateX.
- Verify: build + screenshot desktop and mobile; check reduced motion.

### Task 7: Review & deploy
- Code review pass, Lighthouse sanity check, deploy to Vercel (ask user first).
