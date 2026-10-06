import { useId, useRef, useState, type DragEvent } from 'react'
import { ImagePlus, Loader2, RefreshCw, Trash2 } from 'lucide-react'
import { ProductImage } from '../shared/catalog/ProductImage'
import { catalogRepo } from '../shared/catalog/store'
import { formatBytes, ImageError, prepareImage } from './image'
import { cx } from './styles'
import { FieldError } from './ui'

type Phase = 'idle' | 'resizing' | 'saving'

/**
 * One product photo: drop or tap to choose, resized in the browser, stored via the catalog repo.
 * `value` is an image ref (static path or idb:…).
 */
export function PhotoField({
  label,
  hint,
  value,
  onChange,
  error,
  required,
  inputId,
  aspect = 'aspect-[4/5]',
}: {
  label: string
  hint: string
  value: string | undefined
  onChange: (ref: string | undefined) => void
  error?: string
  required?: boolean
  inputId?: string
  aspect?: string
}) {
  const input = useRef<HTMLInputElement>(null)
  const autoId = useId()
  const id = inputId ?? autoId
  const errId = `${id}-error`
  const hintId = `${id}-hint`
  const [phase, setPhase] = useState<Phase>('idle')
  const [problem, setProblem] = useState<string>()
  const [over, setOver] = useState(false)
  const [optimised, setOptimised] = useState<{ before: number; after: number }>()

  const busy = phase !== 'idle'
  const shownError = problem ?? error

  async function take(file: File | undefined) {
    if (!file || busy) return
    setProblem(undefined)
    setOptimised(undefined)
    try {
      setPhase('resizing')
      const blob = await prepareImage(file)
      setPhase('saving')
      const ref = await catalogRepo.uploadImage(blob)
      setOptimised({ before: file.size, after: blob.size })
      onChange(ref)
    } catch (e) {
      setProblem(e instanceof ImageError ? e.message : 'The photo couldn’t be saved. Try again.')
    } finally {
      setPhase('idle')
      if (input.current) input.current.value = ''
    }
  }

  const drag = {
    onDragOver: (e: DragEvent) => {
      e.preventDefault()
      if (!busy) setOver(true)
    },
    onDragLeave: () => setOver(false),
    onDrop: (e: DragEvent) => {
      e.preventDefault()
      setOver(false)
      take(e.dataTransfer.files[0])
    },
  }

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[14px] font-semibold text-admin-ink">
          {label}
          {!required && <span className="ml-1.5 font-normal text-admin-mute">optional</span>}
        </label>
      </div>

      <input
        ref={input}
        id={id}
        type="file"
        accept="image/*"
        className="sr-only"
        aria-describedby={cx(hintId, shownError && errId) || undefined}
        aria-invalid={!!shownError || undefined}
        onChange={(e) => take(e.target.files?.[0])}
        tabIndex={-1}
      />

      {value ? (
        <div
          {...drag}
          className={cx(
            '@container group relative overflow-hidden rounded-xl bg-admin-canvas ring-1 ring-inset transition',
            over ? 'ring-2 ring-couture-gold' : 'ring-admin-line',
            aspect,
          )}
        >
          <ProductImage src={value} alt={`${label} preview`} className="absolute inset-0 h-full w-full object-cover" />
          {busy && <Processing phase={phase} />}
          <div className="absolute inset-x-0 bottom-0 flex gap-2 bg-linear-to-t from-black/55 to-transparent p-2.5 pt-10">
            <button
              type="button"
              onClick={() => input.current?.click()}
              disabled={busy}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-lg bg-white/95 px-3 text-[13px] font-semibold text-admin-ink shadow-sm backdrop-blur hover:bg-white disabled:opacity-60"
            >
              <RefreshCw className="size-4" aria-hidden />
              <span className="sr-only @[15rem]:not-sr-only">Replace</span>
              <span className="sr-only"> {label.toLowerCase()}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setOptimised(undefined)
                onChange(undefined)
              }}
              disabled={busy}
              className="inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-lg bg-white/95 px-3 text-[13px] font-semibold text-red-700 shadow-sm backdrop-blur hover:bg-white disabled:opacity-60"
            >
              <Trash2 className="size-4" aria-hidden />
              <span className="sr-only @[15rem]:not-sr-only">Remove</span>
              <span className="sr-only"> {label.toLowerCase()}</span>
            </button>
          </div>
        </div>
      ) : (
        <button
          id={`${id}-zone`}
          type="button"
          {...drag}
          onClick={() => input.current?.click()}
          disabled={busy}
          aria-describedby={cx(hintId, shownError && errId) || undefined}
          className={cx(
            'relative flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-4 text-center transition-colors',
            aspect,
            over
              ? 'border-couture-gold bg-admin-gold-wash'
              : shownError
                ? 'border-red-300 bg-red-50/40 hover:border-red-400'
                : 'border-admin-line-strong bg-admin-canvas hover:border-couture-gold hover:bg-admin-gold-wash/60',
          )}
        >
          {busy ? (
            <Processing phase={phase} inline />
          ) : (
            <>
              <span className="grid size-12 place-items-center rounded-full bg-white text-admin-gold-deep shadow-sm ring-1 ring-admin-line">
                <ImagePlus className="size-5" aria-hidden />
              </span>
              <span className="text-[14px] font-semibold text-admin-ink">
                <span className="hidden sm:inline">Drop a photo or </span>
                <span className="text-admin-gold-deep underline decoration-couture-gold/50 underline-offset-4">
                  <span className="sm:hidden">Add a photo</span>
                  <span className="hidden sm:inline">choose a file</span>
                </span>
              </span>
            </>
          )}
        </button>
      )}

      <p id={hintId} className="mt-2 text-[13px] leading-snug text-admin-mute">
        {optimised
          ? `Optimised from ${formatBytes(optimised.before)} to ${formatBytes(optimised.after)}.`
          : hint}
      </p>
      <FieldError id={errId}>{shownError}</FieldError>
    </div>
  )
}

function Processing({ phase, inline }: { phase: Phase; inline?: boolean }) {
  const text = phase === 'resizing' ? 'Resizing photo…' : 'Saving photo…'
  const body = (
    <div className="flex w-40 flex-col items-center gap-3">
      <Loader2 className="size-6 animate-spin text-admin-gold-deep" aria-hidden />
      <span className="text-[13px] font-semibold text-admin-ink" role="status">
        {text}
      </span>
      <span className="h-1 w-full overflow-hidden rounded-full bg-neutral-200">
        <span
          className="block h-full rounded-full bg-couture-gold transition-[width] duration-500"
          style={{ width: phase === 'resizing' ? '55%' : '90%' }}
        />
      </span>
    </div>
  )
  if (inline) return body
  return <div className="absolute inset-0 grid place-items-center bg-white/80 backdrop-blur-sm">{body}</div>
}
