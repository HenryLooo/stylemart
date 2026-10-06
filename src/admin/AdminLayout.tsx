import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { ExternalLink, LogOut, RotateCcw } from 'lucide-react'
import { catalogRepo } from '../shared/catalog/store'
import { signOut, useSession } from './auth'
import { toast } from './toast'
import { cx } from './styles'
import { ConfirmDialog } from './ui'

export default function AdminLayout() {
  const session = useSession()
  const navigate = useNavigate()
  const [confirmReset, setConfirmReset] = useState(false)
  const [resetting, setResetting] = useState(false)

  async function reset() {
    setResetting(true)
    try {
      await catalogRepo.reset()
      setConfirmReset(false)
      navigate('/admin')
      toast('Demo data reset to the original 14 products.')
    } catch {
      toast('Couldn’t reset the demo data. Try again.', 'error')
    } finally {
      setResetting(false)
    }
  }

  const navCls = ({ isActive }: { isActive: boolean }) =>
    cx(
      'relative inline-flex min-h-11 items-center px-1 text-[14px] font-semibold transition-colors',
      isActive ? 'text-admin-ink after:absolute after:inset-x-1 after:-bottom-px after:h-0.5 after:rounded-full after:bg-couture-gold' : 'text-admin-mute hover:text-admin-ink',
    )

  return (
    <div className="flex min-h-svh flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:shadow">
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-admin-line bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:gap-6 sm:px-6">
          <Link to="/admin" className="-ml-1 flex shrink-0 items-center gap-2.5 rounded-md p-1" aria-label="Stylemart Admin home">
            <img src="/media/logo.png" alt="" className="h-10 w-auto" />
            <span className="hidden border-l border-admin-line pl-2.5 text-[13px] font-semibold text-admin-mute sm:block">Admin</span>
          </Link>
          <nav aria-label="Admin" className="flex items-center">
            <NavLink to="/admin" end={false} className={navCls}>
              Products
            </NavLink>
          </nav>
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <a
              href="/couture"
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2.5 text-[14px] font-semibold text-admin-mute transition-colors hover:bg-neutral-100 hover:text-admin-ink"
            >
              <ExternalLink className="size-4" aria-hidden />
              <span>
                View shop<span className="sr-only"> (opens in a new tab)</span>
              </span>
            </a>
            <span className="mx-1 hidden h-6 w-px bg-admin-line md:block" aria-hidden />
            <span className="hidden max-w-[220px] truncate text-[13px] text-admin-mute md:block" title={session?.email}>
              {session?.email}
            </span>
            <button
              type="button"
              onClick={signOut}
              className="inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-lg px-2.5 text-[14px] font-semibold text-admin-mute transition-colors hover:bg-neutral-100 hover:text-admin-ink"
            >
              <LogOut className="size-4" aria-hidden />
              <span className="sr-only sm:not-sr-only">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <main id="main" className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-admin-line bg-admin-canvas">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-[13px] text-admin-mute sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            Signed in as <span className="font-semibold text-admin-ink">{session?.email}</span>. Demo data is saved in this browser only.
          </p>
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="inline-flex min-h-11 items-center gap-1.5 self-start rounded-lg px-2 font-semibold text-admin-ink hover:bg-neutral-200/60 sm:self-auto"
          >
            <RotateCcw className="size-4" aria-hidden />
            Reset demo data
          </button>
        </div>
      </footer>

      <ConfirmDialog
        open={confirmReset}
        tone="danger"
        title="Reset the demo data?"
        description="This restores the original 14 products. Products you added, your edits and uploaded photos will be removed from this browser."
        confirmLabel="Reset demo data"
        busy={resetting}
        onConfirm={reset}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  )
}
