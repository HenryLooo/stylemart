import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

const messages = [
  'Bridal fittings by appointment · 151 Selegie Road',
  'New: The Lion Suit, SG60 edition',
  'Made to measure in Singapore since 1999',
]

export default function AnnouncementBar() {
  const [i, setI] = useState(0)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    const t = window.setInterval(() => setI((n) => (n + 1) % messages.length), 4500)
    return () => window.clearInterval(t)
  }, [reduce])

  return (
    <div className="relative h-9 overflow-hidden border-b border-white/[0.06] bg-[#151515] text-classic-gold">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.p
          key={i}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center justify-center px-4 text-center text-[11px] tracking-[0.14em] sm:text-xs"
          aria-live="polite"
        >
          {messages[i]}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}
