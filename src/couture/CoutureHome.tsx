import CoutureShell from './CoutureShell'
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

/**
 * Mockup 2, "Couture": Stylemart as a couture house and Kavita Thulasidas as its
 * designer, set as a shoppable magazine issue.
 */
export default function CoutureHome() {
  return (
    <CoutureShell title="Stylemart · Kavita Thulasidas, Couture" skipTo="lookbook" skipLabel="Skip to the lookbook">
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
    </CoutureShell>
  )
}
