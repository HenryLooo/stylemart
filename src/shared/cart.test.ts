// @vitest-environment jsdom
import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { useCart, cartCount, cartSubtotal } from './cart'
import { catalogRepo } from './catalog/store'

const state = () => useCart.getState()

describe('cart store', () => {
  beforeEach(async () => {
    await catalogRepo.reset()
    useCart.setState({ lines: [], isOpen: false })
  })

  it('adds a product and increments qty on repeat add', () => {
    state().add('p5')
    state().add('p5')
    expect(state().lines).toEqual([{ id: 'p5', qty: 2 }])
  })

  it('opens the drawer when adding', () => {
    state().add('p5')
    expect(state().isOpen).toBe(true)
  })

  it('can add without opening the drawer', () => {
    state().add('p5', { open: false })
    expect(state().isOpen).toBe(false)
    expect(state().lines).toEqual([{ id: 'p5', qty: 1 }])
  })

  it('removes a line', () => {
    state().add('p5')
    state().add('p6')
    state().remove('p5')
    expect(state().lines).toEqual([{ id: 'p6', qty: 1 }])
  })

  it('setQty to 0 removes the line', () => {
    state().add('p5')
    state().setQty('p5', 0)
    expect(state().lines).toEqual([])
  })

  it('counts total quantity', () => {
    state().add('p5')
    state().add('p5')
    state().add('p6')
    expect(cartCount(state().lines)).toBe(3)
  })

  it('computes subtotal from product prices', () => {
    state().add('p5') // 490
    state().add('p6') // 415
    state().add('p6')
    expect(cartSubtotal(state().lines)).toBe(490 + 415 * 2)
  })

  it('ignores price-on-request products', () => {
    expect(state().add('p1')).toBe(false)
    expect(state().lines).toEqual([])
  })

  it('never exceeds stock', () => {
    // p9 has 1 in stock
    expect(state().add('p9')).toBe(true)
    expect(state().add('p9')).toBe(false)
    state().setQty('p9', 5)
    expect(state().lines).toEqual([{ id: 'p9', qty: 1 }])
  })

  it('refuses sold-out and inactive products', async () => {
    await catalogRepo.update('p5', { stock: 0 })
    await catalogRepo.update('p6', { status: 'draft' })
    expect(state().add('p5')).toBe(false)
    expect(state().add('p6')).toBe(false)
    expect(state().lines).toEqual([])
  })

  it('prunes and clamps lines when the catalog changes', async () => {
    state().add('p5')
    state().add('p5')
    state().add('p5')
    state().add('p6')
    state().add('p7')
    await catalogRepo.update('p5', { stock: 2 })
    await catalogRepo.update('p6', { status: 'archived' })
    await catalogRepo.remove('p7')
    expect(state().lines).toEqual([{ id: 'p5', qty: 2 }])
  })
})
