import { useEffect } from 'react'
import { useStore } from '@/store'

// TEMPORARY (removed in Step 4b when real login + AuthContext arrive):
// switches the demo account to match the area you open, exactly like the
// prototype did, so /owner pages show an owner and /admin shows an admin.
const DEMO_USER_ID = { Student: 1, 'Hostel Owner': 2, Admin: 10 }

export function useDemoRole(role) {
  const { currentUser, signIn } = useStore()

  useEffect(() => {
    if (currentUser.role !== role) signIn(DEMO_USER_ID[role])
  }, [currentUser.role, role, signIn])
}