import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check } from 'lucide-react'
import { useProduct } from '../../shared/catalog/store'
import { isSoldOut } from '../../shared/catalog/types'
import { addToBag } from '../bagToast'
import { EASE } from '../ui'

type Flash = 'idle' | 'added' | 'limit'

/**
 * Add-to-bag button that confirms in place ("✓ Added") before settling back.
 * Sold-out pieces get a disabled "Sold out" control; a tap when the bag already holds
 * every one in stock flashes "Max in bag" instead.
 */
export default function AddToBagButton({
  id,
  label = 'Add to bag',
  className = '',
  onAdded,
}: {
  id: string
  label?: string
  className?: string
  onAdded?: () => void
}) {
  const p = useProduct(id)
  const [flash, setFlash] = useState<Flash>('idle')

  useEffect(() => {
    if (flash === 'idle') return
    const t = setTimeout(() => setFlash('idle'), 1800)
    return () => clearTimeout(t)
  }, [flash])

  if (p && isSoldOut(p)) {
    return (
      <button type="button" disabled className={`${className} pointer-events-none opacity-45`}>
        Sold out
      </button>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (addToBag(id)) {
            setFlash('added')
            onAdded?.()
          } else setFlash('limit')
        }}
        className={`relative inline-grid overflow-hidden ${className}`}
      >
        {/* Every label shares one grid cell; the idle label sizes it so the width never jumps */}
        <span className="invisible col-start-1 row-start-1" aria-hidden>
          {label}
        </span>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={flash}
            className="col-start-1 row-start-1 inline-flex items-center justify-center gap-1.5"
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            exit={{ y: '-110%', opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            {flash === 'added' ? (
              <>
                <Check className="size-3.5" strokeWidth={2} aria-hidden /> Added
              </>
            ) : flash === 'limit' ? (
              'Max in bag'
            ) : (
              label
            )}
          </motion.span>
        </AnimatePresence>
      </button>
      {/* Out of flow (sr-only is absolute), so it doesn't disturb the surrounding layout */}
      <span role="status" className="sr-only">
        {flash === 'limit' ? `Your bag already holds all ${p?.stock ?? ''} available` : ''}
      </span>
    </>
  )
}
