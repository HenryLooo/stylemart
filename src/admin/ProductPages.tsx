import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link, useBlocker, useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, ExternalLink, Minus, Plus, Sparkles, Trash2, X } from 'lucide-react'
import { collectionHref, filters } from '../couture/catalogue'
import { CatalogError } from '../shared/catalog/repository'
import { normalizeSku, suggestSku } from '../shared/catalog/sku'
import { catalogRepo, useCatalog, useProduct } from '../shared/catalog/store'
import {
  CATEGORIES,
  COLLECTIONS,
  STATUSES,
  type Category,
  type Collection,
  type Product,
  type ProductInput,
  type Status,
} from '../shared/catalog/types'
import { PhotoField } from './PhotoField'
import { toast } from './toast'
import { cx, inputCls } from './styles'
import { Button, ConfirmDialog, FieldError, StatusBadge, Switch } from './ui'

/* ------------------------------------------------------------------ Pages */

export function NewProductPage() {
  return <ProductForm key="new" />
}

export function EditProductPage() {
  const { id } = useParams()
  const product = useProduct(id)
  const ready = useCatalog((s) => s.ready)
  if (!product) {
    if (!ready) return null
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="font-bodoni text-[32px]">Product not found</h1>
        <p className="mt-3 text-[15px] text-admin-mute">It may have been deleted, or the demo data was reset.</p>
        <Link to="/admin" className="mt-6 inline-flex min-h-11 items-center rounded-lg border border-admin-line-strong px-4 text-[14px] font-semibold hover:bg-admin-canvas">
          Back to products
        </Link>
      </div>
    )
  }
  return <ProductForm key={product.id} product={product} />
}

/* ------------------------------------------------------------------ Form model */

interface Draft {
  name: string
  note: string
  details: string[]
  category: Category
  collection: Collection
  isNew: boolean
  madeToOrder: boolean
  price: string
  sku: string
  stock: string
  image?: string
  closeup?: string
  status: Status
}

type FieldKey = 'name' | 'note' | 'sku' | 'price' | 'stock' | 'image'
type Errors = Partial<Record<FieldKey, string>>

const FIELD_ORDER: FieldKey[] = ['image', 'name', 'note', 'price', 'sku', 'stock']
const FIELD_ID: Record<FieldKey, string> = {
  image: 'photo-main-zone',
  name: 'f-name',
  note: 'f-note',
  price: 'f-price',
  sku: 'f-sku',
  stock: 'f-stock',
}

/** Sensible merchandising group for a category (the owner can still change it) */
const collectionFor = (c: Category): Collection => (c === 'Lengha' ? 'Lengha' : c === 'Saree' ? 'Saree' : 'Asian Woman')

function toDraft(p: Product | undefined, skus: string[]): Draft {
  if (!p) {
    const category: Category = 'Lengha'
    return {
      name: '',
      note: '',
      details: [''],
      category,
      collection: collectionFor(category),
      isNew: true,
      madeToOrder: false,
      price: '',
      sku: suggestSku(category, skus),
      stock: '1',
      status: 'active',
    }
  }
  return {
    name: p.name,
    note: p.note,
    details: p.details.length ? [...p.details] : [''],
    category: p.category,
    collection: p.collection,
    isNew: !!p.isNew,
    madeToOrder: p.price == null,
    price: p.price == null ? '' : String(p.price),
    sku: p.sku,
    stock: String(p.stock),
    image: p.image,
    closeup: p.closeup,
    status: p.status,
  }
}

const parseStock = (s: string) => (/^\d+$/.test(s.trim()) ? Number(s.trim()) : NaN)
const parsePrice = (s: string) => {
  const t = s.replace(/[,\s]/g, '').replace(/^S?\$/i, '')
  return t === '' || !/^\d+(\.\d{1,2})?$/.test(t) ? NaN : Number(t)
}

