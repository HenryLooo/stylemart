import { NavLink, useLocation } from 'react-router-dom'

/** Floating pill for presenting: flip between the two concepts. */
export default function MockupSwitcher() {
  const { pathname } = useLocation()
  // Hidden on the pitch index and inside the in-house admin
  if (pathname === '/' || pathname === '/admin' || pathname.startsWith('/admin/')) return null

  const link = ({ isActive }: { isActive: boolean }) =>
    `rounded-full px-3.5 py-1.5 transition-colors ${
      isActive ? 'bg-white text-black' : 'text-white/70 hover:text-white'
    }`

  return (
    <nav
      aria-label="Switch concept"
      className="fixed bottom-4 left-4 z-[60] flex items-center gap-1 rounded-full bg-black/80 p-1 font-manrope text-[11px] font-semibold uppercase tracking-[0.14em] shadow-lg backdrop-blur"
    >
      <NavLink to="/" className="px-3 py-1.5 text-white/50 hover:text-white" aria-label="All concepts">
        ⌂
      </NavLink>
      <NavLink to="/classic" className={link}>
        Refined
      </NavLink>
      <NavLink to="/couture" className={link}>
        Couture
      </NavLink>
    </nav>
  )
}
