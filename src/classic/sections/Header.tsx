import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown, Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react'
import { cartCount, useCart } from '../../shared/cart'
import { brand } from '../../shared/data/story'
import { focusRing } from '../components/tokens'
import { useEscape, useLockBodyScroll } from '../components/useLockBodyScroll'
import { navItems, shopCategories } from './nav'

function CartButton() {
  const count = useCart((s) => cartCount(s.lines))
  const open = useCart((s) => s.open)
  return (
    <button
      type="button"
      onClick={open}
      aria-label={`Open bag, ${count} ${count === 1 ? 'item' : 'items'}`}
      className={`relative grid size-10 place-items-center text-white transition-colors hover:text-classic-gold ${focusRing}`}
    >
      <ShoppingBag className="size-[19px]" strokeWidth={1.5} />
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 22 }}
            className="absolute right-0.5 top-0.5 grid h-[17px] min-w-[17px] place-items-center rounded-full bg-classic-gold px-1 text-[10px] font-semibold leading-none text-classic-charcoal"
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}

const iconBtn = `grid size-10 place-items-center text-white transition-colors hover:text-classic-gold ${focusRing}`

export default function Header() {
  const [compact, setCompact] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-classic-charcoal transition-shadow duration-300 ${
          compact ? 'shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)]' : ''
        }`}
      >
        <div
          className={`mx-auto grid max-w-[1280px] grid-cols-[1fr_auto_1fr] items-center px-3 transition-[height] duration-300 ease-out sm:px-6 lg:flex lg:justify-between lg:px-10 ${
            compact ? 'h-14 lg:h-[64px]' : 'h-16 lg:h-[88px]'
          }`}
        >
          {/* Mobile: hamburger */}
          <div className="lg:hidden">
            <button type="button" aria-label="Open menu" onClick={() => setMenuOpen(true)} className={iconBtn}>
              <Menu className="size-[22px]" strokeWidth={1.5} />
            </button>
          </div>

          <a href="#top" aria-label="Stylemart home" className={`justify-self-center ${focusRing}`}>
            <img
              src="/media/logo.png"
              alt="Stylemart · Asian Woman"
              width={161}
              height={117}
              className={`w-auto transition-[height] duration-300 ease-out ${compact ? 'h-10 lg:h-11' : 'h-12 lg:h-[66px]'}`}
            />
          </a>

          {/* Desktop nav */}
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-5 xl:gap-7">
              {navItems.map((item) => (
                <li key={item.label} className={item.menu ? 'group relative' : undefined}>
                  <a
                    href={item.href}
                    aria-current={item.label === 'Home' ? 'page' : undefined}
                    className={`flex items-center gap-1 py-3 text-[13px] tracking-[0.02em] transition-colors hover:text-classic-gold ${focusRing} ${
                      item.label === 'Home' ? 'text-classic-gold' : 'text-white'
                    }`}
                  >
                    {item.label}
                    {item.menu && (
                      <ChevronDown
                        className="size-3.5 transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180"
                        strokeWidth={1.5}
                        aria-hidden
                      />
                    )}
                  </a>
                  {item.menu && <ShopMenu />}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center justify-self-end lg:gap-1">
            <button type="button" aria-label="Search" className={iconBtn}>
              <Search className="size-[18px]" strokeWidth={1.5} />
            </button>
            <button type="button" aria-label="Account" className={`hidden sm:grid ${iconBtn}`}>
              <UserRound className="size-[19px]" strokeWidth={1.5} />
            </button>
            <CartButton />
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}

function ShopMenu() {
  return (
    <div className="invisible absolute left-1/2 top-full z-10 w-[540px] -translate-x-1/2 translate-y-2 pt-2 opacity-0 transition-all duration-300 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
      <div className="grid grid-cols-[1fr_190px] border-t-2 border-classic-gold bg-white shadow-[0_24px_48px_-16px_rgba(0,0,0,0.35)]">
        <div className="p-7">
          <p className="font-playfair text-lg text-classic-ink">Shop by category</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5">
            {shopCategories.map((c) => (
              <li key={c}>
                <a
                  href="#featured"
                  className={`text-[13px] text-classic-muted transition-colors hover:text-classic-gold-dark ${focusRing}`}
                >
                  {c}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <a href="#new-arrivals" className={`group/img relative block overflow-hidden ${focusRing}`}>
          <img
            src="/media/editorial-blush-lengha.webp"
            alt="Blush lengha with a sheer dupatta"
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-700 group-hover/img:scale-105"
          />
          <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent px-4 pb-4 pt-10 text-[11px] uppercase tracking-[0.18em] text-white">
            New arrivals
          </span>
        </a>
      </div>
    </div>
  )
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [shopOpen, setShopOpen] = useState(false)
  const close = useCallback(() => onClose(), [onClose])
  useLockBodyScroll(open)
  useEscape(open, close)

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <motion.div
            className="absolute inset-0 bg-black/55"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.nav
            aria-label="Mobile"
            className="absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col overflow-y-auto bg-classic-charcoal text-white"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
              <img src="/media/logo.png" alt="Stylemart" className="h-11 w-auto" />
              <button type="button" aria-label="Close menu" onClick={close} className={iconBtn} autoFocus>
                <X className="size-5" strokeWidth={1.5} />
              </button>
            </div>
            <ul className="flex-1 px-6 py-4">
              {navItems.map((item, i) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.12 + i * 0.04, duration: 0.4 }}
                  className="border-b border-white/[0.07]"
                >
                  {item.menu ? (
                    <>
                      <button
                        type="button"
                        aria-expanded={shopOpen}
                        onClick={() => setShopOpen((v) => !v)}
                        className={`flex w-full items-center justify-between py-4 font-playfair text-xl ${focusRing}`}
                      >
                        {item.label}
                        <ChevronDown
                          className={`size-4 text-classic-gold transition-transform ${shopOpen ? 'rotate-180' : ''}`}
                          strokeWidth={1.5}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {shopOpen && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            {shopCategories.map((c) => (
                              <li key={c}>
                                <a
                                  href="#featured"
                                  onClick={close}
                                  className={`block py-2 pl-3 text-sm text-white/70 hover:text-classic-gold ${focusRing}`}
                                >
                                  {c}
                                </a>
                              </li>
                            ))}
                            <li className="h-3" />
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <a
                      href={item.href}
                      onClick={close}
                      className={`block py-4 font-playfair text-xl ${item.label === 'Home' ? 'text-classic-gold' : ''} ${focusRing}`}
                    >
                      {item.label}
                    </a>
                  )}
                </motion.li>
              ))}
            </ul>
            <div className="space-y-1 border-t border-white/10 px-6 py-6 text-xs leading-relaxed text-white/55">
              <p>{brand.address}</p>
              <p>{brand.phones.join(' · ')}</p>
            </div>
          </motion.nav>
        </div>
      )}
    </AnimatePresence>
  )
}