function toInput(d: Draft): ProductInput {
  const stock = parseStock(d.stock)
  return {
    sku: normalizeSku(d.sku),
    name: d.name.trim(),
    price: d.madeToOrder ? null : parsePrice(d.price),
    stock: Number.isInteger(stock) ? stock : 0,
    category: d.category,
    collection: d.collection,
    image: d.image ?? '',
    closeup: d.closeup || undefined,
    note: d.note.trim(),
    details: d.details.map((x) => x.trim()).filter(Boolean),
    status: d.status,
    isNew: d.isNew || undefined,
  }
}

/** What counts as a change worth guarding (ignores blank craft-note lines and whitespace) */
const fingerprint = (d: Draft) => JSON.stringify({ ...toInput(d), price: d.madeToOrder ? null : d.price.trim(), stock: d.stock.trim() })

function validate(d: Draft, duplicate: Product | undefined): Errors {
  const e: Errors = {}
  if (!d.image) e.image = 'Add a main photo.'
  if (!d.name.trim()) e.name = 'Give the product a name.'
  if (!d.madeToOrder) {
    if (!d.price.trim()) e.price = 'Enter a price, or switch on “Price on request”.'
    else if (Number.isNaN(parsePrice(d.price))) e.price = 'Enter the price as a number, e.g. 2480.'
    if (!Number.isInteger(parseStock(d.stock))) e.stock = 'Stock must be a whole number, 0 or more.'
  }
  if (!normalizeSku(d.sku)) e.sku = 'Every product needs a SKU.'
  else if (duplicate) e.sku = `${normalizeSku(d.sku)} is already used by “${duplicate.name}”.`
  return e
}

/* ------------------------------------------------------------------ Form */

const STATUS_COPY: Record<Status, { title: string; line: string }> = {
  active: { title: 'Active', line: 'Live in the shop. Customers can see and buy it.' },
  draft: { title: 'Draft', line: 'Hidden from the shop while you finish it.' },
  archived: { title: 'Archived', line: 'Hidden and set aside. Bring it back any time.' },
}

