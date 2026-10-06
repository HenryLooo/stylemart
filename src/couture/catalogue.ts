import { products, type Product } from '../shared/data/products'

export const COLLECTION_PATH = '/couture/collection'

export interface Filter {
  slug: string
  name: string
  match: (p: Product) => boolean
}

export const filters: Filter[] = [
  { slug: 'all', name: 'All pieces', match: () => true },
  { slug: 'bridal-lengha', name: 'Bridal Lengha', match: (p) => p.category === 'Lengha' },
  { slug: 'saree', name: 'Saree', match: (p) => p.category === 'Saree' },
  { slug: 'gown', name: 'Gown', match: (p) => p.category === 'Gown' },
  { slug: 'indo-western', name: 'Indo-Western', match: (p) => p.category === 'Indo-Western' },
  { slug: 'pants-suit', name: 'Pants Suit', match: (p) => p.category === 'Pants Suit' },
  { slug: 'asian-woman', name: 'Asian Woman', match: (p) => p.collection === 'Asian Woman' },
  { slug: 'menswear', name: 'Menswear', match: (p) => p.category === 'Menswear' },
]

export const filterBySlug = (slug: string | null) => filters.find((f) => f.slug === slug) ?? filters[0]

export const collectionHref = (slug?: string) =>
  slug && slug !== 'all' ? `${COLLECTION_PATH}?c=${slug}` : COLLECTION_PATH

export const countIn = (f: Filter) => products.filter(f.match).length

export const sorts = [
  { value: 'featured', label: 'Featured' },
  { value: 'new', label: 'New arrivals first' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
] as const

export type SortValue = (typeof sorts)[number]['value']

/**
 * Featured leads with what can be bought today (new, then priced) and ends with made-to-order.
 * Price sorts also keep made-to-order (price on request) pieces at the end.
 */
export function sortProducts(list: Product[], sort: SortValue) {
  const priced = (p: Product) => p.price != null
  switch (sort) {
    case 'new':
      return [...list].sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew))
    case 'price-asc':
    case 'price-desc': {
      const dir = sort === 'price-asc' ? 1 : -1
      return [...list].sort((a, b) =>
        priced(a) && priced(b) ? (a.price! - b.price!) * dir : Number(priced(b)) - Number(priced(a)),
      )
    }
    default:
      return [...list].sort(
        (a, b) => Number(!!b.isNew) - Number(!!a.isNew) || Number(priced(b)) - Number(priced(a)),
      )
  }
}
