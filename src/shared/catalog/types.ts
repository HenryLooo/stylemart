export const CATEGORIES = ['Lengha', 'Saree', 'Gown', 'Indo-Western', 'Pants Suit', 'Menswear'] as const
export type Category = (typeof CATEGORIES)[number]

/** Merchandising group used by the storefront tabs */
export const COLLECTIONS = ['Lengha', 'Saree', 'Asian Woman'] as const
export type Collection = (typeof COLLECTIONS)[number]

export const STATUSES = ['active', 'draft', 'archived'] as const
export type Status = (typeof STATUSES)[number]

export interface Product {
  id: string
  /** Unique stock-keeping code, e.g. SM-LEN-0009 */
  sku: string
  name: string
  /** null = price on request: made to order, booked by fitting, stock not tracked */
  price: number | null
  stock: number
  category: Category
  collection: Collection
  /** Image ref: a static path (/media/…) or an uploaded image (idb:<uuid>) */
  image: string
  /** Optional waist-up crop, same ref format */
  closeup?: string
  /** One-line description shown on cards */
  note: string
  /** Craft notes, e.g. "Hand-worked Kashmiri gara sleeves" */
  details: string[]
  status: Status
  isNew?: boolean
  createdAt: string
  updatedAt: string
}

/** What the admin form submits; the repository fills in id and timestamps */
export type ProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>

export const isMadeToOrder = (p: Pick<Product, 'price'>) => p.price == null
export const isSoldOut = (p: Pick<Product, 'price' | 'stock'>) => !isMadeToOrder(p) && p.stock <= 0
export const LOW_STOCK = 3
export const isLowStock = (p: Pick<Product, 'price' | 'stock'>) =>
  !isMadeToOrder(p) && p.stock > 0 && p.stock <= LOW_STOCK
