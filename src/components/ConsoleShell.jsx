import { useState } from 'react'
import { useStore } from '../store'
import { navigate, cx } from '../lib'
import { Icon } from './icons'
import { Avatar, Logo, Select, Toaster } from './ui'
import { NotificationsMenu } from './StudentShell'
const ACCENT = 'text-[#5DB7E8]'
export function ConsoleShell({ nav, active, area, children, context }) {
  const { currentUser } = useStore()
  const [drawer, setDrawer] = useState(false)
  const current = nav.find((n) => n.key === active)
  const go = (to) => {
    setDrawer(false)
    navigate(to)
  }
  //  Navy sidebar
  const sidebar = (
    <div className="flex h-full flex-col bg-charcoal text-white">
      <div className="h-16 px-5 flex items-center gap-2.5 border-b border-white/10 shrink-0">
        <Logo inverse onClick={() => go(nav[0].to)} />
        <span className="ml-auto rounded-full bg-white/10 px-2.5 py-1 text-micro font-semibold uppercase tracking-[0.12em] text-brand-200">
          {area}
        </span>
      </div>

      {context && <div className="px-4 pt-5">{context}</div>}

      <p className="px-6 pt-6 pb-2 text-tiny font-semibold uppercase tracking-[0.12em] text-white/40">
        Menu
      </p>
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {nav.map((n) => {
          const on = active === n.key
          return (
            <button
              key={n.key}
              onClick={() => go(n.to)}
              aria-current={on ? 'page' : undefined}
              className={cx(
                'relative w-full flex items-center gap-3 h-11 px-3 rounded-md text-body font-medium transition-colors',
                on ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white',
              )}
            >
              {on && <span className="absolute left-0 inset-y-2 w-1 rounded-r-full bg-[#5DB7E8]" />}
              <Icon name={n.icon} size={18} className={on ? ACCENT : ''} />
              {n.label}
              {!!n.count && (
                <span className="ml-auto h-5 min-w-5 px-1.5 rounded-full bg-brand-700 text-white text-tiny font-semibold leading-5 tabular">
                  {n.count}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      <div className="p-3 border-t border-white/10 shrink-0">
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar name={currentUser.name} size={34} />
          <div className="min-w-0 flex-1">
            <p className="text-body font-semibold truncate">{currentUser.name}</p>
            <p className="text-caption text-white/50 truncate">{currentUser.email}</p>
          </div>
          <button
            onClick={() => navigate('/')}
            aria-label="Log out"
            title="Log out"
            className="h-8 w-8 rounded-full text-white/60 hover:bg-white/10 hover:text-white flex items-center justify-center transition-colors"
          >
            <Icon name="logout" size={16} />
          </button>
        </div>
      </div>
    </div>
  )
  return (
    <div className="min-h-screen bg-canvas lg:pl-[256px]">
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-[256px] z-30">{sidebar}</aside>

      {/*  Top bar  */}
      <header className="sticky top-0 z-20 h-16 bg-surface/95 backdrop-blur border-b border-line">
        <div className="h-full px-4 sm:px-6 lg:px-10 flex items-center gap-3">
          <button
            onClick={() => setDrawer(true)}
            aria-label="Open menu"
            className="lg:hidden -ml-2 h-10 w-10 rounded-full flex items-center justify-center text-ink hover:bg-sunken"
          >
            <Icon name="menu" size={20} />
          </button>
          <div className="lg:hidden">
            <Logo onClick={() => navigate(nav[0].to)} />
          </div>

          <nav
            aria-label="Breadcrumb"
            className="hidden lg:flex items-center gap-1.5 text-small text-muted"
          >
            <Icon
              name={area === 'Admin' ? 'shield' : 'building'}
              size={14}
              className="text-brand-700"
            />
            <span>{area} console</span>
            {current && (
              <>
                <Icon name="chevronRight" size={14} className="text-subtle" />
                <span className="font-semibold text-ink">{current.label}</span>
              </>
            )}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <NotificationsMenu />
            <Avatar name={currentUser.name} size={34} />
          </div>
        </div>
      </header>

      {/*  Mobile drawer  */}
      <div
        className={cx(
          'fixed inset-0 z-50 lg:hidden transition-[visibility] duration-300',
          drawer ? 'visible' : 'invisible',
        )}
      >
        <div
          onClick={() => setDrawer(false)}
          className={cx(
            'absolute inset-0 bg-ink/40 transition-opacity duration-300',
            drawer ? 'opacity-100' : 'opacity-0',
          )}
        />
        <div
          className={cx(
            'absolute left-0 top-0 bottom-0 w-[280px] max-w-[85vw] shadow-pop transition-transform duration-300',
            drawer ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          {sidebar}
        </div>
      </div>

      <main className="px-4 sm:px-6 lg:px-10 pb-8">{children}</main>
      <Toaster />
    </div>
  )
}
/** Owner's property switcher shown at the top of the navy sidebar. */
export function OwnerHostelPicker() {
  const { hostels, currentUser, ownerHostelId, setOwnerHostelId } = useStore()
  const mine = hostels.filter((h) => h.ownerId === currentUser.id && h.status === 'Approved')
  if (mine.length === 0) return null
  return (
    <div>
      <p className="mb-1.5 text-tiny font-semibold uppercase tracking-[0.12em] text-white/50">
        Property
      </p>
      <Select
        value={ownerHostelId}
        onChange={(e) => setOwnerHostelId(Number(e.target.value))}
        icon="building"
      >
        {mine.map((h) => (
          <option key={h.id} value={h.id}>
            {h.name}
          </option>
        ))}
      </Select>
    </div>
  )
}
