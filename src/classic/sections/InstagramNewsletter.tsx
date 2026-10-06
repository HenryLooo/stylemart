import { useState } from 'react'
import type { FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check } from 'lucide-react'
import { Sample } from '../../shared/Sample'
import { InstagramIcon } from '../components/icons'
import { Container, Reveal } from '../components/ui'
import { ease, focusRing } from '../components/tokens'

const posts = [
  { src: '/media/runway-kl-1.webp', alt: 'Runway look at KL Asia Fashion Week', pos: 'object-[50%_30%]' },
  { src: '/media/runway-kl-shawl.webp', alt: 'Model in an embroidered shawl on the runway', pos: 'object-[50%_30%]' },
  { src: '/media/runway-lineup-1.webp', alt: 'Finale line-up of Asian Woman looks', pos: 'object-center' },
  { src: '/media/runway-finale-menswear.webp', alt: 'Menswear finale on the runway', pos: 'object-center' },
  { src: '/media/runway-garden-1.webp', alt: 'Garden runway show', pos: 'object-center' },
  { src: '/media/runway-kl-black.webp', alt: 'Black couture gown on the runway', pos: 'object-[50%_30%]' },
]

export default function InstagramNewsletter() {
  const [done, setDone] = useState(false)
  const [email, setEmail] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setDone(true)
  }

  return (
    <>
      <section aria-labelledby="ig-title" className="bg-white pt-16 sm:pt-24">
        <Container>
          <Reveal className="flex flex-col items-center text-center">
            <InstagramIcon className="size-6 text-classic-gold" />
            <h2 id="ig-title" className="mt-3 font-playfair text-[26px] text-classic-ink sm:text-3xl">
              Follow @stylemart.sg
            </h2>
            <div className="mt-3 flex items-center gap-2 text-sm text-classic-muted">
              Runway, fittings and new pieces
              <Sample />
            </div>
          </Reveal>
        </Container>
        <ul className="mt-10 grid grid-cols-3 sm:mt-12 lg:grid-cols-6">
          {posts.map((p) => (
            <li key={p.src}>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                aria-label={`Instagram post: ${p.alt}`}
                className={`group relative block aspect-square overflow-hidden bg-classic-charcoal focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-classic-gold`}
              >
                <img
                  src={p.src}
                  alt=""
                  loading="lazy"
                  className={`h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${p.pos}`}
                />
                <span
                  aria-hidden
                  className="absolute inset-0 grid place-items-center bg-classic-charcoal/55 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  <InstagramIcon className="size-7" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="newsletter-title" className="bg-classic-paper py-16 sm:py-20">
        <Container>
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 id="newsletter-title" className="font-playfair text-[28px] leading-tight text-classic-ink sm:text-4xl">
              Join the Stylemart list
            </h2>
            <span aria-hidden className="mx-auto mt-4 block h-px w-14 bg-classic-gold" />
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-classic-muted">
              New collections, trunk shows and fitting dates. A few emails a year, never more.
            </p>

            <div className="relative mx-auto mt-8 max-w-lg">
              <AnimatePresence mode="wait" initial={false}>
                {done ? (
                  <motion.p
                    key="thanks"
                    role="status"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease }}
                    className="flex min-h-[52px] items-center justify-center gap-3 text-[15px] text-classic-ink"
                  >
                    <span className="grid size-7 place-items-center rounded-full bg-classic-gold text-white">
                      <Check className="size-4" strokeWidth={2} />
                    </span>
                    Thank you. {email} is on the list.
                  </motion.p>
                ) : (
                  <motion.form
                    key="form"
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={submit}
                    className="flex flex-col gap-3 sm:flex-row sm:gap-0"
                  >
                    <label htmlFor="classic-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="classic-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      autoComplete="email"
                      className="h-[52px] w-full min-w-0 border sm:flex-1 border-classic-line bg-white px-5 text-[15px] text-classic-ink placeholder:text-classic-muted/70 focus:border-classic-gold focus:outline-none"
                    />
                    <button
                      type="submit"
                      className={`h-[52px] bg-classic-charcoal px-8 text-[12px] font-medium tracking-[0.2em] text-white uppercase transition-colors hover:bg-classic-gold ${focusRing}`}
                    >
                      Subscribe
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  )
}
