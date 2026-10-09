import { createContext, useCallback, useMemo, useState } from 'react'
import * as authApi from '@/features/auth/api/authApi'
import { clearSession, loadSession, saveSession } from '@/features/auth/utils/sessionStorage'

/**
 * Remembers WHO is logged in, for the whole app.
 * Any component can read it with:  const { user, login, logout } = useAuth()
 */
export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Start with whoever was saved last time (so refresh keeps you logged in)
  const [session, setSession] = useState(loadSession)

  const startSession = useCallback((newSession) => {
    saveSession(newSession)
    setSession(newSession)
    return newSession.user
  }, [])

  const login = useCallback(
    async (email, password) => startSession(await authApi.login(email, password)),
    [startSession],
  )

  const register = useCallback(
    async (details) => startSession(await authApi.register(details)),
    [startSession],
  )

  const logout = useCallback(() => {
    clearSession()
    setSession(null)
  }, [])

  const value = useMemo(
    () => ({ user: session?.user ?? null, token: session?.token ?? null, login, register, logout }),
    [session, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
