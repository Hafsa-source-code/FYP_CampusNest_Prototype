import { Outlet } from 'react-router-dom'
import { AdminShell } from '@/components/OwnerShell'
import { useActiveSection } from '@/routes/useActiveSection'

/** Navy side menu + the current admin page. */
export function AdminLayout() {
  const section = useActiveSection()

  return (
    <AdminShell active={section}>
      <Outlet />
    </AdminShell>
  )
}
