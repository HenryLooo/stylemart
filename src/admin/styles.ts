import type { Status } from '../shared/catalog/types'

/** Focus style shared by every admin surface (pages and portalled dialogs) */
export const FOCUS =
  '[&_:focus-visible]:outline-2 [&_:focus-visible]:outline-offset-2 [&_:focus-visible]:outline-couture-gold'

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

export const STATUS_LABEL: Record<Status, string> = { active: 'Live', draft: 'Draft', archived: 'Archived' }

export const inputCls = (invalid?: boolean) =>
  cx(
    'block w-full rounded-lg border bg-white px-3.5 text-base text-admin-ink sm:text-[15px] placeholder:text-neutral-400 transition-[border-color,box-shadow]',
    'min-h-11 focus:outline-none focus:ring-3',
    invalid
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/15'
      : 'border-admin-line-strong hover:border-neutral-400 focus:border-couture-gold focus:ring-couture-gold/20',
    'disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-400',
  )
