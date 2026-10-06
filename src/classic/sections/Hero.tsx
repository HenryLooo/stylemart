import { motion } from 'motion/react'
import { ease, focusRing } from '../components/tokens'

const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease } },
}

export default function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate flex h-[calc(100svh-100px)] max-h-[880px] min-h-[540px] scroll-mt-24 overflow-hidden bg-classic-charcoal lg:h-[calc(100svh-124px)] lg:min-h-[600px]"
    >
      {/* Slow Ken Burns: settles from a gentle zoom over the first seconds on screen */}
      <motion.img
        src="/media/editorial-gramophone.webp"
        alt="A couple in Indo-Western couture beside a vintage gramophone"
        fetchPriority="high"
        initial={{ scale: 1.14 }}
        animate={{ scale: 1 }}
        transition={{ duration: 16, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute inset-0 -z-10 h-full w-full object-cover object-[60%_30%] md:object-[62%_center]"
      />
      {/* Legibility: bottom wash on phones, left-to-right wash on larger screens */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-t from-black/90 via-black/55 via-55% to-black/0 md:bg-linear-to-r md:from-black/80 md:via-black/40 md:to-transparent"
      />
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-24 bg-linear-to-b from-black/35 to-transparent" />

      <div className="mx-auto flex w-full max-w-[1280px] items-end px-5 pb-20 sm:px-6 md:items-center md:pb-0 lg:px-10">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.14, delayChildren: 0.25 } } }}
          className="max-w-xl text-white"
        >
          <motion.p variants={item} className="flex items-center gap-3 text-[11px] tracking-[0.28em] text-classic-gold uppercase sm:text-xs">
            <span aria-hidden className="h-px w-8 bg-classic-gold" />
            Since 1999 · Singapore
          </motion.p>
          <motion.h1
            id="hero-title"
            variants={item}
            className="mt-5 font-playfair text-[44px] leading-[1.04] font-normal tracking-[-0.01em] sm:text-6xl lg:text-[76px]"
          >
            Trendsetters of Fashionwear
          </motion.h1>
          <motion.p variants={item} className="mt-5 text-[15px] font-light tracking-wide text-white/85 sm:text-lg">
            Bridal &amp; couture by Kavita Thulasidas
          </motion.p>
          <motion.div variants={item} className="mt-9 flex flex-wrap gap-3 sm:gap-4">
            <a
              href="#new-arrivals"
              className={`inline-flex items-center justify-center bg-white px-7 py-3.5 text-[11px] font-medium tracking-[0.22em] text-classic-ink uppercase transition-colors duration-300 hover:bg-classic-gold hover:text-white sm:px-9 sm:text-xs ${focusRing}`}
            >
              Shop now
            </a>
            <a
              href="#appointment"
              className={`inline-flex items-center justify-center border border-white px-7 py-3.5 text-[11px] font-medium tracking-[0.22em] text-white uppercase transition-colors duration-300 hover:bg-white hover:text-classic-ink sm:px-9 sm:text-xs ${focusRing}`}
            >
              Book a fitting
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
