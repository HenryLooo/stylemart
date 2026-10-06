import { MapPin, Phone, Clock } from 'lucide-react'
import { brand } from '../../shared/data/story'
import { Sample } from '../../shared/Sample'
import { InstagramIcon, WhatsAppIcon } from '../components/icons'
import { Container } from '../components/ui'
import { focusRing } from '../components/tokens'
import { shopCategories } from './nav'

const about = [
  { label: 'Kavita Thulasidas', href: '#kavita' },
  { label: 'Our History', href: '#kavita' },
  { label: 'Media', href: '#press' },
  { label: 'Services', href: '#appointment' },
]

const payments = ['Visa', 'Mastercard', 'PayNow', 'PayPal']

const link = `text-sm text-white/60 transition-colors hover:text-classic-gold ${focusRing}`

export default function Footer() {
  return (
    <footer id="visit" className="scroll-mt-20 bg-classic-charcoal text-white">
      <Container className="grid grid-cols-2 gap-x-6 gap-y-12 pt-16 pb-12 sm:pt-20 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr] lg:gap-10">
        <div className="col-span-2 lg:col-span-1">
          <img src="/media/logo.png" alt="Stylemart · Asian Woman" width={161} height={117} loading="lazy" className="h-20 w-auto" />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/60">
            Bridal and couture by Kavita Thulasidas. Made to measure on Selegie Road since 1999.
          </p>
          <div className="mt-6 flex gap-2">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              aria-label="Instagram"
              className={`grid size-10 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-classic-gold hover:text-classic-gold ${focusRing}`}
            >
              <InstagramIcon className="size-[18px]" />
            </a>
            <a
              href={brand.whatsapp}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className={`grid size-10 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-classic-gold hover:text-classic-gold ${focusRing}`}
            >
              <WhatsAppIcon className="size-[18px]" />
            </a>
          </div>
        </div>

        <nav aria-labelledby="f-shop">
          <h2 id="f-shop" className="font-playfair text-lg text-classic-gold">
            Shop
          </h2>
          <ul className="mt-5 space-y-2.5">
            {shopCategories.map((c) => (
              <li key={c}>
                <a href="#featured" className={link}>
                  {c}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="f-about">
          <h2 id="f-about" className="font-playfair text-lg text-classic-gold">
            About
          </h2>
          <ul className="mt-5 space-y-2.5">
            {about.map((a) => (
              <li key={a.label}>
                <a href={a.href} className={link}>
                  {a.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-2 lg:col-span-1">
          <h2 className="font-playfair text-lg text-classic-gold">Visit the boutique</h2>
          <ul className="mt-5 space-y-4 text-sm leading-relaxed text-white/70">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-classic-gold" strokeWidth={1.5} aria-hidden />
              <address className="not-italic">{brand.address}</address>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-classic-gold" strokeWidth={1.5} aria-hidden />
              <span className="flex flex-col">
                {brand.phones.map((p) => (
                  <a key={p} href={`tel:${p.replace(/\s/g, '')}`} className={link}>
                    {p}
                  </a>
                ))}
              </span>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 size-4 shrink-0 text-classic-gold" strokeWidth={1.5} aria-hidden />
              <span>
                {brand.hours} <Sample className="ml-1 align-middle text-white" />
              </span>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-5 py-7 pb-24 sm:pb-7 md:flex-row md:items-center md:justify-between">
          <ul aria-label="Payment methods" className="flex flex-wrap gap-2">
            {payments.map((p) => (
              <li
                key={p}
                className="rounded-[3px] border border-white/15 px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] text-white/60 uppercase"
              >
                {p}
              </li>
            ))}
          </ul>
          <p className="text-xs text-white/45">© 2026 Stylemart Dept. Store. All rights reserved.</p>
        </Container>
      </div>
    </footer>
  )
}
