import { useNavigate } from 'react-router-dom'
import { Avatar, Menu } from '@/components/ui'
import { PATHS } from '@/routes/paths'

/**
 * Avatar button that opens: name + email, quick links, Log out.
 * links: [{ label, icon, to }]
 */
export function AccountMenu({ user, links = [] }) {
  const navigate = useNavigate()

  const items = [
    {
      header: (
        <div>
          <p className="text-body font-semibold text-ink">{user.name}</p>
          <p className="text-small text-muted">{user.email}</p>
        </div>
      ),
    },
    'divider',
    ...links.map((link) => ({
      label: link.label,
      icon: link.icon,
      onClick: () => navigate(link.to),
    })),
    ...(links.length ? ['divider'] : []),
    { label: 'Log out', icon: 'logout', danger: true, onClick: () => navigate(PATHS.logout) },
  ]

  return (
    <Menu
      width={240}
      items={items}
      trigger={(_, toggle) => (
        <button
          type="button"
          onClick={toggle}
          className="ml-1 rounded-full"
          aria-label="Account menu"
        >
          <Avatar name={user.name} size={34} />
        </button>
      )}
    />
  )
}
