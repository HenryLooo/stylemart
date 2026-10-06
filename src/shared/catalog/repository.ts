import type { Product, ProductInput } from './types'

/**
 * Everything the app knows about storing products. Today: localStorage + IndexedDB.
 * Later: Supabase (Postgres + Storage), implementing this same interface.
 */
export interface CatalogRepository {
  /** Synchronous snapshot when the backend has one locally (first paint without a spinner) */
  peek(): Product[] | null
  list(): Promise<Product[]>
  get(id: string): Promise<Product | undefined>
  create(input: ProductInput): Promise<Product>
  update(id: string, patch: Partial<ProductInput>): Promise<Product>
  remove(id: string): Promise<void>
  /** Store a photo and return its image ref */
  uploadImage(blob: Blob): Promise<string>
  /** Resolve an uploaded image ref to its data */
  getImage(ref: string): Promise<Blob | undefined>
  /** Delete uploaded photos no product uses (e.g. uploaded, then replaced or cancelled before saving). Returns how many. */
  sweepImages(): Promise<number>
  /** Restore the original catalogue (demo convenience); also clears every uploaded photo */
  reset(): Promise<Product[]>
  /** Called with the full list after every change, including changes from other tabs */
  subscribe(cb: (products: Product[]) => void): () => void
}

/** A validation failure tied to the form field that caused it */
export class CatalogError extends Error {
  readonly field?: keyof ProductInput
  constructor(message: string, field?: keyof ProductInput) {
    super(message)
    this.name = 'CatalogError'
    this.field = field
  }
}
