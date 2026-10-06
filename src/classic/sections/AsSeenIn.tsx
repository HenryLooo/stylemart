import { press, pressNames } from '../../shared/data/story'
import { Rail } from '../components/Rail'
import { Container, Reveal, SectionHeading } from '../components/ui'

const marqueeCss = `
@keyframes classic-marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
`

function NameRun({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {pressNames.map((n) => (
        <li key={n} className="flex items-center">
          <span className="px-6 font-playfair text-2xl whitespace-nowrap text-classic-ink/80 italic sm:px-10 sm:text-[32px]">
            {n}
          </span>
          <span aria-hidden className="size-1.5 rotate-45 bg-classic-gold" />
        </li>
      ))}
    </ul>
  )
}

export default function AsSeenIn() {
  return (
    <section id="press" aria-labelledby="press-title" className="scroll-mt-20 bg-white py-16 sm:py-24">
      <style>{marqueeCss}</style>
      <Container>
        <SectionHeading
          id="press-title"
          title="As Seen In"
          sub="Twenty-five years of Kavita and Stylemart in Singapore’s papers, magazines and on the runway."
        />
      </Container>

      <div className="group mt-10 overflow-hidden border-y border-classic-line py-6 sm:mt-14 sm:py-8">
        <div className="flex w-max animate-[classic-marquee_42s_linear_infinite] group-hover:[animation-play-state:paused]">
          <NameRun />
          <NameRun hidden />
        </div>
      </div>

      <Container className="mt-12 sm:mt-16">
        <Reveal>
          <Rail label="Press features">
            {press.map((p) => (
              <li key={p.image} className="w-[46%] shrink-0 snap-start sm:w-[30%] lg:w-[calc((100%-6rem)/5)]">
                <figure className="group/press">
                  <div className="overflow-hidden bg-classic-paper p-2.5 shadow-[0_1px_0_rgba(0,0,0,0.04)] transition duration-500 ease-out group-hover/press:-translate-y-1.5 group-hover/press:shadow-[0_22px_40px_-22px_rgba(31,31,31,0.5)] sm:p-3">
                    <img
                      src={p.image}
                      alt={`Press clipping: ${p.title}`}
                      loading="lazy"
                      className="aspect-[3/4] w-full object-cover object-top"
                    />
                  </div>
                  <figcaption className="mt-3.5">
                    <p className="font-playfair text-[15px] leading-snug text-classic-ink">{p.title}</p>
                    <p className="mt-1 text-xs text-classic-muted">{p.outlet}</p>
                  </figcaption>
                </figure>
              </li>
            ))}
          </Rail>
        </Reveal>
      </Container>
    </section>
  )
}
