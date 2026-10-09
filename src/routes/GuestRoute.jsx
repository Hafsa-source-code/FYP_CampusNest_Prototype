import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { homePathFor } from './roleHome'

/** For login / sign-up pages: someone already logged in goes straight to their home. */
export function GuestRoute() {
  const { user } = useAuth()
  return user ? <Navigate to={homePathFor(user.role)} replace /> : <Outlet />
}
