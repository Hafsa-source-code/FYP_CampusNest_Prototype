import { useState } from 'react'
import { useStore } from '../store'
import { navigate, cx } from '../lib'
import { Icon } from './icons'
import { SearchProvider } from './SearchContext'
import { Avatar, IconButton, Logo, Menu, Toaster } from './ui'
const NAV = [
  { key: 'search', label: 'Find a hostel', to: '/s/search' },
  { key: 'roommates', label: 'Roommates', to: '/s/roommates' },
  { key: 'community', label: 'Community', to: '/s/community' },
  { key: 'inquiries', label: 'Inquiries', to: '/s/inquiries' },
]
export function NotificationsMenu() {
  const { notifications, currentUser, markAllNotificationsRead, readNotification } = useStore()
  const mine = notifications.filter((n) => n.userId === currentUser.id)
  const unread = mine.filter((n) => n.unread).length
  return (
    <Menu
      width={340}
      trigger={(_, toggle) => (
        <IconButton icon="bell" label="Notifications" onClick={toggle} badge={unread} />
      )}
      items={[
        {
          header: (
            <div className="flex items-center justify-between">
              <span className="text-body font-semibold text-ink">Notifications</span>
              {unread > 0 && (
                <button
                  onClick={markAllNotificationsRead}
                  className="text-small font-medium text-brand-600 hover:text-brand-800"
                >
                  Mark all as read
                </button>
              )}
            </div>
          ),
        },
        'divider',
        ...(mine.length
          ? mine.slice(0, 6).map((n) => ({
              header: (
                <button
                  onClick={() => {
                    readNotification(n.id)
                    if (n.link) navigate(n.link)
                  }}
                  className="w-full text-left flex gap-3 -mx-1 px-1 py-0.5 rounded-md hover:bg-sunken"
                >
                  <span
                    className={cx(
                      'mt-1.5 h-2 w-2 rounded-full shrink-0',
                      n.unread ? 'bg-brand-600' : 'bg-transparent',
                    )}
                  />
                  <span className="min-w-0">
                    <span
                      className={cx(
                        'block text-small leading-snug',
                        n.unread ? 'text-ink font-medium' : 'text-ink-2',
                      )}
                    >
                      {n.text}
                    </span>
                    <span className="block text-caption text-subtle mt-0.5">{n.time}</span>
                  </span>
                </button>
              ),
            }))
          : [
              {
                header: <p className="text-small text-muted py-2">You're all caught up.</p>,
              },
            ]),
      ]}
    />
  )
}
export function StudentShell({ active, children }) {
  const { currentUser, compareIds, wishlistIds } = useStore()
  const [drawer, setDrawer] = useState(false)
  const secondary = [
    {
      key: 'wishlist',
      label: 'Saved',
      icon: 'heart',
      to: '/s/wishlist',
      count: wishlistIds.length,
    },
    {
      key: 'compare',
      label: 'Compare',
      icon: 'columns',
      to: '/s/compare',
      count: compareIds.length,
    },
  ]
  return (
    <SearchProvider>
      <div className="min-h-screen bg-canvas flex flex-col">
        <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur border-b border-line">
          <div className="w-full px-4 sm:px-6 lg:px-10 2xl:px-16 h-16 flex items-center gap-8">
            <Logo onClick={() => navigate('/s/search')} size="lg" />{' '}
            <nav className="hidden lg:flex items-center gap-1 h-full">
              {NAV.map((n) => (
                <button
                  key={n.key}
                  onClick={() => navigate(n.to)}
                  className={cx(
                    'relative h-full px-3 text-body-lg font-medium transition-colors',
                    active === n.key ? 'text-brand-700' : 'text-ink-2 hover:text-ink',
                  )}
                >
                  {n.label}
                  {active === n.key && (
                    <span className="absolute left-3 right-3 bottom-0 h-0.5 bg-brand-700 rounded-full" />
                  )}
                </button>
              ))}
            </nav>
            <div className="ml-auto flex items-center gap-1">
              {' '}
              {secondary.map((s) => (
                <button
                  key={s.key}
                  onClick={() => navigate(s.to)}
                  className={cx(
                    'hidden md:inline-flex items-center gap-2 h-10 px-3 rounded-md text-body font-medium transition-colors',
                    active === s.key ? 'bg-sunken text-ink' : 'text-ink-2 hover:bg-sunken',
                  )}
                >
                  <Icon name={s.icon} size={16} />
                  {s.label}
                  {s.count > 0 && (
                    <span className="text-caption text-muted tabular">{s.count}</span>
                  )}
                </button>
              ))}
              <NotificationsMenu />
              <Menu
                width={240}
                trigger={(_, toggle) => (
                  <button onClick={toggle} className="ml-1 rounded-full" aria-label="Account menu">
                    <Avatar name={currentUser.name} size={34} />
                  </button>
                )}
                items={[
                  {
                    header: (
                      <div>
                        <p className="text-body font-semibold text-ink">{currentUser.name}</p>
                        <p className="text-small text-muted">{currentUser.email}</p>
                      </div>
                    ),
                  },
                  'divider',
                  {
                    label: 'Roommate profile',
                    icon: 'user',
                    onClick: () => navigate('/s/roommates/profile'),
                  },
                  {
                    label: 'Saved hostels',
                    icon: 'heart',
                    onClick: () => navigate('/s/wishlist'),
                  },
                  {
                    label: 'My inquiries',
                    icon: 'message',
                    onClick: () => navigate('/s/inquiries'),
                  },
                  'divider',
                  {
                    label: 'Log out',
                    icon: 'logout',
                    onClick: () => navigate('/'),
                    danger: true,
                  },
                ]}
              />
              <IconButton
                icon="menu"
                label="Open menu"
                className="lg:hidden"
                onClick={() => setDrawer(true)}
              />
            </div>
          </div>
        </header>

        {drawer && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-ink/40" onClick={() => setDrawer(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-[300px] max-w-[85vw] bg-surface shadow-pop flex flex-col">
              <div className="h-16 px-4 flex items-center justify-between border-b border-line">
                <Logo
                  onClick={() => {
                    setDrawer(false)
                    navigate('/s/search')
                  }}
                />
                <IconButton icon="x" label="Close menu" onClick={() => setDrawer(false)} />
              </div>
              <nav className="p-3 space-y-0.5">
                {[
                  ...NAV.map((n) => ({
                    ...n,
                    icon:
                      n.key === 'search'
                        ? 'search'
                        : n.key === 'roommates'
                          ? 'users'
                          : n.key === 'community'
                            ? 'message'
                            : 'inbox',
                    count: 0,
                  })),
                  ...secondary,
                ].map((n) => (
                  <button
                    key={n.key}
                    onClick={() => {
                      setDrawer(false)
                      navigate(n.to)
                    }}
                    className={cx(
                      'w-full flex items-center gap-3 h-11 px-3 rounded-md text-body font-medium',
                      active === n.key ? 'bg-sunken text-ink' : 'text-ink-2 hover:bg-sunken',
                    )}
                  >
                    <Icon name={n.icon} size={17} className="text-muted" />
                    {n.label}
                    {n.count > 0 && (
                      <span className="ml-auto text-caption text-muted">{n.count}</span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}

        <main className="flex-1">{children}</main>

        <footer className="border-t border-line bg-surface">
          <div className="w-full px-4 sm:px-6 lg:px-10 2xl:px-16 py-3 flex flex-col sm:flex-row gap-2 items-center justify-between text-caption text-muted">
            <span>© 2026 CampusNest · Lahore</span>
            <span className="flex gap-5">
              <a className="hover:text-ink" href="#/">
                Help centre
              </a>
              <a className="hover:text-ink" href="#/">
                Safety
              </a>
              <a className="hover:text-ink" href="#/">
                Terms
              </a>
            </span>
          </div>
        </footer>
        <Toaster />
      </div>
    </SearchProvider>
  )
}
