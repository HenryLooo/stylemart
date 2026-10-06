import { useActiveProducts } from '../../shared/catalog/store'
import { ProductCard } from '../components/ProductCard'
import { Rail } from '../components/Rail'
import { Container, Reveal, SectionHeading } from '../components/ui'

export default function NewArrivals() {
  const arrivals = useActiveProducts().filter((p) => p.isNew)
  return (
    <section id="new-arrivals" aria-labelledby="new-title" className="scroll-mt-20 bg-classic-paper py-16 sm:py-24">
      <Container>
        <SectionHeading
          id="new-title"
          title="New Arrivals"
          sub="Ready-to-wear pieces from the latest Asian Woman collection, in store and online."
        />
        <Reveal className="mt-10 sm:mt-14" delay={0.1}>
          <Rail label="New arrivals">
            {arrivals.map((p) => (
              <li
                key={p.id}
                className="w-[68%] shrink-0 snap-start sm:w-[calc((100%-2.5rem)/3)] lg:w-[calc((100%-4.5rem)/4)]"
              >
                <ProductCard product={p} />
              </li>
            ))}
          </Rail>
        </Reveal>
      </Container>
    </section>
  )
}
