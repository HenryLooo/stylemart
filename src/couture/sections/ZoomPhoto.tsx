import { useRef, type PointerEvent } from 'react'
import { motion, useSpring } from 'motion/react'
import { useImageSrc } from '../../shared/catalog/useImageSrc'

const ZOOM = 2.2

/**
 * Product photo that zooms toward the cursor and pans with it, like a loupe over the
 * whole frame. Mouse only: on touch there's no hover, so scrolling never zooms by accident.
 */
export default function ZoomPhoto({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const url = useImageSrc(src)
  const box = useRef<HTMLDivElement>(null)
  const scale = useSpring(1, { stiffness: 260, damping: 32 })
  // Origin eases after the cursor so panning glides rather than jitters
  const ox = useSpring(0.5, { stiffness: 380, damping: 40 })
  const oy = useSpring(0.5, { stiffness: 380, damping: 40 })

  /** Cursor position within the frame, 0–1 on each axis */
  const at = (e: PointerEvent) => {
    const r = box.current!.getBoundingClientRect()
    const clamp = (n: number) => Math.min(1, Math.max(0, n))
    return [clamp((e.clientX - r.left) / r.width), clamp((e.clientY - r.top) / r.height)] as const
  }

  return (
    <div
      ref={box}
      className="absolute inset-0 cursor-zoom-in overflow-hidden"
      onPointerEnter={(e) => {
        if (e.pointerType !== 'mouse') return
        // Start zooming from where the cursor came in, not from the centre
        const [x, y] = at(e)
        ox.jump(x)
        oy.jump(y)
        scale.set(ZOOM)
      }}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse') return
        const [x, y] = at(e)
        ox.set(x)
        oy.set(y)
      }}
      onPointerLeave={() => scale.set(1)}
    >
      {url && (
        <motion.img
          src={url}
          alt={alt}
          loading="lazy"
          draggable={false}
          className={`h-full w-full object-cover ${className}`}
          style={{ scale, originX: ox, originY: oy }}
        />
      )}
    </div>
  )
}
