import { Outlet, ScrollRestoration } from 'react-router-dom'

/**
 * Wraps EVERY page.
 * <Outlet /> = "the current page goes here".
 * <ScrollRestoration /> = new page starts at the top; Back returns to where you were.
 */
export function RootLayout() {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  )
}