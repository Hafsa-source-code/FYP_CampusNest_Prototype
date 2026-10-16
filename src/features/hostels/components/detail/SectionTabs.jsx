import { useScrollSpy } from '@/hooks/useScrollSpy'
import { cn } from '@/utils/cn'
import { scrollToSection } from '@/utils/scrollToSection'

/**
 * Tabs that stick under the top menu. Clicking one scrolls to its section;
 * the blue underline follows whichever section is on screen.
 * tabs: [{ id, label }]
 */
export function SectionTabs({ tabs }) {
  const activeId = useScrollSpy(tabs.map((tab) => tab.id))

  return (
    <div className="sticky top-16 z-30 -mx-4 border-b border-line bg-canvas/95 px-4 backdrop-blur sm:mx-0 sm:px-0">
      <nav className="flex gap-7 overflow-x-auto" aria-label="Page sections">
        {tabs.map((tab) => {
          const active = tab.id === activeId
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => scrollToSection(tab.id)}
              className={cn(
                'relative h-14 whitespace-nowrap text-body-lg font-medium transition-colors',
                active ? 'text-brand-700' : 'text-muted hover:text-ink',
              )}
            >
              {tab.label}
              {active && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-brand-700" />
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}