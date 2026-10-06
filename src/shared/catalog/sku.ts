import type { Category } from './types'

export const SKU_PREFIX: Record<Category, string> = {
  Lengha: 'LEN',
  Saree: 'SAR',
  Gown: 'GWN',
  'Indo-Western': 'IWW',
  'Pants Suit': 'PNT',
  Menswear: 'MEN',
}

export const normalizeSku = (sku: string) => sku.trim().toUpperCase().replace(/\s+/g, '-')

/** Next free SM-<CAT>-NNNN code: one past the highest existing number for that prefix. */
export function suggestSku(category: Category, existing: string[]) {
  const prefix = `SM-${SKU_PREFIX[category]}-`
  const highest = existing
    .map(normalizeSku)
    .filter((s) => s.startsWith(prefix))
    .map((s) => Number(s.slice(prefix.length)))
    .filter(Number.isInteger)
    .reduce((max, n) => Math.max(max, n), 0)
  return `${prefix}${String(highest + 1).padStart(4, '0')}`
}
