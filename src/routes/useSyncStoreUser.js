import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useStore } from '@/store'

// TEMPORARY (deleted in Step 5 with store.jsx): the old demo store keeps its
// own "current user". This keeps it pointing at whoever really logged in.
export function useSyncStoreUser() {
  const { user } = useAuth()
  const { signIn } = useStore()
  const userId = user?.id

  useEffect(() => {
    if (userId) signIn(userId)
  }, [userId, signIn])
}
