import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, X } from 'lucide-react'
import { cartCount, useCart } from '../../shared/cart'
import { ProductImage } from '../../shared/catalog/ProductImage'
import { useProduct } from '../../shared/catalog/store'
import { formatPrice } from '../../shared/format'
import { useBagToast } from '../bagToast'
import { EASE } from '../ui'

const DURATION_MS = 4200

/** "Added to your bag" confirmation that slides in below the header. */
export default function BagToast() {
  const item = useBagToast((s) => s.item)
  const dismiss = useBagToast((s) => s.dismiss)
  const drawerOpen = useCart((s) => s.isOpen)

  useEffect(() => {
    if (drawerOpen) dismiss()
  }, [drawerOpen, dismiss])

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-3 top-[72px] z-[62] flex justify-end sm:inset-x-auto sm:right-6 sm:top-[92px] lg:right-10"
    >
      <AnimatePresence>{item && <Toast key={item.key} id={item.id} />}</AnimatePresence>
    </div>
  )
}

function Toast({ id }: { id: string }) {
  const p = useProduct(id)
  const dismiss = useBagToast((s) => s.dismiss)
  const openCart = useCart((s) => s.open)
  const count = useCart((s) => cartCount(s.lines))
  const [paused, setPaused] = useState(false)
  const remaining = useRef(DURATION_MS)
  const bar = useRef<HTMLSpanElement>(null)
  const barAnim = useRef<Animation | null>(null)

  // Countdown bar (native WAAPI, so it can pause/resume alongside the timer)
  useEffect(() => {
    const a = bar.current?.animate([{ transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }], {
      duration: DURATION_MS,
      easing: 'linear',
      fill: 'forwards',
    })
    barAnim.current = a ?? null
    return () => a?.cancel()
  }, [])

  // Auto-dismiss that resumes from where it paused
  useEffect(() => {
    if (paused) {
      barAnim.current?.pause()
      return
    }
    barAnim.current?.play()
    const started = Date.now()
    const t = setTimeout(dismiss, remaining.current)
    return () => {
      clearTimeout(t)
      remaining.current -= Date.now() - started
    }
  }, [paused, dismiss])

  if (!p) return null

  return (
    <motion.div
      role="status"
      className="pointer-events-auto relative w-full overflow-hidden border border-couture-gold/50 bg-couture-ink/95 text-couture-bone shadow-[0_24px_60px_-12px_rgba(0,0,0,.7)] backdrop-blur-md sm:w-[380px]"
      initial={{ opacity: 0, y: -16, clipPath: 'inset(0 0 100% 0)' }}
      animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
      exit={{ opacity: 0, y: -10, transition: { duration: 0.35 } }}
      transition={{ duration: 0.6, ease: EASE }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="flex gap-4 p-4">
        <div className="w-16 shrink-0 border border-couture-gold/40 p-1">
          <ProductImage src={p.image} alt="" className="aspect-[2/3] w-full bg-[#e9e7e4] object-cover" />
        </div>
        <div className="min-w-0 flex-1 pr-6">
          <p className="flex items-center gap-2 font-manrope text-[10px] font-semibold uppercase tracking-[0.26em] text-couture-gold">
            <span className="grid size-4 place-items-center rounded-full bg-couture-gold text-couture-ink">
              <Check className="size-2.5" strokeWidth={3} aria-hidden />
            </span>
            Added to your bag
          </p>
          <p className="mt-2 font-bodoni text-[17px] leading-snug">{p.name}</p>
          <p className="mt-1 font-bodoni text-[15px] text-couture-gold-light">{formatPrice(p.price)}</p>
          <div className="mt-3 flex items-center gap-5">
            <button
              type="button"
              onClick={() => {
                dismiss()
                openCart()
              }}
              className="border-b border-couture-gold pb-0.5 font-manrope text-[10px] font-semibold uppercase tracking-[0.22em] text-couture-bone transition-colors hover:text-couture-gold-light"
            >
              View bag ({count})
            </button>
            <button
              type="button"
              onClick={dismiss}
              className="font-manrope text-[10px] font-semibold uppercase tracking-[0.22em] text-couture-mute transition-colors hover:text-couture-bone"
            >
              Keep browsing
            </button>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute right-2 top-2 grid size-8 place-items-center text-couture-mute transition-colors hover:text-couture-bone"
      >
        <X className="size-4" strokeWidth={1.4} />
      </button>
      <span ref={bar} aria-hidden className="absolute inset-x-0 bottom-0 h-px origin-left bg-couture-gold" />
    </motion.div>
  )
}
