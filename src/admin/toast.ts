import { create } from 'zustand'

export type ToastTone = 'success' | 'error' | 'info'

export interface Toast {
  id: number
  message: string
  tone: ToastTone
}

interface ToastState {
  toasts: Toast[]
}

/** Admin toasts live outside the pages so a message survives navigation (save → list). */
export const useToasts = create<ToastState>(() => ({ toasts: [] }))

let next = 1
const timers = new Map<number, ReturnType<typeof setTimeout>>()

export function dismissToast(id: number) {
  clearTimeout(timers.get(id))
  timers.delete(id)
  useToasts.setState((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
}

export function toast(message: string, tone: ToastTone = 'success') {
  const id = next++
  // Keep the stack short: the newest three
  useToasts.setState((s) => ({ toasts: [...s.toasts, { id, message, tone }].slice(-3) }))
  timers.set(
    id,
    setTimeout(() => dismissToast(id), tone === 'error' ? 6000 : 3200),
  )
  return id
}
