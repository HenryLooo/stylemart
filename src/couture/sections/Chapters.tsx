import { useRef, useState, type ReactNode } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'motion/react'
import { chapters } from '../../shared/data/story'
import { EASE, Folio, useIsDesktop } from '../ui'

/** Crops tuned per photograph (several have old banner text on the right). */
const crop = ['50% 55%', '26% 35%', '50% 28%', '50% 40%', '42% 50%']
const n = chapters.length
/** Viewport-heights of scroll given to each chapter while pinned */
const PER = 85

export default function Chapters() {
  const isDesktop = useIsDesktop()
  const reduced = useReducedMotion()
  return isDesktop && !reduced ? <Pinned /> : <Stacked />
}

function Pinned() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [active, setActive] = useState(0)
  const rail = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const i = Math.min(n - 1, Math.max(0, Math.floor(v * n)))
    setActive((prev) => (prev === i ? prev : i))
  })

  const jump = (i: number) => {
    const el = ref.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    const range = el.offsetHeight - window.innerHeight
    window.scrollTo({ top: top + ((i + 0.35) / n) * range, behavior: 'smooth' })
  }

  const c = chapters[active]

  return (
    <section
      ref={ref}
      id="story"
      aria-label="Her story, in five chapters"
      className="relative bg-couture-ink"
      style={{ height: `${n * PER + 100}svh` }}
    >
      <div className="sticky top-0 flex h-svh overflow-clip">
        {/* Ghost numeral behind everything */}
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={c.numeral}
            aria-hidden
            className="pointer-events-none absolute -left-[2vw] bottom-[-6vw] select-none font-bodoni text-[34vw] italic leading-none text-couture-bone/[0.035]"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 1.2, ease: EASE }}
          >
            {c.numeral}
          </motion.span>
        </AnimatePresence>

        <div className="relative mx-auto grid w-full max-w-[1500px] grid-cols-12 gap-x-8 px-10 pb-20 pt-28">
          {/* Text column */}
          <div className="col-span-5 flex flex-col">
            <Folio page="06" label={`Her story · Chapter ${c.numeral} of V`} />

            <div className="flex flex-1 flex-col justify-center py-8">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  variants={{ show: { transition: { staggerChildren: 0.07 } } }}
                >
                  <Line>
                    <span className="flex items-baseline gap-6">
                      <span className="font-bodoni text-[clamp(6rem,10vw,10rem)] leading-[0.9] text-couture-gold">
                        {c.numeral}
                      </span>
                      <span className="font-manrope text-[11px] font-semibold uppercase tracking-[0.3em] text-couture-gold-light">
                        {c.year}
                      </span>
                    </span>
                  </Line>
                  <h3 className="mt-6 font-bodoni text-[clamp(2.6rem,4.4vw,4.5rem)] font-normal leading-[1] tracking-[-0.01em] text-couture-bone">
                    <Line>{c.title}</Line>
                  </h3>
                  <motion.p
                    variants={{
                      hidden: { opacity: 0, y: 16 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE, delay: 0.15 } },
                      exit: { opacity: 0, transition: { duration: 0.25 } },
                    }}
                    className="mt-7 max-w-[42ch] font-manrope text-[15px] font-light leading-[1.8] text-couture-bone/75"
                  >
                    {c.body}
                  </motion.p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Year rail */}
            <nav aria-label="Chapters" className="relative">
              <div className="relative h-px bg-couture-bone/15">
                <motion.div className="absolute inset-0 origin-left bg-couture-gold" style={{ scaleX: rail }} />
              </div>
              <ol className="mt-4 grid grid-cols-5">
                {chapters.map((ch, i) => (
                  <li key={ch.year}>
                    <button
                      type="button"
                      onClick={() => jump(i)}
                      aria-current={i === active ? 'step' : undefined}
                      className={`group flex flex-col items-start gap-1 text-left transition-colors duration-500 ${
                        i === active ? 'text-couture-gold-light' : 'text-couture-mute hover:text-couture-bone'
                      }`}
                    >
                      <span className="font-bodoni text-xs italic">{ch.numeral}</span>
                      <span className="font-manrope text-[11px] font-semibold tracking-[0.18em]">{ch.year}</span>
                    </button>
                  </li>
                ))}
              </ol>
              <motion.span
                aria-hidden
                className="absolute -top-[3px] size-[7px] rotate-45 bg-couture-gold"
                animate={{ left: `calc(${(active / n) * 100}% - 3px)` }}
                transition={{ duration: 0.8, ease: EASE }}
              />
            </nav>
          </div>

          {/* Image stack: each chapter wipes up over the last */}
          <div className="relative col-span-6 col-start-7">
            <div className="absolute inset-0 border border-couture-gold/35 p-3">
              <div className="relative h-full w-full overflow-hidden bg-couture-ink-2">
                {chapters.map((ch, i) => (
                  <motion.div
                    key={ch.year}
                    className="absolute inset-0"
                    style={{ zIndex: i }}
                    initial={false}
                    animate={{ clipPath: i <= active ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)' }}
                    transition={{ duration: 1.15, ease: EASE }}
                  >
                    <motion.img
                      src={ch.image}
                      alt={ch.imageAlt}
                      loading={i === 0 ? 'eager' : 'lazy'}
                      className="h-full w-full object-cover"
                      style={{ objectPosition: crop[i] }}
                      initial={false}
                      animate={{ scale: i === active ? 1 : 1.14 }}
                      transition={{ duration: 1.6, ease: EASE }}
                    />
                  </motion.div>
                ))}
                <div aria-hidden className="absolute inset-0 z-10 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <p className="absolute bottom-5 right-6 z-10 max-w-[60%] text-right font-manrope text-[11px] leading-snug text-couture-bone/70">
                  {c.imageAlt}
                </p>
              </div>
            </div>

            {/* Chapter V: Kavita herself, inset */}
            <AnimatePresence>
              {active === n - 1 && (
                <motion.figure
                  className="absolute -left-14 bottom-10 z-20 w-[min(17rem,40%)] border border-couture-gold/60 bg-couture-ink p-2 shadow-2xl shadow-black/60"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
                >
                  <img
                    src="/media/kavita-runway-bow.webp"
                    alt="Kavita Thulasidas takes her bow on the runway"
                    className="aspect-[4/3] w-full object-cover object-[40%_35%]"
                  />
                  <figcaption className="px-1 pb-1 pt-2 font-bodoni text-sm italic text-couture-bone/80">
                    Kavita takes her bow
                  </figcaption>
                </motion.figure>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

function Line({ children }: { children: ReactNode }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        className="block"
        variants={{
          hidden: { y: '105%' },
          show: { y: '0%', transition: { duration: 0.95, ease: EASE } },
          exit: { y: '-105%', transition: { duration: 0.35, ease: [0.4, 0, 1, 1] } },
        }}
      >
        {children}
      </motion.span>
    </span>
  )
}

/** Mobile and reduced motion: stacked full-width chapters. */
function Stacked() {
  return (
    <section id="story" aria-label="Her story, in five chapters" className="relative mx-auto max-w-[1400px] bg-couture-ink px-4 pb-10 sm:px-6 lg:px-10 lg:pb-24">
      <Folio page="06" label="Her story, in five chapters" className="mb-10" />
      <ol className="space-y-20 lg:space-y-28">
        {chapters.map((c, i) => (
          <motion.li
            key={c.year}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '0px 0px -15% 0px' }}
            transition={{ duration: 1, ease: EASE }}
          >
            <article className="lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-10">
              <div className="relative border border-couture-gold/35 p-2 lg:col-span-6">
                <img
                  src={c.image}
                  alt={c.imageAlt}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover sm:aspect-[16/11]"
                  style={{ objectPosition: crop[i] }}
                />
                <span
                  aria-hidden
                  className="absolute -bottom-6 left-4 font-bodoni text-[5.5rem] leading-none text-couture-gold [text-shadow:0_2px_30px_rgba(0,0,0,.6)]"
                >
                  {c.numeral}
                </span>
              </div>
              <div className="lg:col-span-5 lg:col-start-8">
              <p className="mt-10 font-manrope text-[11px] font-semibold uppercase tracking-[0.3em] text-couture-gold-light lg:mt-0">
                Chapter {c.numeral} <span className="text-couture-gold">/</span> {c.year}
              </p>
              <h3 className="mt-3 font-bodoni text-[2.6rem] font-normal leading-[1.02] text-couture-bone">{c.title}</h3>
              <p className="mt-4 max-w-[46ch] font-manrope text-[15px] font-light leading-[1.75] text-couture-bone/75">{c.body}</p>
              {i === chapters.length - 1 && (
                <figure className="mt-8 w-2/3 max-w-xs border border-couture-gold/50 p-1.5">
                  <img
                    src="/media/kavita-runway-bow.webp"
                    alt="Kavita Thulasidas takes her bow on the runway"
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover object-[40%_35%]"
                  />
                  <figcaption className="px-1 pt-2 font-bodoni text-sm italic text-couture-bone/80">Kavita takes her bow</figcaption>
                </figure>
              )}
              </div>
            </article>
          </motion.li>
        ))}
      </ol>
    </section>
  )
}
