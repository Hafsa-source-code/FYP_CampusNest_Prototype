import { generatePath } from 'react-router-dom'
import { PATHS } from '@/routes/paths'
import { CAMPUS_PARAM } from '../constants'

// Page addresses for the hostel pages. They carry the chosen campus (?uni=...)
// so every page shows distances to the same campus the student picked.

const withCampus = (path, campus) => `${path}?${CAMPUS_PARAM}=${encodeURIComponent(campus)}`

export const searchLink = (campus) => withCampus(PATHS.student.search, campus)

export const hostelLink = (hostelId, campus) =>
  withCampus(generatePath(PATHS.student.hostel, { id: hostelId }), campus)

export const roomLink = (hostelId, roomTypeId, campus) =>
  withCampus(generatePath(PATHS.student.room, { id: hostelId, type: roomTypeId }), campus)