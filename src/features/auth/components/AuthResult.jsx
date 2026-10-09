import { IconCircle } from '@/components/ui'
import { AuthTitle } from './AuthTitle'

/** "Done" screen on auth pages: icon + title + text + buttons. E.g. "Check your email". */
export function AuthResult({ icon, tone = 'brand', title, actions, children }) {
  return (
    <>
      <IconCircle icon={icon} tone={tone} size={48} />
      <div className="mt-5">
        <AuthTitle title={title}>{children}</AuthTitle>
      </div>
      {actions && <div className="mt-6 flex flex-wrap justify-center gap-3">{actions}</div>}
    </>
  )
}
