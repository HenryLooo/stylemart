import { brand } from '../../shared/data/story'
import { ISSUE, scrollToId } from '../ui'
import { contents } from './MenuOverlay'

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-couture-ink px-4 pb-20 pt-20 text-couture-bone sm:px-6 lg:px-10 lg:pt-28">
      <div className="mx-auto grid max-w-[1400px] gap-10 border-b border-couture-gold/25 pb-12 sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="font-bodoni text-2xl italic text-couture-gold-light">{brand.philosophy}</p>
          <p className="mt-4 font-manrope text-[12px] leading-relaxed text-couture-mute">
            Bridal and couture by {brand.founder}. {brand.address}.
          </p>
        </div>
        <nav aria-label="Footer" className="lg:col-span-4 lg:col-start-6">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5">
            {contents.map((c) => (
              <li key={c.label}>
                <a
                  href={`#${c.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToId(c.id)
                  }}
                  className="font-manrope text-[13px] text-couture-bone/80 transition-colors hover:text-couture-gold-light"
                >
                  {c.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="font-manrope text-[13px] leading-relaxed text-couture-bone/80 lg:col-span-3 lg:col-start-10">
          {brand.phones.map((p) => (
            <a key={p} href={`tel:${p.replace(/\s/g, '')}`} className="block hover:text-couture-gold-light">
              {p}
            </a>
          ))}
          <a href={brand.whatsapp} target="_blank" rel="noreferrer" className="mt-2 block hover:text-couture-gold-light">
            WhatsApp
          </a>
        </div>
      </div>

      <div className="mx-auto mt-6 flex max-w-[1400px] flex-wrap justify-between gap-3 font-manrope text-[10px] uppercase tracking-[0.26em] text-couture-mute">
        <span>© 2026 {brand.name}</span>
        <span>
          {ISSUE.vol} / Singapore / Est. 1999
        </span>
      </div>

      <p
        aria-hidden
        className="mt-10 select-none whitespace-nowrap text-center font-bodoni text-[15.6vw] leading-[0.8] tracking-[-0.01em] [margin-right:-0.01em] text-couture-bone lg:mt-14"
      >
        STYLEMART
      </p>
    </footer>
  )
}
