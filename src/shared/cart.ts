import { create } from 'zustand'
import { productById } from './data/products'

export interface CartLine {
  id: string
  qty: number
}

interface CartState {
  lines: CartLine[]
  isOpen: boolean
  /** `open: false` adds silently, for pages that confirm with their own UI */
  add: (id: string, opts?: { open?: boolean }) => void
  remove: (id: string) => void
  setQty: (id: string, qty: number) => void
  open: () => void
  close: () => void
}

export const useCart = create<CartState>((set) => ({
  lines: [],
  isOpen: false,
  add: (id, { open = true } = {}) =>
    set((s) => {
      // Price-on-request pieces are booked by appointment, not bought online
      if (productById(id)?.price == null) return s
      const existing = s.lines.find((l) => l.id === id)
      const lines = existing
        ? s.lines.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l))
        : [...s.lines, { id, qty: 1 }]
      return { lines, isOpen: open || s.isOpen }
    }),
  remove: (id) => set((s) => ({ lines: s.lines.filter((l) => l.id !== id) })),
  setQty: (id, qty) =>
    set((s) => ({
      lines:
        qty <= 0
          ? s.lines.filter((l) => l.id !== id)
          : s.lines.map((l) => (l.id === id ? { ...l, qty } : l)),
    })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}))

export const cartCount = (lines: CartLine[]) =>
  lines.reduce((n, l) => n + l.qty, 0)

export const cartSubtotal = (lines: CartLine[]) =>
  lines.reduce((sum, l) => sum + (productById(l.id)?.price ?? 0) * l.qty, 0)
