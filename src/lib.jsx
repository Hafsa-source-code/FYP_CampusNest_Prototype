import { useEffect, useState } from 'react'

// ─────────────────────────────────────────────────────────────
// TEMPORARY BRIDGE: old imports pass through to the new files.
// Screens still import from here; each one switches to the new
// path when we move it. Delete this whole section when unused.
// ─────────────────────────────────────────────────────────────
export { cn as cx } from './utils/cn'
export { formatPrice as rs, getInitials as initials } from './utils/formatters'
export { IMG, HOSTEL_PHOTOS, ROOM_PHOTOS } from './mocks/images'

// ─────────────────────────────────────────────────────────────
// OLD HASH ROUTER: replaced by React Router in Step 4.
// ─────────────────────────────────────────────────────────────
function readHash() {
  const raw = window.location.hash.replace(/^#/, '') || '/'
  const [path, query = ''] = raw.split('?')
  return { path: path || '/', query: new URLSearchParams(query) }
}

export function useRoute() {
  const [route, setRoute] = useState(readHash)
  useEffect(() => {
    const onChange = () => {
      setRoute(readHash())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}

export function navigate(to) {
  if (window.location.hash.replace(/^#/, '') === to) return
  window.location.hash = to
}

/** Match "/s/hostel/:id" against "/s/hostel/4" → { id: '4' } */
export function match(pattern, path) {
  const p = pattern.split('/').filter(Boolean)
  const a = path.split('/').filter(Boolean)
  if (p.length !== a.length) return null
  const params = {}
  for (let i = 0; i < p.length; i++) {
    if (p[i].startsWith(':')) params[p[i].slice(1)] = decodeURIComponent(a[i])
    else if (p[i] !== a[i]) return null
  }
  return params
}
