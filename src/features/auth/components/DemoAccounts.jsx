import { Icon, TextDivider } from '@/components/ui'

// PROTOTYPE ONLY: one-click login for the examiner. Remove before real launch.
const DEMO_ACCOUNTS = [
  { label: 'Student', icon: 'graduation', email: 'areesha@pu.edu.pk' },
  { label: 'Owner', icon: 'building', email: 'tariq@greencourt.pk' },
  { label: 'Admin', icon: 'shield', email: 'admin@campusnest.pk' },
]

/** Three buttons that log straight into a demo account. onPick receives the email. */
export function DemoAccounts({ onPick, disabled }) {
  return (
    <div className="mt-6">
      <TextDivider>Try a demo account</TextDivider>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {DEMO_ACCOUNTS.map((account) => (
          <button
            key={account.label}
            type="button"
            disabled={disabled}
            onClick={() => onPick(account.email)}
            className="flex flex-col items-center gap-1 rounded-lg border border-line-strong bg-surface py-2.5 text-small font-medium text-ink-2 transition-colors hover:border-brand-700 hover:text-brand-700 disabled:opacity-50"
          >
            <Icon name={account.icon} size={17} />
            {account.label}
          </button>
        ))}
      </div>
    </div>
  )
}
