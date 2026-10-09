import { Outlet } from 'react-router-dom'
import { OwnerShell } from '@/components/OwnerShell'
import { useActiveSection } from '@/routes/useActiveSection'

/** Navy side menu + the current hostel-owner page. */
export function OwnerLayout() {
  const section = useActiveSection()

  return (
    <OwnerShell active={section}>
      <Outlet />
    </OwnerShell>
  )
}
