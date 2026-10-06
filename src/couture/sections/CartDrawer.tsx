import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Minus, Plus, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cartCount, cartSubtotal, useCart } from '../../shared/cart'
import { productById } from '../../shared/data/products'
import { formatSGD } from '../../shared/format'
import { COLLECTION_PATH } from '../catalogue'
import { EASE, btnLine, btnSolid, useBodyLock, useEscape } from '../ui'

export default function CartDrawer() {
  const { lines, isOpen, close, setQty, remove } = useCart()
  const navigate = useNavigate()
  const [demoNote, setDemoNote] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const count = cartCount(lines)
  useBodyLock(isOpen)
  useEscape(isOpen, close)

  useEffect(() => {
    if (isOpen) {
      const prev = document.activeElement as HTMLElement | null
      closeRef.current?.focus()
      return () => prev?.focus?.()
    }
    setDemoNote(false)
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[65]" role="dialog" aria-modal="true" aria-label="Your bag">
          <motion.button
            type="button"
            aria-label="Close bag"
            onClick={close}
            className="absolute inset-0 cursor-default bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
          <motion.aside
            className="absolute inset-y-0 right-0 flex w-full flex-col border-l border-couture-gold/40 bg-couture-ink text-couture-bone sm:w-[460px]"
            initial={{ x: '100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.75, ease: EASE }}
          >
            <header className="flex items-start justify-between border-b border-couture-gold/30 px-6 pb-5 pt-6">
              <div>
                <h2 className="font-bodoni text-[2rem] font-normal leading-none">Your bag</h2>
                <p className="mt-2 font-manrope text-[10px] font-semibold uppercase tracking-[0.26em] text-couture-mute">
                  {count} {count === 1 ? 'piece' : 'pieces'}
                </p>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Close bag"
                className="-mr-2 grid size-10 place-items-center hover:text-couture-gold-light"
              >
                <X className="size-5" strokeWidth={1.3} />
              </button>
            </header>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-start justify-center px-6 pb-24">
                <p className="font-bodoni text-3xl italic leading-tight">Your bag is empty.</p>
                <p className="mt-3 max-w-[30ch] font-manrope text-sm font-light leading-relaxed text-couture-bone/70">
                  Every piece in the house is in the collection, ready to add.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    close()
                    requestAnimationFrame(() => requestAnimationFrame(() => navigate(COLLECTION_PATH)))
                  }}
                  className={`${btnLine} mt-8`}
                >
                  Browse the collection
                </button>
              </div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto px-6">
                  <AnimatePresence initial={false}>
                    {lines.map((l) => {
                      const p = productById(l.id)
                      if (!p) return null
                      return (
                        <motion.li
                          key={l.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4, ease: EASE }}
                          className="overflow-hidden border-b border-couture-gold/20"
                        >
                          <div className="flex gap-4 py-5">
                            <div className="shrink-0 border border-couture-gold/40 p-1">
                              <img src={p.image} alt="" className="h-28 w-[4.7rem] object-cover" />
                            </div>
                            <div className="flex min-w-0 flex-1 flex-col">
                              <div className="flex items-start justify-between gap-3">
                                <p className="font-bodoni text-[17px] leading-snug">{p.name}</p>
                                <button
                                  type="button"
                                  onClick={() => remove(l.id)}
                                  aria-label={`Remove ${p.name}`}
                                  className="-mr-1 -mt-1 grid size-7 shrink-0 place-items-center text-couture-mute hover:text-couture-bone"
                                >
                                  <X className="size-3.5" strokeWidth={1.4} />
                                </button>
                              </div>
                              <p className="mt-1 font-manrope text-[11px] text-couture-mute">{p.category}</p>
                              <div className="mt-auto flex items-center justify-between pt-3">
                                <div className="flex items-center border border-couture-gold/40">
                                  <button
                                    type="button"
                                    onClick={() => setQty(l.id, l.qty - 1)}
                                    aria-label={`One fewer ${p.name}`}
                                    className="grid size-8 place-items-center hover:text-couture-gold-light"
                                  >
                                    <Minus className="size-3" strokeWidth={1.5} />
                                  </button>
                                  <span className="w-7 text-center font-manrope text-[13px]" aria-label={`Quantity ${l.qty}`}>
                                    {l.qty}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => setQty(l.id, l.qty + 1)}
                                    aria-label={`One more ${p.name}`}
                                    className="grid size-8 place-items-center hover:text-couture-gold-light"
                                  >
                                    <Plus className="size-3" strokeWidth={1.5} />
                                  </button>
                                </div>
                                <span className="font-bodoni text-lg text-couture-gold-light">{formatSGD((p.price ?? 0) * l.qty)}</span>
                              </div>
                            </div>
                          </div>
                        </motion.li>
                      )
                    })}
                  </AnimatePresence>
                </ul>

                <footer className="border-t border-couture-gold/40 px-6 pb-6 pt-5">
                  <div className="flex items-baseline justify-between">
                    <span className="font-manrope text-[10px] font-semibold uppercase tracking-[0.26em] text-couture-mute">Subtotal</span>
                    <span className="font-bodoni text-[1.75rem] text-couture-bone">{formatSGD(cartSubtotal(lines))}</span>
                  </div>
                  <p className="mt-1 font-manrope text-[11px] text-couture-mute">Alterations and delivery are arranged at checkout.</p>
                  <button type="button" onClick={() => setDemoNote(true)} className={`${btnSolid} mt-5 w-full`}>
                    Proceed to checkout
                  </button>
                  <p className="mt-3 min-h-[1.25rem] text-center font-manrope text-[11px] text-couture-gold-light" role="status">
                    {demoNote ? 'This is a design mockup, so checkout isn’t connected yet.' : ''}
                  </p>
                </footer>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
