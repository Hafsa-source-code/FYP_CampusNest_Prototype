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
