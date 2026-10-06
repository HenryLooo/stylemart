import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { focusRing } from './tokens'

/**
 * Horizontal scroll-snap rail with prev/next buttons and a thin progress line.
 * Children should be <li> items with their own widths + `snap-start`.
 */
export function Rail({ children, label }: { children: ReactNode; label: string }) {
  const ref = useRef<HTMLUListElement>(null)
  const [state, setState] = useState({ prev: false, next: true, progress: 0, thumb: 1 })

  const measure = useCallback(() => {
    const el = ref.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setState({
      prev: el.scrollLeft > 4,
      next: el.scrollLeft < max - 4,
      progress: max > 0 ? el.scrollLeft / max : 0,
      thumb: el.scrollWidth > 0 ? el.clientWidth / el.scrollWidth : 1,
    })
  }, [])

  useEffect(() => {
    measure()
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [measure])

  const scroll = (dir: 1 | -1) => {
    const el = ref.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' })
  }

  const arrow = `grid size-11 place-items-center rounded-full border border-classic-line bg-white text-classic-ink shadow-[0_6px_20px_-8px_rgba(31,31,31,0.25)] transition hover:border-classic-gold hover:text-classic-gold-dark disabled:pointer-events-none disabled:opacity-0 ${focusRing}`

  return (
    <div className="relative">
      <ul
        ref={ref}
        onScroll={measure}
        aria-label={label}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:scroll-px-6 sm:gap-5 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:gap-6 lg:px-0"
      >
        {children}
      </ul>

      <button
        type="button"
        aria-label="Previous"
        onClick={() => scroll(-1)}
        disabled={!state.prev}
        className={`absolute left-0 top-[34%] hidden -translate-x-1/2 -translate-y-1/2 md:grid ${arrow}`}
      >
        <ChevronLeft className="size-5" strokeWidth={1.5} />
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={() => scroll(1)}
        disabled={!state.next}
        className={`absolute right-0 top-[34%] hidden -translate-y-1/2 translate-x-1/2 md:grid ${arrow}`}
      >
        <ChevronRight className="size-5" strokeWidth={1.5} />
      </button>

      {state.thumb < 0.999 && (
        <div aria-hidden className="mx-auto mt-8 h-px w-40 bg-classic-line sm:w-56">
          <div
            className="h-px bg-classic-gold transition-[margin] duration-150"
            style={{
              width: `${state.thumb * 100}%`,
              marginLeft: `${state.progress * (1 - state.thumb) * 100}%`,
            }}
          />
        </div>
      )}
    </div>
  )
}
