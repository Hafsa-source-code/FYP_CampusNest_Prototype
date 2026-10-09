import { clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// These must match the --text-* and --shadow-* names in index.css.
// tailwind-merge can't read our CSS, so without this list it would think
// "text-small" is a colour (like "text-ink") and wrongly remove one of them.
const FONT_SIZES = [
  'micro',
  'tiny',
  'caption',
  'small',
  'body',
  'body-lg',
  'lead',
  'title-sm',
  'title',
  'heading',
  'display-sm',
  'display',
  'display-lg',
]
const SHADOWS = ['card', 'pop']

const twMerge = extendTailwindMerge({
  extend: { theme: { text: FONT_SIZES, shadow: SHADOWS } },
})

/**
 * Combines class names into one string.
 * - Skips empty values: cn('a', false && 'b') → 'a'
 * - When two classes clash, the LAST one wins: cn('p-2', 'p-4') → 'p-4'
 *   This lets any component accept a className that safely overrides its defaults.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
