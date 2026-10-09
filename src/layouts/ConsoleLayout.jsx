import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Avatar, Drawer } from '@/components/ui'
import { ConsoleSidebar } from '@/components/navigation/ConsoleSidebar'
import { ConsoleTopbar } from '@/components/navigation/ConsoleTopbar'
import { NotificationsMenu } from '@/features/notifications/components/NotificationsMenu'
import { useAuth } from '@/hooks/useAuth'
import { useActiveSection } from '@/routes/useActiveSection'

/**
 * Shared frame for the owner AND admin consoles: navy sidebar (a slide-in
 * drawer on phones), top bar, and the current page.
 * area: 'Owner' | 'Admin'
 * links: menu items with counts
 * context: optional element at the top of the sidebar
 */
export function ConsoleLayout({ area, areaIcon, links, context }) {
  const { user } = useAuth()
  const active = useActiveSection()
  const [menuOpen, setMenuOpen] = useState(false)

  const currentLink = links.find((link) => link.section === active)
  const sidebarProps = { area, links, active, context, user }

  return (
    <div className="min-h-screen bg-canvas lg:pl-[256px]">
      {/* Desktop: sidebar always visible */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[256px] lg:block">
        <ConsoleSidebar {...sidebarProps} />
      </aside>

      {/* Phone: the same sidebar inside a slide-in drawer */}
      <Drawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        title={`${area} menu`}
        bare
        panelClassName="w-[280px] max-w-[85vw] lg:hidden"
      >
        <ConsoleSidebar {...sidebarProps} onNavigate={() => setMenuOpen(false)} />
      </Drawer>

      <ConsoleTopbar
        area={area}
        areaIcon={areaIcon}
        pageLabel={currentLink?.label}
        homePath={links[0].to}
        onOpenMenu={() => setMenuOpen(true)}
        actions={
          <>
            <NotificationsMenu />
            <Avatar name={user.name} size={34} />
          </>
        }
      />

      <main className="px-4 pb-8 sm:px-6 lg:px-10">
        <Outlet />
      </main>
    </div>
  )
}
