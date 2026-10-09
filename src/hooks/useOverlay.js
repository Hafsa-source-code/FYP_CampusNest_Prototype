import { useEffect } from 'react'

/**
 * Shared behaviour for anything that covers the page (Modal, Drawer):
 * - pressing Esc calls onClose
 * - the page behind stops scrolling while it's open
 */
export function useOverlay(open, onClose) {
  useEffect(() => {
    if (!open) return

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', closeOnEscape)
    document.body.style.overflow = 'hidden'

    // Cleanup: runs when the overlay closes or the component disappears
    return () => {
      window.removeEventListener('keydown', closeOnEscape)
      document.body.style.overflow = ''
    }
  }, [open, onClose])
}
