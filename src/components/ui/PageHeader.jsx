import { Icon } from './Icon'

/**
 * Big page title with optional description, back link, small text above (eyebrow)
 * and action buttons on the right.
 * NOTE: will be merged with PageTitle / ConsoleTitle in Step 3c.
 */
export function PageHeader({ title, description, actions, back, eyebrow }) {
  return (
    <div className="pb-6 pt-8 sm:pb-8 sm:pt-10">
      {back && (
        <button
          type="button"
          onClick={back.onClick}
          className="mb-4 inline-flex items-center gap-1.5 text-small font-medium text-muted transition-colors hover:text-ink"
        >
          <Icon name="arrowLeft" size={14} /> {back.label}
        </button>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          {eyebrow && <div className="mb-2 text-small text-muted">{eyebrow}</div>}
          <h1 className="text-title font-semibold tracking-tight text-ink sm:text-heading">
            {title}
          </h1>
          {description && <p className="mt-1.5 max-w-2xl text-body text-muted">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  )
}
