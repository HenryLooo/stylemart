import { useCallback, useEffect, useState } from 'react'
import { Grain } from './ui'
import Header from './sections/Header'
import MenuOverlay from './sections/MenuOverlay'
import SearchOverlay from './sections/SearchOverlay'
import Hero from './sections/Hero'
import Manifesto from './sections/Manifesto'
import Designer from './sections/Designer'
import Chapters from './sections/Chapters'
import Lookbook from './sections/Lookbook'
import CollectionsIndex from './sections/CollectionsIndex'
import Atelier from './sections/Atelier'
import Press from './sections/Press'
import Voices from './sections/Voices'
import Visit from './sections/Visit'
import Footer from './sections/Footer'
import CartDrawer from './sections/CartDrawer'

/**
 * Mockup 2, "Couture": Stylemart as a couture house and Kavita Thulasidas as its
 * designer, set as a shoppable magazine issue.
 */
export default function CoutureHome() {
  const [menu, setMenu] = useState(false)
  const [search, setSearch] = useState(false)
  const closeMenu = useCallback(() => setMenu(false), [])
  const closeSearch = useCallback(() => setSearch(false), [])

  useEffect(() => {
    const { title } = document
    const bg = document.body.style.background
    document.title = 'Stylemart · Kavita Thulasidas, Couture'
    // Overscroll should reveal ink, not the white body
    document.body.style.background = '#0e0c0a'
    return () => {
      document.title = title
      document.body.style.background = bg
    }
  }, [])

  return (
    <div className="relative overflow-x-clip bg-couture-ink font-manrope text-couture-bone antialiased selection:bg-couture-gold selection:text-couture-ink [&_:focus-visible]:outline-1 [&_:focus-visible]:outline-offset-4 [&_:focus-visible]:outline-couture-gold-light">
      <a
        href="#lookbook"
        className="sr-only z-[80] bg-couture-gold px-4 py-2 text-couture-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to the lookbook
      </a>
      <Header onMenu={() => setMenu(true)} onSearch={() => setSearch(true)} />
      <main>
        <Hero />
        <Manifesto />
        <Designer />
        <Chapters />
        <Lookbook />
        <CollectionsIndex />
        <Atelier />
        <Press />
        <Voices />
        <Visit />
      </main>
      <Footer />
      <MenuOverlay open={menu} onClose={closeMenu} />
      <SearchOverlay open={search} onClose={closeSearch} />
      <CartDrawer />
      <Grain />
    </div>
  )
}
