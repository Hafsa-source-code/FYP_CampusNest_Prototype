/** Big heading + one short line under it, used at the top of every auth page. */
export function AuthTitle({ title, children }) {
  return (
    <div>
      <h1 className="text-display-sm font-semibold leading-[1.1] tracking-tight text-ink">
        {title}
      </h1>
      {children && <p className="mt-2 text-body-lg leading-relaxed text-ink-2">{children}</p>}
    </div>
  )
}
