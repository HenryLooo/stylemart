import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { brand } from '../../shared/data/story'
import { EASE, ISSUE, scrollToId, useBodyLock, useEscape } from '../ui'

/** The menu is set as the issue's contents page: page number, title, a line of what's there. */
export const contents = [
  { label: 'Collections', id: 'collections', page: '24', line: 'Lengha, saree, gown, menswear', image: '/media/editorial-trio.webp', pos: '50% 30%' },
  { label: 'Bridal', id: 'lookbook', page: '14', line: 'The lookbook, eight looks to shop', image: '/media/editorial-bride-red.webp', pos: '28% 40%' },
  { label: 'Asian Woman', id: 'designer', page: '04', line: 'Kavita’s own label, since 2004', image: '/media/editorial-gramophone.webp', pos: '55% 40%' },
  { label: 'The Atelier', id: 'atelier', page: '28', line: 'Bespoke, made to measure', image: '/media/runway-garden-1.webp', pos: '50% 50%' },
  { label: 'Her Story', id: 'story', page: '06', line: 'Five chapters, 1999 to today', image: '/media/kavita-runway-bow.webp', pos: '40% 40%' },
  { label: 'Press', id: 'press', page: '32', line: 'In print and on the runway', image: '/media/press-kavita-feature.webp', pos: '50% 20%' },
  { label: 'Contact', id: 'visit', page: '40', line: '151 Selegie Road', image: '/media/store-interior.webp', pos: '50% 50%' },
]

export default function MenuOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [hover, setHover] = useState(0)
  const closeRef = useRef<HTMLButtonElement>(null)
  useBodyLock(open)
  useEscape(open, onClose)

  useEffect(() => {
    if (open) {
      setHover(0)
      closeRef.current?.focus()
    }
  }, [open])

  const go = (id: string) => {
    onClose()
    // Let the body unlock before scrolling
    requestAnimationFrame(() => requestAnimationFrame(() => scrollToId(id)))
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[65] overflow-y-auto bg-couture-ink text-couture-bone"
          initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center border-b border-couture-gold/30 px-4 sm:px-6 lg:h-20 lg:px-10">
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="flex items-center gap-3 justify-self-start py-2 font-manrope text-[11px] font-semibold uppercase tracking-[0.24em] hover:text-couture-gold-light"
            >
              <X className="size-4" strokeWidth={1.3} aria-hidden />
              Close
            </button>
            <p className="text-center font-bodoni text-[16px] tracking-[0.3em] [margin-right:-0.3em] sm:text-[19px] lg:text-[24px]">STYLEMART</p>
            <p className="hidden justify-self-end font-manrope text-[10px] uppercase tracking-[0.28em] text-couture-mute sm:block">
              {ISSUE.vol}
            </p>
          </div>

          <div className="mx-auto grid max-w-[1500px] gap-12 px-4 pb-28 pt-10 sm:px-6 lg:grid-cols-12 lg:px-10 lg:pt-14">
            <nav aria-label="Contents" className="lg:col-span-7">
              <p className="mb-6 font-bodoni text-lg italic text-couture-gold">In this issue</p>
              <ul>
                {contents.map((c, i) => (
                  <li key={c.label} className="border-t border-couture-gold/20 last:border-b">
                    <a
                      href={`#${c.id}`}
                      onClick={(e) => {
                        e.preventDefault()
                        go(c.id)
                      }}
                      onMouseEnter={() => setHover(i)}
                      onFocus={() => setHover(i)}
                      className="group grid grid-cols-[2.5rem_1fr] items-baseline gap-x-3 py-3 sm:grid-cols-[3.5rem_1fr_auto] sm:py-4"
                    >
                      <span className="font-bodoni text-base italic text-couture-gold sm:text-lg">{c.page}</span>
                      <span className="block overflow-hidden pb-[0.08em]">
                        <motion.span
                          className="block font-bodoni text-[clamp(2.1rem,6.4vw,4.75rem)] leading-[1] transition-[color,transform] duration-500 ease-couture group-hover:translate-x-3 group-hover:text-couture-gold-light group-focus-visible:text-couture-gold-light"
                          initial={{ y: '105%' }}
                          animate={{ y: '0%' }}
                          transition={{ duration: 0.9, delay: 0.25 + i * 0.06, ease: EASE }}
                        >
                          {c.label}
                        </motion.span>
                      </span>
                      <motion.span
                        className="col-start-2 font-manrope text-[11px] tracking-[0.06em] text-couture-mute sm:col-start-3 sm:text-right"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 + i * 0.06 }}
                      >
                        {c.line}
                      </motion.span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <motion.aside
              className="hidden lg:col-span-4 lg:col-start-9 lg:block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <div className="relative aspect-[4/5] overflow-hidden border border-couture-gold/40 p-2">
                <div className="relative h-full w-full overflow-hidden">
                  <AnimatePresence initial={false}>
                    <motion.img
                      key={contents[hover].image}
                      src={contents[hover].image}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                      style={{ objectPosition: contents[hover].pos }}
                      initial={{ opacity: 0, scale: 1.06 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8, ease: EASE }}
                    />
                  </AnimatePresence>
                </div>
              </div>
              <div className="mt-6 space-y-1 font-manrope text-xs leading-relaxed text-couture-mute">
                <p className="text-couture-bone">{brand.address}</p>
                <p>{brand.phones.join('  /  ')}</p>
              </div>
            </motion.aside>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
