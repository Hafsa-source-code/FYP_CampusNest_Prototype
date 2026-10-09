import { OwnerHostelPicker } from '@/features/owner-listings/components/OwnerHostelPicker'
import { useOwnerNavCounts } from '@/features/owner-listings/hooks/useOwnerNavCounts'
import { OWNER_NAV } from '@/routes/navigation'
import { ConsoleLayout } from './ConsoleLayout'

/** Hostel-owner console: the shared console frame + owner menu with counts. */
export function OwnerLayout() {
  const counts = useOwnerNavCounts()
  const links = OWNER_NAV.map((link) => ({ ...link, count: counts[link.section] }))

  return (
    <ConsoleLayout area="Owner" areaIcon="building" links={links} context={<OwnerHostelPicker />} />
  )
}
