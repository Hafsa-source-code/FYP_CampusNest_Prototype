import { Outlet, ScrollRestoration } from 'react-router-dom'
import { Toaster } from '@/components/feedback'
import { useSyncStoreUser } from '@/routes/useSyncStoreUser'

/**
 * Wraps EVERY page.
 * <Outlet /> = "the current page goes here".
 * <ScrollRestoration /> = new page starts at the top; Back returns to where you were.
 * <Toaster /> = the one place toast messages appear, on every page.
 */
export function RootLayout() {
  useSyncStoreUser() // TEMPORARY, see that file

  return (
    <>
      <ScrollRestoration />
      <Outlet />
      <Toaster />
    </>
  )
}
