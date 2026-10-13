import { Icon } from '@/components/ui'

/** Small grey note on the right of a section heading, e.g. "3 room types". */
export function SectionNote({ icon, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-body text-muted">
      {icon && <Icon name={icon} size={14} />}
      {children}
    </span>
  )
}