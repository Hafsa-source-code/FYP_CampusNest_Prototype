// Every page address in the app, in ONE place.
// Never type a URL by hand in a component: use these, so renaming a page
// means changing one line here.
// ":id" parts are filled in with generatePath() from react-router-dom, e.g.
//   generatePath(PATHS.student.hostel, { id: 4 })  →  '/student/hostel/4'

export const PATHS = {
  home: '/',
  login: '/login',
  signup: '/signup',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',

  student: {
    root: '/student',
    search: '/student/search',
    hostel: '/student/hostel/:id',
    room: '/student/hostel/:id/room/:type',
    compare: '/student/compare',
    wishlist: '/student/wishlist',
    inquiries: '/student/inquiries',
    inquiry: '/student/inquiries/:id',
    roommates: '/student/roommates',
    roommateProfile: '/student/roommates/profile',
    community: '/student/community',
    newPost: '/student/community/new',
    post: '/student/community/:id',
    marketItem: '/student/market/:id',
  },

  owner: {
    root: '/owner',
    dashboard: '/owner/dashboard',
    hostels: '/owner/hostels',
    newHostel: '/owner/hostels/new',
    editHostel: '/owner/hostels/:id/edit',
    rooms: '/owner/rooms',
    inquiries: '/owner/inquiries',
    inquiry: '/owner/inquiries/:id',
    reviews: '/owner/reviews',
  },

  admin: {
    root: '/admin',
    moderation: '/admin/moderation',
    users: '/admin/users',
  },
}