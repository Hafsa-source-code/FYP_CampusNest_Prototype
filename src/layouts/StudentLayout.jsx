import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AccountMenu } from '@/components/navigation/AccountMenu'
import { AppFooter } from '@/components/navigation/AppFooter'
import { MobileNavMenu } from '@/components/navigation/MobileNavMenu'
import { StudentNavbar } from '@/components/navigation/StudentNavbar'
import { useCompare } from '@/features/compare/hooks/useCompare'
import { NotificationsMenu } from '@/features/notifications/components/NotificationsMenu'
import { useWishlist } from '@/features/wishlist/hooks/useWishlist'
import { useAuth } from '@/hooks/useAuth'
import { STUDENT_ACCOUNT_LINKS, STUDENT_MAIN_NAV, STUDENT_SHORTCUTS } from '@/routes/navigation'
import { useActiveSection } from '@/routes/useActiveSection'

/** Student pages: top bar + page + footer. Collects the data the menus need. */
export function StudentLayout() {
  const { user } = useAuth()
  const active = useActiveSection()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const counts = { wishlist: useWishlist().count, compare: useCompare().count }
  const shortcuts = STUDENT_SHORTCUTS.map((shortcut) => ({
    ...shortcut,
    count: counts[shortcut.section],
  }))

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <StudentNavbar
        links={STUDENT_MAIN_NAV}
        shortcuts={shortcuts}
        active={active}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
        actions={
          <>
            <NotificationsMenu />
            <AccountMenu user={user} links={STUDENT_ACCOUNT_LINKS} />
          </>
        }
      />

      <MobileNavMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        links={[...STUDENT_MAIN_NAV, ...shortcuts]}
        active={active}
      />

      <main className="flex-1">
        <Outlet />
      </main>

      <AppFooter />
    </div>
  )
}
