import { Link, useNavigate } from 'react-router-dom'
import { cn } from '@/utils/cn'
import { Avatar, Icon, Logo } from '@/components/ui'
import { PATHS } from '@/routes/paths'

const ACCENT = 'text-[#5DB7E8]'

/**
 * Navy side menu for the owner and admin consoles.
 * area: 'Owner' | 'Admin' (badge beside the logo)
 * links: [{ section, label, icon, to, count? }]
 * context: optional element above the links (e.g. the owner's hostel picker)
 * onNavigate: called after a link is clicked (closes the phone drawer)
 */
export function ConsoleSidebar({ area, links, active, context, user, onNavigate }) {
  const navigate = useNavigate()

  const goTo = (path) => {
    onNavigate?.()
    navigate(path)
  }

  return (
    <div className="flex h-full flex-col bg-charcoal text-white">
      <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-white/10 px-5">
        <Logo inverse onClick={() => goTo(links[0].to)} />
        <span className="ml-auto rounded-full bg-white/10 px-2.5 py-1 text-micro font-semibold uppercase tracking-[0.12em] text-brand-200">
          {area}
        </span>
      </div>

      {context && <div className="px-4 pt-5">{context}</div>}

      <p className="px-6 pb-2 pt-6 text-tiny font-semibold uppercase tracking-[0.12em] text-white/40">
        Menu
      </p>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {links.map((link) => {
          const isActive = active === link.section
          return (
            <Link
              key={link.section}
              to={link.to}
              onClick={onNavigate}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'relative flex h-11 w-full items-center gap-3 rounded-md px-3 text-body font-medium transition-colors',
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-white/70 hover:bg-white/5 hover:text-white',
              )}
            >
              {isActive && (
                <span className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-[#5DB7E8]" />
              )}
              <Icon name={link.icon} size={18} className={isActive ? ACCENT : undefined} />
              {link.label}
              {!!link.count && (
                <span className="tabular ml-auto h-5 min-w-5 rounded-full bg-brand-700 px-1.5 text-tiny font-semibold leading-5 text-white">
                  {link.count}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="shrink-0 border-t border-white/10 p-3">
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar name={user.name} size={34} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-body font-semibold">{user.name}</p>
            <p className="truncate text-caption text-white/50">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={() => goTo(PATHS.logout)}
            aria-label="Log out"
            title="Log out"
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Icon name="logout" />
          </button>
        </div>
      </div>
    </div>
  )
}
