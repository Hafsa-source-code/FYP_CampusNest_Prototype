import { cn } from '@/utils/cn'
import { Icon } from '@/components/ui'
import { ROLES } from '@/utils/constants'

const OPTIONS = [
  { role: ROLES.STUDENT, label: 'Student', icon: 'graduation' },
  { role: ROLES.OWNER, label: 'Hostel owner', icon: 'building' },
]

/** Two-option switch on the sign-up page: Student / Hostel owner. */
export function RoleToggle({ value, onChange }) {
  return (
    <div>
      <p id="role-label" className="sr-only">
        I'm joining as
      </p>
      <div
        role="radiogroup"
        aria-labelledby="role-label"
        className="grid grid-cols-2 rounded-full bg-sunken p-1"
      >
        {OPTIONS.map((option) => {
          const selected = value === option.role
          return (
            <button
              key={option.role}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option.role)}
              className={cn(
                'inline-flex h-10 items-center justify-center gap-2 rounded-full text-body font-medium transition-colors',
                selected ? 'bg-brand-700 text-white shadow-card' : 'text-ink-2 hover:text-ink',
              )}
            >
              <Icon name={option.icon} />
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
