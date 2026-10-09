import { useAuth } from '@/hooks/useAuth'
import { useStore } from '@/store'

/**
 * The owner's verified hostels, and which one they're currently looking at.
 * TEMPORARY: reads the demo store (which still calls "Verified" "Approved").
 */
export function useOwnerHostels() {
  const { user } = useAuth()
  const { hostels, ownerHostelId, setOwnerHostelId } = useStore()

  const verified = hostels.filter(
    (hostel) => hostel.ownerId === user?.id && hostel.status === 'Approved',
  )

  return { hostels: verified, selectedId: ownerHostelId, select: setOwnerHostelId }
}
