import { SORT_OPTIONS } from '../constants'

// Pure functions: given hostels + filters, return the matching hostels in order.
// No React here, so they're easy to test, and the backend will do the same
// filtering in SQL later (then this file is deleted).

/** Does this hostel have a room type that fits the room-type, AC and rent filters? */
function hasMatchingRoom(roomTypes, filters) {
  const fitting = roomTypes.filter(
    (roomType) =>
      (!filters.acOnly || roomType.ac) &&
      (filters.roomTypes.length === 0 || filters.roomTypes.includes(roomType.type)),
  )
  if (fitting.length === 0) return false

  const cheapest = Math.min(...fitting.map((roomType) => roomType.price))
  const minRent = Number(filters.minRent) || 0
  const maxRent = Number(filters.maxRent) || Infinity
  return cheapest >= minRent && cheapest <= maxRent
}

function matchesText(hostel, text) {
  const search = text.trim().toLowerCase()
  return !search || hostel.name.toLowerCase().includes(search) || hostel.area.toLowerCase().includes(search)
}

/**
 * hostels: list of hostel summaries (each has .roomTypes and .startingPrice)
 * filters: { text, maxDistance, minRent, maxRent, roomTypes, acOnly, gender, facilities, sort }
 */
export function filterHostels(hostels, filters) {
  const matching = hostels.filter(
    (hostel) =>
      hostel.distance <= filters.maxDistance &&
      matchesText(hostel, filters.text) &&
      (filters.gender === 'Any' || hostel.gender === filters.gender) &&
      filters.facilities.every((facility) => hostel.facilities.includes(facility)) &&
      hasMatchingRoom(hostel.roomTypes, filters),
  )
  return sortHostels(matching, filters.sort)
}

const SORTERS = {
  [SORT_OPTIONS.NEAREST]: (a, b) => a.distance - b.distance,
  [SORT_OPTIONS.CHEAPEST]: (a, b) => a.startingPrice - b.startingPrice,
  [SORT_OPTIONS.TOP_RATED]: (a, b) => b.rating - a.rating,
}

export function sortHostels(hostels, sort) {
  return [...hostels].sort(SORTERS[sort])
}