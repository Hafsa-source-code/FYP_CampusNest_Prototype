import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'
import { Drawer, Icon } from '@/components/ui'

/**
 * Phone menu: slides in from the right with every link.
 * links: [{ section, label, icon, to, count? }]
 */
export function MobileNavMenu({ open, onClose, links, active }) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Menu"
      side="right"
      panelClassName="w-[300px] max-w-[85vw]"
    >
      <nav className="-mx-2 -my-3 space-y-0.5">
        {links.map((link) => (
          <Link
            key={link.section}
            to={link.to}
            onClick={onClose}
            className={cn(
              'flex h-11 w-full items-center gap-3 rounded-md px-3 text-body font-medium',
              active === link.section ? 'bg-sunken text-ink' : 'text-ink-2 hover:bg-sunken',
            )}
          >
            <Icon name={link.icon} size={17} className="text-muted" />
            {link.label}
            {link.count > 0 && (
              <span className="ml-auto text-caption text-muted">{link.count}</span>
            )}
          </Link>
        ))}
      </nav>
    </Drawer>
  )
}
