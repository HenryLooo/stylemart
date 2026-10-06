import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import { createIdbImageStore, createMemoryImageStore } from './imageStore'
import { createLocalRepository } from './localRepository'
import type { CatalogRepository } from './repository'
import type { Product } from './types'

/** The app's one catalog backend. Swap for a Supabase repository later; nothing else changes. */
export const catalogRepo: CatalogRepository = createLocalRepository({
  storage: localStorage,
  images: typeof indexedDB !== 'undefined' ? createIdbImageStore() : createMemoryImageStore(),
})

interface CatalogState {
  products: Product[]
  ready: boolean
}

const snapshot = catalogRepo.peek()

/** Live product list shared by the admin, both storefronts and the cart. */
export const useCatalog = create<CatalogState>(() => ({ products: snapshot ?? [], ready: snapshot != null }))

catalogRepo.subscribe((products) => useCatalog.setState({ products, ready: true }))
if (!snapshot) catalogRepo.list().then((products) => useCatalog.setState({ products, ready: true }))

// Clear photos left behind by uploads that were replaced or abandoned before saving.
// Runs once per page load, so it can't race an in-progress upload on this page.
catalogRepo.sweepImages().catch(() => {})

const isActive = (p: Product) => p.status === 'active'

/** Non-hook lookup (cart maths, event handlers) */
export const getProduct = (id: string) => useCatalog.getState().products.find((p) => p.id === id)

export const useProduct = (id: string | undefined) => useCatalog((s) => s.products.find((p) => p.id === id))

/** What shoppers can see: active products only, in catalog order */
export const useActiveProducts = () => useCatalog(useShallow((s) => s.products.filter(isActive)))

export const activeProducts = () => useCatalog.getState().products.filter(isActive)
