// Tells any page whether the logged-in student has filled in their roommate profile.
// Match scores are only shown once they have (we compare their answers with other students').
// TEMPORARY: reads the demo store; later this comes from the backend.

import { useStore } from '@/store'

export function useRoommateProfile() {
  const { profile } = useStore()
  return { profile, hasProfile: profile.saved }
}