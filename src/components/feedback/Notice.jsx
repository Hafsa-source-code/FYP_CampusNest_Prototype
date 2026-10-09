import { cn } from '@/utils/cn'
import { Icon } from '@/components/ui/Icon'
import { TONE_STYLES } from '@/components/ui/toneStyles'

const BORDER_COLORS = {
  neutral: 'border-line',
  brand: 'border-brand-200',
  success: 'border-[#CFE5D8]',
  warning: 'border-[#EFDDB3]',
  danger: 'border-[#F3CCC7]',
}

const DEFAULT_ICONS = {
  neutral: 'info',
  brand: 'info',
  success: 'check',
  warning: 'alert',
  danger: 'alert',
}

/**
 * Coloured info box inside a page (tips, warnings, errors).
 * tone: neutral | brand | success | warning | danger
 */
export function Notice({ tone = 'brand', icon, title, action, className, children }) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border p-4',
        TONE_STYLES[tone],
        BORDER_COLORS[tone],
        className,
      )}
    >
      <Icon name={icon ?? DEFAULT_ICONS[tone]} className="mt-0.5" />
      <div className="min-w-0 flex-1 text-body">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={cn('opacity-90', title && 'mt-0.5')}>{children}</div>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
