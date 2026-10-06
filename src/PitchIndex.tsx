import { Link } from 'react-router-dom'
import { motion } from 'motion/react'

const concepts = [
  {
    to: '/classic',
    no: '01',
    name: 'Refined',
    line: 'The Stylemart you know, finished properly. Same identity and photography, rebuilt around shopping, trust and Kavita’s story.',
    image: '/media/editorial-gramophone.webp',
  },
  {
    to: '/couture',
    no: '02',
    name: 'Couture',
    line: 'Stylemart as a couture house. A shoppable editorial that tells Kavita’s 27-year story chapter by chapter.',
    image: '/media/editorial-reclining.webp',
  },
]

export default function PitchIndex() {
  return (
    <main className="min-h-svh bg-couture-ink px-4 py-10 text-couture-bone sm:px-8 lg:px-12">
      <header className="mx-auto flex max-w-7xl flex-col items-center gap-4 text-center">
        <img src="/media/logo.png" alt="Stylemart" className="h-16 w-auto" />
        <p className="font-manrope text-[11px] uppercase tracking-[0.3em] text-couture-gold">
          Landing page concepts · October 2026
        </p>
        <h1 className="font-bodoni text-4xl leading-tight sm:text-6xl">
          Two directions for <em className="text-couture-gold-light">Stylemart</em>
        </h1>
      </header>

      <div className="mx-auto mt-10 grid max-w-7xl gap-5 md:grid-cols-2">
        {concepts.map((c, i) => (
          <motion.div
            key={c.to}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.12, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              to={c.to}
              className="group relative block aspect-[4/5] overflow-hidden rounded-sm sm:aspect-[4/3] md:aspect-[4/5]"
            >
              <img
                src={c.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <p className="font-manrope text-xs tracking-[0.3em] text-couture-gold">CONCEPT {c.no}</p>
                <h2 className="mt-2 font-bodoni text-5xl sm:text-6xl">{c.name}</h2>
                <p className="mt-3 max-w-md font-manrope text-sm leading-relaxed text-couture-bone/80">{c.line}</p>
                <span className="mt-5 inline-flex items-center gap-2 border-b border-couture-gold pb-1 font-manrope text-xs font-semibold uppercase tracking-[0.2em]">
                  View concept
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </main>
  )
}
