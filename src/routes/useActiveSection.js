import { useMatches } from 'react-router-dom'

/**
 * Which menu item should be highlighted for the current page.
 * Each route in router.jsx says its section in `handle: { section: '...' }`.
 */
export function useActiveSection() {
  const matches = useMatches()
  const deepest = matches[matches.length - 1]
  return deepest?.handle?.section
}