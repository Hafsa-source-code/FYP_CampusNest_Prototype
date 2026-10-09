import { useParams, useSearchParams } from 'react-router-dom'

// TEMPORARY: the old screens expect values like id={4} as props, but React
// Router puts them in the URL. This reads the URL and hands them over.
// Removed in Step 5, when each screen becomes a proper page that reads
// the URL itself.
export function OldScreen({ render }) {
  const params = useParams()
  const [query] = useSearchParams()
  return render(params, query)
}