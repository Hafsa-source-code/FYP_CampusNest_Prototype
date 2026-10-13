import { useNavigate } from 'react-router-dom'
import { Button, Icon } from '@/components/ui'
import { useHostelSummaries } from '@/features/hostels/hooks/useHostelSummaries'
import { PATHS } from '@/routes/paths'
import { MAX_COMPARE } from '../constants'
import { useCompare } from '../hooks/useCompare'

/** Dark bar fixed at the bottom of the screen listing the hostels picked for comparing. */
export function CompareTray() {
  const navigate = useNavigate()
  const { ids, count, toggle } = useCompare()
  const hostels = useHostelSummaries()

  if (count === 0) return null
  const picked = ids.map((id) => hostels.find((hostel) => hostel.id === id)).filter(Boolean)

  return (
    <div className="fixed bottom-5 left-1/2 z-30 w-[calc(100%-2rem)] max-w-[680px] -translate-x-1/2">
      <div className="flex items-center gap-3 rounded-full bg-charcoal py-2 pl-6 pr-2 text-white shadow-pop">
        <span className="whitespace-nowrap text-body font-semibold">
          Compare{' '}
          <span className="tabular font-normal text-white/60">
            {count}/{MAX_COMPARE}
          </span>
        </span>

        <div className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto">
          {picked.map((hostel) => (
            <span
              key={hostel.id}
              className="inline-flex h-8 items-center gap-1 whitespace-nowrap rounded-full bg-white/10 pl-3 pr-1 text-small"
            >
              {hostel.name}
              <button
                type="button"
                onClick={() => toggle(hostel.id)}
                aria-label={`Remove ${hostel.name} from compare`}
                className="inline-flex h-6 w-6 items-center justify-center rounded-full hover:bg-white/15"
              >
                <Icon name="x" size={12} />
              </button>
            </span>
          ))}
        </div>

        <Button
          size="sm"
          className="h-9 rounded-full px-4"
          disabled={count < 2}
          onClick={() => navigate(PATHS.student.compare)}
        >
          Compare now
        </Button>
      </div>
    </div>
  )
}
