import { motion } from 'motion/react'
import { brand } from '../../shared/data/story'
import { EASE, Folio, MaskLine, btnLine, btnSolid, whatsappLink } from '../ui'

const steps = [
  {
    title: 'Consultation',
    body: 'Sit down with Kavita’s team on Selegie Road. Bring the occasion, the photographs, your mother’s saree.',
  },
  {
    title: 'Fabric',
    body: 'Choose from pure silks, brocades and georgettes, matched to your colouring and the season of the wedding.',
  },
  {
    title: 'Embroidery',
    body: 'Motifs are drawn for you, then worked by hand: sequins, mirrorwork, Kashmiri gara.',
  },
  {
    title: 'Fitting',
    body: 'Fitted by hand, over as many sessions as it takes, until the piece moves the way you do.',
  },
]

export default function Atelier() {
  return (
    <section id="atelier" className="relative overflow-hidden bg-couture-ink px-4 py-24 sm:px-6 lg:px-10 lg:py-40">
      <div className="mx-auto grid max-w-[1400px] gap-14 lg:grid-cols-12 lg:gap-x-10">
        <div className="relative lg:col-span-6 lg:row-span-2">
          <motion.div
            className="relative aspect-[4/5] overflow-hidden lg:sticky lg:top-28 lg:aspect-[4/5.4]"
            initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 1.4, ease: EASE }}
          >
            <img
              src="/media/runway-garden-1.webp"
              alt="Embroidered Asian Woman pieces on the runway at a garden show"
              loading="lazy"
              className="h-full w-full object-cover object-[52%_50%]"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-couture-ink/80 via-transparent to-transparent" />
            <figure className="absolute bottom-5 right-5 w-[34%] border border-couture-gold/60 bg-couture-ink p-1.5 sm:bottom-7 sm:right-7">
              <img
                src="/media/product-p3-close.webp"
                alt="Detail of hand-worked Kashmiri gara embroidery on a sleeve"
                loading="lazy"
                className="aspect-[2/3] w-full object-cover"
              />
              <figcaption className="px-0.5 pt-1.5 font-bodoni text-[12px] italic leading-tight text-couture-bone/80">
                Kashmiri gara
              </figcaption>
            </figure>
          </motion.div>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <Folio page="28" label="The atelier · Bespoke" />
          <h2 className="mt-6 font-bodoni text-[clamp(3.4rem,7.4vw,7.5rem)] font-normal leading-[0.9] tracking-[-0.02em] text-couture-bone">
            <MaskLine inView>Made</MaskLine>
            <MaskLine inView delay={0.1}>for one.</MaskLine>
          </h2>
          <p className="mt-8 max-w-[40ch] font-manrope text-[15px] font-light leading-[1.75] text-couture-bone/75">
            Every Stylemart bride can have her piece made from the first sketch. Four steps, one atelier, and the designer’s eye
            on all of it.
          </p>

          <ol className="mt-12 border-t border-couture-gold/25">
            {steps.map((s, i) => (
              <motion.li
                key={s.title}
                className="grid grid-cols-[3rem_1fr] gap-x-4 border-b border-couture-gold/25 py-6 sm:grid-cols-[4rem_1fr]"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                transition={{ duration: 0.9, delay: i * 0.08, ease: EASE }}
              >
                <span className="font-bodoni text-3xl italic leading-none text-couture-gold">{i + 1}</span>
                <div>
                  <h3 className="font-bodoni text-[1.65rem] font-normal leading-tight text-couture-bone">{s.title}</h3>
                  <p className="mt-2 max-w-[44ch] font-manrope text-[14px] font-light leading-[1.7] text-couture-bone/70">{s.body}</p>
                </div>
              </motion.li>
            ))}
          </ol>

          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-5">
            <a
              href={whatsappLink('Hello Stylemart, I would like to book a private appointment at the atelier.')}
              target="_blank"
              rel="noreferrer"
              className={btnSolid}
            >
              Book a private appointment
            </a>
            <a href={brand.whatsapp} target="_blank" rel="noreferrer" className={btnLine}>
              Message us on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
