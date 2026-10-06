import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check } from 'lucide-react'
import { addToBag } from '../bagToast'
import { EASE } from '../ui'

/** Add-to-bag button that confirms in place ("✓ Added") before settling back. */
export default function AddToBagButton({
  id,
  label = 'Add to bag',
  className = '',
}: {
  id: string
  label?: string
  className?: string
}) {
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!added) return
    const t = setTimeout(() => setAdded(false), 1800)
    return () => clearTimeout(t)
  }, [added])

  return (
    <button
      type="button"
      onClick={() => {
        addToBag(id)
        setAdded(true)
      }}
      className={`relative inline-grid overflow-hidden ${className}`}
    >
      {/* Both labels share one grid cell; the idle label sizes it so the width never jumps */}
      <span className="invisible col-start-1 row-start-1" aria-hidden>
        {label}
      </span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={added ? 'added' : 'idle'}
          className="col-start-1 row-start-1 inline-flex items-center justify-center gap-1.5"
          initial={{ y: '110%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-110%', opacity: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          {added ? (
            <>
              <Check className="size-3.5" strokeWidth={2} aria-hidden /> Added
            </>
          ) : (
            label
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
