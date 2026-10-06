import { motion } from 'motion/react'
import { stats } from '../../shared/data/story'
import { EASE, Folio, MaskLine, btnLine, scrollToId } from '../ui'

export default function Designer() {
  return (
    <section id="designer" className="relative bg-couture-ink px-4 pb-24 pt-8 sm:px-6 lg:px-10 lg:pb-40">
      <div className="mx-auto grid max-w-[1400px] items-center gap-y-12 lg:grid-cols-12 lg:gap-x-10">
        {/* Portrait: true colour; a soft ink vignette blends the grey studio backdrop into the page */}
        <motion.figure
          className="relative lg:col-span-6"
          initial={{ clipPath: 'inset(12% 0% 12% 0%)', opacity: 0.4 }}
          whileInView={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
          viewport={{ once: true, margin: '0px 0px -15% 0px' }}
          transition={{ duration: 1.4, ease: EASE }}
        >
          <div className="group relative aspect-[4/3.4] overflow-hidden bg-couture-ink-2">
            <img
              src="/media/kavita-portrait.webp"
              alt="Kavita Thulasidas, founder and designer of Stylemart"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover object-[30%_30%] transition-transform duration-[1.6s] ease-couture group-hover:scale-[1.03]"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_45%_35%,transparent_45%,rgba(14,12,10,0.55)_100%)]"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-couture-ink/75 via-transparent to-transparent" />
            <div aria-hidden className="pointer-events-none absolute inset-3 border border-couture-gold/50 sm:inset-4" />
            <p className="absolute bottom-6 left-7 font-bodoni text-sm italic text-couture-bone/90 sm:bottom-8 sm:left-9">
              Kavita Thulasidas, founder and designer
            </p>
          </div>
        </motion.figure>

        <div className="lg:col-span-5 lg:col-start-8">
          <Folio page="04" label="The designer" />
          <h2 className="mt-6 font-bodoni text-[clamp(2.3rem,4.6vw,4.4rem)] font-normal leading-[1.02] tracking-[-0.01em] text-couture-bone lg:-ml-[22%]">
            <MaskLine inView>For the bride</MaskLine>
            <MaskLine inView delay={0.08}>who belongs</MaskLine>
            <MaskLine inView delay={0.16}>to two worlds.</MaskLine>
          </h2>
          <div className="mt-8 max-w-[44ch] space-y-4 font-manrope text-[15px] font-light leading-[1.75] text-couture-bone/80">
            <p>
              Singapore-born Kavita Thulasidas took over Stylemart in 1999 and turned a 700 sq ft shop on Selegie Road into a
              bridal and couture house.
            </p>
            <p>
              Her own label, <em className="font-bodoni text-[1.08em] text-couture-bone">Asian Woman</em>, pairs pure silks and
              hand embroidery with western cuts, for cross-cultural brides and anyone who wants both.
            </p>
          </div>

          <dl className="mt-10 grid grid-cols-3 border-y border-couture-gold/25">
            {stats.map((s) => (
              <div key={s.label} className="border-l border-couture-gold/25 px-3 py-5 first:border-l-0 first:pl-0 sm:px-5">
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-bodoni text-[clamp(1.6rem,3vw,2.5rem)] leading-none text-couture-gold-light">{s.value}</dd>
                <dd className="mt-2 font-manrope text-[11px] leading-snug text-couture-mute">{s.label}</dd>
              </div>
            ))}
          </dl>

          <a
            href="#story"
            onClick={(e) => {
              e.preventDefault()
              scrollToId('story')
            }}
            className={`${btnLine} mt-10`}
          >
            Read her story in five chapters <span aria-hidden>↓</span>
          </a>
        </div>
      </div>
    </section>
  )
}
