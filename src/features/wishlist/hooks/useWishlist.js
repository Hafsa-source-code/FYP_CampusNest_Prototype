import { useStore } from '@/store'

/** The student's saved hostels. TEMPORARY: reads the demo store. */
export function useWishlist() {
  const { wishlistIds, toggleWishlist, clearWishlist } = useStore()

  return {
    ids: wishlistIds,
    count: wishlistIds.length,
    isSaved: (hostelId) => wishlistIds.includes(hostelId),
    toggle: toggleWishlist,
    clear: clearWishlist,
  }
}
