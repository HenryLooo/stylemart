import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Plus } from 'lucide-react'
import { productById } from '../../shared/data/products'
import { useCart } from '../../shared/cart'
import { formatPrice } from '../../shared/format'
import { EASE, whatsappLink } from '../ui'

export interface Spot {
  x: number
  y: number
  label: string
}

export interface Look {
  id: string
  /** Detail annotations, drawn from the product name and note */
  spots: Spot[]
  /** Where the shop hotspot sits */
  main: { x: number; y: number }
}

/** A look presented as a framed plate, with annotated hotspots and a shop card. */
export default function Plate({ look, index, className = '' }: { look: Look; index: number; className?: string }) {
  const p = productById(look.id)!
  const [open, setOpen] = useState<number | 'main' | null>(null)
  const add = useCart((s) => s.add)
  const uid = useId()
  const no = String(index + 1).padStart(2, '0')
  const toggle = (k: number | 'main') => setOpen((o) => (o === k ? null : k))

  const action =
    p.price != null ? (
      <button
        type="button"
        onClick={() => add(p.id)}
        className="font-manrope text-[10px] font-semibold uppercase tracking-[0.22em] text-couture-gold transition-colors hover:text-couture-gold-light"
      >
        Add to bag
      </button>
    ) : (
      <a
        href={whatsappLink(`Hello Stylemart, I'd like to book a fitting for ${p.name}.`)}
        target="_blank"
        rel="noreferrer"
        className="font-manrope text-[10px] font-semibold uppercase tracking-[0.22em] text-couture-gold transition-colors hover:text-couture-gold-light"
      >
        Book a fitting
      </a>
    )

  return (
    <figure
      className={`shrink-0 ${className}`}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && open !== null) {
          e.stopPropagation()
          setOpen(null)
        }
      }}
    >
      <div className="border border-couture-gold/40 bg-couture-ink-2 p-2 sm:p-2.5">
        <div className="relative aspect-[2/3] overflow-hidden bg-[#e9e7e4]">
          <img
            src={p.image}
            alt={`Look ${no}: ${p.name}`}
            loading="lazy"
            draggable={false}
            className="h-full w-full object-cover"
          />
          {/* A whisper of ink at the foot so the card and spots sit on the plate */}
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-couture-ink/25 via-transparent to-transparent" />
          <span className="absolute left-3 top-3 font-bodoni text-sm italic text-couture-ink/70">Plate {no}</span>

          {look.spots.map((s, i) => {
            const isOpen = open === i
            const left = s.x > 55
            return (
              <div key={i} className="absolute z-10" style={{ left: `${s.x}%`, top: `${s.y}%` }}>
                <SpotButton
                  open={isOpen}
                  onClick={() => toggle(i)}
                  label={`Detail: ${s.label}`}
                  controls={`${uid}-s${i}`}
                />
                <AnimatePresence>
                  {isOpen && (
                    <motion.span
                      id={`${uid}-s${i}`}
                      role="note"
                      className={`absolute top-1/2 w-max max-w-[11rem] -translate-y-1/2 border border-couture-gold/50 bg-couture-ink/90 px-3 py-2 font-bodoni text-[13px] italic leading-snug text-couture-bone backdrop-blur-sm ${
                        left ? 'right-6' : 'left-6'
                      }`}
                      initial={{ opacity: 0, x: left ? 8 : -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                    >
                      {s.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            )
          })}

          <div className="absolute z-10" style={{ left: `${look.main.x}%`, top: `${look.main.y}%` }}>
            <SpotButton
              main
              open={open === 'main'}
              onClick={() => toggle('main')}
              label={`Shop this look: ${p.name}`}
              controls={`${uid}-card`}
            />
          </div>

          <AnimatePresence>
            {open === 'main' && (
              <motion.div
                id={`${uid}-card`}
                className="absolute inset-x-2 bottom-2 z-20 border border-couture-gold/50 bg-couture-ink/95 p-4 text-couture-bone backdrop-blur-sm sm:inset-x-3 sm:bottom-3 sm:p-5"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(null)}
                  aria-label="Close"
                  className="absolute right-1.5 top-1.5 grid size-8 place-items-center text-couture-mute hover:text-couture-bone"
                >
                  <Plus className="size-4 rotate-45" strokeWidth={1.4} aria-hidden />
                </button>
                <p className="font-manrope text-[9.5px] font-semibold uppercase tracking-[0.26em] text-couture-gold">
                  Look {no} {p.isNew && <span className="text-couture-mute">/ New</span>}
                </p>
                <p className="mt-2 font-bodoni text-[17px] leading-snug sm:text-lg">{p.name}</p>
                <p className="mt-1.5 font-manrope text-[12px] leading-relaxed text-couture-bone/70">{p.note}</p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-couture-gold/25 pt-3">
                  <span className="whitespace-nowrap font-bodoni text-base text-couture-gold-light sm:text-lg">{formatPrice(p.price)}</span>
                  {p.price != null ? (
                    <button
                      type="button"
                      onClick={() => add(p.id)}
                      className="whitespace-nowrap bg-couture-gold px-4 py-2.5 font-manrope text-[10px] font-semibold uppercase tracking-[0.22em] text-couture-ink transition-colors hover:bg-couture-gold-light"
                    >
                      Add to Bag
                    </button>
                  ) : (
                    <a
                      href={whatsappLink(`Hello Stylemart, I'd like to book a fitting for ${p.name}.`)}
                      target="_blank"
                      rel="noreferrer"
                      className="whitespace-nowrap bg-couture-gold px-4 py-2.5 font-manrope text-[10px] font-semibold uppercase tracking-[0.22em] text-couture-ink transition-colors hover:bg-couture-gold-light"
                    >
                      Book a Fitting
                    </a>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <figcaption className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-manrope text-[10px] font-semibold uppercase tracking-[0.26em] text-couture-mute">Look {no}</p>
          <p className="mt-1.5 font-bodoni text-[17px] leading-snug text-couture-bone lg:text-lg">{p.name}</p>
        </div>
        <div className="shrink-0 pt-0.5 text-right">
          <p className="font-bodoni text-[15px] text-couture-gold-light">{formatPrice(p.price)}</p>
          <div className="mt-1.5">{action}</div>
        </div>
      </figcaption>
    </figure>
  )
}

function SpotButton({
  open,
  onClick,
  label,
  controls,
  main = false,
}: {
  open: boolean
  onClick: () => void
  label: string
  controls: string
  main?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-controls={controls}
      aria-label={label}
      className="relative -ml-5 -mt-5 grid size-10 place-items-center"
    >
      {!open && (
        <span
          aria-hidden
          className={`absolute inset-1.5 animate-ping rounded-full [animation-duration:2.4s] ${
            main ? 'bg-couture-gold/60' : 'border border-white/80'
          }`}
        />
      )}
      <span
        aria-hidden
        className={`relative grid place-items-center rounded-full shadow-[0_2px_14px_rgba(0,0,0,.35)] transition-[background-color,transform] duration-500 ease-couture ${
          main
            ? 'size-8 bg-couture-gold text-couture-ink hover:bg-couture-gold-light'
            : 'size-6 border border-white/90 bg-couture-ink/55 text-white backdrop-blur-sm hover:bg-couture-ink/80'
        } ${open ? 'rotate-45' : ''}`}
      >
        <Plus className={main ? 'size-4' : 'size-3.5'} strokeWidth={main ? 1.8 : 1.5} />
      </span>
    </button>
  )
}
