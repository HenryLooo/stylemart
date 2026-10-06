import { useMemo, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Link, useSearchParams } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { ProductImage } from '../shared/catalog/ProductImage'
import { useActiveProducts } from '../shared/catalog/store'
import { usePreloadImage } from '../shared/catalog/usePreloadImage'
import { isMadeToOrder, isSoldOut, type Product } from '../shared/catalog/types'
import { formatPrice } from '../shared/format'
import CoutureShell from './CoutureShell'
import AddToBagButton from './sections/AddToBagButton'
import { countIn, filterBySlug, filters, sortProducts, sorts, type SortValue } from './catalogue'
import { EASE, Folio, btnSolid, whatsappLink } from './ui'

/** The full catalogue: every piece, filterable by collection, with the filter kept in the URL. */
export default function CollectionPage() {
  const [params, setParams] = useSearchParams()
  const active = filterBySlug(params.get('c'))
  const sort = (sorts.find((s) => s.value === params.get('sort'))?.value ?? 'featured') as SortValue
  const products = useActiveProducts()
  const list = useMemo(() => sortProducts(products.filter(active.match), sort), [products, active, sort])
  const gridTop = useRef<HTMLDivElement>(null)

  const update = (next: { c?: string; sort?: SortValue }) => {
    const c = next.c ?? active.slug
    const s = next.sort ?? sort
    const q: Record<string, string> = {}
    if (c !== 'all') q.c = c
    if (s !== 'featured') q.sort = s
    setParams(q, { replace: true })
    // If the shopper is down in the grid, bring them back to the top of the results
    const el = gridTop.current
    if (el && el.getBoundingClientRect().top < 0) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 140, behavior: reduce ? 'auto' : 'smooth' })
    }
  }

  return (
    <CoutureShell title={`${active.slug === 'all' ? 'The Collection' : active.name} · Stylemart`} skipTo="catalogue" skipLabel="Skip to the pieces">
      {/* Masthead */}
      <section className="px-4 pb-10 pt-28 sm:px-6 lg:px-10 lg:pb-14 lg:pt-36">
        <div className="mx-auto max-w-[1400px]">
          <nav aria-label="Breadcrumb" className="font-manrope text-[10px] font-semibold uppercase tracking-[0.26em] text-couture-mute">
            <Link to="/couture" className="transition-colors hover:text-couture-gold-light">
              The Issue
            </Link>
            <span aria-hidden className="mx-3 text-couture-gold/60">/</span>
            <span className={active.slug === 'all' ? 'text-couture-bone' : ''}>The Collection</span>
            {active.slug !== 'all' && (
              <>
                <span aria-hidden className="mx-3 text-couture-gold/60">/</span>
                <span className="text-couture-bone">{active.name}</span>
              </>
            )}
          </nav>

          <div className="mt-10 grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <Folio page="44" label="The collection" />
              <h1 className="mt-5 overflow-hidden pb-[0.06em] font-bodoni text-[clamp(3rem,8vw,7.5rem)] font-normal leading-[0.95] tracking-[-0.02em]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={active.slug}
                    className="block"
                    initial={{ y: '100%' }}
                    animate={{ y: '0%' }}
                    exit={{ y: '-100%' }}
                    transition={{ duration: 0.6, ease: EASE }}
                  >
                    {active.slug === 'all' ? 'The Collection' : active.name}
                  </motion.span>
                </AnimatePresence>
              </h1>
            </div>
            <p className="max-w-[40ch] font-manrope text-[14px] font-light leading-[1.75] text-couture-bone/75 lg:col-span-4">
              Every look is sold as a complete outfit. Ready-to-wear pieces can be bought online; bridal and couture pieces are
              made to order, so book a fitting with the atelier.
            </p>
          </div>
        </div>
      </section>

      {/* Filter + sort bar, pinned under the header */}
      <div className="sticky top-16 z-30 border-y border-couture-gold/25 bg-couture-ink/95 backdrop-blur-sm lg:top-20">
        <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-4 sm:px-6 lg:px-10">
          <ul aria-label="Filter by collection" className="no-scrollbar -mx-1 flex flex-1 gap-1 overflow-x-auto py-3">
            {filters.map((f) => {
              const on = f.slug === active.slug
              return (
                <li key={f.slug} className="shrink-0">
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => update({ c: f.slug })}
                    className={`relative px-3 py-2 font-manrope text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors duration-300 ${
                      on ? 'text-couture-bone' : 'text-couture-mute hover:text-couture-bone'
                    }`}
                  >
                    {f.slug === 'all' ? 'All' : f.name}
                    <sup className="ml-1 font-bodoni text-[11px] normal-case italic tracking-normal text-couture-gold">{countIn(f, products)}</sup>
                    {on && (
                      <motion.span
                        layoutId="collection-filter"
                        className="absolute inset-x-3 -bottom-px h-px bg-couture-gold"
                        transition={{ duration: 0.5, ease: EASE }}
                      />
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
          <label className="relative hidden shrink-0 items-center sm:flex">
            <span className="sr-only">Sort pieces</span>
            <select
              value={sort}
              onChange={(e) => update({ sort: e.target.value as SortValue })}
              className="cursor-pointer appearance-none border border-couture-gold/35 bg-couture-ink py-2 pl-3 pr-9 font-manrope text-[11px] font-semibold uppercase tracking-[0.18em] text-couture-bone transition-colors hover:border-couture-gold focus:outline-none"
            >
              {sorts.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 size-3.5 text-couture-gold" strokeWidth={1.6} />
          </label>
        </div>
      </div>

      {/* Results */}
      <section id="catalogue" className="px-4 pb-24 pt-8 sm:px-6 lg:px-10 lg:pb-32 lg:pt-12">
        <div ref={gridTop} className="mx-auto max-w-[1400px]">
          <div className="flex items-center justify-between gap-4">
            <p aria-live="polite" className="font-manrope text-[11px] uppercase tracking-[0.24em] text-couture-mute">
              {list.length} {list.length === 1 ? 'piece' : 'pieces'}
            </p>
            {/* Sort on mobile sits with the count */}
            <label className="relative flex items-center sm:hidden">
              <span className="sr-only">Sort pieces</span>
              <select
                value={sort}
                onChange={(e) => update({ sort: e.target.value as SortValue })}
                className="appearance-none border border-couture-gold/35 bg-couture-ink py-2 pl-3 pr-8 font-manrope text-[10px] font-semibold uppercase tracking-[0.16em] text-couture-bone focus:outline-none"
              >
                {sorts.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 size-3.5 text-couture-gold" strokeWidth={1.6} />
            </label>
          </div>

          <motion.ul layout className="mt-6 grid grid-cols-2 gap-x-3 gap-y-12 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-16">
            <AnimatePresence mode="popLayout" initial={false}>
              {list.map((p) => (
                <Card key={p.id} p={p} />
              ))}
            </AnimatePresence>
          </motion.ul>
        </div>
      </section>

      {/* Bespoke: the answer when nothing in the grid is quite right */}
      <section className="relative overflow-hidden border-t border-couture-gold/25">
        <img
          src="/media/runway-garden-1.webp"
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-[50%_45%] opacity-45"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-couture-ink via-couture-ink/80 to-couture-ink/20" />
        <div className="relative mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
          <p className="font-bodoni text-lg italic text-couture-gold">Not quite it?</p>
          <h2 className="mt-3 max-w-[16ch] font-bodoni text-[clamp(2.2rem,4.6vw,4.2rem)] leading-[1.02]">
            Every piece can be made to measure.
          </h2>
          <p className="mt-5 max-w-[42ch] font-manrope text-[14px] font-light leading-[1.75] text-couture-bone/75">
            Bring a colour, a heirloom or a photograph. Kavita and the atelier will design it with you on Selegie Road.
          </p>
          <a
            href={whatsappLink("Hello Stylemart, I'd like to book a private appointment for a made-to-measure piece.")}
            target="_blank"
            rel="noreferrer"
            className={`${btnSolid} mt-8`}
          >
            Book a private appointment
          </a>
        </div>
      </section>
    </CoutureShell>
  )
}

function Card({ p }: { p: Product }) {
  const madeToOrder = isMadeToOrder(p)
  const soldOut = isSoldOut(p)
  usePreloadImage(p.closeup)
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25 } }}
      transition={{ duration: 0.6, ease: EASE }}
      className="group flex flex-col"
    >
      <div className="border border-couture-gold/35 bg-couture-ink-2 p-1.5 transition-colors duration-500 group-hover:border-couture-gold/70">
        <div className="relative aspect-[2/3] overflow-hidden bg-[#e9e7e4]">
          {/* Hover reveals the detail: the close-up wipes up over the full look, or, without one, the look zooms in */}
          <ProductImage
            src={p.image}
            alt={p.name}
            loading="lazy"
            className={`h-full w-full object-cover transition-transform duration-[1.4s] ease-couture ${
              p.closeup
                ? 'group-hover:scale-[1.04] group-focus-within:scale-[1.04]'
                : 'origin-[50%_26%] group-hover:scale-[1.35] group-focus-within:scale-[1.35]'
            } ${soldOut ? 'opacity-60' : ''}`}
          />
          {p.closeup && (
            <>
              <ProductImage
                src={p.closeup}
                alt=""
                aria-hidden
                className={`absolute inset-0 h-full w-full scale-[1.06] object-cover object-top transition-[clip-path,transform] duration-[900ms] ease-couture [clip-path:inset(100%_0_0_0)] group-hover:scale-100 group-hover:[clip-path:inset(0_0_0_0)] group-focus-within:scale-100 group-focus-within:[clip-path:inset(0_0_0_0)] ${
                  soldOut ? 'opacity-60' : ''
                }`}
              />
              <span
                aria-hidden
                className="absolute bottom-2 left-2 translate-y-1 bg-couture-ink/85 px-2 py-1 font-bodoni text-[12px] italic text-couture-bone opacity-0 backdrop-blur-sm transition duration-500 ease-couture group-hover:translate-y-0 group-hover:opacity-100 group-hover:delay-300 group-focus-within:translate-y-0 group-focus-within:opacity-100"
              >
                The detail
              </span>
            </>
          )}
          <div className="absolute left-2 top-2 flex flex-col items-start gap-1.5">
            {p.isNew && (
              <span className="bg-couture-gold px-2 py-1 font-manrope text-[9px] font-semibold uppercase tracking-[0.22em] text-couture-ink">
                New
              </span>
            )}
            {madeToOrder && (
              <span className="bg-couture-ink/85 px-2 py-1 font-manrope text-[9px] font-semibold uppercase tracking-[0.22em] text-couture-bone backdrop-blur-sm">
                Made to order
              </span>
            )}
            {soldOut && (
              <span className="bg-couture-bone px-2 py-1 font-manrope text-[9px] font-semibold uppercase tracking-[0.22em] text-couture-ink">
                Sold out
              </span>
            )}
          </div>
        </div>
      </div>
      <p className="mt-4 font-manrope text-[9.5px] font-semibold uppercase tracking-[0.24em] text-couture-mute">{p.category}</p>
      <h3 className="mt-1.5 font-bodoni text-[16px] leading-snug text-couture-bone sm:text-[18px]">{p.name}</h3>
      <p className="mt-1.5 line-clamp-2 font-manrope text-[12px] font-light leading-relaxed text-couture-bone/60">{p.note}</p>
      <div className="mt-auto flex flex-wrap items-baseline justify-between gap-x-3 gap-y-2 pt-4">
        <span className="font-bodoni text-[15px] text-couture-gold-light sm:text-base">{formatPrice(p.price)}</span>
        {madeToOrder ? (
          <a
            href={whatsappLink(`Hello Stylemart, I'd like to book a fitting for ${p.name}.`)}
            target="_blank"
            rel="noreferrer"
            className="border-b border-couture-gold/60 pb-0.5 font-manrope text-[10px] font-semibold uppercase tracking-[0.2em] text-couture-gold transition-colors hover:text-couture-gold-light"
          >
            Book a fitting
          </a>
        ) : (
          <AddToBagButton
            id={p.id}
            className="border-b border-couture-gold/60 pb-0.5 font-manrope text-[10px] font-semibold uppercase tracking-[0.2em] text-couture-gold transition-colors hover:text-couture-gold-light"
          />
        )}
      </div>
    </motion.li>
  )
}
