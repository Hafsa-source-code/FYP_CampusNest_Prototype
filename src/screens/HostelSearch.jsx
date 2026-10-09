import { useSearchQuery } from '../components/SearchContext'
import { useMemo, useState } from 'react'
import { useStore } from '../store'
import { navigate, useRoute } from '../lib'
import { Icon } from '../components/icons'
import {
  Button,
  Checkbox,
  Choice,
  Container,
  Drawer,
  EmptyState,
  Input,
  Select,
  Switch,
} from '../components/ui'
import { HostelCard } from '../components/HostelCard'
//  Fixed options (same lists as before)
const UNIVERSITIES = ['PU New Campus', 'PU Old Campus']
const ROOM_TYPES = [
  { label: 'Single', type: 'Single' },
  { label: '2-seater', type: 'Twin' },
  { label: '3-seater', type: '3-seater' },
  { label: '4+ seater', type: '4-seater+' },
]
const FACILITIES = ['Wi-Fi', 'Mess', 'Generator/UPS', 'Laundry', 'Security guard', 'Parking']
const SORTS = ['Nearest first', 'Lowest price', 'Highest rated']
const DEFAULT_DIST = 3
//  Compare tray (bottom of screen)
export function CompareTray() {
  const { compareIds, hostel, toggleCompare } = useStore()
  if (compareIds.length === 0) return null
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-30 w-[calc(100%-2rem)] max-w-[680px]">
      <div className="flex items-center gap-3 rounded-full bg-charcoal text-white pl-6 pr-2 py-2 shadow-pop">
        <span className="text-body font-semibold whitespace-nowrap">
          Compare <span className="text-white/60 font-normal tabular">{compareIds.length}/3</span>
        </span>
        <div className="flex-1 min-w-0 flex gap-1.5 overflow-x-auto">
          {compareIds.map((id) => (
            <span
              key={id}
              className="inline-flex items-center gap-1 h-8 pl-3 pr-1 rounded-full bg-white/10 text-small whitespace-nowrap"
            >
              {hostel(id)?.name}
              <button
                onClick={() => toggleCompare(id)}
                aria-label="Remove from compare"
                className="h-6 w-6 inline-flex items-center justify-center rounded-full hover:bg-white/15"
              >
                <Icon name="x" size={12} />
              </button>
            </span>
          ))}
        </div>
        <Button
          size="sm"
          className="rounded-full h-9 px-4"
          onClick={() => navigate('/s/compare')}
          disabled={compareIds.length < 2}
        >
          Compare now
        </Button>
      </div>
    </div>
  )
}
//  Small pieces used only on this page
/** Removable chip showing one active filter. */
function FilterChip({ label, onRemove }) {
  return (
    <button
      onClick={onRemove}
      aria-label={`Remove filter: ${label}`}
      className="inline-flex items-center gap-1.5 h-8 pl-3 pr-2 rounded-full border border-brand-200 bg-brand-50 text-small font-medium text-brand-800 hover:bg-brand-100 transition-colors"
    >
      {label}
      <Icon name="x" size={13} />
    </button>
  )
}
/** One titled block inside the filter panel. */
function FilterSection({ title, children }) {
  return (
    <section className="py-5 first:pt-0 border-b border-line last:border-b-0">
      <h3 className="text-body font-semibold text-ink mb-3">{title}</h3>
      {children}
    </section>
  )
}
//  Page
export function HostelSearch() {
  const { hostels, typesFor, startingPrice } = useStore()
  const { query } = useRoute()
  // Search + filter state (unchanged logic)
  const [uni, setUni] = useState(query.get('uni') ?? 'PU New Campus')
  const { query: name, setQuery: setName } = useSearchQuery() // shared with the search box in the top menu
  const [maxDist, setMaxDist] = useState(DEFAULT_DIST)
  const [minRent, setMinRent] = useState('')
  const [maxRent, setMaxRent] = useState(query.get('max') ?? '')
  const [types, setTypes] = useState([])
  const [acOnly, setAcOnly] = useState(false)
  const [facilities, setFacilities] = useState([])
  const [gender, setGender] = useState('Any')
  const [sort, setSort] = useState('Nearest first')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const toggle = (list, set, v) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v])
  const clear = () => {
    setMaxDist(DEFAULT_DIST)
    setMinRent('')
    setMaxRent('')
    setTypes([])
    setAcOnly(false)
    setFacilities([])
    setGender('Any')
  }
  const results = useMemo(
    () =>
      hostels
        .filter((h) => h.status === 'Approved')
        .filter((h) => h.distance <= maxDist)
        .filter(
          (h) =>
            !name ||
            h.name.toLowerCase().includes(name.toLowerCase()) ||
            h.area.toLowerCase().includes(name.toLowerCase()),
        )
        .filter((h) => gender === 'Any' || h.gender === gender)
        .filter((h) => {
          const ts = typesFor(h.id).filter(
            (t) => (!acOnly || t.ac) && (types.length === 0 || types.includes(t.type)),
          )
          if (ts.length === 0) return false
          const min = Math.min(...ts.map((t) => t.price))
          return (!minRent || min >= Number(minRent)) && (!maxRent || min <= Number(maxRent))
        })
        .filter((h) => facilities.every((f) => h.facilities.includes(f)))
        .sort((a, b) =>
          sort === 'Nearest first'
            ? a.distance - b.distance
            : sort === 'Lowest price'
              ? startingPrice(a.id) - startingPrice(b.id)
              : b.rating - a.rating,
        ),
    [
      hostels,
      maxDist,
      name,
      gender,
      acOnly,
      types,
      minRent,
      maxRent,
      facilities,
      sort,
      typesFor,
      startingPrice,
    ],
  )
  // Each active filter becomes a removable chip; the count drives the badge on the Filters button
  const rentLabel =
    minRent && maxRent
      ? `Rs ${minRent}–${maxRent}`
      : minRent
        ? `From Rs ${minRent}`
        : `Up to Rs ${maxRent}`
  const chips = [
    ...(maxDist !== DEFAULT_DIST
      ? [
          {
            label: `Within ${maxDist} km`,
            remove: () => setMaxDist(DEFAULT_DIST),
          },
        ]
      : []),
    ...(minRent || maxRent
      ? [
          {
            label: rentLabel,
            remove: () => {
              setMinRent('')
              setMaxRent('')
            },
          },
        ]
      : []),
    ...types.map((t) => ({
      label: ROOM_TYPES.find((r) => r.type === t).label,
      remove: () => toggle(types, setTypes, t),
    })),
    ...(acOnly ? [{ label: 'AC only', remove: () => setAcOnly(false) }] : []),
    ...(gender !== 'Any' ? [{ label: `${gender} hostels`, remove: () => setGender('Any') }] : []),
    ...facilities.map((f) => ({
      label: f,
      remove: () => toggle(facilities, setFacilities, f),
    })),
  ]
  const filterPanel = (
    <div>
      <FilterSection title="Distance from campus">
        <input
          type="range"
          min={0.5}
          max={3}
          step={0.5}
          value={maxDist}
          onChange={(e) => setMaxDist(Number(e.target.value))}
          className="w-full accent-[var(--color-brand-700)]"
        />
        <div className="mt-1 flex justify-between text-small text-muted tabular">
          <span>0.5 km</span>
          <span className="font-semibold text-brand-700">Up to {maxDist} km</span>
        </div>
      </FilterSection>
      <FilterSection title="Rent per seat (Rs / month)">
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="Min"
            inputMode="numeric"
            value={minRent}
            onChange={(e) => setMinRent(e.target.value.replace(/\D/g, ''))}
          />
          <Input
            placeholder="Max"
            inputMode="numeric"
            value={maxRent}
            onChange={(e) => setMaxRent(e.target.value.replace(/\D/g, ''))}
          />
        </div>
      </FilterSection>
      <FilterSection title="Room type">
        <Choice
          size="sm"
          options={ROOM_TYPES.map((r) => r.label)}
          value={ROOM_TYPES.filter((r) => types.includes(r.type)).map((r) => r.label)}
          onChange={(l) => toggle(types, setTypes, ROOM_TYPES.find((r) => r.label === l).type)}
        />
        <div className="mt-4 flex items-center justify-between">
          <span className="text-body text-ink">Air-conditioned only</span>
          <Switch checked={acOnly} onChange={setAcOnly} label="Air-conditioned only" />
        </div>
      </FilterSection>
      <FilterSection title="Hostel for">
        <Choice size="sm" options={['Any', 'Female', 'Male']} value={gender} onChange={setGender} />
      </FilterSection>
      <FilterSection title="Facilities">
        <div className="space-y-2.5">
          {FACILITIES.map((f) => (
            <Checkbox
              key={f}
              label={f}
              checked={facilities.includes(f)}
              onChange={() => toggle(facilities, setFacilities, f)}
            />
          ))}
        </div>
      </FilterSection>
    </div>
  )
  return (
    <>
      <Container className="pt-8 pb-28">
        {/* One row: title on the left; Search + Filters + Campus + Sort on the right */}
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 mb-6">
          <div className="min-w-0">
            <h1 className="tracking-tight text-heading leading-tight font-semibold text-ink">
              Hostels near <span className="text-brand-700">{uni}</span>
            </h1>
            <p className="mt-0.5 text-body text-muted">
              <span className="font-semibold text-ink tabular">{results.length}</span>{' '}
              {results.length === 1 ? 'hostel matches' : 'hostels match'} your filters
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <div className="w-full sm:w-auto sm:flex-1 lg:flex-none lg:w-[300px]">
              <Input
                icon="search"
                placeholder="Search hostel or area"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-label="Search hostels"
              />
            </div>
            <Button
              icon="menu"
              className="h-10"
              onClick={() => setFiltersOpen(true)}
              aria-label="Open filters"
            >
              Filters
              {chips.length > 0 && (
                <span className="h-5 min-w-5 px-1.5 rounded-full bg-white text-brand-700 text-tiny font-semibold leading-5 tabular">
                  {chips.length}
                </span>
              )}
            </Button>
            <div className="w-[184px]">
              <Select
                value={uni}
                onChange={(e) => setUni(e.target.value)}
                icon="graduation"
                aria-label="Campus"
              >
                {UNIVERSITIES.map((u) => (
                  <option key={u}>{u}</option>
                ))}
              </Select>
            </div>
            <div className="w-[168px]">
              <Select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                icon="sliders"
                aria-label="Sort by"
              >
                {SORTS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </Select>
            </div>
          </div>
        </div>
        {chips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {chips.map((c) => (
              <FilterChip key={c.label} label={c.label} onRemove={c.remove} />
            ))}
            <button
              onClick={clear}
              className="ml-1 text-small font-semibold text-brand-700 hover:text-brand-800"
            >
              Clear all
            </button>
          </div>
        )}

        {results.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
            {results.map((h) => (
              <HostelCard key={h.id} hostel={h} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-line-strong bg-surface">
            <EmptyState
              icon="search"
              title="No hostels match these filters"
              description="Try widening the distance, raising your budget or removing a facility."
              action={
                <Button variant="secondary" onClick={clear}>
                  Clear all filters
                </Button>
              }
            />
          </div>
        )}
      </Container>
      {/* Slide-in filter panel (the "hamburger") */}
      <Drawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filters"
        footer={
          <>
            <Button variant="secondary" onClick={clear} disabled={chips.length === 0}>
              Clear all
            </Button>
            <Button full onClick={() => setFiltersOpen(false)}>
              Show {results.length} {results.length === 1 ? 'hostel' : 'hostels'}
            </Button>
          </>
        }
      >
        {filterPanel}
      </Drawer>

      <CompareTray />
    </>
  )
}
