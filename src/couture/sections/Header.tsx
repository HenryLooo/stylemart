import { useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { Search } from 'lucide-react'
import { cartCount, useCart } from '../../shared/cart'
import { scrollToId } from '../ui'

export default function Header({ onMenu, onSearch }: { onMenu: () => void; onSearch: () => void }) {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 48))
  const count = useCart((s) => cartCount(s.lines))
  const openCart = useCart((s) => s.open)

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color] duration-700 ease-couture ${
        scrolled
          ? 'border-b border-couture-gold/35 bg-couture-ink/95 backdrop-blur-sm'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto grid h-16 grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 lg:h-20 lg:px-10">
        <div>
          <button
            type="button"
            onClick={onMenu}
            className="group flex items-center gap-3 py-2 font-manrope text-[11px] font-semibold uppercase tracking-[0.24em] text-couture-bone"
            aria-haspopup="dialog"
          >
            <span aria-hidden className="flex w-6 flex-col gap-[5px]">
              <span className="h-px w-full bg-current transition-transform duration-500 ease-couture group-hover:translate-x-1" />
              <span className="h-px w-2/3 bg-couture-gold transition-[width] duration-500 ease-couture group-hover:w-full" />
            </span>
            <span className="hidden sm:inline">Menu</span>
            <span className="sr-only sm:hidden">Menu</span>
          </button>
        </div>

        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault()
            scrollToId('top')
          }}
          className="flex flex-col items-center text-center leading-none text-couture-bone"
          aria-label="Stylemart, back to top"
        >
          <span className="font-bodoni text-[16px] tracking-[0.3em] [margin-right:-0.3em] sm:text-[19px] sm:tracking-[0.34em] sm:[margin-right:-0.34em] lg:text-[24px]">STYLEMART</span>
          <span className="mt-1.5 font-manrope text-[6.5px] sm:text-[7.5px] font-semibold tracking-[0.42em] [margin-right:-0.42em] text-couture-gold lg:text-[8.5px]">
            KAVITA THULASIDAS
          </span>
        </a>

        <div className="flex items-center justify-end gap-1 sm:gap-4">
          <button
            type="button"
            onClick={onSearch}
            className="grid size-10 place-items-center text-couture-bone transition-colors hover:text-couture-gold-light"
            aria-label="Search the collection"
          >
            <Search className="size-[17px]" strokeWidth={1.4} />
          </button>
          <button
            type="button"
            onClick={openCart}
            className="flex items-center gap-1.5 py-2 font-manrope text-[11px] font-semibold uppercase tracking-[0.24em] text-couture-bone transition-colors hover:text-couture-gold-light"
            aria-label={`Bag, ${count} ${count === 1 ? 'item' : 'items'}`}
          >
            Bag
            <span className="inline-flex min-w-[2.2ch] justify-center overflow-hidden text-couture-gold">
              (
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={count}
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  exit={{ y: '-100%', opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block"
                >
                  {count}
                </motion.span>
              </AnimatePresence>
              )
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
