import { useRef, type ReactNode } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'

const lines = [
  { text: 'Asian opulence.', className: '' },
  { text: 'Western silhouettes.', className: 'italic' },
]
const support =
  'Pure silks, hand-worked embroidery and one-of-a-kind pieces, made to measure in Singapore since 1999.'

function Word({
  children,
  progress,
  range,
}: {
  children: ReactNode
  progress: MotionValue<number>
  range: [number, number]
}) {
  const opacity = useTransform(progress, range, [0.15, 1])
  return <motion.span style={{ opacity }}>{children}</motion.span>
}

export default function Manifesto() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.65', 'end 0.85'] })

  // Every word in reading order gets a slice of the scroll range
  const words = [
    ...lines.flatMap((l, li) => l.text.split(' ').map((w) => ({ w, line: li }))),
    ...support.split(' ').map((w) => ({ w, line: 2 })),
  ]
  const slice = 0.82 / words.length
  const render = (line: number) =>
    words
      .map((x, i) => ({ ...x, i }))
      .filter((x) => x.line === line)
      .map(({ w, i }) => (
        <span key={i}>
          {reduced ? w : <Word progress={scrollYProgress} range={[i * slice, i * slice + slice * 2.2]}>{w}</Word>}{' '}
        </span>
      ))

  return (
    <section
      ref={ref}
      id="manifesto"
      aria-label="Manifesto"
      className="relative bg-couture-ink px-4 py-28 text-center sm:px-6 lg:py-48"
    >
      <span aria-hidden className="mx-auto mb-12 block h-16 w-px bg-gradient-to-b from-transparent to-couture-gold lg:mb-16" />
      <h2 className="mx-auto max-w-6xl font-bodoni text-[clamp(2.7rem,8.4vw,8.25rem)] font-normal leading-[0.98] tracking-[-0.015em] text-couture-bone">
        {lines.map((l, li) => (
          <span key={l.text} className={`block ${l.className}`}>
            {render(li)}
          </span>
        ))}
      </h2>
      <p className="mx-auto mt-10 max-w-[36ch] font-bodoni text-[clamp(1.2rem,2.1vw,1.75rem)] leading-[1.45] text-couture-bone lg:mt-14">
        {render(2)}
      </p>
      <p className="mt-10 font-bodoni text-2xl italic text-couture-gold lg:text-3xl">— Kavita Thulasidas</p>
    </section>
  )
}
