import { cn } from '@/utils/cn'
import { useOverlay } from '@/hooks/useOverlay'
import { IconButton } from './IconButton'

const WIDTHS = { sm: 'max-w-[420px]', md: 'max-w-[520px]', lg: 'max-w-[640px]' }

/**
 * Pop-up dialog in the middle of the screen (slides up from the bottom on phones).
 * Closes on Esc, on the X button, or by clicking the dark background.
 * footer: buttons shown at the bottom (e.g. Cancel / Save)
 */
export function Modal({ open, onClose, title, description, size = 'md', footer, children }) {
  useOverlay(open, onClose)
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative flex max-h-[92vh] w-full flex-col rounded-t-xl bg-surface shadow-pop sm:rounded-xl',
          WIDTHS[size],
        )}
      >
        <div className="flex items-start justify-between gap-4 px-6 pb-4 pt-6">
          <div>
            <h2 className="text-title-sm font-semibold text-ink">{title}</h2>
            {description && <p className="mt-1 text-body text-muted">{description}</p>}
          </div>
          <IconButton icon="x" label="Close" size="sm" onClick={onClose} className="-mr-2 -mt-1" />
        </div>

        {children && <div className="overflow-y-auto px-6 pb-2">{children}</div>}

        {footer && (
          <div className="mt-2 flex flex-col-reverse gap-2 border-t border-line px-6 py-4 sm:flex-row sm:justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
