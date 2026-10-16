import { useSearchParams } from 'react-router-dom'
import { CAMPUS_PARAM, UNIVERSITIES } from '../constants'

/**
 * The campus the student is searching near. It lives in the address bar (?uni=...),
 * so the search page, the hostel page and the back button all agree on it.
 */
export function useCampus() {
  const [query, setQuery] = useSearchParams()
  const fromAddress = query.get(CAMPUS_PARAM)
  const campus = UNIVERSITIES.includes(fromAddress) ? fromAddress : UNIVERSITIES[0]

  const setCampus = (name) =>
    setQuery(
      (current) => {
        const next = new URLSearchParams(current)
        next.set(CAMPUS_PARAM, name)
        return next
      },
      { replace: true }, // changing campus shouldn't add a step to the Back button
    )

  return { campus, setCampus }
}