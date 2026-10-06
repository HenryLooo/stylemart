import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  type ButtonHTMLAttributes,
  type ReactNode,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { AlertTriangle, Check, Info, Loader2, Minus, Plus, X } from 'lucide-react'
import { isLowStock, isSoldOut, type Product, type Status } from '../shared/catalog/types'
import { cx, FOCUS } from './styles'
import { dismissToast, useToasts } from './toast'



/* ------------------------------------------------------------------ Buttons */

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'quiet-danger'

const variants: Record<Variant, string> = {
  primary:
    'bg-couture-gold text-admin-ink hover:bg-admin-gold-hover shadow-[inset_0_-1px_0_rgb(0_0_0/0.12)] disabled:bg-neutral-200 disabled:text-neutral-500 disabled:shadow-none disabled:opacity-100',
  secondary: 'bg-white text-admin-ink border border-admin-line-strong hover:border-neutral-400 hover:bg-neutral-50',
  ghost: 'text-admin-ink hover:bg-neutral-100',
  danger: 'bg-red-700 text-white hover:bg-red-800',
  'quiet-danger': 'text-red-700 border border-red-200 bg-white hover:bg-red-50',
}

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; loading?: boolean; size?: 'md' | 'sm' }
>(function Button({ variant = 'secondary', loading, size = 'md', className, children, disabled, ...props }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      {...props}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cx(
        'inline-flex select-none items-center justify-center gap-2 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-55',
        size === 'md' ? 'min-h-11 px-4 text-[14px]' : 'min-h-9 px-3 text-[13px]',
        variants[variant],
        className,
      )}
    >
      {loading && <Loader2 aria-hidden className="size-4 animate-spin" />}
      {children}
    </button>
  )
})

/* ------------------------------------------------------------------ Status */

const statusStyle: Record<Status, { label: string; cls: string; dot: string }> = {
  active: { label: 'Live', cls: 'bg-emerald-50 text-emerald-800 ring-emerald-600/20', dot: 'bg-emerald-500' },
  draft: { label: 'Draft', cls: 'bg-amber-50 text-amber-900 ring-amber-600/25', dot: 'bg-amber-500' },
  archived: { label: 'Archived', cls: 'bg-neutral-100 text-neutral-600 ring-neutral-400/30', dot: 'bg-neutral-400' },
}


export function StatusBadge({ status }: { status: Status }) {
  const s = statusStyle[status]
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[12px] font-semibold ring-1 ring-inset',
        s.cls,
      )}
    >
      <span aria-hidden className={cx('size-1.5 rounded-full', s.dot)} />
      {s.label}
    </span>
  )
}

export function Chip({ children, tone = 'gold' }: { children: ReactNode; tone?: 'gold' | 'red' | 'amber' }) {
  const tones = {
    gold: 'bg-admin-gold-wash text-admin-gold-deep',
    red: 'bg-red-50 text-red-700',
    amber: 'bg-amber-50 text-amber-900',
  }
  return (
    <span className={cx('inline-flex items-center rounded px-1.5 py-px text-[11px] font-bold', tones[tone])}>
      {children}
    </span>
  )
}

/** "Sold out" / "Low stock" hint for a product, or nothing */
export function StockNote({ product }: { product: Pick<Product, 'price' | 'stock'> }) {
  if (isSoldOut(product)) return <Chip tone="red">Sold out</Chip>
  if (isLowStock(product)) return <Chip tone="amber">Low stock</Chip>
  return null
}

/* ------------------------------------------------------------------ Stock stepper */

export function StockStepper({
  value,
  onChange,
  label,
  product,
  size = 'md',
}: {
  value: number
  onChange: (n: number) => void
  /** Accessible name, e.g. "Stock for The Ivory Gown" */
  label: string
  product?: Pick<Product, 'price' | 'stock'>
  size?: 'md' | 'sm'
}) {
  const tone = product && isSoldOut(product) ? 'text-red-700' : product && isLowStock(product) ? 'text-amber-800' : 'text-admin-ink'
  const btn = cx(
    'grid place-items-center text-admin-ink transition-colors hover:bg-neutral-100 active:bg-neutral-200 disabled:cursor-not-allowed disabled:text-neutral-300 disabled:hover:bg-transparent',
    size === 'md' ? 'size-11' : 'size-11 lg:size-9',
  )
  return (
    <div
      role="group"
      aria-label={label}
      className="relative z-10 inline-flex items-center rounded-lg border border-admin-line-strong bg-white"
      onClick={(e) => e.stopPropagation()}
    >
      <button type="button" className={cx(btn, 'rounded-l-lg')} aria-label="One fewer" disabled={value <= 0} onClick={() => onChange(Math.max(0, value - 1))}>
        <Minus className="size-4" aria-hidden />
      </button>
      <output
        aria-live="polite"
        className={cx('min-w-9 border-x border-admin-line px-1 text-center text-[15px] font-bold tabular-nums', tone, size === 'md' ? 'leading-[44px]' : 'leading-[44px] lg:leading-9')}
      >
        {value}
      </output>
      <button type="button" className={cx(btn, 'rounded-r-lg')} aria-label="One more" onClick={() => onChange(value + 1)}>
        <Plus className="size-4" aria-hidden />
      </button>
    </div>
  )
}

export function MadeToOrder() {
  return <span className="text-[13px] font-medium text-admin-mute">Made to order</span>
}


