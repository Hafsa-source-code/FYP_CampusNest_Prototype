import { Button, CountBubble, Input, Select } from '@/components/ui'
import { SORT_OPTIONS, UNIVERSITIES } from '../constants'

/** Search page header: title + result count on the left; search, Filters, campus and sort on the right. */
export function SearchToolbar({ search, resultCount, filterCount, onOpenFilters }) {
  const { university, setUniversity, text, setText, sort, setSort } = search

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
      <div className="min-w-0">
        <h1 className="text-heading font-semibold leading-tight tracking-tight text-ink">
          Hostels near <span className="text-brand-700">{university}</span>
        </h1>
        <p className="mt-0.5 text-body text-muted">
          <span className="tabular font-semibold text-ink">{resultCount}</span>{' '}
          {resultCount === 1 ? 'hostel matches' : 'hostels match'} your filters
        </p>
      </div>

      <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto">
        <div className="w-full sm:w-auto sm:flex-1 lg:w-[300px] lg:flex-none">
          <Input
            icon="search"
            placeholder="Search hostel or area"
            aria-label="Search hostels"
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
        </div>

        <Button icon="menu" className="h-10" onClick={onOpenFilters}>
          Filters
          <CountBubble count={filterCount} />
        </Button>

        <div className="w-[184px]">
          <Select
            icon="graduation"
            aria-label="Campus"
            value={university}
            onChange={(event) => setUniversity(event.target.value)}
          >
            {UNIVERSITIES.map((name) => (
              <option key={name}>{name}</option>
            ))}
          </Select>
        </div>

        <div className="w-[168px]">
          <Select
            icon="sliders"
            aria-label="Sort by"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            {Object.values(SORT_OPTIONS).map((option) => (
              <option key={option}>{option}</option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  )
}
