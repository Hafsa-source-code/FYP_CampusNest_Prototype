import { cn } from '@/utils/cn'

/** One row in the notifications list: blue dot if unread, text, time. */
export function NotificationItem({ notification, onOpen }) {
  const { text, time, unread } = notification

  return (
    <button
      type="button"
      onClick={() => onOpen(notification)}
      className="-mx-1 flex w-full gap-3 rounded-md px-1 py-0.5 text-left hover:bg-sunken"
    >
      <span
        className={cn(
          'mt-1.5 h-2 w-2 shrink-0 rounded-full',
          unread ? 'bg-brand-600' : 'bg-transparent',
        )}
      />
      <span className="min-w-0">
        <span
          className={cn(
            'block text-small leading-snug',
            unread ? 'font-medium text-ink' : 'text-ink-2',
          )}
        >
          {text}
        </span>
        <span className="mt-0.5 block text-caption text-subtle">{time}</span>
      </span>
    </button>
  )
}
