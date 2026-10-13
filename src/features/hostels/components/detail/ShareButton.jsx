import { Button } from '@/components/ui'
import { toast } from '@/components/feedback'

/** Copies the current page address so the student can send it to someone. */
export function ShareButton() {
  const share = () => {
    navigator.clipboard?.writeText(window.location.href)
    toast('Link copied')
  }

  return (
    <Button variant="secondary" icon="share" className="rounded-full" onClick={share}>
      Share
    </Button>
  )
}