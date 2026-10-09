import { useStore } from '@/store'

/** How many hostels the student has saved. TEMPORARY: reads the demo store. */
export function useWishlistCount() {
  return useStore().wishlistIds.length
}
