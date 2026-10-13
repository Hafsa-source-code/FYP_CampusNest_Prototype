import { useState } from 'react'
import { Button, Container, Drawer } from '@/components/ui'
import { CompareTray } from '@/features/compare/components/CompareTray'
import { ActiveFilterChips } from '@/features/hostels/components/ActiveFilterChips'
import { FilterPanel } from '@/features/hostels/components/FilterPanel'
import { HostelGrid } from '@/features/hostels/components/HostelGrid'
import { NoResults } from '@/features/hostels/components/NoResults'
import { SearchToolbar } from '@/features/hostels/components/SearchToolbar'
import { useHostelSearch } from '@/features/hostels/hooks/useHostelSearch'

/** "Find a hostel": toolbar, active filters, results grid, filter drawer, compare tray. */
export function HostelSearchPage() {
  const search = useHostelSearch()
  const { results, chips, filters, setFilter, toggleFilter, clearFilters } = search
  const [filtersOpen, setFiltersOpen] = useState(false)

  return (
    <>
      <Container className="pb-28 pt-8">
        <SearchToolbar
          search={search}
          resultCount={results.length}
          filterCount={chips.length}
          onOpenFilters={() => setFiltersOpen(true)}
        />
        <ActiveFilterChips chips={chips} onClearAll={clearFilters} />
        {results.length ? (
          <HostelGrid hostels={results} />
        ) : (
          <NoResults onClearFilters={clearFilters} />
        )}
      </Container>

      <Drawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filters"
        footer={
          <>
            <Button variant="secondary" onClick={clearFilters} disabled={chips.length === 0}>
              Clear all
            </Button>
            <Button full onClick={() => setFiltersOpen(false)}>
              Show {results.length} {results.length === 1 ? 'hostel' : 'hostels'}
            </Button>
          </>
        }
      >
        <FilterPanel filters={filters} setFilter={setFilter} toggleFilter={toggleFilter} />
      </Drawer>

      <CompareTray />
    </>
  )
}
