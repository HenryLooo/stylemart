import { useEffect, useSyncExternalStore, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { brand } from '../shared/data/story'

export const EASE = [0.22, 1, 0.36, 1] as const

/** Issue metadata used across the page. Est. 1999 → 2026 is the 27th year. */
export const ISSUE = {
  vol: 'Vol. XXVII',
  season: 'Autumn / Winter 2026',
  title: 'The Bridal Issue',
}

export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(query)
      m.addEventListener('change', cb)
      return () => m.removeEventListener('change', cb)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/** Desktop = wide enough for pinned / horizontal scroll set pieces. */
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)')

export function useBodyLock(active: boolean) {
  useEffect(() => {
    if (!active) return
    const { overflow, paddingRight } = document.body.style
    const gap = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (gap > 0) document.body.style.paddingRight = `${gap}px`
    return () => {
      document.body.style.overflow = overflow
      document.body.style.paddingRight = paddingRight
    }
  }, [active])
}

export function useEscape(active: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onEscape()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, onEscape])
}

export const whatsappLink = (text: string) =>
  `${brand.whatsapp}?text=${encodeURIComponent(text)}`

/** Smooth-scroll to a section id (works with the tall pinned sections). */
export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: reduce ? 'auto' : 'smooth' })
}

/** A line of type that rises out of an overflow mask. */
export function MaskLine({
  children,
  delay = 0,
  className = '',
  inView = false,
  duration = 1.2,
}: {
  children: ReactNode
  delay?: number
  className?: string
  inView?: boolean
  duration?: number
}) {
  // The observer must watch the mask, not the line: the line starts clipped out of view
  const trigger = inView
    ? { initial: 'hidden', whileInView: 'show', viewport: { once: true, margin: '0px 0px -10% 0px' } }
    : { initial: 'hidden', animate: 'show' }
  return (
    <motion.span className={`block overflow-hidden pb-[0.06em] -mb-[0.06em] ${className}`} {...trigger}>
      <motion.span
        className="block"
        variants={{ hidden: { y: '108%' }, show: { y: '0%', transition: { duration, delay, ease: EASE } } }}
      >
        {children}
      </motion.span>
    </motion.span>
  )
}

/** Running folio, as on a magazine page: page number, hairline, section name. */
export function Folio({ page, label, className = '' }: { page: string; label: string; className?: string }) {
  return (
    <p className={`flex items-center gap-3 font-manrope text-[10px] font-medium uppercase tracking-[0.28em] text-couture-mute ${className}`}>
      <span className="font-bodoni text-[13px] normal-case italic tracking-normal text-couture-gold">{page}</span>
      <span aria-hidden className="h-px w-8 bg-couture-gold/50" />
      <span>{label}</span>
    </p>
  )
}

export const btnSolid =
  'inline-flex items-center justify-center gap-3 bg-couture-gold px-7 py-4 font-manrope text-[11px] font-semibold uppercase tracking-[0.24em] text-couture-ink transition-colors duration-500 ease-couture hover:bg-couture-gold-light'

export const btnLine =
  'group inline-flex items-center gap-3 border-b border-couture-gold/60 pb-1.5 font-manrope text-[11px] font-semibold uppercase tracking-[0.24em] text-couture-bone transition-colors duration-500 ease-couture hover:border-couture-gold-light hover:text-couture-gold-light'

const noise =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")"

/** Film grain over the whole page. Static, so it costs one composited layer. */
export function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[70] opacity-[0.055]"
      style={{ backgroundImage: noise }}
    />
  )
}
