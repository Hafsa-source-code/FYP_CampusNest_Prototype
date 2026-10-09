import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui'
import { EmptyState } from '@/components/feedback'
import { PATHS } from '@/routes/paths'

/** Shown for any address that doesn't exist. */
export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen items-center justify-center">
      <EmptyState
        icon="search"
        title="Page not found"
        description="The page you're looking for doesn't exist or was moved."
        action={<Button onClick={() => navigate(PATHS.home)}>Go to home</Button>}
      />
    </div>
  )
}