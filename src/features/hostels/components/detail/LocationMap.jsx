import { Icon } from '@/components/ui'

// TEMPORARY drawing of a map. Replaced by a real Google Map in the Maps step.

/** Dark pin = hostel, blue pin = campus, dashed line = the route between them. */
export function LocationMap({ hostelName, campus }) {
  return (
    <div className="relative h-72 overflow-hidden rounded-xl border border-line bg-[#EEF1EC]">
      <svg
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        viewBox="0 0 800 256"
        aria-hidden="true"
      >
        <path d="M0 180 C200 160 380 200 800 150" stroke="#fff" strokeWidth="18" fill="none" />
        <path d="M260 0 L300 256" stroke="#fff" strokeWidth="12" />
        <path d="M560 0 C540 90 600 160 580 256" stroke="#fff" strokeWidth="10" fill="none" />
        <path d="M0 70 L800 90" stroke="#fff" strokeWidth="8" />
        <rect x="620" y="20" width="140" height="60" rx="6" fill="#DDE7D8" />
        <path
          d="M300 128 C380 120 470 100 590 55"
          stroke="var(--color-brand-700)"
          strokeWidth="2.5"
          strokeDasharray="6 5"
          fill="none"
        />
      </svg>

      <div className="absolute left-[34%] top-[50%] flex -translate-x-1/2 -translate-y-full flex-col items-center">
        <span className="whitespace-nowrap rounded-full bg-charcoal px-3 py-1.5 text-caption font-semibold text-white shadow-pop">
          {hostelName}
        </span>
        <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-charcoal text-white ring-4 ring-white">
          <Icon name="mapPin" size={15} />
        </span>
      </div>

      <div className="absolute left-[74%] top-[14%] flex -translate-x-1/2 flex-col items-center">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-700 text-white ring-4 ring-white">
          <Icon name="graduation" size={15} />
        </span>
        <span className="mt-1 whitespace-nowrap rounded-full bg-surface px-3 py-1.5 text-caption font-semibold text-ink shadow-card">
          {campus}
        </span>
      </div>
    </div>
  )
}