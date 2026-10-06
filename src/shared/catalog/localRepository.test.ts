// @vitest-environment jsdom
import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { CatalogError, createLocalRepository } from './localRepository'
import { createMemoryImageStore } from './imageStore'
import type { ProductInput } from './types'

const input = (over: Partial<ProductInput> = {}): ProductInput => ({
  sku: 'SM-LEN-0099',
  name: 'Test Lengha',
  price: 1200,
  stock: 3,
  category: 'Lengha',
  collection: 'Lengha',
  image: '/media/product-p9.webp',
  note: 'A test piece.',
  details: [],
  status: 'active',
  ...over,
})

let repo: ReturnType<typeof createLocalRepository>

beforeEach(() => {
  localStorage.clear()
  repo = createLocalRepository({ storage: localStorage, images: createMemoryImageStore() })
})

describe('local catalog repository', () => {
  it('seeds the 14 real products on first run', async () => {
    const list = await repo.list()
    expect(list).toHaveLength(14)
    expect(new Set(list.map((p) => p.sku)).size).toBe(14)
    expect(list.every((p) => p.status === 'active')).toBe(true)
  })

  it('exposes a synchronous snapshot for first paint', () => {
    expect(repo.peek()).toHaveLength(14)
  })

  it('persists across repository instances (same storage)', async () => {
    const created = await repo.create(input())
    const again = createLocalRepository({ storage: localStorage, images: createMemoryImageStore() })
    expect((await again.get(created.id))?.name).toBe('Test Lengha')
  })

  it('creates with id and timestamps, normalizing the SKU', async () => {
    const p = await repo.create(input({ sku: ' sm-len-0099 ', name: '  Test Lengha  ' }))
    expect(p.id).toBeTruthy()
    expect(p.sku).toBe('SM-LEN-0099')
    expect(p.name).toBe('Test Lengha')
    expect(p.createdAt).toBe(p.updatedAt)
    expect(await repo.list()).toHaveLength(15)
  })

  it('rejects a duplicate SKU, case-insensitively', async () => {
    const existing = (await repo.list())[0].sku
    await expect(repo.create(input({ sku: existing.toLowerCase() }))).rejects.toMatchObject({ field: 'sku' })
  })

  it('allows a product to keep its own SKU on update', async () => {
    const p = await repo.create(input())
    await expect(repo.update(p.id, { sku: p.sku, name: 'Renamed' })).resolves.toMatchObject({ name: 'Renamed' })
  })

  it('validates name, stock and price', async () => {
    await expect(repo.create(input({ name: '  ' }))).rejects.toMatchObject({ field: 'name' })
    await expect(repo.create(input({ stock: -1 }))).rejects.toMatchObject({ field: 'stock' })
    await expect(repo.create(input({ stock: 1.5 }))).rejects.toMatchObject({ field: 'stock' })
    await expect(repo.create(input({ price: -5 }))).rejects.toMatchObject({ field: 'price' })
    await expect(repo.create(input({ image: '' }))).rejects.toMatchObject({ field: 'image' })
    await expect(repo.create(input({ name: '' }))).rejects.toBeInstanceOf(CatalogError)
  })

  it('updates fields and bumps updatedAt', async () => {
    const p = await repo.create(input())
    await new Promise((r) => setTimeout(r, 5))
    const u = await repo.update(p.id, { stock: 0 })
    expect(u.stock).toBe(0)
    expect(u.updatedAt > p.updatedAt).toBe(true)
  })

  it('removes a product', async () => {
    const p = await repo.create(input())
    await repo.remove(p.id)
    expect(await repo.get(p.id)).toBeUndefined()
  })

  it('deletes uploaded images when their product is removed or the image replaced', async () => {
    const images = createMemoryImageStore()
    repo = createLocalRepository({ storage: localStorage, images })
    const a = await repo.uploadImage(new Blob(['a']))
    const b = await repo.uploadImage(new Blob(['b']))
    const p = await repo.create(input({ image: a }))
    await repo.update(p.id, { image: b })
    expect(await images.get(a)).toBeUndefined()
    expect(await images.get(b)).toBeDefined()
    await repo.remove(p.id)
    expect(await images.get(b)).toBeUndefined()
  })

  it('sweeps uploaded photos that no product uses (abandoned uploads)', async () => {
    const images = createMemoryImageStore()
    repo = createLocalRepository({ storage: localStorage, images })
    const kept = await repo.uploadImage(new Blob(['kept']))
    const abandoned = await repo.uploadImage(new Blob(['abandoned']))
    await repo.create(input({ image: kept }))
    expect(await repo.sweepImages()).toBe(1)
    expect(await images.get(kept)).toBeDefined()
    expect(await images.get(abandoned)).toBeUndefined()
  })

  it('reset clears every uploaded photo, saved or not', async () => {
    const images = createMemoryImageStore()
    repo = createLocalRepository({ storage: localStorage, images })
    const used = await repo.uploadImage(new Blob(['a']))
    const loose = await repo.uploadImage(new Blob(['b']))
    await repo.create(input({ image: used }))
    await repo.reset()
    expect(await images.get(used)).toBeUndefined()
    expect(await images.get(loose)).toBeUndefined()
  })

  it('notifies subscribers on change', async () => {
    const seen: number[] = []
    const off = repo.subscribe((list) => seen.push(list.length))
    await repo.create(input())
    off()
    await repo.create(input({ sku: 'SM-LEN-0100' }))
    expect(seen).toEqual([15])
  })

  it('reset restores the seed', async () => {
    await repo.create(input())
    const first = (await repo.list()).find((p) => p.id === 'p1')!
    await repo.remove(first.id)
    const list = await repo.reset()
    expect(list).toHaveLength(14)
    expect(list.some((p) => p.id === first.id)).toBe(true)
  })

  it('recovers from corrupted storage by reseeding', () => {
    localStorage.setItem('stylemart.catalog.v1', '{not json')
    const fresh = createLocalRepository({ storage: localStorage, images: createMemoryImageStore() })
    expect(fresh.peek()).toHaveLength(14)
  })
})

describe('IndexedDB image store', () => {
  it('stores and returns blobs by ref', async () => {
    const { createIdbImageStore } = await import('./imageStore')
    const store = createIdbImageStore()
    const ref = await store.put(new Blob(['hello'], { type: 'text/plain' }))
    expect(ref.startsWith('idb:')).toBe(true)
    const blob = await store.get(ref)
    expect(blob?.size).toBe(5)
    await store.delete(ref)
    expect(await store.get(ref)).toBeUndefined()
  })
})
