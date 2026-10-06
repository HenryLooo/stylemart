/** Marks placeholder content so the client never mistakes it for real copy. */
export function Sample({ className = '' }: { className?: string }) {
  return (
    <span
      title="Sample content: to be replaced with real client material"
      className={`inline-flex items-center rounded-full border border-dashed border-current px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.15em] opacity-60 ${className}`}
    >
      Sample
    </span>
  )
}
