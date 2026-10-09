import { Link, useNavigate } from 'react-router-dom'
import { cn } from '@/utils/cn'
import { Icon, IconButton, Logo } from '@/components/ui'
import { PATHS } from '@/routes/paths'

/**
 * Student top bar: logo, main links, shortcuts with counts, then `actions`
 * (bell + account menu) and the phone menu button.
 * links / shortcuts: [{ section, label, icon, to, count? }]
 */
export function StudentNavbar({ links, shortcuts, active, actions, onOpenMobileMenu }) {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur">
      <div className="flex h-16 w-full items-center gap-8 px-4 sm:px-6 lg:px-10 2xl:px-16">
        <Logo size="lg" onClick={() => navigate(PATHS.student.search)} />

        <nav className="hidden h-full items-center gap-1 lg:flex">
          {links.map((link) => {
            const isActive = active === link.section
            return (
              <Link
                key={link.section}
                to={link.to}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'relative flex h-full items-center px-3 text-body-lg font-medium transition-colors',
                  isActive ? 'text-brand-700' : 'text-ink-2 hover:text-ink',
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-brand-700" />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          {shortcuts.map((shortcut) => (
            <Link
              key={shortcut.section}
              to={shortcut.to}
              className={cn(
                'hidden h-10 items-center gap-2 rounded-md px-3 text-body font-medium transition-colors md:inline-flex',
                active === shortcut.section ? 'bg-sunken text-ink' : 'text-ink-2 hover:bg-sunken',
              )}
            >
              <Icon name={shortcut.icon} />
              {shortcut.label}
              {shortcut.count > 0 && (
                <span className="tabular text-caption text-muted">{shortcut.count}</span>
              )}
            </Link>
          ))}

          {actions}

          <IconButton
            icon="menu"
            label="Open menu"
            className="lg:hidden"
            onClick={onOpenMobileMenu}
          />
        </div>
      </div>
    </header>
  )
}
