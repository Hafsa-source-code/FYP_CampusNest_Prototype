// What this file does:
// A numbered step title, like "① Choose your room". The number turns into a green tick when done.

import { cn } from '@/utils/cn'
import { Icon } from './Icon'

/** number: step number, title, subtitle (optional), done: show a tick instead of the number */
export function StepHeading({ number, title, subtitle, done = false }) {
  return (
    <div className="flex items-start gap-3">
      <span
        className={cn(
          'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-body font-bold text-white',
          done ? 'bg-success' : 'bg-brand-700',
        )}
      >
        {done ? <Icon name="check" size={15} strokeWidth={3} /> : number}
      </span>
      <div>
        <h2 className="text-title font-semibold leading-tight tracking-tight text-ink">{title}</h2>
        {subtitle && <p className="mt-1 text-small text-muted">{subtitle}</p>}
      </div>
    </div>
  )
}