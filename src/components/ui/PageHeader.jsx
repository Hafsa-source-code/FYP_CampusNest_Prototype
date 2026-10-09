import { Icon } from './Icon'
import { IconCircle } from './IconCircle'

/**
 * The title block at the top of every page.
 * icon: optional icon in a dark circle beside the title
 * description: one line under the title
 * actions: buttons on the right
 * back: { label, onClick } shows a "← label" link above the title
 * eyebrow: small text above the title
 */
export function PageHeader({ icon, title, description, actions, back, eyebrow }) {
  return (
    <div className="pb-5 pt-6">
      {back && (
        <button
          type="button"
          onClick={back.onClick}
          className="mb-4 inline-flex items-center gap-1.5 text-small font-medium text-muted transition-colors hover:text-ink"
        >
          <Icon name="arrowLeft" size={14} /> {back.label}
        </button>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          {icon && <IconCircle icon={icon} tone="solid" />}
          <div className="min-w-0">
            {eyebrow && <div className="mb-1 text-small text-muted">{eyebrow}</div>}
            <h1 className="text-title font-semibold tracking-tight text-ink sm:text-heading">
              {title}
            </h1>
            {description && <p className="max-w-2xl text-small text-muted">{description}</p>}
          </div>
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  )
}
