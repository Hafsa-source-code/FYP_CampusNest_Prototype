import { Icon } from '@/components/ui/Icon'

/** Shown when a list has nothing in it, e.g. "No saved hostels yet". */
export function EmptyState({ icon = 'inbox', title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sunken text-muted">
        <Icon name={icon} size={22} />
      </div>
      <h3 className="text-body-lg font-semibold text-ink">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-body text-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
