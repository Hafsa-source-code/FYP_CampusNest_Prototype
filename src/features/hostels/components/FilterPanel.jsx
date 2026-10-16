import { Checkbox, Input, PillGroup, Switch } from '@/components/ui'
import { DISTANCE_LIMITS, FILTER_FACILITIES, GENDER_OPTIONS, ROOM_TYPE_OPTIONS } from '../constants'
import { FilterSection } from './FilterSection'

const digitsOnly = (text) => text.replace(/\D/g, '')

/**
 * All search filters. Only shows values and reports changes;
 * the filter state itself lives in useHostelSearch.
 */
export function FilterPanel({ filters, setFilter, toggleFilter }) {
  return (
    <div>
      <FilterSection title="Distance from campus">
        <input
          type="range"
          min={DISTANCE_LIMITS.min}
          max={DISTANCE_LIMITS.max}
          step={DISTANCE_LIMITS.step}
          value={filters.maxDistance}
          onChange={(event) => setFilter('maxDistance', Number(event.target.value))}
          aria-label="Maximum distance from campus"
          className="w-full accent-[var(--color-brand-700)]"
        />
        <div className="tabular mt-1 flex justify-between text-small text-muted">
          <span>{DISTANCE_LIMITS.min} km</span>
          <span className="font-semibold text-brand-700">Up to {filters.maxDistance} km</span>
        </div>
      </FilterSection>

      <FilterSection title="Rent per seat (Rs / month)">
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="Min: 15,000"
            inputMode="numeric"
            aria-label="Minimum rent"
            value={filters.minRent}
            onChange={(event) => setFilter('minRent', digitsOnly(event.target.value))}
          />
          <Input
            placeholder="Max: 30,000"
            inputMode="numeric"
            aria-label="Maximum rent"
            value={filters.maxRent}
            onChange={(event) => setFilter('maxRent', digitsOnly(event.target.value))}
          />
        </div>
      </FilterSection>

    <FilterSection title="Room type">
      <PillGroup
        size="sm"
        options={ROOM_TYPE_OPTIONS}
        value={filters.roomTypes}
        onChange={(type) => setFilter('roomTypes', type)}
      />
    </FilterSection>

      <FilterSection title="Hostel for">
        <PillGroup
          size="sm"
          options={GENDER_OPTIONS}
          value={filters.gender}
          onChange={(gender) => setFilter('gender', gender)}
        />
      </FilterSection>

      <FilterSection title="Facilities">
        <div className="space-y-2.5">
          {FILTER_FACILITIES.map((facility) => (
            <Checkbox
              key={facility}
              label={facility}
              checked={filters.facilities.includes(facility)}
              onChange={() => toggleFilter('facilities', facility)}
            />
          ))}
        </div>
      </FilterSection>
    </div>
  )
}
