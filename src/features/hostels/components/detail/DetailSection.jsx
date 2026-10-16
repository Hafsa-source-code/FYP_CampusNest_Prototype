/**
 * One section of the hostel page: heading, optional extra on the right (aside), content.
 * scroll-mt keeps the heading visible under the sticky menu + tabs after a tab click.
 */
export function DetailSection({ id, title, aside, children }) {
  return (
    <section id={id} className="scroll-mt-32 border-b border-line py-10 last:border-b-0">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-heading font-semibold leading-tight tracking-tight text-ink">{title}</h2>
        {aside}
      </div>
      {children}
    </section>
  )
}