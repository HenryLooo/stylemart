import { useMemo, useRef, type ReactNode } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { PackageOpen, Plus, Search, X } from 'lucide-react'
import { ProductImage } from '../shared/catalog/ProductImage'
import { normalizeSku } from '../shared/catalog/sku'
import { catalogRepo, useCatalog } from '../shared/catalog/store'
import {
  CATEGORIES,
  isLowStock,
  isMadeToOrder,
  isSoldOut,
  STATUSES,
  type Category,
  type Product,
  type Status,
} from '../shared/catalog/types'
import { formatPrice } from '../shared/format'
import { toast } from './toast'
import { cx, inputCls, STATUS_LABEL } from './styles'
import { Chip, MadeToOrder, StatusBadge, StockNote, StockStepper } from './ui'

type StockFilter = 'low' | 'out'

const tracked = (p: Product) => p.status !== 'archived'

async function saveStock(p: Product, stock: number) {
  try {
    await catalogRepo.update(p.id, { stock })
  } catch (e) {
    toast(e instanceof Error ? e.message : 'Couldn’t update the stock. Try again.', 'error')
  }
}

export default function ProductsPage() {
  const products = useCatalog((s) => s.products)
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const searchRef = useRef<HTMLInputElement>(null)

  const q = params.get('q') ?? ''
  const status = (STATUSES as readonly string[]).includes(params.get('status') ?? '') ? (params.get('status') as Status) : undefined
  const category = (CATEGORIES as readonly string[]).includes(params.get('cat') ?? '') ? (params.get('cat') as Category) : undefined
  const stock = (['low', 'out'] as const).find((s) => s === params.get('stock')) as StockFilter | undefined

  const set = (patch: Record<string, string | undefined>) => {
    const next = new URLSearchParams(params)
    for (const [k, v] of Object.entries(patch)) {
      if (v) next.set(k, v)
      else next.delete(k)
    }
    setParams(next, { replace: true })
  }

  const counts = useMemo(
    () => ({
      total: products.length,
      active: products.filter((p) => p.status === 'active').length,
      draft: products.filter((p) => p.status === 'draft').length,
      archived: products.filter((p) => p.status === 'archived').length,
      low: products.filter((p) => tracked(p) && isLowStock(p)).length,
      out: products.filter((p) => tracked(p) && isSoldOut(p)).length,
    }),
    [products],
  )

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const skuNeedle = normalizeSku(q)
    return products.filter((p) => {
      if (needle && !p.name.toLowerCase().includes(needle) && !normalizeSku(p.sku).includes(skuNeedle)) return false
      if (status && p.status !== status) return false
      if (category && p.category !== category) return false
      if (stock === 'low' && !(tracked(p) && isLowStock(p))) return false
      if (stock === 'out' && !(tracked(p) && isSoldOut(p))) return false
      return true
    })
  }, [products, q, status, category, stock])

  const filtered = !!(q || status || category || stock)
  const clearAll = () => setParams(new URLSearchParams(), { replace: true })

  const tiles: { key: string; label: string; value: number; dot: string; active: boolean; onClick: () => void }[] = [
    { key: 'total', label: 'Total', value: counts.total, dot: 'bg-admin-ink', active: !status && !stock, onClick: () => set({ status: undefined, stock: undefined }) },
    { key: 'live', label: 'Live', value: counts.active, dot: 'bg-emerald-500', active: status === 'active' && !stock, onClick: () => set({ status: status === 'active' && !stock ? undefined : 'active', stock: undefined }) },
    { key: 'draft', label: 'Drafts', value: counts.draft, dot: 'bg-amber-500', active: status === 'draft' && !stock, onClick: () => set({ status: status === 'draft' && !stock ? undefined : 'draft', stock: undefined }) },
    { key: 'low', label: 'Low stock', value: counts.low, dot: 'bg-amber-400 ring-2 ring-amber-100', active: stock === 'low', onClick: () => set({ stock: stock === 'low' ? undefined : 'low', status: undefined }) },
    { key: 'out', label: 'Sold out', value: counts.out, dot: 'bg-red-500', active: stock === 'out', onClick: () => set({ stock: stock === 'out' ? undefined : 'out', status: undefined }) },
  ]

  const open = (p: Product) => navigate(`/admin/products/${p.id}`)

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-7 sm:px-6 sm:pt-10">
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-bodoni text-[34px] leading-none sm:text-[42px]">Products</h1>
          <p className="mt-2 text-[14px] text-admin-mute">
            {counts.active} of {counts.total} live in the shop
          </p>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-lg bg-couture-gold px-4 text-[14px] font-semibold text-admin-ink shadow-[inset_0_-1px_0_rgb(0_0_0/0.12)] transition-colors hover:bg-admin-gold-hover"
        >
          <Plus className="size-4" aria-hidden />
          New product
        </Link>
      </div>

      {/* Stat tiles double as quick filters */}
      {/* Phone: counts on one row, the two stock alerts wider below; tablet up: five across */}
      <div role="group" aria-label="Quick filters" className="mt-7 grid grid-cols-6 gap-2 sm:grid-cols-5 sm:gap-3">
        {tiles.map((t) => (
          <button
            key={t.key}
            type="button"
            aria-pressed={t.active}
            onClick={t.onClick}
            className={cx(
              'min-w-0 rounded-xl border px-3 pb-2.5 pt-2.5 text-left transition-colors sm:col-span-1 sm:px-3.5 sm:pb-3 sm:pt-3',
              t.key === 'low' || t.key === 'out' ? 'col-span-3' : 'col-span-2',
              t.active
                ? 'border-couture-gold bg-admin-gold-wash shadow-[inset_0_0_0_1px_var(--color-couture-gold)]'
                : 'border-admin-line bg-white hover:border-admin-line-strong hover:bg-admin-canvas',
            )}
          >
            <span className="flex items-center gap-2 truncate text-[13px] font-semibold text-admin-mute">
              <span aria-hidden className={cx('size-2 shrink-0 rounded-full', t.dot)} />
              {t.label}
            </span>
            <span className="mt-1.5 block text-[22px] font-bold leading-none tabular-nums text-admin-ink sm:text-[26px]">{t.value}</span>
          </button>
        ))}
      </div>

      {/* Search + filters */}
      <div className="mt-6 grid gap-2.5 sm:grid-cols-[minmax(0,1fr)_180px_200px]">
        <div className="relative">
          <label htmlFor="search" className="sr-only">
            Search by name or SKU
          </label>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" aria-hidden />
          <input
            ref={searchRef}
            id="search"
            type="search"
            value={q}
            onChange={(e) => set({ q: e.target.value || undefined })}
            placeholder="Search by name or SKU"
            className={cx(inputCls(), 'pl-10 pr-11 [&::-webkit-search-cancel-button]:hidden')}
            autoComplete="off"
          />
          {q && (
            <button
              type="button"
              onClick={() => {
                set({ q: undefined })
                searchRef.current?.focus()
              }}
              className="absolute inset-y-0 right-0 grid w-11 place-items-center text-admin-mute hover:text-admin-ink"
              aria-label="Clear search"
            >
              <X className="size-4" aria-hidden />
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:contents">
          <Select id="status" label="Status" value={status ?? ''} onChange={(v) => set({ status: v || undefined })}>
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]} ({counts[s]})
              </option>
            ))}
          </Select>
          <Select id="category" label="Category" value={category ?? ''} onChange={(v) => set({ cat: v || undefined })}>
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="mt-4 flex min-h-8 items-center justify-between gap-3 text-[13px] text-admin-mute" aria-live="polite">
        <p>
          {filtered ? `Showing ${shown.length} of ${products.length} products` : `${products.length} products`}
        </p>
        {filtered && (
          <button type="button" onClick={clearAll} className="min-h-9 rounded px-1 font-semibold text-admin-gold-deep underline decoration-couture-gold/50 underline-offset-4 hover:decoration-couture-gold">
            Clear filters
          </button>
        )}
      </div>

      {shown.length === 0 ? (
        <EmptyState filtered={filtered} query={q} onClear={clearAll} />
      ) : (
        <>
          {/* Phone + tablet: cards */}
          <ul className="mt-2 grid gap-2.5 md:grid-cols-2 lg:hidden">
            {shown.map((p) => (
              <li key={p.id} className="relative flex gap-3.5 rounded-xl border border-admin-line bg-white p-3 transition-colors hover:border-admin-line-strong">
                <ProductImage src={p.image} alt="" className="aspect-[4/5] w-[76px] shrink-0 rounded-lg bg-admin-canvas object-cover" />
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <Link to={`/admin/products/${p.id}`} className="min-w-0 rounded text-[15px] font-semibold leading-snug text-admin-ink after:absolute after:inset-0 after:rounded-xl">
                      <span className="line-clamp-2">{p.name}</span>
                    </Link>
                    <StatusBadge status={p.status} />
                  </div>
                  <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-admin-mute">
                    <span className="font-mono text-[12px] text-admin-ink/80">{p.sku}</span>
                    {p.isNew && <Chip>New</Chip>}
                    <StockNote product={p} />
                  </p>
                  <div className="mt-auto flex items-end justify-between gap-2 pt-2">
                    <div className="min-w-0 text-[13px] leading-tight">
                      {!isMadeToOrder(p) && <p className="font-semibold text-admin-ink">{formatPrice(p.price)}</p>}
                      <p className="mt-0.5 truncate text-admin-mute">{p.category}</p>
                    </div>
                    {isMadeToOrder(p) ? (
                      <span className="pb-1">
                        <MadeToOrder />
                      </span>
                    ) : (
                      <StockStepper value={p.stock} product={p} label={`Stock for ${p.name}`} onChange={(n) => saveStock(p, n)} />
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Desktop: table */}
          <div className="mt-2 hidden overflow-hidden rounded-xl border border-admin-line lg:block">
            <table className="w-full text-left text-[14px]">
              <thead className="bg-admin-canvas text-[12.5px] font-semibold text-admin-mute">
                <tr>
                  <th scope="col" className="py-3 pl-4 pr-3 font-semibold">Product</th>
                  <th scope="col" className="px-3 py-3 font-semibold">SKU</th>
                  <th scope="col" className="px-3 py-3 font-semibold">Category</th>
                  <th scope="col" className="px-3 py-3 text-right font-semibold">Price</th>
                  <th scope="col" className="px-3 py-3 font-semibold">Stock</th>
                  <th scope="col" className="py-3 pl-3 pr-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-line">
                {shown.map((p) => (
                  <tr key={p.id} onClick={() => open(p)} className="group cursor-pointer bg-white transition-colors hover:bg-admin-canvas/70">
                    <td className="py-2.5 pl-4 pr-3">
                      <div className="flex items-center gap-3.5">
                        <ProductImage src={p.image} alt="" className="aspect-[4/5] w-12 shrink-0 rounded-md bg-admin-canvas object-cover" />
                        <div className="min-w-0">
                          <Link
                            to={`/admin/products/${p.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="rounded font-semibold leading-snug text-admin-ink group-hover:underline group-hover:decoration-admin-line-strong group-hover:underline-offset-4"
                          >
                            {p.name}
                          </Link>
                          <div className="mt-1 flex items-center gap-1.5">
                            {p.isNew && <Chip>New</Chip>}
                            <StockNote product={p} />
                            {!p.isNew && !isSoldOut(p) && !isLowStock(p) && <span className="truncate text-[13px] text-admin-mute">{p.collection}</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 font-mono text-[12.5px] text-admin-ink/80">{p.sku}</td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-admin-mute">{p.category}</td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-right font-semibold tabular-nums">
                      {isMadeToOrder(p) ? <span className="font-medium text-admin-mute">On request</span> : formatPrice(p.price)}
                    </td>
                    <td className="px-3 py-2">
                      {isMadeToOrder(p) ? (
                        <MadeToOrder />
                      ) : (
                        <StockStepper size="sm" value={p.stock} product={p} label={`Stock for ${p.name}`} onChange={(n) => saveStock(p, n)} />
                      )}
                    </td>
                    <td className="py-2.5 pl-3 pr-4">
                      <StatusBadge status={p.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

function Select({
  id,
  label,
  value,
  onChange,
  children,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={cx(inputCls(), 'cursor-pointer pr-9', value && 'border-couture-gold/70 bg-admin-gold-wash/50')}>
        {children}
      </select>
    </div>
  )
}

function EmptyState({ filtered, query, onClear }: { filtered: boolean; query: string; onClear: () => void }) {
  return (
    <div className="mt-2 flex flex-col items-center rounded-xl border border-dashed border-admin-line-strong px-6 py-14 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-admin-canvas text-admin-mute" aria-hidden>
        <PackageOpen className="size-5" />
      </span>
      {filtered ? (
        <>
          <h2 className="mt-4 text-[16px] font-bold">{query ? `No products match “${query.trim()}”` : 'No products match these filters'}</h2>
          <p className="mt-1.5 max-w-sm text-[14px] text-admin-mute">Check the spelling or SKU, or clear the filters to see everything.</p>
          <button type="button" onClick={onClear} className="mt-5 inline-flex min-h-11 items-center rounded-lg border border-admin-line-strong px-4 text-[14px] font-semibold hover:bg-admin-canvas">
            Clear filters
          </button>
        </>
      ) : (
        <>
          <h2 className="mt-4 text-[16px] font-bold">No products yet</h2>
          <p className="mt-1.5 max-w-sm text-[14px] text-admin-mute">Add your first piece with a photo, price and stock. It goes live in the shop when you set it to Active.</p>
          <Link to="/admin/products/new" className="mt-5 inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-couture-gold px-4 text-[14px] font-semibold text-admin-ink hover:bg-admin-gold-hover">
            <Plus className="size-4" aria-hidden />
            New product
          </Link>
        </>
      )}
    </div>
  )
}
