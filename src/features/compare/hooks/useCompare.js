import { useStore } from '@/store'
import { MAX_COMPARE } from '../constants'

/** Hostels picked for side-by-side comparison. TEMPORARY: reads the demo store. */
export function useCompare() {
  const { compareIds, toggleCompare } = useStore()

  return {
    ids: compareIds,
    count: compareIds.length,
    isFull: compareIds.length >= MAX_COMPARE,
    isComparing: (hostelId) => compareIds.includes(hostelId),
    /** Returns false if the list is already full. */
    toggle: toggleCompare,
  }
}
