import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { testimonials } from '../../shared/data/story'
import { Sample } from '../../shared/Sample'
import { Container, Reveal, SectionHeading } from '../components/ui'
import { ease, focusRing } from '../components/tokens'

export default function Testimonials() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (paused || reduce) return
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % testimonials.length), 6500)
    return () => window.clearTimeout(t)
  }, [index, paused, reduce])

  return (
    <section aria-labelledby="voices-title" className="bg-classic-paper py-16 sm:py-24">
      <Container>
        <SectionHeading id="voices-title" title="From Our Brides" aside={<Sample className="text-classic-muted" />} />

        <Reveal delay={0.1}>
          <div
            className="mx-auto mt-10 max-w-3xl text-center sm:mt-12"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            <span aria-hidden className="block font-playfair text-7xl leading-[0.5] text-classic-gold">
              “
            </span>
            {/* All slides share one grid cell, so the block never changes height */}
            <div className="mt-6 grid" aria-live="polite">
              {testimonials.map((t, i) => (
                <motion.figure
                  key={t.name}
                  aria-hidden={i !== index}
                  initial={false}
                  animate={{ opacity: i === index ? 1 : 0, y: i === index ? 0 : 10 }}
                  transition={{ duration: 0.7, ease }}
                  className={`[grid-area:1/1] ${i === index ? '' : 'pointer-events-none'}`}
                >
                  <blockquote className="font-playfair text-[21px] leading-[1.55] text-classic-ink italic sm:text-[28px]">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-7">
                    <span className="block text-[13px] font-medium tracking-[0.12em] text-classic-ink uppercase">
                      {t.name}
                    </span>
                    <span className="mt-1 block text-xs text-classic-muted">{t.detail}</span>
                  </figcaption>
                </motion.figure>
              ))}
            </div>

            <div className="mt-9 flex justify-center gap-2.5">
              {testimonials.map((t, i) => (
                <button
                  key={t.name}
                  type="button"
                  aria-label={`Show testimonial ${i + 1} of ${testimonials.length}`}
                  aria-current={i === index}
                  onClick={() => setIndex(i)}
                  className={`group grid h-6 place-items-center ${focusRing}`}
                >
                  <span
                    className={`block h-[3px] rounded-full transition-all duration-500 ${
                      i === index ? 'w-9 bg-classic-gold' : 'w-4 bg-classic-ink/20 group-hover:bg-classic-ink/40'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
