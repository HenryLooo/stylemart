import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { Grain } from './ui'
import Header from './sections/Header'
import MenuOverlay from './sections/MenuOverlay'
import SearchOverlay from './sections/SearchOverlay'
import Footer from './sections/Footer'
import BagToast from './sections/BagToast'
import CartDrawer from './sections/CartDrawer'

/** Frame shared by every Couture page: header, overlays, bag, footer and grain. */
export default function CoutureShell({
  title,
  skipTo,
  skipLabel,
  children,
}: {
  title: string
  skipTo: string
  skipLabel: string
  children: ReactNode
}) {
  const [menu, setMenu] = useState(false)
  const [search, setSearch] = useState(false)
  const closeMenu = useCallback(() => setMenu(false), [])
  const closeSearch = useCallback(() => setSearch(false), [])

  useEffect(() => {
    const prevTitle = document.title
    const bg = document.body.style.background
    document.title = title
    // Overscroll should reveal ink, not the white body
    document.body.style.background = '#0e0c0a'
    return () => {
      document.title = prevTitle
      document.body.style.background = bg
    }
  }, [title])

  return (
    <div className="relative overflow-x-clip bg-couture-ink font-manrope text-couture-bone antialiased selection:bg-couture-gold selection:text-couture-ink [&_:focus-visible]:outline-1 [&_:focus-visible]:outline-offset-4 [&_:focus-visible]:outline-couture-gold-light">
      <a
        href={`#${skipTo}`}
        className="sr-only z-[80] bg-couture-gold px-4 py-2 text-couture-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {skipLabel}
      </a>
      <Header onMenu={() => setMenu(true)} onSearch={() => setSearch(true)} />
      <main>{children}</main>
      <Footer />
      <MenuOverlay open={menu} onClose={closeMenu} />
      <SearchOverlay open={search} onClose={closeSearch} />
      <BagToast />
      <CartDrawer />
      <Grain />
    </div>
  )
}
