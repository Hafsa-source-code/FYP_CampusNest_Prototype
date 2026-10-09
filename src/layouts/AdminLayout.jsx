import { Outlet } from 'react-router-dom'
import { AdminShell } from '@/components/OwnerShell'
import { useActiveSection } from '@/routes/useActiveSection'
import { useDemoRole } from '@/routes/useDemoRole'

/** Navy side menu + the current admin page. */
export function AdminLayout() {
  useDemoRole('Admin')
  const section = useActiveSection()

  return (
    <AdminShell active={section}>
      <Outlet />
    </AdminShell>
  )
}