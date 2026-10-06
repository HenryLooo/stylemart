import { useSyncExternalStore } from 'react'

/**
 * Mock sign-in for the pitch demo. The session is a flag in localStorage, so it survives reloads and
 * is shared across tabs. Later this swaps to Supabase Auth (`supabase.auth.signInWithPassword`,
 * `onAuthStateChange`) behind the same `useSession` / `signIn` / `signOut` surface.
 */

export const DEMO_EMAIL = 'admin@stylemart.sg'
export const DEMO_PASSWORD = 'stylemart2026'

const KEY = 'stylemart.admin.session'

export interface Session {
  email: string
  signedInAt: string
}

const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

// Cache by raw string so useSyncExternalStore gets a stable object between reads
let cachedRaw: string | null | undefined
let cached: Session | null = null

function read(): Session | null {
  let raw: string | null = null
  try {
    raw = localStorage.getItem(KEY)
  } catch {
    raw = null
  }
  if (raw === cachedRaw) return cached
  cachedRaw = raw
  try {
    const parsed = raw ? (JSON.parse(raw) as Session) : null
    cached = parsed && typeof parsed.email === 'string' ? parsed : null
  } catch {
    cached = null
  }
  return cached
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  const onStorage = (e: StorageEvent) => e.key === KEY && cb()
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(cb)
    window.removeEventListener('storage', onStorage)
  }
}

export const getSession = read

export function useSession(): Session | null {
  return useSyncExternalStore(subscribe, read, () => null)
}

export class AuthError extends Error {
  readonly field?: 'email' | 'password'
  constructor(message: string, field?: 'email' | 'password') {
    super(message)
    this.name = 'AuthError'
    this.field = field
  }
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function signIn(email: string, password: string): Promise<Session> {
  await wait(650) // feel like a network round trip
  const e = email.trim().toLowerCase()
  if (!e) throw new AuthError('Enter your email address.', 'email')
  if (!password) throw new AuthError('Enter your password.', 'password')
  if (e !== DEMO_EMAIL || password !== DEMO_PASSWORD)
    throw new AuthError('That email and password don’t match. Check the demo details below.')
  const session: Session = { email: e, signedInAt: new Date().toISOString() }
  localStorage.setItem(KEY, JSON.stringify(session))
  emit()
  return session
}

export function signOut() {
  localStorage.removeItem(KEY)
  emit()
}
