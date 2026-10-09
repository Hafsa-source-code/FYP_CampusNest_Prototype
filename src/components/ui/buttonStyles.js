// Shared by Button and IconButton so both always look like the same family.

export const BUTTON_BASE =
  'inline-flex items-center justify-center gap-2 font-medium rounded-md transition-colors duration-150 whitespace-nowrap select-none disabled:opacity-45 disabled:pointer-events-none'

export const BUTTON_VARIANTS = {
  primary: 'bg-brand-700 text-white hover:bg-brand-800 active:bg-brand-800',
  secondary: 'bg-surface text-ink border border-line-strong hover:bg-sunken',
  ghost: 'text-ink-2 hover:bg-sunken hover:text-ink',
  danger: 'bg-danger text-white hover:bg-[#961d14]',
  'danger-ghost': 'text-danger hover:bg-danger-bg',
  inverse: 'bg-white text-brand-900 hover:bg-brand-50',
}
