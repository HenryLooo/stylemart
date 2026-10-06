import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { ease } from './tokens'

/** Page gutter + max width shared by every section. */
export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-10 ${className}`}>{children}</div>
}

/** Gentle fade-up when scrolled into view. Plays once. */
export function Reveal({
  children,
  delay = 0,
  className = '',
  y = 22,
}: {
  children: ReactNode
  delay?: number
  className?: string
  y?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.8, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

/** The live site's heading: Playfair title over a short gold rule. */
export function SectionHeading({
  title,
  id,
  sub,
  aside,
  light = false,
}: {
  title: string
  id?: string
  sub?: ReactNode
  aside?: ReactNode
  light?: boolean
}) {
  return (
    <Reveal className="flex flex-col items-center text-center">
      <h2
        id={id}
        className={`font-playfair text-[28px] leading-tight sm:text-4xl ${light ? 'text-white' : 'text-classic-ink'}`}
      >
        {title}
      </h2>
      <span aria-hidden className="mt-4 block h-px w-14 bg-classic-gold" />
      {sub && (
        <p className={`mt-4 max-w-xl text-sm leading-relaxed ${light ? 'text-white/70' : 'text-classic-muted'}`}>
          {sub}
        </p>
      )}
      {aside && <div className="mt-3">{aside}</div>}
    </Reveal>
  )
}
