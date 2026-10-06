import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { products } from '../../shared/data/products'
import { useCart } from '../../shared/cart'
import { formatPrice } from '../../shared/format'
import { EASE, useBodyLock, useEscape, whatsappLink } from '../ui'

const suggestions = ['Lengha', 'Saree', 'Gown', 'Menswear', 'Kashmiri gara']

export default function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('')
  const add = useCart((s) => s.add)
  useBodyLock(open)
  useEscape(open, onClose)

  const results = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return products.filter((p) => p.isNew).slice(0, 4)
    return products.filter((p) =>
      [p.name, p.category, p.collection, p.note].some((s) => s.toLowerCase().includes(t)),
    )
  }, [q])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[65]" role="dialog" aria-modal="true" aria-label="Search the collection">
          <motion.button
            type="button"
            aria-label="Close search"
            className="absolute inset-0 cursor-default bg-black/70"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
          <motion.div
            className="relative max-h-svh overflow-y-auto border-b border-couture-gold/40 bg-couture-ink text-couture-bone"
            initial={{ y: '-100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div className="mx-auto max-w-5xl px-4 pb-10 pt-5 sm:px-6 lg:pt-8">
              <div className="flex items-center justify-between">
                <p className="font-bodoni text-lg italic text-couture-gold">Search the collection</p>
                <button
                  type="button"
                  onClick={onClose}
                  className="grid size-10 place-items-center hover:text-couture-gold-light"
                  aria-label="Close search"
                >
                  <X className="size-5" strokeWidth={1.3} />
                </button>
              </div>
              <label className="mt-4 block border-b border-couture-gold/50">
                <span className="sr-only">Search pieces</span>
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Saree, lengha, gara…"
                  className="w-full bg-transparent pb-3 font-bodoni text-[clamp(1.9rem,5vw,3.5rem)] leading-tight text-couture-bone placeholder:text-couture-mute/50 focus:outline-none"
                />
              </label>
              <div className="mt-4 flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setQ(s)}
                    className="rounded-full border border-couture-gold/30 px-3 py-1 font-manrope text-[11px] text-couture-mute transition-colors hover:border-couture-gold hover:text-couture-bone"
                  >
                    {s}
                  </button>
                ))}
              </div>

              <p className="mt-8 font-manrope text-[10px] uppercase tracking-[0.28em] text-couture-mute" aria-live="polite">
                {q.trim() ? `${results.length} ${results.length === 1 ? 'piece' : 'pieces'}` : 'New this season'}
              </p>
              <ul className="mt-4 grid gap-x-6 sm:grid-cols-2">
                {results.map((p) => (
                  <li key={p.id} className="flex gap-4 border-t border-couture-gold/15 py-4">
                    <img src={p.image} alt="" className="h-24 w-16 shrink-0 object-cover" loading="lazy" />
                    <div className="min-w-0 flex-1">
                      <p className="font-bodoni text-lg leading-snug">{p.name}</p>
                      <p className="mt-1 font-manrope text-xs text-couture-mute">{formatPrice(p.price)}</p>
                      {p.price != null ? (
                        <button
                          type="button"
                          onClick={() => {
                            onClose()
                            add(p.id)
                          }}
                          className="mt-2 font-manrope text-[10px] font-semibold uppercase tracking-[0.22em] text-couture-gold hover:text-couture-gold-light"
                        >
                          Add to bag
                        </button>
                      ) : (
                        <a
                          href={whatsappLink(`Hello Stylemart, I'd like to book a fitting for ${p.name}.`)}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-block font-manrope text-[10px] font-semibold uppercase tracking-[0.22em] text-couture-gold hover:text-couture-gold-light"
                        >
                          Book a fitting
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              {q.trim() && results.length === 0 && (
                <p className="mt-2 font-manrope text-sm text-couture-mute">
                  Nothing matches “{q}”. Try a fabric or a category, like saree or gown.
                </p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
