import { useNavigate } from 'react-router-dom'
import { Icon, Logo } from '@/components/ui'

/**
 * White bar at the top of console pages: phone menu button, breadcrumb
 * ("Owner console › Inquiries") and `actions` on the right.
 */
export function ConsoleTopbar({ area, areaIcon, pageLabel, homePath, actions, onOpenMenu }) {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-20 h-16 border-b border-line bg-surface/95 backdrop-blur">
      <div className="flex h-full items-center gap-3 px-4 sm:px-6 lg:px-10">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Open menu"
          className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-sunken lg:hidden"
        >
          <Icon name="menu" size={20} />
        </button>
        <div className="lg:hidden">
          <Logo onClick={() => navigate(homePath)} />
        </div>

        <nav
          aria-label="Breadcrumb"
          className="hidden items-center gap-1.5 text-small text-muted lg:flex"
        >
          <Icon name={areaIcon} size={14} className="text-brand-700" />
          <span>{area} console</span>
          {pageLabel && (
            <>
              <Icon name="chevronRight" size={14} className="text-subtle" />
              <span className="font-semibold text-ink">{pageLabel}</span>
            </>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-2">{actions}</div>
      </div>
    </header>
  )
}
