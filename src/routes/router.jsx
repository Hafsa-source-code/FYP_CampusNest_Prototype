// What this file does:
// The map of the whole app: which web address shows which page, inside which layout,
// and which roles (Student / Owner / Admin) are allowed to open it.

import { Navigate, createBrowserRouter } from 'react-router-dom'
import { PATHS } from './paths'
import { OldScreen } from './OldScreen'
import { ProtectedRoute } from './ProtectedRoute'
import { GuestRoute } from './GuestRoute'
import { ROLES } from '@/utils/constants'
import { connectRouter } from '@/lib'

import { RootLayout } from '@/layouts/RootLayout'
import { StudentLayout } from '@/layouts/StudentLayout'
import { OwnerLayout } from '@/layouts/OwnerLayout'
import { AdminLayout } from '@/layouts/AdminLayout'
import { NotFoundPage } from '@/pages/public/NotFoundPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { SignupPage } from '@/pages/auth/SignupPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage'
import { LogoutPage } from '@/pages/auth/LogoutPage'
import { HostelSearchPage } from '@/pages/student/HostelSearchPage'
import { HostelDetailPage } from '@/pages/student/HostelDetailPage'
import { RoomDetailPage } from '@/pages/student/RoomDetailPage'
import { MyInquiriesPage } from '@/pages/student/MyInquiriesPage'

import { Landing } from '@/screens/Landing'
import { Compare } from '@/screens/Compare'
import { Wishlist } from '@/screens/Wishlist'
import { RoommateMatches } from '@/screens/RoommateMatches'
import { RoommateProfile } from '@/screens/RoommateProfile'
import { Community } from '@/screens/Community'
import { CreatePost } from '@/screens/CreatePost'
import { PostDetail } from '@/screens/PostDetail'
import { MarketplaceItem } from '@/screens/MarketplaceItem'
import { OwnerDashboard } from '@/screens/OwnerDashboard'
import { OwnerMyHostels } from '@/screens/OwnerMyHostels'
import { OwnerAddHostel } from '@/screens/OwnerAddHostel'
import { OwnerManageRooms } from '@/screens/OwnerManageRooms'
import { OwnerInquiries } from '@/screens/OwnerInquiries'
import { OwnerReviews } from '@/screens/OwnerReviews'
import { AdminModerationQueue } from '@/screens/AdminModerationQueue'
import { AdminUsers } from '@/screens/AdminUsers'

// handle.section = which menu item is highlighted on that page.
export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // ── Public pages (no menu) ─────────────────────────────
      { path: PATHS.home, element: <Landing /> },
      { path: PATHS.logout, element: <LogoutPage /> },
      {
        // Only for people NOT logged in; others go to their home page
        element: <GuestRoute />,
        children: [
          { path: PATHS.login, element: <LoginPage /> },
          { path: PATHS.signup, element: <SignupPage /> },
          { path: PATHS.forgotPassword, element: <ForgotPasswordPage /> },
          { path: PATHS.resetPassword, element: <ResetPasswordPage /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },

      // ── Student area ───────────────────────────────────────
      {
        element: <ProtectedRoute allow={[ROLES.STUDENT]} />,
        children: [
          {
            path: PATHS.student.root,
            element: <StudentLayout />,
            children: [
              { index: true, element: <Navigate to={PATHS.student.search} replace /> },
              {
                path: PATHS.student.search,
                handle: { section: 'search' },
                element: <HostelSearchPage />,
              },
              {
                path: PATHS.student.hostel,
                handle: { section: 'search' },
                element: <HostelDetailPage />,
              },
              {
                path: PATHS.student.room,
                handle: { section: 'search' },
                element: <RoomDetailPage />,
              },
              { path: PATHS.student.compare, handle: { section: 'compare' }, element: <Compare /> },
              {
                path: PATHS.student.wishlist,
                handle: { section: 'wishlist' },
                element: <Wishlist />,
              },
              {
                path: PATHS.student.inquiries,
                handle: { section: 'inquiries' },
                element: <MyInquiriesPage />,
              },
              {
                path: PATHS.student.inquiry,
                handle: { section: 'inquiries' },
                element: <MyInquiriesPage />,
              },
              {
                path: PATHS.student.roommates,
                handle: { section: 'roommates' },
                element: <RoommateMatches />,
              },
              {
                path: PATHS.student.roommateProfile,
                handle: { section: 'roommates' },
                element: <RoommateProfile />,
              },
              {
                path: PATHS.student.community,
                handle: { section: 'community' },
                element: <Community />,
              },
              {
                path: PATHS.student.newPost,
                handle: { section: 'community' },
                element: <CreatePost />,
              },
              {
                path: PATHS.student.post,
                handle: { section: 'community' },
                element: <OldScreen render={(p) => <PostDetail id={Number(p.id)} />} />,
              },
              {
                path: PATHS.student.marketItem,
                handle: { section: 'community' },
                element: <OldScreen render={(p) => <MarketplaceItem id={Number(p.id)} />} />,
              },
            ],
          },
        ],
      },

      // ── Hostel owner area ──────────────────────────────────
      {
        element: <ProtectedRoute allow={[ROLES.OWNER]} />,
        children: [
          {
            path: PATHS.owner.root,
            element: <OwnerLayout />,
            children: [
              { index: true, element: <Navigate to={PATHS.owner.dashboard} replace /> },
              {
                path: PATHS.owner.dashboard,
                handle: { section: 'dashboard' },
                element: <OwnerDashboard />,
              },
              {
                path: PATHS.owner.hostels,
                handle: { section: 'hostels' },
                element: <OwnerMyHostels />,
              },
              {
                path: PATHS.owner.newHostel,
                handle: { section: 'hostels' },
                element: <OwnerAddHostel />,
              },
              {
                path: PATHS.owner.editHostel,
                handle: { section: 'hostels' },
                element: <OldScreen render={(p) => <OwnerAddHostel editId={Number(p.id)} />} />,
              },
              {
                path: PATHS.owner.rooms,
                handle: { section: 'rooms' },
                element: <OwnerManageRooms />,
              },
              {
                path: PATHS.owner.inquiries,
                handle: { section: 'inquiries' },
                element: <OwnerInquiries />,
              },
              {
                path: PATHS.owner.inquiry,
                handle: { section: 'inquiries' },
                element: <OldScreen render={(p) => <OwnerInquiries selectedId={Number(p.id)} />} />,
              },
              {
                path: PATHS.owner.reviews,
                handle: { section: 'reviews' },
                element: <OwnerReviews />,
              },
            ],
          },
        ],
      },

      // ── Admin area ─────────────────────────────────────────
      {
        element: <ProtectedRoute allow={[ROLES.ADMIN]} />,
        children: [
          {
            path: PATHS.admin.root,
            element: <AdminLayout />,
            children: [
              { index: true, element: <Navigate to={PATHS.admin.moderation} replace /> },
              {
                path: PATHS.admin.moderation,
                handle: { section: 'moderation' },
                element: <AdminModerationQueue />,
              },
              { path: PATHS.admin.users, handle: { section: 'users' }, element: <AdminUsers /> },
            ],
          },
        ],
      },
    ],
  },
])

// Lets the old screens' navigate('/s/...') calls drive React Router (see lib.jsx)
connectRouter(router)