import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { Link } from 'react-router-dom'
import { products } from '../../shared/data/products'
import { COLLECTION_PATH } from '../catalogue'
import { Folio, btnLine, useIsDesktop } from '../ui'
import Plate, { type Look } from './Plate'

const looks: Look[] = [
  {
    id: 'p9',
    details: ['Full-sleeve sequin blouse', 'Blush sequin lengha'],
    main: { x: 58, y: 52 },
  },
  {
    id: 'p3',
    details: ['Hand-worked Kashmiri gara sleeves', 'Teal-to-sapphire ombré silk'],
    main: { x: 52, y: 40 },
  },
  {
    id: 'p11',
    details: ['Hand-painted, gara-embroidered pallu', 'Champagne draped gown'],
    main: { x: 52, y: 58 },
  },
  {
    id: 'p13',
    details: ['Hand-embroidered lion-mane shoulder', 'SG60 edition Indo-Western tuxedo'],
    main: { x: 52, y: 42 },
  },
  {
    id: 'p7',
    details: ['Sculpted full-sleeve jacket', 'Printed silver saree gown'],
    main: { x: 50, y: 52 },
  },
  {
    id: 'p2',
    details: ['Embellished bustier', 'Liquid-metal drape'],
    main: { x: 46, y: 64 },
  },
  {
    id: 'p5',
    details: ['Sweetheart bodice', 'Threadwork skirt in petal pink'],
    main: { x: 58, y: 48 },
  },
  {
    id: 'p6',
    details: ['Structured beaded blouse', 'Pre-draped metallic saree'],
    main: { x: 45, y: 66 },
  },
]

const breathers = {
  3: { src: '/media/runway-kl-shawl.webp', alt: 'A model in an embroidered shawl on the runway', caption: 'On the runway', pos: '50% 40%' },
  6: { src: '/media/runway-garden-2.webp', alt: 'Asian Woman gowns in jewel tones at the garden show', caption: 'The garden show', pos: '50% 45%' },
} as Record<number, { src: string; alt: string; caption: string; pos: string }>

export default function Lookbook() {
  const isDesktop = useIsDesktop()
  const reduced = useReducedMotion()
  return isDesktop && !reduced ? <Horizontal /> : <Swipe />
}

function Intro({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? '' : 'w-[30vw] max-w-[440px] shrink-0 self-center'}>
      <Folio page="14" label={`The lookbook · ${looks.length} looks`} />
      <h2 className="mt-6 font-bodoni text-[clamp(3.2rem,6.4vw,7rem)] font-normal leading-[0.92] tracking-[-0.02em] text-couture-bone">
        The
        <br />
        Lookbook
      </h2>
      <p className="mt-6 max-w-[34ch] font-manrope text-[14px] font-light leading-[1.75] text-couture-bone/75">
        Eight looks from the atelier, from bridal lengha to the SG60 Lion Suit. Each is sold as a complete outfit. Open the + on any look for its details, price
        and a way to make it yours.
      </p>
    </div>
  )
}

function Outro() {
  return (
    <div className="flex w-[78vw] max-w-[420px] shrink-0 flex-col justify-center self-center pr-[6vw] lg:w-[28vw]">
      <p className="font-bodoni text-[clamp(2.2rem,3.6vw,3.6rem)] leading-[1.02] text-couture-bone">
        {products.length} pieces in the collection.
      </p>
      <p className="mt-4 max-w-[30ch] font-manrope text-[14px] font-light leading-relaxed text-couture-bone/70">
        Every piece can be altered to measure, and bridal pieces are made to order.
      </p>
      <Link to={COLLECTION_PATH} className={`${btnLine} mt-8 self-start`}>
        View all {products.length} pieces <span aria-hidden>→</span>
      </Link>
    </div>
  )
}

function sequence(render: { look: (l: Look, i: number) => ReactNode; breather: (b: (typeof breathers)[number], i: number) => ReactNode }) {
  return looks.flatMap((l, i) => {
    const out = [render.look(l, i)]
    if (breathers[i + 1]) out.push(render.breather(breathers[i + 1], i + 1))
    return out
  })
}

