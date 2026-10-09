import { useStore } from '../store'
import { ConsoleShell, OwnerHostelPicker } from './ConsoleShell'
export function OwnerShell({ active, children }) {
  const { inquiries, hostels, currentUser, reviews } = useStore()
  const myHostelIds = hostels.filter((h) => h.ownerId === currentUser.id).map((h) => h.id)
  const pending = inquiries.filter(
    (i) => myHostelIds.includes(i.hostelId) && i.status === 'Pending',
  ).length
  const unreplied = reviews.filter((r) => myHostelIds.includes(r.hostelId) && !r.reply).length
  return (
    <ConsoleShell
      area="Owner"
      active={active}
      context={<OwnerHostelPicker />}
      nav={[
        {
          key: 'dashboard',
          label: 'Overview',
          icon: 'grid',
          to: '/o/dashboard',
        },
        {
          key: 'inquiries',
          label: 'Inquiries',
          icon: 'inbox',
          to: '/o/inquiries',
          count: pending,
        },
        {
          key: 'rooms',
          label: 'Rooms & residents',
          icon: 'bed',
          to: '/o/rooms',
        },
        {
          key: 'reviews',
          label: 'Reviews',
          icon: 'star',
          to: '/o/reviews',
          count: unreplied,
        },
        {
          key: 'hostels',
          label: 'My hostels',
          icon: 'building',
          to: '/o/hostels',
        },
      ]}
    >
      {children}
    </ConsoleShell>
  )
}
export function AdminShell({ active, children }) {
  const { reports } = useStore()
  return (
    <ConsoleShell
      area="Admin"
      active={active}
      nav={[
        {
          key: 'moderation',
          label: 'Moderation queue',
          icon: 'shieldCheck',
          to: '/a/moderation',
          count: reports.length,
        },
        { key: 'users', label: 'Users', icon: 'users', to: '/a/users' },
      ]}
    >
      {children}
    </ConsoleShell>
  )
}
