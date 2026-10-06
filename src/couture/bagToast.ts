import { create } from 'zustand'
import { useCart } from '../shared/cart'

interface BagToastState {
  /** `key` changes on every add so a repeat add of the same piece restarts the toast */
  item: { id: string; key: number } | null
  show: (id: string) => void
  dismiss: () => void
}

export const useBagToast = create<BagToastState>((set) => ({
  item: null,
  show: (id) => set({ item: { id, key: Date.now() } }),
  dismiss: () => set({ item: null }),
}))

/**
 * Couture confirms adds with a toast instead of throwing the drawer over the page.
 * Returns false (and shows no toast) when the piece couldn't be added: sold out, or the bag already holds all the stock.
 */
export function addToBag(id: string) {
  const added = useCart.getState().add(id, { open: false })
  if (added) useBagToast.getState().show(id)
  return added
}
