import { brand } from '../../shared/data/story'
import { WhatsAppIcon } from '../components/icons'
import { Reveal } from '../components/ui'
import { focusRing } from '../components/tokens'

export default function AppointmentBand() {
  return (
    <section
      id="appointment"
      aria-labelledby="appointment-title"
      className="relative isolate scroll-mt-20 overflow-hidden bg-[#0d0d0c] md:flex md:min-h-[600px] md:items-center"
    >
      {/* Phones: image above the copy. Larger screens: full-bleed image with copy on its dark side. */}
      <div className="relative h-[340px] sm:h-[420px] md:absolute md:inset-0 md:-z-10 md:h-auto">
        <img
          src="/media/runway-garden-2.webp"
          alt="Models in jewel-toned saree gowns on a garden runway"
          loading="lazy"
          className="h-full w-full object-cover object-[48%_center] md:object-center"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-[#0d0d0c] via-[#0d0d0c]/10 via-35% to-transparent md:bg-linear-to-l md:from-black/85 md:via-black/55 md:via-50% md:to-black/0"
        />
      </div>

      <div className="relative mx-auto -mt-10 flex w-full max-w-[1280px] px-5 pb-24 sm:px-6 md:mt-0 md:justify-end md:pb-0 lg:px-10">
        <Reveal className="max-w-md text-white md:mr-4 lg:mr-10">
          <span aria-hidden className="block h-px w-14 bg-classic-gold" />
          <h2 id="appointment-title" className="mt-6 font-playfair text-[34px] leading-[1.15] sm:text-[44px]">
            Your one-of-a-kind bridal piece, made to measure.
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed font-light text-white/80">
            Sit down with Kavita’s team at {brand.address.split(',')[0]} to choose fabrics, embroidery and fit, then
            come back for fittings until it is exactly right.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#visit"
              className={`inline-flex items-center justify-center bg-white px-7 py-3.5 text-[11px] font-medium tracking-[0.2em] text-classic-ink uppercase transition-colors duration-300 hover:bg-classic-gold hover:text-white sm:text-xs ${focusRing}`}
            >
              Book an appointment
            </a>
            <a
              href={brand.whatsapp}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center justify-center gap-2 border border-white px-7 py-3.5 text-[11px] font-medium tracking-[0.2em] text-white uppercase transition-colors duration-300 hover:bg-white hover:text-classic-ink sm:text-xs ${focusRing}`}
            >
              <WhatsAppIcon />
              WhatsApp us
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
