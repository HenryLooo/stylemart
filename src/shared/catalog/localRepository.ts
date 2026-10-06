import { CatalogError, type CatalogRepository } from './repository'
import { isIdbRef, type ImageStore } from './imageStore'
import { seedProducts } from './seed'
import { normalizeSku } from './sku'
import type { Product, ProductInput } from './types'

export { CatalogError }

export const STORAGE_KEY = 'stylemart.catalog.v1'

/** Catalog kept in localStorage, photos in an ImageStore (IndexedDB in the browser). */
export function createLocalRepository({
  storage,
  images,
  key = STORAGE_KEY,
}: {
  storage: Storage
  images: ImageStore
  key?: string
}): CatalogRepository {
  const listeners = new Set<(products: Product[]) => void>()

  const read = (): Product[] => {
    const raw = storage.getItem(key)
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) return parsed as Product[]
      } catch {
        // fall through and reseed
      }
    }
    const seeded = seedProducts()
    storage.setItem(key, JSON.stringify(seeded))
    return seeded
  }

  const write = (products: Product[]) => {
    storage.setItem(key, JSON.stringify(products))
    listeners.forEach((cb) => cb(products))
  }

  /** Delete uploaded photos no product references any more */
  const collectGarbage = async (refs: (string | undefined)[], products: Product[]) => {
    const inUse = new Set(products.flatMap((p) => [p.image, p.closeup]))
    await Promise.all(refs.filter((r) => isIdbRef(r) && !inUse.has(r)).map((r) => images.delete(r!)))
  }

  const validate = (p: ProductInput, products: Product[], selfId?: string): ProductInput => {
    const name = p.name.trim()
    if (!name) throw new CatalogError('Give the product a name.', 'name')
    const sku = normalizeSku(p.sku)
    if (!sku) throw new CatalogError('Every product needs a SKU.', 'sku')
    if (products.some((o) => o.id !== selfId && normalizeSku(o.sku) === sku))
      throw new CatalogError(`SKU ${sku} is already used by another product.`, 'sku')
    if (!Number.isInteger(p.stock) || p.stock < 0)
      throw new CatalogError('Stock must be a whole number, 0 or more.', 'stock')
    if (p.price != null && (!Number.isFinite(p.price) || p.price < 0))
      throw new CatalogError('Price must be 0 or more.', 'price')
    if (!p.image) throw new CatalogError('Add a main photo.', 'image')
    return {
      ...p,
      name,
      sku,
      note: p.note.trim(),
      details: p.details.map((d) => d.trim()).filter(Boolean),
    }
  }

  // Other tabs (e.g. the storefront open beside the admin) see changes via the storage event
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (e) => {
      if (e.key === key && e.storageArea === storage) listeners.forEach((cb) => cb(read()))
    })
  }

  return {
    peek: read,
    async list() {
      return read()
    },
    async get(id) {
      return read().find((p) => p.id === id)
    },
    async create(input) {
      const products = read()
      const now = new Date().toISOString()
      const product: Product = { ...validate(input, products), id: crypto.randomUUID(), createdAt: now, updatedAt: now }
      write([product, ...products])
      return product
    },
    async update(id, patch) {
      const products = read()
      const current = products.find((p) => p.id === id)
      if (!current) throw new CatalogError('That product no longer exists.')
      const { id: _id, createdAt, updatedAt: _u, ...rest } = current
      const product: Product = {
        ...validate({ ...rest, ...patch }, products, id),
        id,
        createdAt,
        updatedAt: new Date().toISOString(),
      }
      const next = products.map((p) => (p.id === id ? product : p))
      write(next)
      await collectGarbage([current.image, current.closeup], next)
      return product
    },
    async remove(id) {
      const products = read()
      const gone = products.find((p) => p.id === id)
      const next = products.filter((p) => p.id !== id)
      write(next)
      if (gone) await collectGarbage([gone.image, gone.closeup], next)
    },
    uploadImage: (blob) => images.put(blob),
    getImage: (ref) => images.get(ref),
    async sweepImages() {
      const inUse = new Set(read().flatMap((p) => [p.image, p.closeup]))
      const orphans = (await images.keys()).filter((ref) => !inUse.has(ref))
      await Promise.all(orphans.map((ref) => images.delete(ref)))
      return orphans.length
    },
    async reset() {
      const seeded = seedProducts()
      write(seeded)
      const uploaded = await images.keys()
      await Promise.all(uploaded.map((ref) => images.delete(ref)))
      return seeded
    },
    subscribe(cb) {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
  }
}
