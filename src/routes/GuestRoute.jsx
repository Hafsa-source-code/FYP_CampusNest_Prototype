import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { homePathFor } from './roleHome'


/** For login / sign-up pages: someone already logged in goes straight to their home. */
// export function GuestRoute() {
//   const { user } = useAuth()
//   return user ? <Navigate to={homePathFor(user.role)} replace /> : <Outlet />
// }
export function GuestRoute() {
  const { user } = useAuth()
  const location = useLocation()

  // Keep the demo role-selection page accessible.
  if (location.pathname === '/login') {
    return <Outlet />
  }
  else if (location.pathname === '/signup') {
    return <Outlet />
  }


  return user ? <Navigate to={homePathFor(user.role)} replace /> : <Outlet />}