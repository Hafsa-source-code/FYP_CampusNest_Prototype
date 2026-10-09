import { Icon, TextLink } from '@/components/ui'
import { PATHS } from '@/routes/paths'

/** "← Back to log in" link at the bottom of the password pages. */
export function BackToLoginLink() {
  return (
    <p className="mt-6 text-center text-body">
      <TextLink to={PATHS.login} className="inline-flex items-center gap-1.5">
        <Icon name="arrowLeft" size={14} />
        Back to log in
      </TextLink>
    </p>
  )
}
