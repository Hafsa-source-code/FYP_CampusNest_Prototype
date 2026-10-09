import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { PATHS } from './paths'
import { homePathFor } from './roleHome'

/**
 * Guards a group of pages.
 * - Not logged in      → sent to login (and brought back here after logging in)
 * - Wrong role         → sent to their own home (a student can't open /owner)
 * - Allowed            → the page shows
 * NOTE: this only hides pages. The backend must ALSO check the role on every
 * request, because anyone can call the API directly.
 */
export function ProtectedRoute({ allow }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) return <Navigate to={PATHS.login} replace state={{ from: location.pathname }} />
  if (!allow.includes(user.role)) return <Navigate to={homePathFor(user.role)} replace />
  return <Outlet />
}
