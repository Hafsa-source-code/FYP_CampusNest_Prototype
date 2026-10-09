import { cn } from '@/utils/cn'
import { getInitials } from '@/utils/formatters'

const AVATAR_COLORS = [
  'bg-brand-100 text-brand-800',
  'bg-[#EFE7DC] text-[#6B4E2A]',
  'bg-[#E4E9F2] text-[#2F4468]',
  'bg-[#EAE6F0] text-[#4D3F66]',
  'bg-[#E3EEE6] text-[#2D5A3C]',
]

/** Picks a colour from the name, so the same person always gets the same colour. */
function colorFor(name) {
  const total = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return AVATAR_COLORS[total % AVATAR_COLORS.length]
}

/** Round circle with the person's initials. */
export function Avatar({ name = '', size = 32, className }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-semibold',
        colorFor(name),
        className,
      )}
      style={{ width: size, height: size, fontSize: Math.max(10, size * 0.36) }}
    >
      {getInitials(name)}
    </span>
  )
}
