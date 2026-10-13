// What this file does:
// The three-step progress line on an inquiry: Inquiry sent → Owner reviewing → Moved in.
// A declined, cancelled or expired inquiry stops at step 2 with a red ✕.
// Used on the student's inquiry page and (later) the owner's.

import { Icon } from '@/components/ui'
import { cn } from '@/utils/cn'
import { INQUIRY_STATUS, OPEN_STATUSES } from '../constants'

// done = green tick, current = blue (happening now), stopped = red ✕, todo = grey (not yet)
const DOT_STYLES = {
  done: 'bg-success text-white',
  current: 'bg-brand-700 text-white ring-4 ring-brand-100',
  stopped: 'bg-danger text-white',
  todo: 'border-2 border-line-strong bg-surface text-subtle',
}
const LABEL_STYLES = {
  done: 'text-ink',
  current: 'text-ink',
  stopped: 'text-danger',
  todo: 'text-subtle',
}
const LINE_STYLES = {
  done: 'bg-brand-700',
  current: 'bg-brand-700',
  stopped: 'bg-danger/40',
  todo: 'bg-line',
}

function stepsFor(status) {
  const isClosed = !OPEN_STATUSES.includes(status)
  const middleState = status === INQUIRY_STATUS.PENDING ? 'current' : isClosed ? 'stopped' : 'done'

  return [
    { label: 'Inquiry sent', icon: 'send', state: 'done' },
    { label: isClosed ? status : 'Owner reviewing', icon: 'clock', state: middleState },
    {
      label: 'Moved in',
      icon: 'home',
      state: status === INQUIRY_STATUS.MOVED_IN ? 'done' : 'todo',
    },
  ]
}

function StepDot({ state, icon }) {
  const iconName = { done: 'check', stopped: 'x' }[state] ?? icon
  const isBold = state === 'done' || state === 'stopped'

  return (
    <span
      className={cn(
        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
        DOT_STYLES[state],
      )}
    >
      <Icon name={iconName} size={15} strokeWidth={isBold ? 2.75 : 1.75} />
    </span>
  )
}

export function InquiryStatusTracker({ status }) {
  const steps = stepsFor(status)

  return (
    <ol className="flex items-center" aria-label={`Inquiry status: ${status}`}>
      {steps.map((step, index) => {
        const next = steps[index + 1]
        return (
          <li key={step.label} className={cn('flex items-center', next && 'flex-1')}>
            <span className="flex items-center gap-2">
              <StepDot state={step.state} icon={step.icon} />
              <span
                className={cn(
                  'hidden whitespace-nowrap text-small font-medium sm:inline',
                  LABEL_STYLES[step.state],
                )}
              >
                {step.label}
              </span>
            </span>
            {next && (
              <span className={cn('mx-3 h-0.5 flex-1 rounded-full', LINE_STYLES[next.state])} />
            )}
          </li>
        )
      })}
    </ol>
  )
}