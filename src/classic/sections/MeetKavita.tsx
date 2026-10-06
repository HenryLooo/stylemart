import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { brand, stats } from '../../shared/data/story'
import { Container, Reveal } from '../components/ui'
import { ease, focusRing } from '../components/tokens'

export default function MeetKavita() {
  return (
    <section id="kavita" aria-labelledby="kavita-title" className="scroll-mt-20 overflow-hidden bg-classic-paper py-16 sm:py-24 lg:py-28">
      <Container className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
        {/* Image composition: studio portrait with a runway moment layered over it */}
        <div className="relative pb-16 sm:pb-20 lg:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 1, ease }}
            className="relative mr-10 sm:mr-24 lg:mr-20"
          >
            <div aria-hidden className="absolute -left-3 -top-3 h-full w-full border border-classic-gold/70 sm:-left-5 sm:-top-5" />
            <img
              src="/media/kavita-portrait.webp"
              alt="Kavita Thulasidas in a teal silk kurta with an embroidered dupatta"
              loading="lazy"
              className="relative aspect-[4/5] w-full object-cover object-[52%_30%]"
            />
          </motion.div>
          <motion.figure
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 1, delay: 0.2, ease }}
            className="absolute bottom-0 right-0 w-[56%] bg-white p-2 shadow-[0_24px_50px_-20px_rgba(31,31,31,0.45)] sm:w-[50%] sm:p-2.5"
          >
            <img
              src="/media/kavita-runway-bow.webp"
              alt="Kavita greeting the audience on the runway after a show"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover object-[50%_20%]"
            />
            <figcaption className="px-1 pb-0.5 pt-2 text-[11px] text-classic-muted">Taking her bow after the show</figcaption>
          </motion.figure>
        </div>

        <div>
          <Reveal>
            <p className="text-xs tracking-[0.28em] text-classic-gold-dark uppercase">The Designer</p>
            <h2 id="kavita-title" className="mt-4 font-playfair text-4xl leading-tight text-classic-ink sm:text-5xl">
              {brand.founder}
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <blockquote className="relative mt-8 border-l-2 border-classic-gold pl-6">
              <p className="font-playfair text-2xl leading-snug text-classic-ink italic sm:text-[28px]">
                “{brand.philosophy}”
              </p>
            </blockquote>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-8 max-w-[60ch] space-y-4 text-[15px] leading-[1.8] text-classic-muted">
              <p>
                Singapore-born Kavita took over Stylemart in 1999, when it was a 700 sq ft shop on Selegie Road, and
                decided it would be known for one thing: the bride. She trained every stylist herself, and within five
                years the business had tripled.
              </p>
              <p>
                In 2004 she launched her own label, Asian Woman: pure silks, intricate hand embroidery and one-of-a-kind
                pieces for cross-cultural brides. Today her collections show from Singapore to KL Asia Fashion Week.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <dl className="mt-10 grid grid-cols-3 border-y border-classic-line">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className={`flex flex-col-reverse justify-end py-5 pr-2 ${i > 0 ? 'border-l border-classic-line pl-4 sm:pl-6' : ''}`}
                >
                  <dt className="mt-2 text-[11px] leading-snug text-classic-muted sm:text-xs">{s.label}</dt>
                  <dd className="font-playfair text-[28px] leading-none lining-nums text-classic-gold-dark sm:text-4xl">{s.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.25}>
            <a
              href="#press"
              className={`group mt-9 inline-flex items-center gap-2 border-b border-classic-gold pb-1 text-[12px] font-medium tracking-[0.2em] text-classic-ink uppercase transition-colors hover:text-classic-gold-dark ${focusRing}`}
            >
              Read her story
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
            </a>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
