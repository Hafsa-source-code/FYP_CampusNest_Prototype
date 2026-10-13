// Fixed lists for the hostels feature. They must match the backend's lookup tables.

/** Universities students can search near (the backend's University table). */
export const UNIVERSITIES = ['PU New Campus', 'PU Old Campus']

/** Name of the address-bar value that remembers the chosen campus: /student/search?uni=... */
export const CAMPUS_PARAM = 'uni'

/** Room types, as shown to students → the value stored in the database. */
export const ROOM_TYPE_OPTIONS = [
  { label: 'Single', value: 'Single' },
  { label: '2-seater', value: 'Twin' },
  { label: '3-seater', value: '3-seater' },
  { label: '4+ seater', value: '4-seater+' },
]

export const GENDER_OPTIONS = ['Any', 'Female', 'Male']

/** Facilities students can filter by. */
export const FILTER_FACILITIES = [
  'Wi-Fi',
  'Mess',
  'Generator/UPS',
  'Laundry',
  'Security guard',
  'Parking',
]

export const SORT_OPTIONS = {
  NEAREST: 'Nearest first',
  CHEAPEST: 'Lowest price',
  TOP_RATED: 'Highest rated',
}

export const DISTANCE_LIMITS = { min: 0.5, max: 3, step: 0.5 }

/** Which icon each facility uses. */
export const FACILITY_ICONS = {
  'Wi-Fi': 'wifi',
  Mess: 'utensils',
  'Generator/UPS': 'zap',
  Laundry: 'shirt',
  'Security guard': 'shield',
  CCTV: 'eye',
  Parking: 'parking',
  'Water cooler': 'info',
  'Common study room': 'book',
  'Prayer room': 'home',
}

export const DEFAULT_FACILITY_ICON = 'check'

/** The sections of the hostel detail page, in order. The tabs and the sections share these ids. */
export const DETAIL_SECTIONS = {
  overview: { id: 'overview', label: 'Overview' },
  rooms: { id: 'rooms', label: 'Rooms' },
  location: { id: 'location', label: 'Location' },
  reviews: { id: 'reviews', label: 'Reviews' },
}