import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { PATHS } from '@/routes/paths'

/** Visiting /logout ends the session and goes to the login page. */
export function LogoutPage() {
  const { user, logout } = useAuth()

  useEffect(() => {
    logout()
  }, [logout])

  return user ? null : <Navigate to={PATHS.login} replace />
}
