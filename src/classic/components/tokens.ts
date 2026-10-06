export const ease = [0.22, 1, 0.36, 1] as const

/** Shared focus ring for the classic skin. */
export const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-classic-gold'

/** The live site's gold-outlined pill, used for product actions. */
export const pillButton = `inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-classic-gold px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.16em] text-classic-gold-dark transition-colors duration-300 hover:bg-classic-gold hover:text-white ${focusRing}`
