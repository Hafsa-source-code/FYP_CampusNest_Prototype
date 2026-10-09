import { Outlet } from 'react-router-dom'
import { Toaster } from '@/components/feedback'

/** Pages with no app menu: landing, login, signup, password reset, 404. */
export function PublicLayout() {
  return (
    <>
      <Outlet />
      <Toaster />
    </>
  )
}