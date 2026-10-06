import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CircleArrowRight } from 'lucide-react'
import { productById } from '../../shared/data/products'
import type { Product } from '../../shared/data/products'
import { ProductCard } from '../components/ProductCard'
import { Container, Reveal, SectionHeading } from '../components/ui'
import { ease, focusRing } from '../components/tokens'

type Collection = Product['collection']

// Tab labels as on the live site; values map to product.collection.
const tabs: { label: string; value: Collection }[] = [
  { label: 'Lengha', value: 'Lengha' },
  { label: 'Saree', value: 'Saree' },
  { label: 'Asian Women', value: 'Asian Woman' },
]

const picks: Record<Collection, string[]> = {
  // Only three lenghas in the catalogue: the fourth slot invites a bespoke order.
  Lengha: ['p9', 'p8', 'p12'],
  Saree: ['p7', 'p14', 'p6', 'p2'],
  'Asian Woman': ['p11', 'p3', 'p5', 'p1'],
}

function BespokeTile() {
  return (
    <a
      href="#appointment"
      className={`group/tile relative flex h-full min-h-[320px] flex-col justify-end overflow-hidden bg-[#ececea] ${focusRing}`}
    >
      <img
        src="/media/editorial-blush-lengha.webp"
        alt="A blush lengha with a sheer dupatta, made to measure"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-1000 group-hover/tile:scale-[1.04]"
      />
      <div aria-hidden className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-2.5 border border-white/40 sm:inset-3" />
      <div className="relative px-4 pb-6 text-center text-white sm:px-6 sm:pb-8">
        <p className="font-playfair text-lg leading-snug sm:text-2xl">Your lengha, made to measure</p>
        <p className="mt-2 hidden text-[13px] font-light text-white/80 sm:block">
          Designed with Kavita, fitted by hand on Selegie Road.
        </p>
        <span className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-white px-2 py-2.5 text-[10px] font-medium tracking-[0.12em] whitespace-nowrap text-white uppercase sm:px-4 sm:text-[11px] sm:tracking-[0.16em] transition-colors duration-300 group-hover/tile:bg-white group-hover/tile:text-classic-ink">
          Book a Fitting
        </span>
      </div>
    </a>
  )
}

export default function FeaturedCollection() {
  const [active, setActive] = useState<Collection>('Lengha')
  const items = picks[active].map((id) => productById(id)).filter((p): p is Product => !!p)

  return (
    <section id="featured" aria-labelledby="featured-title" className="scroll-mt-20 bg-white py-16 sm:py-24">
      <Container>
        <SectionHeading id="featured-title" title="Featured Collection" />

        <Reveal delay={0.05}>
          <div role="tablist" aria-label="Collections" className="mt-8 flex justify-center gap-6 sm:mt-10 sm:gap-10">
            {tabs.map((t) => {
              const selected = t.value === active
              return (
                <button
                  key={t.value}
                  role="tab"
                  type="button"
                  id={`tab-${t.value}`}
                  aria-selected={selected}
                  aria-controls="featured-panel"
                  onClick={() => setActive(t.value)}
                  className={`relative pb-2.5 text-[12px] font-medium tracking-[0.2em] uppercase transition-colors sm:text-[13px] ${focusRing} ${
                    selected ? 'text-classic-gold-dark' : 'text-classic-muted hover:text-classic-ink'
                  }`}
                >
                  {t.label}
                  {selected && (
                    <motion.span
                      layoutId="classic-tab-underline"
                      className="absolute inset-x-0 -bottom-px h-[2px] bg-classic-gold"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                </button>
              )
            })}
          </div>
          <div aria-hidden className="mx-auto h-px max-w-md bg-classic-line" />
        </Reveal>

        <div id="featured-panel" role="tabpanel" aria-labelledby={`tab-${active}`} className="mt-10 sm:mt-12">
          <AnimatePresence mode="wait" initial={false}>
            <motion.ul
              key={active}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease }}
              className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6"
            >
              {items.map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} />
                </li>
              ))}
              {items.length < 4 && (
                <li>
                  <BespokeTile />
                </li>
              )}
            </motion.ul>
          </AnimatePresence>
        </div>

        <Reveal className="mt-14 flex justify-center">
          <a
            href="#new-arrivals"
            className={`group inline-flex items-center gap-2.5 text-[12px] font-medium tracking-[0.24em] text-classic-ink uppercase transition-colors hover:text-classic-gold-dark ${focusRing}`}
          >
            Discover more
            <CircleArrowRight
              className="size-5 text-classic-gold transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={1.3}
            />
          </a>
        </Reveal>
      </Container>
    </section>
  )
}
