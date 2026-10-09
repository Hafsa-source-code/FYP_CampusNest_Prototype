import { PATHS } from './paths'

// The menu items for each area, in ONE place.
// `section` must match the `handle.section` of the routes in router.jsx,
// that's how the menu knows which item to highlight.

export const STUDENT_MAIN_NAV = [
  { section: 'search', label: 'Find a hostel', icon: 'search', to: PATHS.student.search },
  { section: 'roommates', label: 'Roommates', icon: 'users', to: PATHS.student.roommates },
  { section: 'community', label: 'Community', icon: 'message', to: PATHS.student.community },
  { section: 'inquiries', label: 'Inquiries', icon: 'inbox', to: PATHS.student.inquiries },
]

// Shown on the right of the top bar with a count (Saved 3, Compare 2)
export const STUDENT_SHORTCUTS = [
  { section: 'wishlist', label: 'Saved', icon: 'heart', to: PATHS.student.wishlist },
  { section: 'compare', label: 'Compare', icon: 'columns', to: PATHS.student.compare },
]

export const STUDENT_ACCOUNT_LINKS = [
  { label: 'Roommate profile', icon: 'user', to: PATHS.student.roommateProfile },
  { label: 'Saved hostels', icon: 'heart', to: PATHS.student.wishlist },
  { label: 'My inquiries', icon: 'message', to: PATHS.student.inquiries },
]

export const OWNER_NAV = [
  { section: 'dashboard', label: 'Overview', icon: 'grid', to: PATHS.owner.dashboard },
  { section: 'inquiries', label: 'Inquiries', icon: 'inbox', to: PATHS.owner.inquiries },
  { section: 'rooms', label: 'Rooms & residents', icon: 'bed', to: PATHS.owner.rooms },
  { section: 'reviews', label: 'Reviews', icon: 'star', to: PATHS.owner.reviews },
  { section: 'hostels', label: 'My hostels', icon: 'building', to: PATHS.owner.hostels },
]

export const ADMIN_NAV = [
  {
    section: 'moderation',
    label: 'Moderation queue',
    icon: 'shieldCheck',
    to: PATHS.admin.moderation,
  },
  { section: 'users', label: 'Users', icon: 'users', to: PATHS.admin.users },
]
