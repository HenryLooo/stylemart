import { create } from 'zustand'
import { getProduct, useCatalog } from './catalog/store'
import { isSoldOut, type Product } from './catalog/types'

export interface CartLine {
  id: string
  qty: number
}

interface CartState {
  lines: CartLine[]
  isOpen: boolean
  /**
   * Returns false when the piece can't be bought online: inactive, price on request
   * (booked by fitting), sold out, or already at its stock limit in the bag.
   * `open: false` adds silently, for pages that confirm with their own UI.
   */
  add: (id: string, opts?: { open?: boolean }) => boolean
  remove: (id: string) => void
  setQty: (id: string, qty: number) => void
  open: () => void
  close: () => void
}

const buyable = (p: Product | undefined): p is Product =>
  !!p && p.status === 'active' && p.price != null && !isSoldOut(p)

export const useCart = create<CartState>((set, get) => ({
  lines: [],
  isOpen: false,
  add: (id, { open = true } = {}) => {
    const p = getProduct(id)
    if (!buyable(p)) return false
    const s = get()
    const existing = s.lines.find((l) => l.id === id)
    if ((existing?.qty ?? 0) >= p.stock) return false
    const lines = existing
      ? s.lines.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l))
      : [...s.lines, { id, qty: 1 }]
    set({ lines, isOpen: open || s.isOpen })
    return true
  },
  remove: (id) => set((s) => ({ lines: s.lines.filter((l) => l.id !== id) })),
  setQty: (id, qty) =>
    set((s) => {
      const max = getProduct(id)?.stock ?? 0
      const next = Math.min(qty, max)
      return {
        lines: next <= 0 ? s.lines.filter((l) => l.id !== id) : s.lines.map((l) => (l.id === id ? { ...l, qty: next } : l)),
      }
    }),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}))

// Keep the bag honest when the catalog changes (admin edits, other tabs)
useCatalog.subscribe(() => {
  const { lines } = useCart.getState()
  const next = lines.flatMap((l) => {
    const p = getProduct(l.id)
    return buyable(p) ? [{ id: l.id, qty: Math.min(l.qty, p.stock) }] : []
  })
  if (next.length !== lines.length || next.some((l, i) => l.qty !== lines[i].qty)) useCart.setState({ lines: next })
})

export const cartCount = (lines: CartLine[]) => lines.reduce((n, l) => n + l.qty, 0)

export const cartSubtotal = (lines: CartLine[]) =>
  lines.reduce((sum, l) => sum + (getProduct(l.id)?.price ?? 0) * l.qty, 0)
