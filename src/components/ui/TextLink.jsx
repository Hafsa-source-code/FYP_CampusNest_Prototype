// A real link (<a>) instead of a button pretending to be a link.
//  Better for accessibility, and right-click → "open in new tab" works.

import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'

/** Blue text link to another page in the app. Usage: <TextLink to={PATHS.login}>Log in</TextLink> */
export function TextLink({ to, className, children }) {
  return (
    <Link to={to} className={cn('font-semibold text-brand-700 hover:text-brand-800', className)}>
      {children}
    </Link>
  )
}
