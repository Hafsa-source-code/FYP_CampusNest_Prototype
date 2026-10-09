import { Outlet } from 'react-router-dom'
import { OwnerShell } from '@/components/OwnerShell'
import { useActiveSection } from '@/routes/useActiveSection'
import { useDemoRole } from '@/routes/useDemoRole'

/** Navy side menu + the current hostel-owner page. */
export function OwnerLayout() {
  useDemoRole('Hostel Owner')
  const section = useActiveSection()

  return (
    <OwnerShell active={section}>
      <Outlet />
    </OwnerShell>
  )
}