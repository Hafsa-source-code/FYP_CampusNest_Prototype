/** One titled block inside the filter panel. */
export function FilterSection({ title, children }) {
  return (
    <section className="border-b border-line py-5 first:pt-0 last:border-b-0">
      <h3 className="mb-3 text-body font-semibold text-ink">{title}</h3>
      {children}
    </section>
  )
}
