import { IconButton, Menu } from '@/components/ui'
import { useNotifications } from '../hooks/useNotifications'
import { NotificationItem } from './NotificationItem'

const MAX_SHOWN = 6

/** Bell icon with unread count; opens the latest notifications. */
export function NotificationsMenu() {
  const { notifications, unreadCount, markAllRead, open } = useNotifications()

  const header = {
    header: (
      <div className="flex items-center justify-between">
        <span className="text-body font-semibold text-ink">Notifications</span>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            className="text-small font-medium text-brand-600 hover:text-brand-800"
          >
            Mark all as read
          </button>
        )}
      </div>
    ),
  }

  const rows = notifications.length
    ? notifications.slice(0, MAX_SHOWN).map((notification) => ({
        header: <NotificationItem notification={notification} onOpen={open} />,
      }))
    : [{ header: <p className="py-2 text-small text-muted">You're all caught up.</p> }]

  return (
    <Menu
      width={340}
      trigger={(_, toggle) => (
        <IconButton icon="bell" label="Notifications" onClick={toggle} badge={unreadCount} />
      )}
      items={[header, 'divider', ...rows]}
    />
  )
}
