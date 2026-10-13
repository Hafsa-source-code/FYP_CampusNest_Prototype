import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DISTANCE_LIMITS, ROOM_TYPE_OPTIONS, SORT_OPTIONS, UNIVERSITIES } from '../constants'
import { filterHostels } from '../utils/filterHostels'
import { useVerifiedHostels } from './useHostelSummaries'

const EMPTY_FILTERS = {
  maxDistance: DISTANCE_LIMITS.max,
  minRent: '',
  maxRent: '',
  roomTypes: [],
  acOnly: false,
  gender: 'Any',
  facilities: [],
}

/** Adds the value if missing, removes it if present. */
const toggleIn = (list, value) =>
  list.includes(value) ? list.filter((item) => item !== value) : [...list, value]

function rentLabel(min, max) {
  if (min && max) return `Rs ${min}–${max}`
  return min ? `From Rs ${min}` : `Up to Rs ${max}`
}

/**
 * Everything the search page needs: the campus, search text, filters,
 * sort, the matching hostels, and the "active filter" chips.
 * The landing page can pre-fill campus and max rent: /student/search?uni=...&max=...
 */
export function useHostelSearch() {
  const [query] = useSearchParams()
  const hostels = useVerifiedHostels()

  const [university, setUniversity] = useState(query.get('uni') ?? UNIVERSITIES[0])
  const [text, setText] = useState('')
  const [sort, setSort] = useState(SORT_OPTIONS.NEAREST)
  const [filters, setFilters] = useState({ ...EMPTY_FILTERS, maxRent: query.get('max') ?? '' })

  const setFilter = (name, value) => setFilters((current) => ({ ...current, [name]: value }))
  const toggleFilter = (name, value) =>
    setFilters((current) => ({ ...current, [name]: toggleIn(current[name], value) }))
  const clearFilters = () => setFilters(EMPTY_FILTERS)

  const results = useMemo(
    () => filterHostels(hostels, { ...filters, text, sort }),
    [hostels, filters, text, sort],
  )

  // Each active filter becomes a chip the student can remove with one click
  const { maxDistance, minRent, maxRent, roomTypes, acOnly, gender, facilities } = filters
  const chips = [
    maxDistance !== EMPTY_FILTERS.maxDistance && {
      label: `Within ${maxDistance} km`,
      remove: () => setFilter('maxDistance', EMPTY_FILTERS.maxDistance),
    },
    (minRent || maxRent) && {
      label: rentLabel(minRent, maxRent),
      remove: () => setFilters((current) => ({ ...current, minRent: '', maxRent: '' })),
    },
    ...roomTypes.map((type) => ({
      label: ROOM_TYPE_OPTIONS.find((option) => option.value === type).label,
      remove: () => toggleFilter('roomTypes', type),
    })),
    acOnly && { label: 'AC only', remove: () => setFilter('acOnly', false) },
    gender !== 'Any' && { label: `${gender} hostels`, remove: () => setFilter('gender', 'Any') },
    ...facilities.map((facility) => ({ label: facility, remove: () => toggleFilter('facilities', facility) })),
  ].filter(Boolean)

  return {
    university,
    setUniversity,
    text,
    setText,
    sort,
    setSort,
    filters,
    setFilter,
    toggleFilter,
    clearFilters,
    chips,
    results,
  }
}