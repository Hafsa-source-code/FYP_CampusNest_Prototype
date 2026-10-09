import { useLocation } from 'react-router-dom'
import { PATHS } from './routes/paths'

// ═════════════════════════════════════════════════════════════════
// TEMPORARY BRIDGE FILE. Old screens import these; each screen
// switches to the real imports when it's rebuilt in Step 5.
// Delete this whole file when nothing imports it anymore.
// ═════════════════════════════════════════════════════════════════

export { cn as cx } from './utils/cn'
export { formatPrice as rs, getInitials as initials } from './utils/formatters'
export { IMG, HOSTEL_PHOTOS, ROOM_PHOTOS } from './mocks/images'

// ── Old page addresses → new ones ────────────────────────────────
// Old screens still say navigate('/s/search'); the app now lives at
// '/student/search'. These rules translate the old address to the new one.

const RENAMED_PAGES = {
  '/forgot': PATHS.forgotPassword,
  '/reset': PATHS.resetPassword,
}

const RENAMED_AREAS = [
  ['/s/', '/student/'],
  ['/o/', '/owner/'],
  ['/a/', '/admin/'],
]

function toNewAddress(oldAddress) {
  const [path, query] = oldAddress.split('?')
  let newPath = RENAMED_PAGES[path] ?? path
  const area = RENAMED_AREAS.find(([oldStart]) => newPath.startsWith(oldStart))
  if (area) newPath = area[1] + newPath.slice(area[0].length)
  return query ? `${newPath}?${query}` : newPath
}

// ── navigate(): change page from anywhere ─────────────────────────
let routerNavigate = () => {}

/** Called once by routes/router.jsx so navigate() can use React Router. */
export function connectRouter(router) {
  routerNavigate = router.navigate
}

const APP_AREAS = ['/student', '/owner', '/admin']

export function navigate(oldAddress) {
  // The old menus' "Log out" buttons just went to '/'. Inside the app areas,
  // '/' only ever means "log out", so send those clicks to the logout page.
  const insideApp = APP_AREAS.some((area) => window.location.pathname.startsWith(area))
  if (oldAddress === '/' && insideApp) {
    routerNavigate(PATHS.logout)
    return
  }
  routerNavigate(toNewAddress(oldAddress))
}

// ── useRoute(): old way of reading the address bar ────────────────
export function useRoute() {
  const location = useLocation()
  return { path: location.pathname, query: new URLSearchParams(location.search) }
}