/* ------------------------------------------------------------------ Dialog */

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Modal dialog: focus moves in (to `initialFocus` or the first control), Tab is trapped, Esc and the
 * backdrop close it, and focus returns to whatever opened it.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  tone = 'neutral',
  initialFocusRef,
}: {
  open: boolean
  onClose: () => void
  title: string
  description?: ReactNode
  children: ReactNode
  tone?: 'neutral' | 'danger'
  initialFocusRef?: RefObject<HTMLElement | null>
}) {
  const panel = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const descId = useId()
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    if (!open) return
    const opener = document.activeElement as HTMLElement | null
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    const raf = requestAnimationFrame(() => {
      const first = initialFocusRef?.current ?? panel.current?.querySelector<HTMLElement>(FOCUSABLE)
      first?.focus()
    })
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onCloseRef.current()
        return
      }
      if (e.key !== 'Tab' || !panel.current) return
      const items = [...panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)]
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && (document.activeElement === first || !panel.current.contains(document.activeElement))) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey, true)
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('keydown', onKey, true)
      document.body.style.overflow = overflow
      opener?.focus?.()
    }
  }, [open, initialFocusRef])

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className={cx('fixed inset-0 z-[80] flex items-end justify-center p-3 font-manrope sm:items-center sm:p-6', FOCUS)}>
          <motion.div
            className="absolute inset-0 bg-neutral-900/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            ref={panel}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={description ? descId : undefined}
            className="relative w-full max-w-md rounded-2xl bg-white p-5 shadow-[0_24px_60px_-12px_rgb(0_0_0/0.35)] sm:p-6"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-start gap-3">
              {tone === 'danger' && (
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-red-50 text-red-700" aria-hidden>
                  <AlertTriangle className="size-5" />
                </span>
              )}
              <div className="min-w-0 pt-0.5">
                <h2 id={titleId} className="text-[17px] font-bold leading-snug text-admin-ink">
                  {title}
                </h2>
                {description && (
                  <div id={descId} className="mt-1.5 text-[14px] leading-relaxed text-admin-mute">
                    {description}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

/** Two- or three-action confirmation built on Dialog */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  onConfirm,
  onCancel,
  cancelLabel = 'Cancel',
  tone = 'neutral',
  secondary,
  busy,
}: {
  open: boolean
  title: string
  description?: ReactNode
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
  cancelLabel?: string
  tone?: 'neutral' | 'danger'
  /** Optional middle action, e.g. "Archive instead" */
  secondary?: { label: string; onClick: () => void }
  busy?: boolean
}) {
  const cancelRef = useRef<HTMLButtonElement>(null)
  return (
    <Dialog open={open} onClose={busy ? () => {} : onCancel} title={title} description={description} tone={tone} initialFocusRef={cancelRef}>
      <Button ref={cancelRef} variant="ghost" onClick={onCancel} disabled={busy}>
        {cancelLabel}
      </Button>
      {secondary && (
        <Button variant="secondary" onClick={secondary.onClick} disabled={busy}>
          {secondary.label}
        </Button>
      )}
      <Button variant={tone === 'danger' ? 'danger' : 'primary'} onClick={onConfirm} loading={busy}>
        {confirmLabel}
      </Button>
    </Dialog>
  )
}

/* ------------------------------------------------------------------ Toasts */

const toastIcon = {
  success: <Check className="size-4 text-emerald-400" aria-hidden />,
  error: <AlertTriangle className="size-4 text-red-300" aria-hidden />,
  info: <Info className="size-4 text-couture-gold-light" aria-hidden />,
}

/** Always mounted so screen readers hear every message */
export function Toaster() {
  const toasts = useToasts((s) => s.toasts)
  return (
    <div
      aria-live="polite"
      role="status"
      className="pointer-events-none fixed inset-x-0 bottom-24 z-[70] flex flex-col items-center gap-2 px-4 font-manrope"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, transition: { duration: 0.15 } }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto flex max-w-sm items-center gap-3 rounded-xl bg-neutral-900 py-2.5 pl-3.5 pr-1.5 text-[14px] font-medium text-white shadow-lg"
          >
            {toastIcon[t.tone]}
            <span className="min-w-0 flex-1">{t.message}</span>
            <button
              type="button"
              onClick={() => dismissToast(t.id)}
              className="grid size-8 place-items-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white"
              aria-label="Dismiss"
            >
              <X className="size-4" aria-hidden />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

/* ------------------------------------------------------------------ Form bits */


export function FieldError({ id, children }: { id: string; children?: ReactNode }) {
  if (!children) return null
  return (
    <p id={id} className="mt-1.5 flex items-start gap-1.5 text-[13px] font-medium text-red-700">
      <AlertTriangle className="mt-0.5 size-3.5 shrink-0" aria-hidden />
      <span>{children}</span>
    </p>
  )
}

/** Accessible on/off switch */
export function Switch({
  checked,
  onChange,
  label,
  hint,
  id,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  hint?: string
  id?: string
}) {
  const auto = useId()
  const sid = id ?? auto
  return (
    <div className="flex items-start justify-between gap-4">
      <label htmlFor={sid} className="min-w-0 cursor-pointer py-1">
        <span className="block text-[14px] font-semibold text-admin-ink">{label}</span>
        {hint && <span className="mt-0.5 block text-[13px] leading-snug text-admin-mute">{hint}</span>}
      </label>
      <button
        id={sid}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="group grid h-11 w-14 shrink-0 place-items-center"
      >
        <span
          className={cx(
            'relative h-7 w-12 rounded-full transition-colors',
            checked ? 'bg-couture-gold' : 'bg-neutral-300 group-hover:bg-neutral-400',
          )}
        >
          <span
            className={cx(
              'absolute top-0.5 left-0.5 size-6 rounded-full bg-white shadow transition-transform duration-200',
              checked && 'translate-x-5',
            )}
          />
        </span>
      </button>
    </div>
  )
}
