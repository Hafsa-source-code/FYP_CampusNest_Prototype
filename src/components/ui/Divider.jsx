import { cn } from '@/utils/cn'

/** Thin horizontal line. */
export function Divider({ className }) {
  return <hr className={cn('border-0 border-t border-line', className)} />
}
