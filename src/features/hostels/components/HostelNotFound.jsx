// The message shown when a hostel or room can't be opened (it doesn't exist, or isn't verified yet),
// with a button back to the search page.

import { useNavigate } from 'react-router-dom'
import { Button, Container } from '@/components/ui'
import { EmptyState } from '@/components/feedback'
import { useCampus } from '../hooks/useCampus'
import { searchLink } from '../utils/hostelLinks'

/** title / icon: change them for the room page ("Room not found", bed icon) */
export function HostelNotFound({ title = 'Hostel not found', icon = 'building' }) {
  const navigate = useNavigate()
  const { campus } = useCampus()

  return (
    <Container>
      <EmptyState
        icon={icon}
        title={title}
        description="It may have been removed, or it isn't verified yet."
        action={<Button onClick={() => navigate(searchLink(campus))}>Back to search</Button>}
      />
    </Container>
  )
}