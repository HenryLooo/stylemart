import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { brand } from '../../shared/data/story'
import { Sample } from '../../shared/Sample'
import { EASE, Folio, btnLine, btnSolid } from '../ui'

const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Stylemart, ${brand.address}`)}`

export default function Visit() {
  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (email.trim()) setJoined(true)
  }

  return (
    <section id="visit" className="relative bg-couture-ink-2 px-4 py-24 sm:px-6 lg:px-10 lg:py-36">
      <div className="mx-auto grid max-w-[1400px] gap-14 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-5">
          <Folio page="40" label="Visit the atelier" />
          <address className="mt-6 not-italic">
            <span className="block font-bodoni text-[clamp(2.6rem,5vw,5rem)] leading-[0.98] tracking-[-0.015em] text-couture-bone">
              151 Selegie Road
            </span>
            <span className="mt-2 block font-bodoni text-[clamp(1.4rem,2.2vw,2rem)] italic text-couture-gold-light">Singapore 188315</span>
          </address>

          <dl className="mt-10 grid gap-6 border-t border-couture-gold/25 pt-8 sm:grid-cols-2">
            <div>
              <dt className="font-manrope text-[10px] font-semibold uppercase tracking-[0.26em] text-couture-mute">Telephone</dt>
              {brand.phones.map((ph) => (
                <dd key={ph} className="mt-2">
                  <a href={`tel:${ph.replace(/\s/g, '')}`} className="font-manrope text-[15px] text-couture-bone hover:text-couture-gold-light">
                    {ph}
                  </a>
                </dd>
              ))}
            </div>
            <div>
              <dt className="flex items-center gap-3 font-manrope text-[10px] font-semibold uppercase tracking-[0.26em] text-couture-mute">
                Hours <Sample className="text-couture-gold-light" />
              </dt>
              <dd className="mt-2 font-manrope text-[15px] leading-relaxed text-couture-bone">{brand.hours}</dd>
            </div>
          </dl>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
            <a href={maps} target="_blank" rel="noreferrer" className={btnSolid}>
              Get directions
            </a>
            <a href={brand.whatsapp} target="_blank" rel="noreferrer" className={btnLine}>
              WhatsApp the atelier
            </a>
          </div>
        </div>

        <figure className="relative lg:col-span-6 lg:col-start-7">
          <div className="border border-couture-gold/35 p-2">
            <img
              src="/media/store-interior.webp"
              alt="Inside the Stylemart boutique on Selegie Road"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover object-[50%_50%] lg:aspect-[16/11]"
            />
          </div>
          <figcaption className="mt-3 font-bodoni text-sm italic text-couture-mute">The boutique, Selegie Road</figcaption>
        </figure>
      </div>

      {/* The private list */}
      <div className="mx-auto mt-24 max-w-[1400px] border-t border-couture-gold/25 pt-16 lg:mt-32 lg:pt-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <h2 className="font-bodoni text-[clamp(2.3rem,4.4vw,4.25rem)] font-normal leading-[1] tracking-[-0.01em] text-couture-bone">
              Join the private list
            </h2>
            <p className="mt-4 max-w-[42ch] font-manrope text-[14px] font-light leading-[1.75] text-couture-bone/70">
              First sight of new collections, trunk shows and open fitting days. A few letters a year, never more.
            </p>
          </div>
          <div className="min-h-[7rem] lg:col-span-5 lg:col-start-8">
            <AnimatePresence mode="wait" initial={false}>
              {joined ? (
                <motion.p
                  key="done"
                  role="status"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="font-bodoni text-2xl italic leading-snug text-couture-gold-light"
                >
                  You’re on the list. The next letter goes to {email.trim()}.
                </motion.p>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={submit}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-4 sm:flex-row sm:items-end"
                >
                  <label className="flex-1">
                    <span className="font-manrope text-[10px] font-semibold uppercase tracking-[0.26em] text-couture-mute">Email address</span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="mt-2 w-full border-b border-couture-gold/50 bg-transparent pb-3 font-bodoni text-xl text-couture-bone placeholder:text-couture-mute/50 focus:border-couture-gold-light focus:outline-none"
                    />
                  </label>
                  <button type="submit" className={btnSolid}>
                    Join the list
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
