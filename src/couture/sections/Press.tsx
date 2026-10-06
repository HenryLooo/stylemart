import { useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { press, pressNames, type PressItem } from '../../shared/data/story'
import { EASE, Folio, useIsDesktop } from '../ui'

// The fan: Kavita's own feature at the centre, the rest around it
const fanOrder = ['press-a-love-affair', 'press-cool-silks', 'press-kavita-feature', 'press-style-mistress', 'press-sg-indian-entrepreneurs']
const fan = fanOrder.map((k) => press.find((p) => p.image.includes(k))!).filter(Boolean)
const mid = (fan.length - 1) / 2

export default function Press() {
  const isDesktop = useIsDesktop()
  return (
    <section id="press" className="relative overflow-hidden bg-couture-ink py-24 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Folio page="32" label="Press" />
            <h2 className="mt-6 font-bodoni text-[clamp(2.6rem,5.4vw,5.5rem)] font-normal leading-[0.98] tracking-[-0.015em] text-couture-bone">
              In print
            </h2>
          </div>
          <p className="max-w-[40ch] font-manrope text-[14px] font-light leading-[1.75] text-couture-bone/70 lg:col-span-4 lg:col-start-9">
            Two decades of features, from the business pages of The Straits Times to the fashion glossies, and the runway at KL
            Asia Fashion Week.
          </p>
        </div>
      </div>

      {isDesktop ? <Fan /> : <Row />}

      <div className="mx-auto mt-16 max-w-[1400px] px-4 sm:px-6 lg:mt-20 lg:px-10">
        <p className="font-manrope text-[10px] font-semibold uppercase tracking-[0.28em] text-couture-mute">Featured in and with</p>
        <ul className="mt-5 flex flex-wrap items-baseline gap-x-8 gap-y-3 border-t border-couture-gold/25 pt-6 lg:justify-between">
          {pressNames.map((n) => (
            <li key={n} className="font-bodoni text-[clamp(1.25rem,2vw,1.9rem)] italic text-couture-bone/85">
              {n}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Fan() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [active, setActive] = useState(Math.round(mid))
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center 0.55'] })
  const spread = useTransform(scrollYProgress, [0, 1], [reduced ? 1 : 0, 1])

  return (
    <div ref={ref} className="relative mx-auto mt-16 max-w-[1400px] px-10">
      <div className="relative h-[34rem]" onMouseLeave={() => setActive(Math.round(mid))}>
        {fan.map((p, i) => (
          <Cover key={p.image} p={p} i={i} spread={spread} active={active === i} onActive={() => setActive(i)} />
        ))}
      </div>
      <div className="mt-4 h-14 text-center" aria-hidden>
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <p className="font-bodoni text-2xl italic text-couture-bone">{fan[active].title}</p>
            <p className="mt-1 font-manrope text-[10px] font-semibold uppercase tracking-[0.26em] text-couture-gold">{fan[active].outlet}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function Cover({
  p,
  i,
  spread,
  active,
  onActive,
}: {
  p: PressItem
  i: number
  spread: MotionValue<number>
  active: boolean
  onActive: () => void
}) {
  const d = i - mid
  const x = useTransform(spread, [0, 1], [`${d * 1.8}vw`, `${d * 14}vw`])
  const rotate = useTransform(spread, [0, 1], [d * 2.5, d * 7])
  const y = useTransform(spread, [0, 1], [Math.abs(d) * 6, Math.abs(d) * 26])

  return (
    <motion.figure
      className="absolute left-1/2 top-0 -ml-[8.75rem] w-[17.5rem] origin-bottom"
      style={{ x, rotate, y, zIndex: active ? 20 : 10 - Math.abs(d) }}
      onMouseEnter={onActive}
    >
      <div
        className={`border bg-couture-bone p-1.5 shadow-[0_30px_60px_-20px_rgba(0,0,0,.8)] transition-[transform,border-color] duration-500 ease-couture ${
          active ? '-translate-y-5 border-couture-gold' : 'border-couture-gold/30'
        }`}
      >
        <img src={p.image} alt={`${p.title}, ${p.outlet}`} loading="lazy" className="aspect-[0.7] w-full object-cover object-top" />
      </div>
    </motion.figure>
  )
}

function Row() {
  return (
    <ul className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 sm:scroll-px-6 sm:px-6">
      {press.map((p) => (
        <li key={p.image} className="w-[62vw] max-w-[280px] shrink-0 snap-start">
          <div className="border border-couture-gold/30 bg-couture-bone p-1">
            <img src={p.image} alt="" loading="lazy" className="aspect-[0.7] w-full object-cover object-top" />
          </div>
          <p className="mt-3 font-bodoni text-lg italic leading-snug text-couture-bone">{p.title}</p>
          <p className="mt-1 font-manrope text-[10px] font-semibold uppercase tracking-[0.22em] text-couture-gold">{p.outlet}</p>
        </li>
      ))}
    </ul>
  )
}
