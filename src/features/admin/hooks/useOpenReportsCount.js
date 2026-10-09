import { useStore } from '@/store'

/** How many items wait in the moderation queue. TEMPORARY: reads the demo store. */
export function useOpenReportsCount() {
  return useStore().reports.length
}
