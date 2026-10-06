# Admin Catalog Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** A browser-persisted product catalogue with an `/admin` UI for products, SKUs and stock, consumed live by both storefront mockups.

**Architecture:** `src/shared/catalog/` holds the domain: types, seed data, the `CatalogRepository` interface, its localStorage + IndexedDB implementation, and a zustand store that everything reads. The admin lives in `src/admin/`. Storefronts swap the static `data/products.ts` for catalog selectors and an image-ref hook.

**Tech Stack:** React 19, TypeScript, zustand, motion, Tailwind v4, Vitest (jsdom + fake-indexeddb), Playwright for the end-to-end walkthrough.

**Design:** `docs/plans/2026-10-06-admin-catalog-design.md`

---

### Task 1: Catalog domain (TDD), done by the lead
- `src/shared/catalog/types.ts`: `Product` (keeps the storefront field names `image`, `closeup`, `note`; adds `sku`, `stock`, `status`, `details`, `createdAt`, `updatedAt`), `ProductInput`, `CATEGORIES`, `COLLECTIONS`, `STATUSES`.
- `seed.ts`: the 14 real products with SKUs `SM-<CAT>-0001…`, stock, status `active`; lookbook craft notes move into `details`.
- `sku.ts`: `suggestSku(category, existingSkus)`, `normalizeSku`.
- `imageStore.ts`: IndexedDB blob store (`putImage → 'idb:<uuid>'`, `getImage`, `deleteImage`), plus `isIdbRef`.
- `repository.ts`: the `CatalogRepository` interface. `localRepository.ts`: localStorage (`stylemart.catalog.v1`), seeding, CRUD with validation (required name, unique SKU, stock ≥ 0 integer), `reset`, `subscribe` (in-tab and the cross-tab `storage` event), and `peek()` for synchronous first paint.
- `store.ts`: `useCatalog` zustand store plus selectors `useActiveProducts`, `useProduct`, `getProduct`.
- `useImageSrc.ts`: resolves a ref to a URL, caching object URLs.
- Cart: reads `getProduct`, refuses inactive, sold-out or price-on-request items, clamps quantity to stock, and prunes lines when the catalog changes.
- Tests: `localRepository.test.ts`, `sku.test.ts`, updated `cart.test.ts`.

### Task 2: Storefront integration (subagent)
- Replace every `shared/data/products` import with catalog selectors (list in the design doc).
- All product `<img>` go through `useImageSrc`.
- Sold-out states on cards, plates, search results and the bag; filter counts are reactive; the lookbook skips inactive looks and `Plate` reads `product.details`.
- Verify both mockups visually unchanged with the seed data.

### Task 3: Admin UI (subagent)
- `src/admin/`: `AdminLogin`, `AdminLayout` (auth guard), `ProductList`, `ProductForm` (new and edit), `ImageField` (upload, resize to WebP ≤1600px), `ConfirmDialog`, `StockStepper`.
- Routes: `/admin/login`, `/admin`, `/admin/products/new`, `/admin/products/:id`.
- Mock auth: `src/admin/auth.ts` (demo credentials, session in localStorage).

### Task 4: End-to-end verification (lead)
- Playwright walkthrough at desktop and mobile; review screenshots; commit.
