import { useEffect } from 'react'
import CartDrawer from './components/CartDrawer'
import AnnouncementBar from './sections/AnnouncementBar'
import AppointmentBand from './sections/AppointmentBand'
import AsSeenIn from './sections/AsSeenIn'
import Categories from './sections/Categories'
import FeaturedCollection from './sections/FeaturedCollection'
import Footer from './sections/Footer'
import Header from './sections/Header'
import Hero from './sections/Hero'
import InstagramNewsletter from './sections/InstagramNewsletter'
import MeetKavita from './sections/MeetKavita'
import NewArrivals from './sections/NewArrivals'
import Testimonials from './sections/Testimonials'

/** Mockup 1 · "Refined": the current stylemart.sg identity, finished properly. */
export default function ClassicHome() {
  useEffect(() => {
    const prev = document.title
    document.title = 'Stylemart · Trendsetters of Fashionwear'
    return () => {
      document.title = prev
    }
  }, [])

  return (
    <div className="min-h-svh overflow-x-clip bg-white font-poppins text-classic-ink antialiased">
      <a
        href="#main"
        className="sr-only z-[90] bg-white px-4 py-2 text-sm focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <AnnouncementBar />
      <Header />
      <main id="main">
        <Hero />
        <Categories />
        <NewArrivals />
        <FeaturedCollection />
        <MeetKavita />
        <AsSeenIn />
        <Testimonials />
        <AppointmentBand />
        <InstagramNewsletter />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  )
}
