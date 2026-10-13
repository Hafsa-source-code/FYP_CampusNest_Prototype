// What this file does:
// Small helpers that turn raw values into text people read: prices, initials, dates.

/** 15500 → "Rs 15,500" */
export function formatPrice(amount) {
  return `Rs ${amount.toLocaleString('en-PK')}`
}

/** "Areesha Khan" → "AK" (used in avatars) */
export function getInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

/** "2026-10-01" (from a date input) → "1 Oct 2026" */
export function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}