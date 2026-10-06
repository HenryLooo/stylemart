import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Plus } from 'lucide-react'
import { productById } from '../../shared/data/products'
import { formatPrice } from '../../shared/format'
import { EASE, whatsappLink } from '../ui'
import AddToBagButton from './AddToBagButton'

export interface Look {
  id: string
  /** Craft details shown in the shop card, drawn from the product name and note */
  details: string[]
}

/** A look (one complete outfit) presented as a framed plate; the shop hotspot sits in the same corner on every plate. */
export default function Plate({ look, index, className = '' }: { look: Look; index: number; className?: string }) {
  const p = productById(look.id)!
  const [open, setOpen] = useState(false)
  const uid = useId()
  const no = String(index + 1).padStart(2, '0')

  const action =
    p.price != null ? (
      <AddToBagButton
        id={p.id}
        className="font-manrope text-[10px] font-semibold uppercase tracking-[0.22em] text-couture-gold transition-colors hover:text-couture-gold-light"
      />
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
        if (e.key === 'Escape' && open) {
          e.stopPropagation()
          setOpen(false)
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
          {/* A whisper of ink at the foot so the card sits on the plate */}
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-couture-ink/25 via-transparent to-transparent" />
          <span className="absolute left-3 top-3 font-bodoni text-sm italic text-couture-ink/70">Plate {no}</span>

          <div className="absolute right-2 top-2 z-30 sm:right-3 sm:top-3">
            <SpotButton
              open={open}
              onClick={() => setOpen((o) => !o)}
              label={`Shop this look: ${p.name}`}
              controls={`${uid}-card`}
            />
          </div>

          <AnimatePresence>
            {open && (
              <motion.div
                id={`${uid}-card`}
                className="absolute inset-x-2 bottom-2 z-20 border border-couture-gold/50 bg-couture-ink/95 p-4 text-couture-bone backdrop-blur-sm sm:inset-x-3 sm:bottom-3 sm:p-5"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <p className="font-manrope text-[9.5px] font-semibold uppercase tracking-[0.26em] text-couture-gold">
                  Look {no} {p.isNew && <span className="text-couture-mute">/ New</span>}
                </p>
                <p className="mt-2 font-bodoni text-[17px] leading-snug sm:text-lg">{p.name}</p>
                <p className="mt-1.5 font-manrope text-[12px] leading-relaxed text-couture-bone/70">{p.note}</p>
                <ul className="mt-3 space-y-1">
                  {look.details.map((d) => (
                    <li key={d} className="flex items-baseline gap-2 font-bodoni text-[13px] italic text-couture-bone/85">
                      <span aria-hidden className="h-px w-3 shrink-0 translate-y-[-3px] bg-couture-gold/70" />
                      {d}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-couture-gold/25 pt-3">
                  <span className="whitespace-nowrap font-bodoni text-base text-couture-gold-light sm:text-lg">{formatPrice(p.price)}</span>
                  {p.price != null ? (
                    <AddToBagButton
                      id={p.id}
                      label="Add to Bag"
                      className="whitespace-nowrap bg-couture-gold px-4 py-2.5 font-manrope text-[10px] font-semibold uppercase tracking-[0.22em] text-couture-ink transition-colors hover:bg-couture-gold-light"
                    />
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
}: {
  open: boolean
  onClick: () => void
  label: string
  controls: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-controls={controls}
      aria-label={label}
      className="relative grid size-10 place-items-center"
    >
      {!open && (
        <span
          aria-hidden
          className="absolute inset-1.5 animate-ping rounded-full bg-couture-gold/60 [animation-duration:2.4s]"
        />
      )}
      <span
        aria-hidden
        className={`relative grid size-8 place-items-center rounded-full bg-couture-gold text-couture-ink shadow-[0_2px_14px_rgba(0,0,0,.35)] transition-[background-color,transform] duration-500 ease-couture hover:bg-couture-gold-light ${
          open ? 'rotate-45' : ''
        }`}
      >
        <Plus className="size-4" strokeWidth={1.8} />
      </span>
    </button>
  )
}
