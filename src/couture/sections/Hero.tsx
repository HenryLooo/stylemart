import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { Link } from 'react-router-dom'
import { COLLECTION_PATH } from '../catalogue'
import { EASE, ISSUE, MaskLine, btnLine, btnSolid, scrollToId } from '../ui'

// Small type over a busy photo: a soft dark halo keeps it readable without a visible box
const halo = '[text-shadow:0_1px_14px_rgb(0_0_0/0.7)]'

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '24%'])
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  const typeY = useTransform(scrollYProgress, [0, 1], ['0%', '-18%'])
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  const fadeIn = (delay: number) => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 1.2, delay, ease: EASE },
  })

  return (
    <section ref={ref} id="top" className="relative h-svh min-h-[640px] overflow-hidden bg-couture-ink">
      <motion.div className="absolute inset-0 will-change-transform" style={reduced ? undefined : { y: imgY, scale: imgScale }}>
        <motion.div
          className="h-full w-full"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.4, ease: EASE }}
        >
          <picture>
            <source media="(max-width: 767px)" srcSet="/media/editorial-veil-portrait.webp" />
            <img
              src="/media/editorial-reclining.webp"
              alt="A model reclines in an embroidered Asian Woman gown in a dark, gilded parlour"
              fetchPriority="high"
              className="h-full w-full object-cover object-[50%_22%] md:object-[50%_38%]"
            />
          </picture>
        </motion.div>
      </motion.div>

      {/* Legibility: a soft vignette at the top for the header, a deep fall-off where the type sits */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-black/70 via-black/30 to-transparent lg:h-64" />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[76%] bg-[linear-gradient(to_top,var(--color-couture-ink)_0%,rgb(14_12_10/0.85)_30%,rgb(14_12_10/0.45)_60%,transparent_100%)] md:h-[68%]"
      />

      {/* Issue metadata in the corners */}
      <motion.div
        {...fadeIn(1.3)}
        className={`absolute inset-x-4 top-[5.25rem] flex items-start justify-between font-manrope text-[9.5px] font-medium uppercase tracking-[0.3em] text-couture-bone/90 sm:inset-x-6 lg:inset-x-10 lg:top-28 lg:text-[10px] ${halo}`}
      >
        <span>{ISSUE.vol}</span>
        <span className="hidden md:inline">{ISSUE.title}</span>
        <span className="text-right">{ISSUE.season}</span>
      </motion.div>

      <motion.div
        className="absolute inset-x-0 bottom-0 px-4 pb-24 sm:px-6 lg:px-10 lg:pb-14"
        style={reduced ? undefined : { y: typeY, opacity: fade }}
      >
        <motion.p
          {...fadeIn(0.9)}
          className={`mb-4 font-manrope text-[10px] font-semibold uppercase tracking-[0.34em] text-couture-gold-light lg:mb-6 lg:text-[11px] ${halo}`}
        >
          Couture <span className="text-couture-gold">/</span> Bridal <span className="text-couture-gold">/</span> Asian Woman
        </motion.p>

        <div className="relative">
          {/* A pool of shade behind the name, outside the line masks so its soft edge isn't clipped */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-[6%] -inset-y-[30%] bg-[radial-gradient(ellipse_60%_55%_at_35%_50%,rgb(14_12_10/0.7),transparent)]"
          />
          <h1 className="relative font-didot uppercase leading-[0.88] text-couture-bone">
            <span className="sr-only">Kavita Thulasidas</span>
            <span aria-hidden>
              <MaskLine delay={0.35} duration={1.4} className="text-[13.1vw] lg:text-[13.3vw]">
                Kavita
              </MaskLine>
              <MaskLine delay={0.5} duration={1.4} className="text-[13.1vw] lg:text-[13.3vw]">
                Thulasidas
              </MaskLine>
            </span>
          </h1>
          <motion.div {...fadeIn(1.5)} className="absolute right-0 top-[0.6vw] hidden max-w-sm lg:block">
            <HeroCopy />
          </motion.div>
        </div>

        <motion.div {...fadeIn(1.5)} className="mt-6 lg:hidden">
          <HeroCopy />
        </motion.div>
      </motion.div>

      <motion.button
        type="button"
        onClick={() => scrollToId('manifesto')}
        {...fadeIn(1.8)}
        className="absolute bottom-6 right-4 hidden flex-col items-center gap-3 font-manrope text-[9px] font-semibold uppercase tracking-[0.3em] text-couture-bone/70 sm:right-6 md:flex lg:right-10"
        aria-label="Scroll to continue"
      >
        <span className="[writing-mode:vertical-rl]">Scroll</span>
        <span aria-hidden className="relative h-14 w-px overflow-hidden bg-couture-bone/20">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-couture-gold"
            animate={reduced ? undefined : { y: ['-100%', '200%'] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </motion.button>
    </section>
  )
}

function HeroCopy() {
  return (
    <div className="font-manrope">
      <p className={`max-w-[34ch] text-[13px] leading-relaxed text-couture-bone/90 lg:text-sm ${halo}`}>
        Bridal and couture from Singapore, designed by Kavita Thulasidas and made to measure on Selegie Road.
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-4">
        <Link to={COLLECTION_PATH} className={btnSolid}>
          Shop the Collection
        </Link>
        <a
          href="#designer"
          onClick={(e) => {
            e.preventDefault()
            scrollToId('designer')
          }}
          className={btnLine}
        >
          Her Story <span aria-hidden className="transition-transform duration-500 group-hover:translate-y-0.5">↓</span>
        </a>
      </div>
    </div>
  )
}
