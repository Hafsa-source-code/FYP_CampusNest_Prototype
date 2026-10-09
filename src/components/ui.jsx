import { useEffect, useRef, useState } from 'react'
import { Icon } from './icons'
import { cx } from '../lib'
const BTN_BASE =
  'inline-flex items-center justify-center gap-2 font-medium rounded-md transition-colors duration-150 whitespace-nowrap disabled:opacity-45 disabled:pointer-events-none select-none'
const BTN_VARIANT = {
  primary: 'bg-brand-700 text-white hover:bg-brand-800 active:bg-brand-800',
  secondary:
    'bg-surface text-ink border border-line-strong hover:bg-sunken hover:border-line-strong',
  ghost: 'text-ink-2 hover:bg-sunken hover:text-ink',
  danger: 'bg-danger text-white hover:bg-[#961d14]',
  'danger-ghost': 'text-danger hover:bg-danger-bg',
  inverse: 'bg-white text-brand-900 hover:bg-brand-50',
}
const BTN_SIZE = {
  sm: 'h-8 px-3 text-small',
  md: 'h-10 px-4 text-body',
  lg: 'h-12 px-5 text-body-lg',
}
export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  arrow,
  full,
  className,
  children,
  ...rest
}) {
  const iconSize = size === 'sm' ? 14 : 16
  return (
    <button
      {...rest}
      className={cx(
        BTN_BASE,
        BTN_VARIANT[variant],
        BTN_SIZE[size],
        full && 'w-full',
        arrow && 'pr-0 overflow-hidden',
        className,
      )}
    >
      <span
        className={cx('inline-flex items-center justify-center gap-2', arrow && full && 'flex-1')}
      >
        {icon && <Icon name={icon} size={iconSize} />}
        {children}
        {iconRight && <Icon name={iconRight} size={iconSize} />}
      </span>
      {/* Template-style arrow block on the right side of the button */}
      {arrow && (
        <span
          className={cx(
            'self-stretch flex items-center border-l',
            size === 'lg' ? 'px-4 ml-3' : 'px-3 ml-2',
            variant === 'primary' || variant === 'danger'
              ? 'bg-black/15 border-white/20'
              : 'border-current/20',
          )}
        >
          <Icon name="arrowRight" size={iconSize} />
        </span>
      )}
    </button>
  )
}
export function IconButton({
  icon,
  label,
  size = 'md',
  variant = 'ghost',
  className,
  badge,
  ...rest
}) {
  const dim = size === 'sm' ? 'h-8 w-8' : size === 'lg' ? 'h-12 w-12' : 'h-10 w-10'
  return (
    <button
      {...rest}
      aria-label={label}
      title={label}
      className={cx('relative', BTN_BASE, BTN_VARIANT[variant], dim, 'px-0', className)}
    >
      <Icon name={icon} size={size === 'sm' ? 15 : 18} />
      {!!badge && (
        <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 rounded-full bg-danger text-white text-micro font-semibold leading-4 tabular">
          {badge}
        </span>
      )}
    </button>
  )
}
//  Form controls
const CONTROL =
  'w-full bg-surface border border-line-strong rounded-md text-body text-ink placeholder:text-subtle transition-shadow focus:outline-none focus:border-brand-500 focus:ring-[3px] focus:ring-brand-500/15 disabled:bg-sunken disabled:text-muted'
