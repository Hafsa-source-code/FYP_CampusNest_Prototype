import { Button } from '@/components/ui'
import { EmptyState } from '@/components/feedback'

/** Shown when no hostel matches the filters. */
export function NoResults({ onClearFilters }) {
  return (
    <div className="rounded-xl border border-dashed border-line-strong bg-surface">
      <EmptyState
        icon="search"
        title="No hostels match these filters"
        description="Try widening the distance, raising your budget or removing a facility."
        action={
          <Button variant="secondary" onClick={onClearFilters}>
            Clear all filters
          </Button>
        }
      />
    </div>
  )
}
