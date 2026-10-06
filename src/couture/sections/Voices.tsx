import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { testimonials } from '../../shared/data/story'
import { Sample } from '../../shared/Sample'
import { EASE, Folio } from '../ui'

export default function Voices() {
  const [i, setI] = useState(0)
  const n = testimonials.length
  const t = testimonials[i]
  const go = (d: number) => setI((v) => (v + d + n) % n)

  return (
    <section
      aria-label="Client voices"
      aria-roledescription="carousel"
      className="relative overflow-hidden bg-couture-oxblood px-4 py-24 sm:px-6 lg:px-10 lg:py-36"
    >
      <div className="relative mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Folio page="36" label="Client voices" className="!text-couture-bone/60" />
          <Sample className="text-couture-gold-light" />
        </div>

        <div className="mt-12 min-h-[24rem] sm:min-h-[19rem] lg:mt-16 lg:min-h-[16rem]" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.figure
              key={i}
              initial={{ opacity: 0, filter: 'blur(6px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(6px)' }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <blockquote className="font-bodoni text-[clamp(1.6rem,3.5vw,3.1rem)] italic leading-[1.22] tracking-[-0.005em] text-couture-bone">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4">
                <span aria-hidden className="h-px w-10 bg-couture-gold" />
                <span className="font-manrope text-[11px] font-semibold uppercase tracking-[0.24em] text-couture-bone">{t.name}</span>
                <span className="font-manrope text-[12px] text-couture-bone/60">{t.detail}</span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex items-center justify-end gap-6">
          <ol className="flex gap-2" aria-label="Choose a voice">
            {testimonials.map((x, k) => (
              <li key={x.name}>
                <button
                  type="button"
                  onClick={() => setI(k)}
                  aria-label={`Voice ${k + 1} of ${n}`}
                  aria-current={k === i ? 'true' : undefined}
                  className="grid h-6 w-8 place-items-center"
                >
                  <span className={`block h-px w-full transition-colors duration-500 ${k === i ? 'bg-couture-gold-light' : 'bg-couture-bone/30'}`} />
                </button>
              </li>
            ))}
          </ol>
          <span className="font-bodoni text-lg italic text-couture-bone/80">
            {i + 1} / {n}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous voice"
              className="grid size-11 place-items-center rounded-full border border-couture-bone/30 text-couture-bone transition-colors hover:border-couture-gold-light hover:text-couture-gold-light"
            >
              <ChevronLeft className="size-4" strokeWidth={1.4} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next voice"
              className="grid size-11 place-items-center rounded-full border border-couture-bone/30 text-couture-bone transition-colors hover:border-couture-gold-light hover:text-couture-gold-light"
            >
              <ChevronRight className="size-4" strokeWidth={1.4} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