export function Field({ label, hint, error, required, optional, children, className }) {
  return (
    <label className={cx('block', className)}>
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
      ) : hint ? (
        <span className="mt-1.5 block text-small text-muted">{hint}</span>
      ) : null}
    </label>
  )
}
export function Input({ icon, suffix, invalid, inputSize = 'md', className, ...rest }) {
  const lg = inputSize === 'lg'
  return (
    <div className="relative">
      {icon && (
        <Icon
          name={icon}
          size={lg ? 18 : 16}
          className={cx(
            'absolute top-1/2 -translate-y-1/2 text-subtle pointer-events-none',
            lg ? 'left-3.5' : 'left-3',
          )}
        />
      )}
      <input
        {...rest}
        className={cx(
          CONTROL,
          lg ? 'h-11' : 'h-10',
          icon ? (lg ? 'pl-11' : 'pl-9') : lg ? 'pl-4' : 'pl-3',
          suffix ? 'pr-11' : lg ? 'pr-4' : 'pr-3',
          invalid && 'border-danger focus:border-danger focus:ring-danger/15',
          className,
        )}
      />
      {suffix && <div className="absolute right-1.5 top-1/2 -translate-y-1/2">{suffix}</div>}
    </div>
  )
}
export function Textarea({ invalid, className, ...rest }) {
  return (
    <textarea
      {...rest}
      className={cx(
        CONTROL,
        'px-3 py-2.5 resize-none leading-relaxed',
        invalid && 'border-danger focus:border-danger focus:ring-danger/15',
        className,
      )}
    />
  )
}
export function Select({ className, children, icon, ...rest }) {
  return (
    <div className="relative">
      {icon && (
        <Icon
          name={icon}
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle pointer-events-none"
        />
      )}
      <select
        {...rest}
        className={cx(CONTROL, 'h-10 appearance-none pr-9', icon ? 'pl-9' : 'pl-3', className)}
      >
        {children}
      </select>
      <Icon
        name="chevronDown"
        size={16}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
      />
    </div>
  )
}
export function Checkbox({ checked, onChange, label, description }) {
  return (
    <label className="flex items-start gap-2.5 cursor-pointer select-none group">
      <span
        className={cx(
          'mt-0.5 h-4 w-4 rounded-[4px] border flex items-center justify-center transition-colors shrink-0',
          checked
            ? 'bg-charcoal border-charcoal text-white'
            : 'bg-surface border-line-strong group-hover:border-muted',
        )}
      >
        {checked && <Icon name="check" size={12} strokeWidth={3} />}
      </span>
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>
        <span className="block text-body text-ink">{label}</span>
        {description && <span className="block text-small text-muted mt-0.5">{description}</span>}
      </span>
    </label>
  )
}
export function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cx(
        'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors',
        checked ? 'bg-charcoal' : 'bg-line-strong',
      )}
    >
      <span
        className={cx(
          'inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform',
          checked ? 'translate-x-[18px]' : 'translate-x-0.5',
        )}
      />
    </button>
  )
}
/** Single- or multi-select pill group used for filters and preferences. */
export function Choice({ options, value, onChange, size = 'md' }) {
  const isOn = (o) => (Array.isArray(value) ? value.includes(o) : value === o)
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={cx(
            'rounded-full border font-medium transition-colors',
            size === 'sm' ? 'h-8 px-3 text-small' : 'h-9 px-4 text-body',
            isOn(o)
              ? 'border-charcoal bg-charcoal text-white'
              : 'border-line-strong bg-surface text-ink-2 hover:border-muted',
          )}
        >
          {o}
        </button>
      ))}
    </div>
  )
}
/** Segmented control for 2–4 mutually exclusive views. */
export function Segmented({ options, value, onChange }) {
  return (
    <div className="inline-flex rounded-md bg-sunken p-0.5">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={cx(
            'h-8 px-3 rounded-[6px] text-small font-medium transition-colors',
            value === o ? 'bg-surface text-ink shadow-card' : 'text-muted hover:text-ink',
          )}
        >
          {o}
        </button>
      ))}
    </div>
  )
}
const TONE = {
  neutral: 'bg-sunken text-ink-2',
  brand: 'bg-brand-50 text-brand-700',
  success: 'bg-success-bg text-success',
  warning: 'bg-warning-bg text-warning',
  danger: 'bg-danger-bg text-danger',
}
const DOT = {
  neutral: 'bg-subtle',
  brand: 'bg-brand-500',
  success: 'bg-success',
  warning: 'bg-[#C98A12]',
  danger: 'bg-danger',
}
export function Badge({ tone = 'neutral', dot, icon, children, className }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 h-6 px-2 rounded-[6px] text-caption font-medium whitespace-nowrap',
        TONE[tone],
        className,
      )}
    >
      {dot && <span className={cx('h-1.5 w-1.5 rounded-full', DOT[tone])} />}
      {icon && <Icon name={icon} size={12} />}
      {children}
    </span>
  )
}
export const STATUS_TONE = {
  Pending: 'warning',
  'Moved In': 'success',
  Declined: 'neutral',
  Cancelled: 'neutral',
  Expired: 'neutral',
  Approved: 'success',
  Rejected: 'danger',
  Deactivated: 'neutral',
  Active: 'success',
  Banned: 'danger',
  Suspended: 'danger',
}
export function StatusBadge({ status }) {
  return (
    <Badge tone={STATUS_TONE[status] ?? 'neutral'} dot>
      {status}
    </Badge>
  )
}
export function Card({ children, className, padded = true, as: As = 'div', ...rest }) {
  return (
    <As
      {...rest}
      className={cx(
        'bg-surface border border-line rounded-lg shadow-card',
        padded && 'p-5 sm:p-6',
        className,
      )}
    >
      {children}
    </As>
  )
}
export function CardHeader({ title, description, action, className }) {
  return (
    <div className={cx('flex items-start justify-between gap-4 mb-5', className)}>
      <div className="min-w-0">
        <h3 className="text-body-lg font-semibold text-ink">{title}</h3>
        {description && <p className="mt-0.5 text-small text-muted">{description}</p>}
      </div>
      {action}
    </div>
  )
}
const AVATAR_TONES = [
  'bg-brand-100 text-brand-800',
  'bg-[#EFE7DC] text-[#6B4E2A]',
  'bg-[#E4E9F2] text-[#2F4468]',
  'bg-[#EAE6F0] text-[#4D3F66]',
  'bg-[#E3EEE6] text-[#2D5A3C]',
]
export function Avatar({ name, size = 32, className }) {
  const tone =
    AVATAR_TONES[[...name].reduce((s, c) => s + c.charCodeAt(0), 0) % AVATAR_TONES.length]
  const letters = name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  return (
    <span
      className={cx(
        'inline-flex items-center justify-center rounded-full font-semibold shrink-0',
        tone,
        className,
      )}
      style={{ width: size, height: size, fontSize: Math.max(10, size * 0.36) }}
    >
      {letters}
    </span>
  )
}
export function Stars({ value, size = 14, className }) {
  return (
    <span
      className={cx('inline-flex gap-0.5 text-star', className)}
      aria-label={`${value} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Icon
          key={i}
          name="star"
          size={size}
          filled={i <= Math.round(value)}
          className={i <= Math.round(value) ? '' : 'text-line-strong'}
          strokeWidth={1.5}
        />
      ))}
    </span>
  )
}
export function Rating({ value, count, className }) {
  if (!value) return <span className={cx('text-small text-muted', className)}>No reviews yet</span>
  return (
    <span className={cx('inline-flex items-center gap-1 text-small', className)}>
      <Icon name="star" size={13} filled className="text-star" strokeWidth={1.5} />
      <span className="font-semibold text-ink tabular">{value.toFixed(1)}</span>
      {count !== undefined && <span className="text-muted tabular">({count})</span>}
    </span>
  )
}
export function Photo({ src, alt, ratio = '4/3', className, rounded = true, children }) {
  const [failed, setFailed] = useState(false)
  return (
    <div
      className={cx('relative overflow-hidden bg-sunken', rounded && 'rounded-lg', className)}
      style={{ aspectRatio: ratio }}
    >
      {src && !failed ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-subtle">
          <Icon name="image" size={24} />
        </div>
      )}
      {children}
    </div>
  )
}
export function Stat({ label, value, sub, trend }) {
  return (
    <Card>
      <p className="text-small font-medium text-muted">{label}</p>
      <p className="mt-2 text-heading leading-8 font-semibold text-ink tabular tracking-tight">
        {value}
      </p>
      {(sub || trend) && (
        <p className="mt-1.5 flex items-center gap-2 text-small text-muted">
          {trend && (
            <span className={cx('font-medium', trend.up ? 'text-success' : 'text-danger')}>
              {trend.up ? '↑' : '↓'} {trend.value}
            </span>
          )}
          {sub}
        </p>
      )}
    </Card>
  )
}
export function Divider({ className }) {
  return <hr className={cx('border-0 border-t border-line', className)} />
}
//  Layout
export const GUTTER = 'px-4 sm:px-6 lg:px-10 2xl:px-16'
/** Full-bleed page frame: content spans the viewport with consistent side gutters. */
export function Container({ children, className }) {
  return <div className={cx('w-full', GUTTER, className)}>{children}</div>
}
export function PageHeader({ title, description, actions, back, eyebrow }) {
  return (
    <div className="pt-8 pb-6 sm:pt-10 sm:pb-8">
      {back && (
        <button
          onClick={back.onClick}
          className="mb-4 inline-flex items-center gap-1.5 text-small font-medium text-muted hover:text-ink transition-colors"
        >
          <Icon name="arrowLeft" size={14} /> {back.label}
        </button>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          {eyebrow && <div className="mb-2 text-small text-muted">{eyebrow}</div>}
          <h1 className="text-title sm:text-heading sm:leading-9 font-semibold text-ink tracking-tight">
            {title}
          </h1>
          {description && <p className="mt-1.5 text-body text-muted max-w-2xl">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </div>
  )
}
export function Tabs({ tabs, value, onChange, counts, className }) {
  return (
    <div
      className={cx('flex gap-6 border-b border-line overflow-x-auto', className)}
      role="tablist"
    >
      {tabs.map((t) => (
        <button
          key={t}
          role="tab"
          aria-selected={value === t}
          onClick={() => onChange(t)}
          className={cx(
            'relative -mb-px flex items-center gap-2 whitespace-nowrap pb-3 pt-1 text-body font-medium border-b-2 transition-colors',
            value === t ? 'border-ink text-ink' : 'border-transparent text-muted hover:text-ink',
          )}
        >
          {t}
          {counts?.[t] !== undefined && (
            <span
              className={cx(
                'rounded-full px-1.5 text-caption tabular',
                value === t ? 'bg-ink text-white' : 'bg-sunken text-muted',
              )}
            >
              {counts[t]}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
export function EmptyState({ icon = 'inbox', title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="h-12 w-12 rounded-full bg-sunken flex items-center justify-center text-muted mb-4">
        <Icon name={icon} size={22} />
      </div>
      <h3 className="text-body-lg font-semibold text-ink">{title}</h3>
      {description && <p className="mt-1 text-body text-muted max-w-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
export function Notice({ tone = 'brand', icon, title, children, action, className }) {
  const border = {
    neutral: 'border-line',
    brand: 'border-brand-200',
    success: 'border-[#CFE5D8]',
    warning: 'border-[#EFDDB3]',
    danger: 'border-[#F3CCC7]',
  }
  const defaultIcon = {
    neutral: 'info',
    brand: 'info',
    success: 'check',
    warning: 'alert',
    danger: 'alert',
  }
  return (
    <div
      className={cx(
        'flex items-start gap-3 rounded-lg border p-4',
        TONE[tone],
        border[tone],
        className,
      )}
    >
      <Icon name={icon ?? defaultIcon[tone]} size={16} className="mt-0.5" />
      <div className="flex-1 min-w-0 text-body">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={cx(title && 'mt-0.5', 'opacity-90')}>{children}</div>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
export function Modal({ open, onClose, title, description, children, footer, size = 'md' }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])
  if (!open) return null
  const w = size === 'sm' ? 'max-w-[420px]' : size === 'lg' ? 'max-w-[640px]' : 'max-w-[520px]'
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className={cx(
          'relative w-full bg-surface rounded-t-xl sm:rounded-xl shadow-pop max-h-[92vh] flex flex-col',
          w,
        )}
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4">
          <div>
            <h2 className="text-title-sm font-semibold text-ink">{title}</h2>
            {description && <p className="mt-1 text-body text-muted">{description}</p>}
          </div>
          <IconButton icon="x" label="Close" size="sm" onClick={onClose} className="-mr-2 -mt-1" />
        </div>
        {children && <div className="px-6 pb-2 overflow-y-auto">{children}</div>}
        {footer && (
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 px-6 py-4 mt-2 border-t border-line">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
/** Small anchored menu (three-dot menus, account menu). */
export function Menu({ trigger, items, align = 'right', width = 200 }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    const close = () => setOpen(false)
    document.addEventListener('mousedown', onDoc)
    window.addEventListener('hashchange', close)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      window.removeEventListener('hashchange', close)
    }
  }, [open])
  return (
    <div ref={ref} className="relative" onClick={(e) => e.stopPropagation()}>
      {trigger(open, () => setOpen((o) => !o))}
      {open && (
        <div
          className={cx(
            'absolute top-full mt-2 z-50 bg-surface border border-line rounded-lg shadow-pop py-1.5',
            align === 'right' ? 'right-0' : 'left-0',
          )}
          style={{ width }}
        >
          {items.map((it, i) =>
            it === 'divider' ? (
              <Divider key={i} className="my-1.5" />
            ) : 'header' in it ? (
              <div key={i} className="px-3 py-2">
                {it.header}
              </div>
            ) : (
              <button
                key={i}
                onClick={() => {
                  setOpen(false)
                  it.onClick()
                }}
                className={cx(
                  'w-full flex items-center gap-2.5 px-3 h-9 text-body text-left transition-colors',
                  it.danger ? 'text-danger hover:bg-danger-bg' : 'text-ink hover:bg-sunken',
                )}
              >
                {it.icon && (
                  <Icon name={it.icon} size={15} className={it.danger ? '' : 'text-muted'} />
                )}
                {it.label}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  )
}
//  Tables
export function Table({ head, children, className }) {
  return (
    <div className={cx('overflow-x-auto', className)}>
      <table className="w-full text-body">
        <thead>
          <tr className="border-b border-line">
            {head.map((h, i) => {
              const c = typeof h === 'string' ? { label: h } : h
              return (
                <th
                  key={i}
                  className={cx(
                    'h-10 px-4 first:pl-5 last:pr-5 text-caption font-medium text-muted whitespace-nowrap',
                    c.align === 'right' ? 'text-right' : 'text-left',
                    c.className,
                  )}
                >
                  {c.label}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
    </div>
  )
}
export function Td({ children, className, align }) {
  return (
    <td
      className={cx(
        'h-14 px-4 first:pl-5 last:pr-5 align-middle',
        align === 'right' && 'text-right',
        className,
      )}
    >
      {children}
    </td>
  )
}
//  Toast
let pushToast = () => {}
export const toast = (msg) => pushToast(msg)
export function Toaster() {
  const [items, setItems] = useState([])
  useEffect(() => {
    pushToast = (msg) => {
      const id = Date.now() + Math.random()
      setItems((x) => [...x, { id, msg }])
      setTimeout(() => setItems((x) => x.filter((i) => i.id !== id)), 3200)
    }
  }, [])
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex flex-col items-center gap-2 pointer-events-none">
      {items.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-2 rounded-md bg-ink text-white text-body px-4 h-11 shadow-pop"
        >
          <Icon name="check" size={15} className="text-[#8FD1AE]" />
          {t.msg}
        </div>
      ))}
    </div>
  )
}
//  Brand
export function Logo({ inverse, onClick, size = 'md' }) {
  const box = size === 'lg' ? 32 : 28
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2.5 shrink-0"
      aria-label="CampusNest home"
    >
      <span
        className={cx(
          'inline-flex items-center justify-center rounded-[7px]',
          inverse ? 'bg-white text-brand-800' : 'bg-brand-700 text-white',
        )}
        style={{ width: box, height: box }}
      >
        <svg
          width={box * 0.56}
          height={box * 0.56}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 11 12 4l9 7" />
          <path d="M6 9.5V20h12V9.5" />
          <path d="M10 20v-5h4v5" />
        </svg>
      </span>
      <span
        className={cx(
          'font-semibold tracking-tight',
          size === 'lg' ? 'text-title-sm' : 'text-lead',
          inverse ? 'text-white' : 'text-ink',
        )}
      >
        CampusNest
      </span>
    </button>
  )
}
//  Drawer (slide-in side panel)
/** Side panel that slides in from the left or right. Closes on Esc or backdrop click. */
export function Drawer({ open, onClose, title, side = 'left', footer, children }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])
  return (
    // "invisible" when closed so nothing inside can be tabbed to; waits for the slide-out to finish
    <div
      className={cx(
        'fixed inset-0 z-[90] transition-[visibility] duration-300',
        open ? 'visible' : 'invisible',
      )}
    >
      <div
        onClick={onClose}
        className={cx(
          'absolute inset-0 bg-ink/40 transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0',
        )}
      />
      <aside
        role="dialog"
        aria-modal="true"
        className={cx(
          'absolute top-0 bottom-0 w-[360px] max-w-[88vw] bg-surface shadow-pop flex flex-col transition-transform duration-300 ease-out',
          side === 'left' ? 'left-0' : 'right-0',
          open ? 'translate-x-0' : side === 'left' ? '-translate-x-full' : 'translate-x-full',
        )}
      >
        <div className="h-16 px-5 flex items-center justify-between border-b border-line shrink-0">
          <h2 className="tracking-tight text-title font-semibold text-ink">{title}</h2>
          <IconButton icon="x" label="Close" onClick={onClose} />
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-6">{children}</div>
        {footer && <div className="p-4 border-t border-line flex gap-2 shrink-0">{footer}</div>}
      </aside>
    </div>
  )
}
