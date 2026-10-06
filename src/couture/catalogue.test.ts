import { describe, expect, it } from 'vitest'
import { seedProducts } from '../shared/catalog/seed'
import { collectionHref, filterBySlug, filters, sortProducts } from './catalogue'

const products = seedProducts()

describe('catalogue', () => {
  it('falls back to all pieces for unknown or missing slugs', () => {
    expect(filterBySlug(null).slug).toBe('all')
    expect(filterBySlug('nope').slug).toBe('all')
    expect(filterBySlug('saree').name).toBe('Saree')
  })

  it('every piece is reachable from at least one specific filter', () => {
    const specific = filters.filter((f) => f.slug !== 'all')
    for (const p of products) expect(specific.some((f) => f.match(p))).toBe(true)
  })

  it('builds collection links', () => {
    expect(collectionHref()).toBe('/couture/collection')
    expect(collectionHref('all')).toBe('/couture/collection')
    expect(collectionHref('saree')).toBe('/couture/collection?c=saree')
  })

  it('sorts by price ascending with price-on-request pieces last', () => {
    const sorted = sortProducts(products, 'price-asc')
    const prices = sorted.map((p) => p.price)
    const firstNull = prices.indexOf(null)
    expect(prices.slice(firstNull).every((p) => p === null)).toBe(true)
    const priced = prices.slice(0, firstNull) as number[]
    expect(priced).toEqual([...priced].sort((a, b) => a - b))
  })

  it('sorts by price descending with price-on-request pieces last', () => {
    const prices = sortProducts(products, 'price-desc').map((p) => p.price)
    const firstNull = prices.indexOf(null)
    const priced = prices.slice(0, firstNull) as number[]
    expect(priced).toEqual([...priced].sort((a, b) => b - a))
    expect(prices.slice(firstNull).every((p) => p === null)).toBe(true)
  })

  it('features buyable pieces first: new, then priced, then made to order', () => {
    const sorted = sortProducts(products, 'featured')
    const rank = (p: (typeof products)[number]) => (p.isNew ? 0 : p.price != null ? 1 : 2)
    const ranks = sorted.map(rank)
    expect(ranks).toEqual([...ranks].sort((a, b) => a - b))
  })

  it('puts new arrivals first without mutating the source list', () => {
    const before = products.map((p) => p.id)
    const sorted = sortProducts(products, 'new')
    const firstOld = sorted.findIndex((p) => !p.isNew)
    expect(sorted.slice(firstOld).some((p) => p.isNew)).toBe(false)
    expect(products.map((p) => p.id)).toEqual(before)
  })
})
