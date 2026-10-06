import { useRef, useState, type MouseEvent } from 'react'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { products, type Product } from '../../shared/data/products'
import { EASE, Folio, scrollToId, useMediaQuery } from '../ui'

const rows: { name: string; match: (p: Product) => boolean; image: string; pos: string; line: string }[] = [
  { name: 'Bridal Lengha', match: (p) => p.category === 'Lengha', image: '/media/editorial-bride-red.webp', pos: '28% 38%', line: 'Sequin, scallop and heirloom red' },
  { name: 'Saree', match: (p) => p.category === 'Saree', image: '/media/runway-kl-1.webp', pos: '50% 40%', line: 'Ready-to-wear and pre-draped' },
  { name: 'Gown', match: (p) => p.category === 'Gown', image: '/media/editorial-gown-black.webp', pos: '70% 30%', line: 'Ombré silks and Kashmiri gara' },
  { name: 'Indo-Western', match: (p) => p.category === 'Indo-Western', image: '/media/editorial-gramophone.webp', pos: '55% 40%', line: 'Western cuts, Asian hands' },
  { name: 'Asian Woman', match: (p) => p.collection === 'Asian Woman', image: '/media/editorial-trio.webp', pos: '50% 30%', line: 'Kavita’s own label, since 2004' },
  { name: 'Menswear', match: (p) => p.category === 'Menswear', image: '/media/editorial-menswear.webp', pos: '30% 30%', line: 'Sherwanis and the SG60 Lion Suit' },
]

const roman = ['i', 'ii', 'iii', 'iv', 'v', 'vi']
const countLabel = (n: number) => `${n} ${n === 1 ? 'piece' : 'pieces'}`

export default function CollectionsIndex() {
  const canHover = useMediaQuery('(hover: hover) and (min-width: 1024px)')
  return (
    <section id="collections" className="relative bg-couture-ink-2 px-4 py-24 sm:px-6 lg:px-10 lg:py-36">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Folio page="24" label="The collections" />
            <h2 className="mt-6 font-bodoni text-[clamp(2.6rem,5.4vw,5.5rem)] font-normal leading-[0.98] tracking-[-0.015em] text-couture-bone">
              Six ways into the house
            </h2>
          </div>
          <p className="max-w-[38ch] font-manrope text-[14px] font-light leading-[1.75] text-couture-bone/70 lg:col-span-4 lg:col-start-9">
            From the bridal lengha that started it all to Kavita’s Asian Woman label and the menswear that stands beside it.
          </p>
        </div>
        {canHover ? <HoverList /> : <Cards />}
      </div>
    </section>
  )
}

function HoverList() {
  const ref = useRef<HTMLUListElement>(null)
  const [active, setActive] = useState<number | null>(null)
  const reduced = useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 160, damping: 22, mass: 0.6 })
  const y = useSpring(my, { stiffness: 160, damping: 22, mass: 0.6 })

  const onMove = (e: MouseEvent) => {
    const r = ref.current!.getBoundingClientRect()
    mx.set(e.clientX - r.left)
    my.set(e.clientY - r.top)
  }

  return (
    <ul
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setActive(null)}
      className="group/list relative mt-16 border-t border-couture-gold/25"
    >
      {/* Image that trails the cursor */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-0 h-[26rem] w-[20rem] -translate-x-1/2 -translate-y-1/2"
        style={reduced ? { left: '72%', top: '50%' } : { x, y }}
      >
        <AnimatePresence>
          {active !== null && (
            <motion.div
              key={active}
              className="absolute inset-0 overflow-hidden border border-couture-gold/50 bg-couture-ink p-1.5"
              initial={{ opacity: 0, clipPath: 'inset(50% 0% 50% 0%)', rotate: -2 }}
              animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', rotate: -4 }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <img src={rows[active].image} alt="" className="h-full w-full object-cover" style={{ objectPosition: rows[active].pos }} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {rows.map((r, i) => {
        const count = products.filter(r.match).length
        return (
          <li key={r.name} className="relative border-b border-couture-gold/25">
            <a
              href="#lookbook"
              onClick={(e) => {
                e.preventDefault()
                scrollToId('lookbook')
              }}
              onMouseEnter={() => setActive(i)}
              onFocus={(e) => {
                setActive(i)
                const r2 = ref.current!.getBoundingClientRect()
                const t = e.currentTarget.getBoundingClientRect()
                mx.set(r2.width * 0.72)
                my.set(t.top - r2.top + t.height / 2)
              }}
              onBlur={() => setActive(null)}
              className="group/row relative z-10 grid grid-cols-[4rem_1fr_auto] items-baseline gap-6 py-6 transition-opacity duration-500 ease-couture group-hover/list:opacity-35 hover:!opacity-100 focus-visible:!opacity-100"
            >
              <span className="font-bodoni text-xl italic text-couture-gold">{roman[i]}.</span>
              <span className="flex items-baseline gap-8">
                <span className="font-bodoni text-[clamp(2.75rem,5.6vw,5.75rem)] leading-[1] tracking-[-0.015em] text-couture-bone transition-transform duration-700 ease-couture group-hover/row:translate-x-6 group-focus-visible/row:translate-x-6">
                  {r.name}
                </span>
                <span className="hidden font-manrope text-[12px] text-couture-mute xl:inline">{r.line}</span>
              </span>
              <span className="font-manrope text-[11px] font-semibold uppercase tracking-[0.24em] text-couture-gold-light">
                {countLabel(count)}
              </span>
            </a>
          </li>
        )
      })}
    </ul>
  )
}

function Cards() {
  return (
    <ul className="mt-12 grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-5">
      {rows.map((r, i) => (
        <li key={r.name}>
          <a
            href="#lookbook"
            onClick={(e) => {
              e.preventDefault()
              scrollToId('lookbook')
            }}
            className="group block"
          >
            <div className="border border-couture-gold/35 p-1.5">
              <img
                src={r.image}
                alt=""
                loading="lazy"
                className="aspect-[3/4] w-full object-cover"
                style={{ objectPosition: r.pos }}
              />
            </div>
            <p className="mt-3 font-bodoni text-sm italic text-couture-gold">{roman[i]}.</p>
            <p className="font-bodoni text-[1.45rem] leading-tight text-couture-bone">{r.name}</p>
            <p className="mt-1 font-manrope text-[10px] font-semibold uppercase tracking-[0.22em] text-couture-mute">
              {countLabel(products.filter(r.match).length)}
            </p>
          </a>
        </li>
      ))}
    </ul>
  )
}
