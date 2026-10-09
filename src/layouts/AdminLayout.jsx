import { useOpenReportsCount } from '@/features/admin/hooks/useOpenReportsCount'
import { ADMIN_NAV } from '@/routes/navigation'
import { ConsoleLayout } from './ConsoleLayout'

/** Admin console: the shared console frame + admin menu with counts. */
export function AdminLayout() {
  const counts = { moderation: useOpenReportsCount() }
  const links = ADMIN_NAV.map((link) => ({ ...link, count: counts[link.section] }))

  return <ConsoleLayout area="Admin" areaIcon="shield" links={links} />
}
