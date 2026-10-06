import { Container, Reveal, SectionHeading } from '../components/ui'
import { focusRing } from '../components/tokens'

interface Tile {
  title: string
  line: string
  image: string
  alt: string
  /** object-position + any extra crop for this tile */
  imgClass: string
  frame: string
}

const tiles: Tile[] = [
  {
    title: "Women's Wear",
    line: 'Lenghas, sarees and gowns',
    image: '/media/editorial-bride-red.webp',
    alt: 'A bride in a red embroidered dupatta and heirloom jewellery',
    // The source has a caption baked into its right third; crop it away.
    imgClass: 'object-[34%_30%] lg:object-[20%_30%] lg:scale-[1.45] lg:origin-[58%_30%]',
    frame: 'aspect-[4/5] lg:aspect-auto lg:col-span-7 lg:h-[600px]',
  },
  {
    title: "Men's Wear",
    line: 'Sherwanis and Indo-Western suits',
    image: '/media/editorial-menswear.webp',
    alt: 'A man in a black brocade sherwani seated in a green velvet chair',
    imgClass: 'object-[33%_25%]',
    frame: 'aspect-[4/5] lg:aspect-auto lg:col-span-5 lg:h-[600px]',
  },
  {
    title: 'Accessories',
    line: 'Finishing pieces, matched to every outfit',
    image: '/media/editorial-trio.webp',
    alt: 'Three models in jewel-toned silk gowns in a vintage parlour',
    imgClass: 'object-[50%_24%] sm:object-[50%_14%]',
    frame: 'aspect-[4/5] sm:col-span-2 sm:aspect-[16/9] lg:aspect-auto lg:col-span-12 lg:h-[400px]',
  },
]

export default function Categories() {
  return (
    <section aria-labelledby="categories-title" className="bg-white py-16 sm:py-24">
      <Container>
        <SectionHeading id="categories-title" title="Explore Categories" />
        <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:grid-cols-12">
          {tiles.map((t, i) => (
            <Reveal key={t.title} delay={i * 0.08} className={`${t.frame} relative`}>
              <a
                href="#featured"
                className={`group absolute inset-0 block overflow-hidden bg-classic-charcoal ${focusRing}`}
              >
                <img
                  src={t.image}
                  alt={t.alt}
                  loading="lazy"
                  className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06] ${t.imgClass} ${
                    i === 0 ? 'lg:group-hover:scale-[1.52]' : ''
                  }`}
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 via-40% to-transparent transition-opacity duration-500 group-hover:opacity-90"
                />
                {/* Gold inner frame on hover */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-3 border border-classic-gold/80 opacity-0 transition-all duration-500 group-hover:inset-4 group-hover:opacity-100 sm:inset-4 sm:group-hover:inset-5"
                />
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-6 pb-8 text-center text-white sm:pb-10">
                  <h3 className="font-playfair text-[26px] tracking-[0.08em] uppercase sm:text-3xl">{t.title}</h3>
                  <p className="mt-2 text-[13px] font-light text-white/80">{t.line}</p>
                  <span className="mt-5 border border-white px-7 py-3 text-[11px] font-medium tracking-[0.22em] uppercase transition-colors duration-300 group-hover:bg-white group-hover:text-classic-ink">
                    Shop now
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
