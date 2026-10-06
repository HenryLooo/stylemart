import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Minus, Plus, ShoppingBag, X } from 'lucide-react'
import { cartCount, cartSubtotal, useCart } from '../../shared/cart'
import { productById } from '../../shared/data/products'
import { formatSGD } from '../../shared/format'
import { ease, focusRing } from './tokens'
import { useEscape, useLockBodyScroll } from './useLockBodyScroll'

const qtyBtn = `grid size-8 place-items-center text-classic-ink transition-colors hover:text-classic-gold-dark disabled:opacity-30 ${focusRing}`

export default function CartDrawer() {
  const { lines, isOpen, close, setQty, remove } = useCart()
  const [notice, setNotice] = useState(false)
  const onClose = useCallback(() => close(), [close])

  useLockBodyScroll(isOpen)
  useEscape(isOpen, onClose)

  useEffect(() => {
    if (!notice) return
    const t = window.setTimeout(() => setNotice(false), 3200)
    return () => window.clearTimeout(t)
  }, [notice])

  const count = cartCount(lines)

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-labelledby="bag-title">
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col bg-white font-poppins text-classic-ink shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease }}
          >
            <header className="flex h-16 shrink-0 items-center justify-between border-b border-classic-line bg-classic-charcoal px-5 text-white">
              <h2 id="bag-title" className="font-playfair text-xl lining-nums">
                Your bag <span className="text-classic-gold">({count})</span>
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close bag"
                autoFocus
                className={`grid size-10 place-items-center text-white transition-colors hover:text-classic-gold ${focusRing}`}
              >
                <X className="size-5" strokeWidth={1.5} />
              </button>
            </header>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <ShoppingBag className="size-10 text-classic-gold" strokeWidth={1} />
                <p className="mt-5 font-playfair text-2xl">Your bag is empty</p>
                <p className="mt-2 text-sm text-classic-muted">Add a ready-to-wear piece, or book a fitting for bridal.</p>
                <button
                  type="button"
                  onClick={onClose}
                  className={`mt-7 rounded-full border border-classic-gold px-7 py-2.5 text-[11px] font-medium tracking-[0.16em] text-classic-gold-dark uppercase transition-colors hover:bg-classic-gold hover:text-white ${focusRing}`}
                >
                  Continue shopping
                </button>
              </div>
            ) : (
              <ul className="flex-1 divide-y divide-classic-line overflow-y-auto px-5">
                <AnimatePresence initial={false}>
                  {lines.map((line) => {
                    const p = productById(line.id)
                    if (!p) return null
                    return (
                      <motion.li
                        key={line.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease }}
                        className="overflow-hidden"
                      >
                        <div className="flex gap-4 py-5">
                          <img src={p.image} alt="" className="h-28 w-[75px] shrink-0 bg-[#ececea] object-cover object-top" />
                          <div className="flex min-w-0 flex-1 flex-col">
                            <div className="flex items-start justify-between gap-3">
                              <p className="font-playfair text-[15px] leading-snug">{p.name}</p>
                              <button
                                type="button"
                                onClick={() => remove(line.id)}
                                aria-label={`Remove ${p.name}`}
                                className={`-mr-1.5 -mt-1 grid size-7 shrink-0 place-items-center text-classic-muted hover:text-classic-ink ${focusRing}`}
                              >
                                <X className="size-4" strokeWidth={1.5} />
                              </button>
                            </div>
                            <p className="mt-1 text-xs text-classic-muted">{p.category}</p>
                            <div className="mt-auto flex items-center justify-between pt-3">
                              <div className="flex items-center border border-classic-line">
                                <button
                                  type="button"
                                  onClick={() => setQty(line.id, line.qty - 1)}
                                  aria-label={`Decrease quantity of ${p.name}`}
                                  className={qtyBtn}
                                >
                                  <Minus className="size-3.5" />
                                </button>
                                <span className="w-7 text-center text-sm tabular-nums" aria-live="polite">
                                  {line.qty}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setQty(line.id, line.qty + 1)}
                                  aria-label={`Increase quantity of ${p.name}`}
                                  className={qtyBtn}
                                >
                                  <Plus className="size-3.5" />
                                </button>
                              </div>
                              <p className="text-sm tabular-nums">{formatSGD((p.price ?? 0) * line.qty)}</p>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    )
                  })}
                </AnimatePresence>
              </ul>
            )}

            {lines.length > 0 && (
              <footer className="shrink-0 border-t border-classic-line bg-classic-paper px-5 pt-5 pb-6">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-classic-muted">Subtotal</span>
                  <span className="font-playfair text-2xl lining-nums tabular-nums">{formatSGD(cartSubtotal(lines))}</span>
                </div>
                <p className="mt-1 text-xs text-classic-muted">Shipping and alterations are calculated at checkout.</p>
                <button
                  type="button"
                  onClick={() => setNotice(true)}
                  className={`mt-5 h-[52px] w-full bg-classic-charcoal text-[12px] font-medium tracking-[0.22em] text-white uppercase transition-colors hover:bg-classic-gold ${focusRing}`}
                >
                  Checkout
                </button>
                <AnimatePresence>
                  {notice && (
                    <motion.p
                      role="status"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden text-center text-xs text-classic-gold-dark"
                    >
                      <span className="block pt-3">Demo only: checkout isn’t connected in this mockup.</span>
                    </motion.p>
                  )}
                </AnimatePresence>
              </footer>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
