import { useRef, useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate, type Location } from 'react-router-dom'
import { AlertTriangle, Eye, EyeOff } from 'lucide-react'
import { AuthError, DEMO_EMAIL, DEMO_PASSWORD, signIn, useSession } from './auth'
import { cx, inputCls } from './styles'
import { Button, FieldError } from './ui'

export default function LoginPage() {
  const session = useSession()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: Location } | null)?.from
  const target = from && from.pathname.startsWith('/admin') && from.pathname !== '/admin/login' ? `${from.pathname}${from.search}` : '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<{ message: string; field?: 'email' | 'password' }>()
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  if (session && !busy) return <Navigate to={target} replace />

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(undefined)
    try {
      await signIn(email, password)
      navigate(target, { replace: true })
    } catch (err) {
      const field = err instanceof AuthError ? err.field : undefined
      setError({ message: err instanceof Error ? err.message : 'Sign in failed. Try again.', field })
      setBusy(false)
      ;(field === 'email' ? emailRef : passwordRef).current?.focus()
    }
  }

  const fillDemo = () => {
    setEmail(DEMO_EMAIL)
    setPassword(DEMO_PASSWORD)
    setError(undefined)
  }

  return (
    <main className="grid min-h-svh lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="relative hidden overflow-hidden bg-neutral-100 lg:block" aria-hidden>
        <img src="/media/editorial-veil-portrait.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
      </div>

      <div className="flex flex-col items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-[400px]">
          <img src="/media/logo.png" alt="Stylemart" className="mx-auto h-20 w-auto" />
          <h1 className="mt-6 text-center font-bodoni text-[34px] leading-tight text-admin-ink">Stylemart Admin</h1>
          <p className="mt-2 text-center text-[15px] text-admin-mute">Sign in to manage products, SKUs and stock.</p>

          <form onSubmit={submit} noValidate className="mt-8 space-y-5">
            {error && !error.field && (
              <div role="alert" className="flex items-start gap-2.5 rounded-lg bg-red-50 px-3.5 py-3 text-[14px] font-medium text-red-800 ring-1 ring-inset ring-red-200">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
                <span>{error.message}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="mb-1.5 block text-[14px] font-semibold">
                Email
              </label>
              <input
                ref={emailRef}
                id="email"
                type="email"
                autoComplete="username"
                inputMode="email"
                autoCapitalize="none"
                spellCheck={false}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={error?.field === 'email' || undefined}
                aria-describedby={error?.field === 'email' ? 'email-error' : undefined}
                className={inputCls(error?.field === 'email')}
                autoFocus
              />
              <FieldError id="email-error">{error?.field === 'email' && error.message}</FieldError>
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-[14px] font-semibold">
                Password
              </label>
              <div className="relative">
                <input
                  ref={passwordRef}
                  id="password"
                  type={show ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={error?.field === 'password' || undefined}
                  aria-describedby={error?.field === 'password' ? 'password-error' : undefined}
                  className={cx(inputCls(error?.field === 'password'), 'pr-12')}
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute inset-y-0 right-0 grid w-11 place-items-center rounded-r-lg text-admin-mute hover:text-admin-ink"
                  aria-label={show ? 'Hide password' : 'Show password'}
                  aria-pressed={show}
                >
                  {show ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
                </button>
              </div>
              <FieldError id="password-error">{error?.field === 'password' && error.message}</FieldError>
            </div>

            <Button type="submit" variant="primary" loading={busy} className="w-full">
              {busy ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-8 rounded-xl bg-admin-canvas px-4 py-3.5 text-[13px] leading-relaxed text-admin-mute ring-1 ring-inset ring-admin-line">
            <p className="font-semibold text-admin-ink">Demo sign-in</p>
            <dl className="mt-1.5 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5">
              <dt>Email</dt>
              <dd className="font-mono text-[12.5px] text-admin-ink">{DEMO_EMAIL}</dd>
              <dt>Password</dt>
              <dd className="font-mono text-[12.5px] text-admin-ink">{DEMO_PASSWORD}</dd>
            </dl>
            <button
              type="button"
              onClick={fillDemo}
              className="-mx-1 mt-2 min-h-9 rounded px-1 font-semibold text-admin-gold-deep underline decoration-couture-gold/50 underline-offset-4 hover:decoration-couture-gold"
            >
              Fill in the demo details
            </button>
            <p className="mt-1">Products and photos are saved in this browser only.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
