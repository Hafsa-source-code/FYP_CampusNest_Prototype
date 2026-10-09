import { Outlet } from 'react-router-dom'
import { StudentShell } from '@/components/StudentShell'
import { useActiveSection } from '@/routes/useActiveSection'

/** Top menu bar + the current student page under it. */
export function StudentLayout() {
  const section = useActiveSection()

  return (
    <StudentShell active={section}>
      <Outlet />
    </StudentShell>
  )
}
