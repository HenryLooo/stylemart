import { useEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

const positions = new Map<string, number>()

/** Run now and again as late content (lazy routes, measured sections) settles. */
function settle(fn: () => void) {
  fn()
  requestAnimationFrame(fn)
  const t1 = setTimeout(fn, 120)
  const t2 = setTimeout(fn, 400)
  return () => {
    clearTimeout(t1)
    clearTimeout(t2)
  }
}

/**
 * Scroll behaviour for the SPA:
 * - Back/forward restores where you were on that page
 * - `/path#id` lands on that section
 * - New pages start at the top
 * - Query-only replaces (e.g. switching a filter) leave the scroll alone
 */
export default function ScrollManager() {
  const location = useLocation()
  const navType = useNavigationType()
  const keyRef = useRef(location.key)
  const prevPath = useRef<string | null>(null)

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    const onScroll = () => positions.set(keyRef.current, window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    keyRef.current = location.key
    const samePage = prevPath.current === location.pathname
    prevPath.current = location.pathname

    const saved = positions.get(location.key)
    if (navType === 'POP' && saved != null) {
      return settle(() => window.scrollTo(0, saved))
    }
    if (location.hash) {
      const id = decodeURIComponent(location.hash.slice(1))
      return settle(() => {
        const el = document.getElementById(id)
        if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY)
      })
    }
    if (navType === 'REPLACE' && samePage) return
    window.scrollTo(0, 0)
  }, [location.key, location.pathname, location.hash, navType])

  return null
}
