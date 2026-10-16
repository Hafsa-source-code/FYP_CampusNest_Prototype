import { useEffect, useState } from 'react'

/**
 * Watches page sections while the user scrolls and returns the id of the one
 * currently in view. Used to move the underline on in-page tabs.
 * ids: the section ids, in page order
 */
export function useScrollSpy(ids) {
  const [activeId, setActiveId] = useState(ids[0])
  const idsKey = ids.join(',') // a plain string, so the effect only re-runs if the ids really change

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      // Ignore the area under the sticky menu + tabs, and the bottom half of the screen
      { rootMargin: '-140px 0px -55% 0px' },
    )

    idsKey.split(',').forEach((id) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })
    return () => observer.disconnect()
  }, [idsKey])

  return activeId
}