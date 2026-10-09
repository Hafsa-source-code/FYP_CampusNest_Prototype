import { Outlet, ScrollRestoration } from 'react-router-dom'
import { useSyncStoreUser } from '@/routes/useSyncStoreUser'

/**
 * Wraps EVERY page.
 * <Outlet /> = "the current page goes here".
 * <ScrollRestoration /> = new page starts at the top; Back returns to where you were.
 */
export function RootLayout() {
  useSyncStoreUser() // TEMPORARY, see that file

  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  )
}
