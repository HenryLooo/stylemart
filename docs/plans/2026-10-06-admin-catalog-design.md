# Stylemart Admin: Product and SKU Management (Design)

**Date:** 2026-10-06
**Goal:** An in-house admin where the client adds, edits and removes products and manages stock, with both storefront mockups reflecting changes live.

## Decisions

| Topic | Decision |
|---|---|
| Storage (now) | Browser only: products in localStorage, photos in IndexedDB |
| Storage (later) | Supabase (Postgres + Storage + Auth) behind the same repository interface |
| SKU model | One SKU per product: a unique SKU code and a stock count, no size variants |
| Photos | Upload from device; resized in-browser to ≤1600px WebP; stored as IndexedDB blobs |
| Access | Mock sign-in screen at `/admin/login` (demo credentials shown); swaps to Supabase Auth later |

## Data model

`Product`: `id`, `sku` (unique, e.g. `SM-LEN-0009`, auto-suggested from category), `name`, `description`, `details[]`, `category`, `collection`, `price` (number or null = price on request / made to order), `stock` (0 = sold out), `images` (`main`, optional `closeup`), `status` (`active` | `draft` | `archived`), `isNew`, `createdAt`, `updatedAt`.

Image references are either static paths (`/media/...`) or `idb:<uuid>`, resolved to object URLs by a hook.

## Architecture

- `CatalogRepository` interface: `list`, `get`, `create`, `update`, `remove`, `uploadImage`, `subscribe`, `reset`.
- `localRepository`: localStorage JSON (key `stylemart.catalog.v1`), seeded from the 14 real products on first run; IndexedDB `images` store; change events in-tab and cross-tab (`storage` event).
- A catalog store (zustand), hydrated from the repository, feeds the admin, both storefronts and the cart.
- "Reset demo data" restores the seed.

## Admin UX (`/admin`)

Light, mobile-first working UI (white, Manrope, crest, gold primary actions).

1. **Sign in**: email and password, session kept in the browser, sign out in the header.
2. **Products list**: stat tiles (total, live, drafts, low stock ≤ 3, sold out); search by name/SKU; filters by status and category; rows with thumbnail, name, SKU, category, price, stock, status; inline stock − / + ; cards on mobile; "+ New product".
3. **Add / edit**: photos (upload, preview, replace, remove), details (name, description, craft notes, category, collection, new arrival), pricing and stock (price or price-on-request, SKU with uniqueness check, stock), visibility (active / draft / archived). Inline validation, sticky save bar, unsaved-changes guard in a styled dialog. Danger zone for delete, with a confirmation dialog that suggests archiving instead.
4. "View in shop" link per product.

Out of scope: orders, customers, discounts, analytics, lookbook curation.

## Storefront integration

- Both mockups show only `active` products from the catalog store.
- Stock 0: "Sold out" label; add to bag disabled; the cart can't exceed stock.
- New products appear by category and collection (Couture collection page and counts, Refined tabs, New Arrivals when `isNew`).
- The Couture lookbook stays curated; looks whose product is no longer active are skipped.
- Uploaded photos resolve everywhere a product image appears.
- Deleted or deactivated products are pruned from the bag.

## Testing

- Repository unit tests (jsdom + fake-indexeddb): seed, CRUD, SKU uniqueness, status visibility, reset.
- Cart tests for stock limits and sold-out items.
- A Playwright walkthrough: sign in → create a product with an uploaded photo → see it on `/couture/collection` → set stock 0 → "Sold out" → archive → gone. Run at desktop and mobile widths.
