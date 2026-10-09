import { useContext } from 'react'
import { AuthContext } from '@/context/AuthContext'

/** Who is logged in + login / register / logout. Usage: const { user, logout } = useAuth() */
export function useAuth() {
  const auth = useContext(AuthContext)
  if (!auth) throw new Error('useAuth must be used inside <AuthProvider>')
  return auth
}
