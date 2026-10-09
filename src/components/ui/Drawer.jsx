import { cn } from '@/utils/cn'
import { useOverlay } from '@/hooks/useOverlay'
import { IconButton } from './IconButton'

/**
 * Panel that slides in from the left or right (mobile menus, filters).
 * Closes on Esc, on the X button, or by clicking the dark background.
 * bare: no title bar and no padding, so you can fill it yourself (e.g. the navy owner menu)
 * panelClassName: extra classes for the sliding panel (width, background)
 */
export function Drawer({
  open,
  onClose,
  title,
  side = 'left',
  footer,
  bare = false,
  panelClassName,
  children,
}) {
  useOverlay(open, onClose)

  const hiddenPosition = side === 'left' ? '-translate-x-full' : 'translate-x-full'

  return (
    // "invisible" when closed so nothing inside can be reached with Tab,
    // delayed by the transition so the slide-out animation can finish first
    <div
      className={cn(
        'fixed inset-0 z-[90] transition-[visibility] duration-300',
        open ? 'visible' : 'invisible',
      )}
    >
      <div
        onClick={onClose}
        className={cn(
          'absolute inset-0 bg-ink/40 transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0',
        )}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'absolute bottom-0 top-0 flex w-[360px] max-w-[88vw] flex-col bg-surface shadow-pop transition-transform duration-300 ease-out',
          side === 'left' ? 'left-0' : 'right-0',
          open ? 'translate-x-0' : hiddenPosition,
          panelClassName,
        )}
      >
        {bare ? (
          children
        ) : (
          <>
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5">
              <h2 className="text-title font-semibold tracking-tight text-ink">{title}</h2>
              <IconButton icon="x" label="Close" onClick={onClose} />
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-6">{children}</div>
            {footer && <div className="flex shrink-0 gap-2 border-t border-line p-4">{footer}</div>}
          </>
        )}
      </aside>
    </div>
  )
}