function ProductForm({ product }: { product?: Product }) {
  const isEdit = !!product
  const navigate = useNavigate()
  const products = useCatalog((s) => s.products)
  const otherSkus = useMemo(() => products.filter((p) => p.id !== product?.id).map((p) => p.sku), [products, product?.id])

  const [baseline, setBaseline] = useState(() => toDraft(product, otherSkus))
  const [draft, setDraft] = useState(baseline)
  const [errors, setErrors] = useState<Errors>({})
  const [saving, setSaving] = useState(false)
  const [skuTouched, setSkuTouched] = useState(isEdit)
  const [collectionTouched, setCollectionTouched] = useState(isEdit)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const skipGuard = useRef(false)
  const noteRefs = useRef<(HTMLInputElement | null)[]>([])
  const focusNote = useRef<number | null>(null)

  const dirty = fingerprint(draft) !== fingerprint(baseline)
  const duplicate = useMemo(() => {
    const sku = normalizeSku(draft.sku)
    return sku ? products.find((p) => p.id !== product?.id && normalizeSku(p.sku) === sku) : undefined
  }, [draft.sku, products, product?.id])

  const update = <K extends keyof Draft>(key: K, value: Draft[K], clear?: FieldKey) => {
    setDraft((d) => ({ ...d, [key]: value }))
    if (clear && errors[clear]) setErrors(({ [clear]: _gone, ...rest }) => rest)
  }

  const changeCategory = (category: Category) => {
    setDraft((d) => ({
      ...d,
      category,
      collection: collectionTouched ? d.collection : collectionFor(category),
      sku: skuTouched ? d.sku : suggestSku(category, otherSkus),
    }))
    if (!skuTouched) setErrors(({ sku: _gone, ...rest }) => rest)
  }

  /* --- unsaved-changes guard: in-app navigation (styled dialog) + tab close/reload (browser prompt) */
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      dirty && !skipGuard.current && currentLocation.pathname !== nextLocation.pathname && nextLocation.pathname !== '/admin/login',
  )
  useEffect(() => {
    if (!dirty) return
    const onUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onUnload)
    return () => window.removeEventListener('beforeunload', onUnload)
  }, [dirty])

  useEffect(() => {
    if (focusNote.current != null) {
      noteRefs.current[focusNote.current]?.focus()
      focusNote.current = null
    }
  }, [draft.details.length])

  const focusField = (key: FieldKey) =>
    requestAnimationFrame(() => {
      const el = document.getElementById(FIELD_ID[key])
      el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      el?.focus({ preventScroll: true })
    })

  async function save(e?: FormEvent) {
    e?.preventDefault()
    if (saving || (isEdit && !dirty)) return
    const found = validate(draft, duplicate)
    const first = FIELD_ORDER.find((k) => found[k])
    if (first) {
      setErrors(found)
      focusField(first)
      return
    }
    setErrors({})
    setSaving(true)
    try {
      const input = toInput(draft)
      if (product) {
        const saved = await catalogRepo.update(product.id, input)
        const next = toDraft(saved, otherSkus)
        setBaseline(next)
        setDraft(next)
        toast('Changes saved')
      } else {
        const created = await catalogRepo.create(input)
        skipGuard.current = true
        navigate('/admin')
        toast(`Added “${created.name}”${created.status === 'active' ? '. It’s live in the shop.' : ''}`)
      }
    } catch (err) {
      if (err instanceof CatalogError && err.field && err.field in FIELD_ID) {
        const field = err.field as FieldKey
        setErrors({ [field]: err.message })
        focusField(field)
      } else {
        toast(err instanceof Error ? err.message : 'Couldn’t save. Try again.', 'error')
      }
    } finally {
      setSaving(false)
    }
  }

  // Ctrl/Cmd+S saves
  const saveRef = useRef(save)
  useEffect(() => {
    saveRef.current = save
  })
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        saveRef.current()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  async function remove() {
    if (!product) return
    setDeleting(true)
    try {
      skipGuard.current = true
      await catalogRepo.remove(product.id)
      navigate('/admin')
      toast(`Deleted “${product.name}”`)
    } catch {
      skipGuard.current = false
      setDeleting(false)
      toast('Couldn’t delete the product. Try again.', 'error')
    }
  }

  async function archiveInstead() {
    if (!product) return
    try {
      await catalogRepo.update(product.id, { status: 'archived' })
      setBaseline((b) => ({ ...b, status: 'archived' }))
      setDraft((d) => ({ ...d, status: 'archived' }))
      setConfirmDelete(false)
      toast('Archived. It’s hidden from the shop and kept here.')
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Couldn’t archive. Try again.', 'error')
    }
  }

  const shopHref = product ? collectionHref(filters.find((f) => f.slug !== 'all' && f.match(product))?.slug) : undefined
  const errorCount = Object.keys(errors).length
  const title = isEdit ? baseline.name || 'Untitled product' : 'New product'

  return (
    <form onSubmit={save} noValidate>
      <div className="mx-auto max-w-6xl px-4 pt-5 sm:px-6 sm:pt-8">
      {/* Header */}
      <Link to="/admin" className="-ml-2 inline-flex min-h-11 items-center gap-1 rounded-lg px-2 text-[14px] font-semibold text-admin-mute hover:text-admin-ink">
        <ChevronLeft className="size-4" aria-hidden />
        Products
      </Link>
      <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-bodoni text-[30px] leading-[1.1] text-admin-ink sm:text-[40px]">{title}</h1>
          {isEdit && (
            <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13px] text-admin-mute">
              <StatusBadge status={baseline.status} />
              <span className="font-mono text-[12.5px] text-admin-ink/80">{product.sku}</span>
              <span>Updated {new Date(product.updatedAt).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
          )}
          {!isEdit && <p className="mt-2 text-[14px] text-admin-mute">Add a photo, the details shoppers read, and the price and stock.</p>}
        </div>
        {isEdit && (
          baseline.status === 'active' ? (
            <a
              href={shopHref}
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-11 shrink-0 items-center gap-1.5 self-start rounded-lg border border-admin-line-strong px-3.5 text-[14px] font-semibold hover:bg-admin-canvas sm:self-auto"
            >
              <ExternalLink className="size-4" aria-hidden />
              View in shop<span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : (
            <p className="text-[13px] text-admin-mute sm:max-w-56 sm:text-right">Not in the shop while {baseline.status === 'draft' ? 'a draft' : 'archived'}.</p>
          )
        )}
      </div>

      <div className="mt-7 grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)] lg:items-start lg:gap-8">
        {/* Photos */}
        <Section id="photos" title="Photos" hint="Portrait photos work best. They’re resized for the web as you add them." className="lg:sticky lg:top-24">
          <div className="grid grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] gap-3 lg:grid-cols-1 lg:gap-5">
            <PhotoField
              inputId="photo-main"
              label="Main photo"
              hint="Full-length. Shown on cards and the product page."
              required
              value={draft.image}
              onChange={(ref) => update('image', ref, 'image')}
              error={errors.image}
            />
            <PhotoField
              inputId="photo-closeup"
              label="Close-up"
              hint="Detail of the work. Shown on hover."
              value={draft.closeup}
              onChange={(ref) => update('closeup', ref)}
              aspect="aspect-[4/5] lg:aspect-[16/10]"
            />
          </div>
        </Section>

        <div className="grid gap-5">
          {/* Details */}
          <Section id="details" title="Details">
            <div className="grid gap-5">
              <Field id="f-name" label="Name" error={errors.name}>
                {(p) => (
                  <input {...p} value={draft.name} onChange={(e) => update('name', e.target.value, 'name')} placeholder="e.g. The Ivory Zardozi Bridal Lengha" className={inputCls(!!errors.name)} />
                )}
              </Field>
              <Field id="f-note" label="Description" hint="One line shown under the name on product cards." error={errors.note}>
                {(p) => (
                  <input
                    {...p}
                    value={draft.note}
                    maxLength={160}
                    onChange={(e) => update('note', e.target.value, 'note')}
                    placeholder="e.g. Raw-silk lengha with a hand-cut scalloped dupatta."
                    className={inputCls(!!errors.note)}
                  />
                )}
              </Field>

              <fieldset>
                <legend className="text-[14px] font-semibold">
                  Craft notes<span className="ml-1.5 font-normal text-admin-mute">optional</span>
                </legend>
                <p className="mt-0.5 text-[13px] text-admin-mute">One detail per line, e.g. fabric, handwork, fit.</p>
                <ol className="mt-2.5 grid gap-2">
                  {draft.details.map((line, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <label htmlFor={`f-detail-${i}`} className="sr-only">
                        Craft note {i + 1}
                      </label>
                      <input
                        id={`f-detail-${i}`}
                        ref={(el) => {
                          noteRefs.current[i] = el
                        }}
                        value={line}
                        onChange={(e) => update('details', draft.details.map((d, j) => (j === i ? e.target.value : d)))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            focusNote.current = i + 1
                            update('details', [...draft.details.slice(0, i + 1), '', ...draft.details.slice(i + 1)])
                          }
                        }}
                        placeholder={i === 0 ? 'e.g. Hand-worked Kashmiri gara sleeves' : 'Another detail'}
                        className={inputCls()}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const next = draft.details.filter((_, j) => j !== i)
                          update('details', next.length ? next : [''])
                          focusNote.current = Math.max(0, i - 1)
                        }}
                        className="grid size-11 shrink-0 place-items-center rounded-lg text-admin-mute hover:bg-neutral-100 hover:text-red-700"
                        aria-label={`Remove craft note ${i + 1}`}
                      >
                        <X className="size-4" aria-hidden />
                      </button>
                    </li>
                  ))}
                </ol>
                <button
                  type="button"
                  onClick={() => {
                    focusNote.current = draft.details.length
                    update('details', [...draft.details, ''])
                  }}
                  className="mt-2 inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-[14px] font-semibold text-admin-gold-deep hover:bg-admin-gold-wash"
                >
                  <Plus className="size-4" aria-hidden />
                  Add a craft note
                </button>
              </fieldset>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="f-category" label="Category" hint={isEdit ? undefined : 'Sets the SKU prefix.'}>
                  {(p) => (
                    <select {...p} value={draft.category} onChange={(e) => changeCategory(e.target.value as Category)} className={cx(inputCls(), 'cursor-pointer')}>
                      {CATEGORIES.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  )}
                </Field>
                <Field id="f-collection" label="Collection" hint="Which shop tab it appears under.">
                  {(p) => (
                    <select
                      {...p}
                      value={draft.collection}
                      onChange={(e) => {
                        setCollectionTouched(true)
                        update('collection', e.target.value as Collection)
                      }}
                      className={cx(inputCls(), 'cursor-pointer')}
                    >
                      {COLLECTIONS.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  )}
                </Field>
              </div>

              <div className="border-t border-admin-line pt-3">
                <Switch id="f-new" label="New arrival" hint="Shows a “New” tag and lists it under New Arrivals." checked={draft.isNew} onChange={(v) => update('isNew', v)} />
              </div>
            </div>
          </Section>

          {/* Pricing & stock */}
          <Section id="pricing" title="Pricing and stock">
            <div className="grid gap-5">
              <Switch
                id="f-mto"
                label="Price on request (made to order)"
                hint="For bespoke pieces booked by fitting. Hides the price and doesn’t track stock."
                checked={draft.madeToOrder}
                onChange={(v) => {
                  update('madeToOrder', v)
                  if (v) setErrors(({ price: _p, stock: _s, ...rest }) => rest)
                }}
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="f-price" label="Price" error={errors.price} hint={draft.madeToOrder ? 'Shown as “Price on request”.' : 'In Singapore dollars.'}>
                  {(p) => (
                    <div className="relative">
                      <span className={cx('pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[15px] font-semibold', draft.madeToOrder ? 'text-neutral-300' : 'text-admin-mute')}>S$</span>
                      <input
                        {...p}
                        inputMode="decimal"
                        disabled={draft.madeToOrder}
                        value={draft.madeToOrder ? '' : draft.price}
                        placeholder={draft.madeToOrder ? 'On request' : '0'}
                        onChange={(e) => update('price', e.target.value, 'price')}
                        className={cx(inputCls(!!errors.price), 'pl-10 tabular-nums')}
                      />
                    </div>
                  )}
                </Field>

                <Field id="f-stock" label="Stock" error={errors.stock} hint={draft.madeToOrder ? 'Not tracked for made-to-order pieces.' : '0 shows as “Sold out” in the shop.'}>
                  {(p) => (
                    <div className={cx('flex items-stretch rounded-lg', draft.madeToOrder && 'opacity-60')}>
                      <button
                        type="button"
                        aria-label="One fewer"
                        disabled={draft.madeToOrder || !(parseStock(draft.stock) > 0)}
                        onClick={() => update('stock', String(Math.max(0, parseStock(draft.stock) - 1)), 'stock')}
                        className="grid w-12 shrink-0 place-items-center rounded-l-lg border border-r-0 border-admin-line-strong bg-white hover:bg-neutral-50 disabled:cursor-not-allowed disabled:text-neutral-300"
                      >
                        <Minus className="size-4" aria-hidden />
                      </button>
                      <input
                        {...p}
                        inputMode="numeric"
                        disabled={draft.madeToOrder}
                        value={draft.stock}
                        onChange={(e) => update('stock', e.target.value.replace(/[^\d]/g, ''), 'stock')}
                        className={cx(inputCls(!!errors.stock), 'rounded-none text-center font-bold tabular-nums')}
                      />
                      <button
                        type="button"
                        aria-label="One more"
                        disabled={draft.madeToOrder}
                        onClick={() => update('stock', String((parseStock(draft.stock) || 0) + 1), 'stock')}
                        className="grid w-12 shrink-0 place-items-center rounded-r-lg border border-l-0 border-admin-line-strong bg-white hover:bg-neutral-50 disabled:cursor-not-allowed disabled:text-neutral-300"
                      >
                        <Plus className="size-4" aria-hidden />
                      </button>
                    </div>
                  )}
                </Field>
              </div>

              <Field
                id="f-sku"
                label="SKU"
                error={errors.sku ?? (duplicate ? `${normalizeSku(draft.sku)} is already used by “${duplicate.name}”.` : undefined)}
                hint="Unique code for labels and stock-taking."
              >
                {(p) => (
                  <div className="flex gap-2">
                    <input
                      {...p}
                      value={draft.sku}
                      autoCapitalize="characters"
                      autoComplete="off"
                      spellCheck={false}
                      onChange={(e) => {
                        setSkuTouched(true)
                        update('sku', e.target.value.toUpperCase(), 'sku')
                      }}
                      className={cx(inputCls(!!errors.sku || !!duplicate), 'font-mono text-[14px] tracking-wide')}
                    />
                    <Button
                      variant="secondary"
                      className="shrink-0"
                      onClick={() => {
                        setSkuTouched(false)
                        update('sku', suggestSku(draft.category, otherSkus), 'sku')
                      }}
                      disabled={!skuTouched && !duplicate && normalizeSku(draft.sku) === suggestSku(draft.category, otherSkus)}
                    >
                      <Sparkles className="size-4" aria-hidden />
                      Suggest
                    </Button>
                  </div>
                )}
              </Field>
            </div>
          </Section>

          {/* Visibility */}
          <Section id="visibility" title="Visibility">
            <div role="radiogroup" aria-labelledby="visibility-title" className="grid gap-2 sm:grid-cols-3">
              {STATUSES.map((s) => {
                const on = draft.status === s
                return (
                  <label
                    key={s}
                    className={cx(
                      'relative flex min-h-11 cursor-pointer gap-3 rounded-xl border p-3.5 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-couture-gold sm:flex-col sm:gap-2',
                      on ? 'border-couture-gold bg-admin-gold-wash shadow-[inset_0_0_0_1px_var(--color-couture-gold)]' : 'border-admin-line-strong hover:bg-admin-canvas',
                    )}
                  >
                    <input type="radio" name="status" value={s} checked={on} onChange={() => update('status', s)} className="sr-only" />
                    <span
                      aria-hidden
                      className={cx('mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-2 transition-colors', on ? 'border-couture-gold' : 'border-neutral-300')}
                    >
                      {on && <span className="size-2.5 rounded-full bg-couture-gold" />}
                    </span>
                    <span>
                      <span className="block text-[14px] font-bold">{STATUS_COPY[s].title}</span>
                      <span className="mt-0.5 block text-[13px] leading-snug text-admin-mute">{STATUS_COPY[s].line}</span>
                    </span>
                  </label>
                )
              })}
            </div>
          </Section>

          {/* Danger zone */}
          {isEdit && (
            <section aria-labelledby="danger-title" className="rounded-2xl border border-red-200 p-5 sm:p-6">
              <h2 id="danger-title" className="text-[16px] font-bold text-red-800">
                Delete product
              </h2>
              <p className="mt-1 max-w-prose text-[14px] text-admin-mute">
                Deleting removes the product and its uploaded photos from the catalogue for good. To take it out of the shop but keep it, choose Archived above.
              </p>
              <Button variant="quiet-danger" className="mt-4" onClick={() => setConfirmDelete(true)}>
                <Trash2 className="size-4" aria-hidden />
                Delete product
              </Button>
            </section>
          )}
        </div>
      </div>

      </div>

      {/* Sticky save bar: pinned to the viewport bottom while the form is on screen */}
      <div className="sticky bottom-0 z-30 mt-8 border-t border-admin-line bg-white/95 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_-16px_rgb(0_0_0/0.18)] backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 sm:px-6">
          <p className="hidden min-w-0 flex-1 items-center gap-2 text-[13px] font-medium text-admin-mute sm:flex" aria-live="polite">
            {errorCount > 0 ? (
              <>
                <span className="size-2 rounded-full bg-red-500" aria-hidden />
                <span className="text-red-700">
                  {errorCount === 1 ? 'Fix the highlighted field to save.' : `Fix ${errorCount} highlighted fields to save.`}
                </span>
              </>
            ) : dirty ? (
              <>
                <span className="size-2 rounded-full bg-amber-500" aria-hidden />
                Unsaved changes
              </>
            ) : isEdit ? (
              <>
                <span className="size-2 rounded-full bg-emerald-500" aria-hidden />
                All changes saved
              </>
            ) : null}
          </p>
          <Button variant="secondary" onClick={() => navigate('/admin')} className="sm:w-auto">
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={saving} className="flex-1 sm:flex-none sm:px-6" disabled={isEdit && !dirty}>
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add product'}
          </Button>
        </div>
        {errorCount > 0 && (
          <p className="mx-auto mt-2 max-w-6xl px-4 text-[13px] font-medium text-red-700 sm:hidden" aria-hidden>
            {errorCount === 1 ? 'Fix the highlighted field to save.' : `Fix ${errorCount} highlighted fields to save.`}
          </p>
        )}
      </div>

      <ConfirmDialog
        open={blocker.state === 'blocked'}
        title="Leave without saving?"
        description={isEdit ? `Your changes to “${baseline.name}” haven’t been saved and will be lost.` : 'This new product hasn’t been added yet. What you’ve entered will be lost.'}
        cancelLabel="Keep editing"
        confirmLabel="Discard changes"
        tone="danger"
        onCancel={() => blocker.reset?.()}
        onConfirm={() => blocker.proceed?.()}
      />

      <ConfirmDialog
        open={confirmDelete}
        tone="danger"
        title={`Delete “${baseline.name}”?`}
        description={
          <>
            This can’t be undone. If you only want it out of the shop, archive it instead: it stays here and you can bring it back.
          </>
        }
        confirmLabel="Delete product"
        busy={deleting}
        secondary={baseline.status !== 'archived' ? { label: 'Archive instead', onClick: archiveInstead } : undefined}
        onConfirm={remove}
        onCancel={() => setConfirmDelete(false)}
      />
    </form>
  )
}

/* ------------------------------------------------------------------ Layout bits */

function Section({ id, title, hint, children, className }: { id: string; title: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <section aria-labelledby={`${id}-title`} className={cx('rounded-2xl border border-admin-line bg-white p-4 sm:p-6', className)}>
      <h2 id={`${id}-title`} className="text-[17px] font-bold">
        {title}
      </h2>
      {hint && <p className="mt-1 text-[13px] text-admin-mute">{hint}</p>}
      <div className="mt-4">{children}</div>
    </section>
  )
}

interface FieldProps {
  id: string
  'aria-invalid'?: boolean
  'aria-describedby'?: string
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string
  label: string
  hint?: string
  error?: string
  children: (p: FieldProps) => ReactNode
}) {
  const describedBy = cx(hint && !error && `${id}-hint`, error && `${id}-error`) || undefined
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[14px] font-semibold">
        {label}
      </label>
      {children({ id, 'aria-invalid': error ? true : undefined, 'aria-describedby': describedBy })}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-[13px] text-admin-mute">
          {hint}
        </p>
      )}
      <FieldError id={`${id}-error`}>{error}</FieldError>
    </div>
  )
}
