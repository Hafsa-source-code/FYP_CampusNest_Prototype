// TEMPORARY BRIDGE: the old Landing and Wishlist screens still use this.
// They pass a raw hostel; the new card needs its summary (price, seats...).
// Delete when Landing and Wishlist are rebuilt.
import { HostelCard as NewHostelCard } from '@/features/hostels/components/HostelCard'
import { useHostelSummary } from '@/features/hostels/hooks/useHostelSummaries'

export function HostelCard({ hostel, compare = true, unavailable = false }) {
  const summary = useHostelSummary(hostel.id)
  if (!summary) return null
  return <NewHostelCard hostel={summary} showCompare={compare} unavailable={unavailable} />
}
