import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AccountMenu } from '@/components/navigation/AccountMenu'
import { AppFooter } from '@/components/navigation/AppFooter'
import { MobileNavMenu } from '@/components/navigation/MobileNavMenu'
import { StudentNavbar } from '@/components/navigation/StudentNavbar'
import { SearchProvider } from '@/components/SearchContext'
import { useCompareCount } from '@/features/compare/hooks/useCompareCount'
import { NotificationsMenu } from '@/features/notifications/components/NotificationsMenu'
import { useWishlistCount } from '@/features/wishlist/hooks/useWishlistCount'
import { useAuth } from '@/hooks/useAuth'
import { STUDENT_ACCOUNT_LINKS, STUDENT_MAIN_NAV, STUDENT_SHORTCUTS } from '@/routes/navigation'
import { useActiveSection } from '@/routes/useActiveSection'

/** Student pages: top bar + page + footer. Collects the data the menus need. */
export function StudentLayout() {
  const { user } = useAuth()
  const active = useActiveSection()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const counts = { wishlist: useWishlistCount(), compare: useCompareCount() }
  const shortcuts = STUDENT_SHORTCUTS.map((shortcut) => ({
    ...shortcut,
    count: counts[shortcut.section],
  }))

  return (
    // SearchProvider: TEMPORARY, the old search screen still reads its text from here
    <SearchProvider>
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
    </SearchProvider>
  )
}
