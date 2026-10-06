# Stylemart Landing Page Mockups: Design

**Date:** 2026-10-06
**Client:** Stylemart (stylemart.sg), founder Kavita Thulasidas
**Goal:** Two interactive landing page mockups for a pitch: one faithful to the current site ("Refined"), one with our own creative direction ("Couture"). The site is ecommerce, and the brief asks for a premium, interactive feel with storytelling that promotes Kavita.

## Decisions

| Topic | Decision |
|---|---|
| Format | React + TypeScript, Motion (motion.dev) for animation |
| Setup | One Vite app, React Router, Tailwind CSS |
| Routes | `/` pitch index · `/classic` Mockup 1 · `/couture` Mockup 2 |
| Lifespan | Pitch mockup only: mock data, local images, fake cart drawer |
| Commerce | Unknown yet. Mock SGD prices + add-to-cart everywhere, plus bridal appointment CTAs |
| Founder | Kavita is the face of the brand |
| Content | Real facts where available; invented prices and testimonials carry a visible "sample" marker |
| Delivery | Deployed link (Vercel), mobile-first |

## Current site findings

- WooCommerce on the Woostify theme. Dark charcoal header, muted gold accent, serif headings, Poppins body.
- Homepage: hero ("Trendsetters of Fashionwear"), 3 category tiles, a broken empty block, Featured Collection tabs (Lengha / Saree / Asian Women) with 4 unpriced products, and a thin footer.
- The founder story exists only on the About page: Kavita took over in 1999, refocused on bridal (Stylemart Bridal Collection), launched the *Asian Woman* label in 2004, bought the Selegie Rd property in 2006, opened in Bangalore in 2007, and showed at KL Asia Fashion Week. Her design philosophy is "Asian opulence with western cuts and silhouettes."
- Address: 151 Selegie Rd, Singapore 188315.

## Shared foundation

- `data/products.ts`: real product names and images, sample prices, categories.
- `data/story.ts`: timeline chapters.
- Cart store (add/remove/count) + a drawer component that each mockup styles separately.
- Media scraped from stylemart.sg (real `data-src` URLs behind lazy-load placeholders) into `public/media/`, optimized to WebP.
- Respect `prefers-reduced-motion`. Pinned and horizontal-scroll sections fall back to vertical layouts on mobile.
- Out of scope: checkout, WooCommerce integration, product and category pages.

## Mockup 1: "Refined" (`/classic`)

Keep the existing visual identity (dark header, gold, serif + Poppins, outlined buttons, same hero image, same 3-tile categories). Changes are limited to polish, commerce and story. Motion stays restrained.

1. Announcement bar (rotating): bridal fittings by appointment, store address.
2. Sticky header that compacts on scroll, with a cart badge that opens the drawer.
3. Hero: same image, a legible gradient replacing the translucent box, Ken Burns zoom, staggered text. Subline: "Bridal & couture by Kavita Thulasidas, since 1999". CTAs: Shop Now / Book a Fitting.
4. Explore Categories: hover zoom, gold edge, scroll reveal.
5. New Arrivals carousel (replaces the broken block): prices, wishlist, Quick Add.
6. Featured Collection tabs: animated underline, cross-fading grid, prices, add to cart.
7. Meet Kavita: portrait, quote, "Since 1999", 3 stat badges, link to her story.
8. As Seen In: press and magazine marquee, KL Asia Fashion Week.
9. Testimonials (sample) auto-slider.
10. Bridal appointment band → Book / WhatsApp.
11. Instagram strip + newsletter.
12. Full footer: address, phone, hours, links, payment icons.

## Mockup 2: "Couture" (`/couture`)

Concept: Stylemart as a couture house, with Kavita as its designer, presented as a shoppable magazine spread.

- Palette: ink `#0E0C0A`, bone `#EFE7DA`, gold leaf `#B8955A`, oxblood accent.
- Type: Bodoni Moda (display), a grotesk in small caps for the UI.
- Full-bleed imagery, oversized overlapping type, issue-style metadata, fine gold rules.

1. Transparent header with a centered wordmark and "Kavita Thulasidas" beneath it.
2. Hero: masked "KAVITA THULASIDAS" type reveal over the editorial image. CTAs: Shop the Collection / Her Story.
3. Manifesto: "Asian opulence. Western silhouettes." with a scroll-linked word reveal.
4. **Pinned story chapters**: I. 1999 The Inheritance · II. The Bride · III. 2004 *Asian Woman* · IV. 2006 Selegie Road · V. The Runway. Clip-path image wipes, year progress rail.
5. **Lookbook shop**: vertical scroll drives a horizontal strip of looks; hotspots open cards with name, price and Add to Bag.
6. The Collections: typographic index with an image revealed on hover.
7. The Atelier / Bespoke: Consultation → Fabric → Embroidery → Fitting → Book a private appointment.
8. Press: fanned magazine covers + pull quotes.
9. Client voices (sample).
10. Visit the Atelier (151 Selegie Rd, hours) + "Join the private list" newsletter.
11. Footer with a giant wordmark.

Mobile: chapters become stacked full-screen cards, the lookbook becomes a swipe carousel with tap hotspots, and the collections index becomes image cards.
