import { cn } from '@/utils/cn'
import { Icon } from './Icon'

/**
 * Wraps a form control with a label, plus a hint or an error message below it.
 * Usage: <Field label="Hostel name" required error={errors.name}><Input ... /></Field>
 */
export function Field({
  label,
  hint,
  error,
  required = false,
  optional = false,
  className,
  children,
}) {
  return (
    <label className={cn('block', className)}>
      {label && (
        <span className="mb-1.5 flex items-baseline gap-1 text-small font-medium text-ink">
          {label}
          {required && <span className="text-danger">*</span>}
          {optional && <span className="font-normal text-subtle">(optional)</span>}
        </span>
      )}

      {children}

      {error ? (
        <span className="mt-1.5 flex items-center gap-1.5 text-small text-danger">
          <Icon name="alert" size={14} />
          {error}
        </span>
      ) : (
        hint && <span className="mt-1.5 block text-small text-muted">{hint}</span>
      )}
    </label>
  )
}
