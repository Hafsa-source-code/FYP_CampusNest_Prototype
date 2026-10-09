import { useStore } from '@/store'

/** How many hostels are picked for comparing. TEMPORARY: reads the demo store. */
export function useCompareCount() {
  return useStore().compareIds.length
}
