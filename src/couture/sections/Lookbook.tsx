import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { Link } from 'react-router-dom'
import { useActiveProducts } from '../../shared/catalog/store'
import type { Product } from '../../shared/catalog/types'
import { COLLECTION_PATH } from '../catalogue'
import { Folio, btnLine, useIsDesktop } from '../ui'
import Plate from './Plate'

// The curated running order of looks (one product each); craft details come from the product itself
const LOOK_IDS = ['p9', 'p3', 'p11', 'p13', 'p7', 'p2', 'p5', 'p6']

const NUMBER_WORDS = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve']
const inWords = (n: number) => NUMBER_WORDS[n] ?? String(n)

/** The looks still on sale (active), in curated order, plus the size of the whole active collection */
function useLooks() {
  const products = useActiveProducts()
  const looks = useMemo(
    () => LOOK_IDS.map((id) => products.find((p) => p.id === id)).filter((p): p is Product => !!p),
    [products],
  )
  return { looks, total: products.length }
}

const breathers = {
  3: { src: '/media/runway-kl-shawl.webp', alt: 'A model in an embroidered shawl on the runway', caption: 'On the runway', pos: '50% 40%' },
  6: { src: '/media/runway-garden-2.webp', alt: 'Asian Woman gowns in jewel tones at the garden show', caption: 'The garden show', pos: '50% 45%' },
} as Record<number, { src: string; alt: string; caption: string; pos: string }>

export default function Lookbook() {
  const isDesktop = useIsDesktop()
  const reduced = useReducedMotion()
  const { looks, total } = useLooks()
  if (looks.length === 0) return null
  return isDesktop && !reduced ? <Horizontal looks={looks} total={total} /> : <Swipe looks={looks} total={total} />
}

function Intro({ count, compact = false }: { count: number; compact?: boolean }) {
  return (
    <div className={compact ? '' : 'w-[30vw] max-w-[440px] shrink-0 self-center'}>
      <Folio page="14" label={`The lookbook · ${count} ${count === 1 ? 'look' : 'looks'}`} />
      <h2 className="mt-6 font-bodoni text-[clamp(3.2rem,6.4vw,7rem)] font-normal leading-[0.92] tracking-[-0.02em] text-couture-bone">
        The
        <br />
        Lookbook
      </h2>
      <p className="mt-6 max-w-[34ch] font-manrope text-[14px] font-light leading-[1.75] text-couture-bone/75">
        {inWords(count)} {count === 1 ? 'look' : 'looks'} from the atelier, from bridal lengha to the SG60 Lion Suit. Each is sold as a complete outfit. Open the + on any look for its details, price
        and a way to make it yours.
      </p>
    </div>
  )
}

function Outro({ total }: { total: number }) {
  return (
    <div className="flex w-[78vw] max-w-[420px] shrink-0 flex-col justify-center self-center pr-[6vw] lg:w-[28vw]">
      <p className="font-bodoni text-[clamp(2.2rem,3.6vw,3.6rem)] leading-[1.02] text-couture-bone">
        {total} {total === 1 ? 'piece' : 'pieces'} in the collection.
      </p>
      <p className="mt-4 max-w-[30ch] font-manrope text-[14px] font-light leading-relaxed text-couture-bone/70">
        Every piece can be altered to measure, and bridal pieces are made to order.
      </p>
      <Link to={COLLECTION_PATH} className={`${btnLine} mt-8 self-start`}>
        View all {total} {total === 1 ? 'piece' : 'pieces'} <span aria-hidden>→</span>
      </Link>
    </div>
  )
}

function sequence(
  looks: Product[],
  render: { look: (p: Product, i: number) => ReactNode; breather: (b: (typeof breathers)[number], i: number) => ReactNode },
) {
  return looks.flatMap((l, i) => {
    const out = [render.look(l, i)]
    if (breathers[i + 1]) out.push(render.breather(breathers[i + 1], i + 1))
    return out
  })
}

// Scroll-driven CSS animations move the strip on the compositor; without them, Motion moves it from scroll events
const cssScroll = typeof CSS !== 'undefined' && CSS.supports('animation-timeline: view()')

/** Desktop: vertical scroll drives a horizontal strip, pinned to the viewport. */
function Horizontal({ looks, total }: { looks: Product[]; total: number }) {
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
      className={`relative bg-couture-ink ${cssScroll ? 'lookbook-timeline' : ''}`}
      style={{ height: `calc(100svh + ${dist}px)`, '--lookbook-dist': `${dist}px` } as CSSProperties}
    >
      <div className="sticky top-0 h-svh overflow-clip">
        <div aria-hidden className="absolute inset-x-10 top-20 z-10 h-px bg-couture-bone/10">
          {cssScroll ? (
            <div className="lookbook-progress h-full origin-left bg-couture-gold" />
          ) : (
            <motion.div className="h-full origin-left bg-couture-gold" style={{ scaleX: progress }} />
          )}
        </div>
        <motion.div
          ref={track}
          className={`flex h-full w-max items-stretch gap-[5vw] pl-10 will-change-transform ${cssScroll ? 'lookbook-track' : ''}`}
          style={cssScroll ? undefined : { x }}
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
          <Intro count={looks.length} />
          {sequence(looks, {
            look: (l, i) => (
              <div key={l.id} className="shrink-0 pt-[max(6.5rem,calc(50svh-min(40svh,27vw)*0.75-0.5rem))]">
                <Plate product={l} index={i} className="w-[min(40svh,27vw)]" />
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
          <Outro total={total} />
        </motion.div>
      </div>
    </section>
  )
}

/** Mobile & reduced motion: a native swipe carousel with scroll-snap. */
function Swipe({ looks, total }: { looks: Product[]; total: number }) {
  return (
    <section id="lookbook" aria-label="The lookbook" className="relative bg-couture-ink py-20 lg:py-32">
      <div className="px-4 sm:px-6 lg:px-10">
        <Intro count={looks.length} compact />
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
        {sequence(looks, {
          look: (l, i) => <Plate key={l.id} product={l} index={i} className="w-[78vw] max-w-[360px] snap-start" />,
          breather: (b, i) => (
            <figure key={`b${i}`} className="relative w-[86vw] max-w-[520px] shrink-0 snap-start self-start overflow-hidden">
              <img src={b.src} alt={b.alt} loading="lazy" className="aspect-[4/5] w-full object-cover" style={{ objectPosition: b.pos }} />
              <figcaption className="absolute bottom-5 left-5 font-bodoni text-3xl italic text-couture-bone [text-shadow:0_2px_20px_rgba(0,0,0,.6)]">
                {b.caption}
              </figcaption>
            </figure>
          ),
        })}
        <Outro total={total} />
      </div>
    </section>
  )
}
