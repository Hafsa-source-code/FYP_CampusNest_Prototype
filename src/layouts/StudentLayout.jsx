import { Outlet } from 'react-router-dom'
import { StudentShell } from '@/components/StudentShell'
import { useActiveSection } from '@/routes/useActiveSection'
import { useDemoRole } from '@/routes/useDemoRole'

/** Top menu bar + the current student page under it. */
export function StudentLayout() {
  useDemoRole('Student')
  const section = useActiveSection()

  return (
    <StudentShell active={section}>
      <Outlet />
    </StudentShell>
  )
}