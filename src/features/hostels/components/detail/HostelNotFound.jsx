import { useNavigate } from 'react-router-dom'
import { Button, Container } from '@/components/ui'
import { EmptyState } from '@/components/feedback'
import { useCampus } from '../../hooks/useCampus'
import { searchLink } from '../../utils/hostelLinks'

/** Shown when the hostel doesn't exist or students aren't allowed to see it. */
export function HostelNotFound() {
  const navigate = useNavigate()
  const { campus } = useCampus()

  return (
    <Container>
      <EmptyState
        icon="building"
        title="Hostel not found"
        description="It may have been removed, or it isn't verified yet."
        action={<Button onClick={() => navigate(searchLink(campus))}>Back to search</Button>}
      />
    </Container>
  )
}