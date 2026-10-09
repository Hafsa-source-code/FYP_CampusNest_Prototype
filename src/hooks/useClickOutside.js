import { useEffect } from 'react'

/**
 * Calls onOutsideClick when the user clicks anywhere outside `ref`.
 * Only listens while `active` is true (e.g. while a menu is open).
 */
export function useClickOutside(ref, onOutsideClick, active = true) {
  useEffect(() => {
    if (!active) return

    const handleMouseDown = (event) => {
      if (ref.current && !ref.current.contains(event.target)) onOutsideClick()
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [ref, onOutsideClick, active])
}
