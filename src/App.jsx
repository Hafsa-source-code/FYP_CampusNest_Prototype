import { useEffect } from 'react'
import { useStore } from './store'
import { useRoute, match, navigate } from './lib'
import { StudentShell } from './components/StudentShell'
import { OwnerShell, AdminShell } from './components/OwnerShell'
import { Toaster } from './components/ui'
import { Landing } from './screens/Landing'
import { Login, Signup, ForgotPassword, ResetPassword } from './screens/Auth'
import { HostelSearch } from './screens/HostelSearch'
import { HostelDetail } from './screens/HostelDetail'
import { RoomDetail } from './screens/RoomDetail'
import { Compare } from './screens/Compare'
import { Wishlist } from './screens/Wishlist'
import { MyInquiries } from './screens/MyInquiries'
import { RoommateProfile } from './screens/RoommateProfile'
import { RoommateMatches } from './screens/RoommateMatches'
import { Community } from './screens/Community'
import { CreatePost } from './screens/CreatePost'
import { PostDetail } from './screens/PostDetail'
import { MarketplaceItem } from './screens/MarketplaceItem'
import { OwnerDashboard } from './screens/OwnerDashboard'
import { OwnerMyHostels } from './screens/OwnerMyHostels'
import { OwnerAddHostel } from './screens/OwnerAddHostel'
import { OwnerInquiries } from './screens/OwnerInquiries'
import { OwnerReviews } from './screens/OwnerReviews'
import { OwnerManageRooms } from './screens/OwnerManageRooms'
import { AdminModerationQueue } from './screens/AdminModerationQueue'
import { AdminUsers } from './screens/AdminUsers'
const STUDENT = [
  { pattern: '/s/search', section: 'search', render: () => <HostelSearch /> },
  {
    pattern: '/s/hostel/:id',
    section: 'search',
    render: (p) => <HostelDetail id={Number(p.id)} />,
  },
  {
    pattern: '/s/hostel/:id/room/:type',
    section: 'search',
    render: (p) => <RoomDetail hostelId={Number(p.id)} typeId={Number(p.type)} />,
  },
  { pattern: '/s/compare', section: 'compare', render: () => <Compare /> },
  { pattern: '/s/wishlist', section: 'wishlist', render: () => <Wishlist /> },
  {
    pattern: '/s/inquiries',
    section: 'inquiries',
    render: () => <MyInquiries />,
  },
  {
    pattern: '/s/inquiries/:id',
    section: 'inquiries',
    render: (p) => <MyInquiries selectedId={Number(p.id)} />,
  },
  {
    pattern: '/s/roommates',
    section: 'roommates',
    render: () => <RoommateMatches />,
  },
  {
    pattern: '/s/roommates/profile',
    section: 'roommates',
    render: () => <RoommateProfile />,
  },
  {
    pattern: '/s/community',
    section: 'community',
    render: () => <Community />,
  },
  {
    pattern: '/s/community/new',
    section: 'community',
    render: () => <CreatePost />,
  },
  {
    pattern: '/s/community/:id',
    section: 'community',
    render: (p) => <PostDetail id={Number(p.id)} />,
  },
  {
    pattern: '/s/market/:id',
    section: 'community',
    render: (p) => <MarketplaceItem id={Number(p.id)} />,
  },
]
const OWNER = [
  {
    pattern: '/o/dashboard',
    section: 'dashboard',
    render: () => <OwnerDashboard />,
  },
  {
    pattern: '/o/hostels',
    section: 'hostels',
    render: () => <OwnerMyHostels />,
  },
  {
    pattern: '/o/hostels/new',
    section: 'hostels',
    render: () => <OwnerAddHostel />,
  },
  {
    pattern: '/o/hostels/:id/edit',
    section: 'hostels',
    render: (p) => <OwnerAddHostel editId={Number(p.id)} />,
  },
  { pattern: '/o/rooms', section: 'rooms', render: () => <OwnerManageRooms /> },
  {
    pattern: '/o/inquiries',
    section: 'inquiries',
    render: () => <OwnerInquiries />,
  },
  {
    pattern: '/o/inquiries/:id',
    section: 'inquiries',
    render: (p) => <OwnerInquiries selectedId={Number(p.id)} />,
  },
  { pattern: '/o/reviews', section: 'reviews', render: () => <OwnerReviews /> },
]
const ADMIN = [
  {
    pattern: '/a/moderation',
    section: 'moderation',
    render: () => <AdminModerationQueue />,
  },
  { pattern: '/a/users', section: 'users', render: () => <AdminUsers /> },
]
function find(routes, path) {
  for (const r of routes) {
    const p = match(r.pattern, path)
    if (p) return { route: r, params: p }
  }
  return null
}
export default function App() {
  const { path, query } = useRoute()
  const { currentUser, signIn } = useStore()
  // Keep the signed-in demo account in step with the area being viewed.
  useEffect(() => {
    if (path.startsWith('/s/') && currentUser.role !== 'Student') signIn(1)
    if (path.startsWith('/o/') && currentUser.role !== 'Hostel Owner') signIn(2)
    if (path.startsWith('/a/') && currentUser.role !== 'Admin') signIn(10)
  }, [path, currentUser.role, signIn])
  if (path === '/login')
    return (
      <>
        <Login />
        <Toaster />
      </>
    )
  if (path === '/signup') return <Signup initialRole={query.get('role') ?? undefined} />
  if (path === '/forgot') return <ForgotPassword />
  if (path === '/reset') return <ResetPassword />
  if (path.startsWith('/s/')) {
    const m = find(STUDENT, path)
    if (!m) {
      navigate('/s/search')
      return null
    }
    return <StudentShell active={m.route.section}>{m.route.render(m.params)}</StudentShell>
  }
  if (path.startsWith('/o/')) {
    const m = find(OWNER, path)
    if (!m) {
      navigate('/o/dashboard')
      return null
    }
    return <OwnerShell active={m.route.section}>{m.route.render(m.params)}</OwnerShell>
  }
  if (path.startsWith('/a/')) {
    const m = find(ADMIN, path)
    if (!m) {
      navigate('/a/moderation')
      return null
    }
    return <AdminShell active={m.route.section}>{m.route.render(m.params)}</AdminShell>
  }
  return (
    <>
      <Landing />
      <Toaster />
    </>
  )
}
