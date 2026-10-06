import { useEffect } from 'react'

let locks = 0

/** Prevents the page behind an overlay from scrolling. Nested overlays are counted. */
export function useLockBodyScroll(active: boolean) {
  useEffect(() => {
    if (!active) return
    locks += 1
    const html = document.documentElement
    const gap = window.innerWidth - html.clientWidth
    document.body.style.overflow = 'hidden'
    if (gap > 0) document.body.style.paddingRight = `${gap}px`
    return () => {
      locks -= 1
      if (locks === 0) {
        document.body.style.overflow = ''
        document.body.style.paddingRight = ''
      }
    }
  }, [active])
}

/** Calls `onEscape` when Escape is pressed while `active`. */
export function useEscape(active: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onEscape()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, onEscape])
}
