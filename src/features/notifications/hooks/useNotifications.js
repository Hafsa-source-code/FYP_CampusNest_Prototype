import { useAuth } from '@/hooks/useAuth'
import { useStore } from '@/store'
import { navigate } from '@/lib'

/**
 * The logged-in user's notifications + actions on them.
 * Components only use this hook, so when the backend arrives (with SignalR
 * for live updates) only this file changes.
 * TEMPORARY: reads the demo store, and opens links through the old
 * navigate() because the demo data still stores old-style addresses.
 */
export function useNotifications() {
  const { user } = useAuth()
  const { notifications, markAllNotificationsRead, readNotification } = useStore()

  const mine = notifications.filter((notification) => notification.userId === user?.id)

  const open = (notification) => {
    readNotification(notification.id)
    if (notification.link) navigate(notification.link)
  }

  return {
    notifications: mine,
    unreadCount: mine.filter((notification) => notification.unread).length,
    markAllRead: markAllNotificationsRead,
    open,
  }
}