/** Desktop: vertical scroll drives a horizontal strip, pinned to the viewport. */
function Horizontal() {
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [dist, setDist] = useState(0)

  useLayoutEffect(() => {
    const el = track.current
    if (!el) return
    const measure = () => setDist(Math.max(0, el.scrollWidth - window.innerWidth))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, (v) => -v * dist)
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 })

  return (
    <section
      ref={section}
      id="lookbook"
      aria-label="The lookbook"
      className="relative bg-couture-ink"
      style={{ height: `calc(100svh + ${dist}px)` }}
    >
      <div className="sticky top-0 h-svh overflow-clip">
        <div aria-hidden className="absolute inset-x-10 top-20 z-10 h-px bg-couture-bone/10">
          <motion.div className="h-full origin-left bg-couture-gold" style={{ scaleX: progress }} />
        </div>
        <motion.div
          ref={track}
          className="flex h-full w-max items-stretch gap-[5vw] pl-10 will-change-transform"
          style={{ x }}
          onFocusCapture={(e) => {
            // Keyboard users: bring the focused look into view by scrolling the page
            // (only :focus-visible: a mouse click also focuses, and scrolling mid-click would make it miss)
            const el = e.target as HTMLElement
            const sec = section.current
            const tr = track.current
            if (!sec || !tr || dist === 0 || !el.matches(':focus-visible')) return
            const r = el.getBoundingClientRect()
            const left = r.left - tr.getBoundingClientRect().left
            const want = Math.min(dist, Math.max(0, left - window.innerWidth / 2 + r.width / 2))
            const top = sec.getBoundingClientRect().top + window.scrollY
            window.scrollTo({ top: top + want, behavior: 'auto' })
          }}
        >
          <Intro />
          {sequence({
            look: (l, i) => (
              <div key={l.id} className="shrink-0 pt-[max(6.5rem,calc(50svh-min(40svh,27vw)*0.75-0.5rem))]">
                <Plate look={l} index={i} className="w-[min(40svh,27vw)]" />
              </div>
            ),
            breather: (b, i) => (
              <figure key={`b${i}`} className="relative h-full w-[58vw] shrink-0 overflow-hidden">
                <img src={b.src} alt={b.alt} loading="lazy" className="h-full w-full object-cover" style={{ objectPosition: b.pos }} />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
                <figcaption className="absolute bottom-10 left-10 font-bodoni text-[clamp(2rem,3.4vw,3.4rem)] italic text-couture-bone">
                  {b.caption}
                </figcaption>
              </figure>
            ),
          })}
          <Outro />
        </motion.div>
      </div>
    </section>
  )
}

/** Mobile & reduced motion: a native swipe carousel with scroll-snap. */
function Swipe() {
  return (
    <section id="lookbook" aria-label="The lookbook" className="relative bg-couture-ink py-20 lg:py-32">
      <div className="px-4 sm:px-6 lg:px-10">
        <Intro compact />
        <p className="mt-6 font-manrope text-[10px] font-semibold uppercase tracking-[0.28em] text-couture-gold">
          Swipe to browse <span aria-hidden>⟶</span>
        </p>
      </div>
      <div
        className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-4 sm:scroll-px-6 sm:px-6 lg:gap-8 lg:px-10"
        tabIndex={0}
        role="region"
        aria-label="Looks, scroll horizontally"
      >
        {sequence({
          look: (l, i) => <Plate key={l.id} look={l} index={i} className="w-[78vw] max-w-[360px] snap-start" />,
          breather: (b, i) => (
            <figure key={`b${i}`} className="relative w-[86vw] max-w-[520px] shrink-0 snap-start self-start overflow-hidden">
              <img src={b.src} alt={b.alt} loading="lazy" className="aspect-[4/5] w-full object-cover" style={{ objectPosition: b.pos }} />
              <figcaption className="absolute bottom-5 left-5 font-bodoni text-3xl italic text-couture-bone [text-shadow:0_2px_20px_rgba(0,0,0,.6)]">
                {b.caption}
              </figcaption>
            </figure>
          ),
        })}
        <Outro />
      </div>
    </section>
  )
}
