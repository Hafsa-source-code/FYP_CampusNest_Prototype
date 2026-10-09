import { useCallback, useRef, useState } from 'react'
import { cn } from '@/utils/cn'
import { useClickOutside } from '@/hooks/useClickOutside'
import { Divider } from './Divider'
import { Icon } from './Icon'

/** One row inside the menu. */
function MenuItem({ item, onPick }) {
  if (item === 'divider') return <Divider className="my-1.5" />
  if (item.header) return <div className="px-3 py-2">{item.header}</div>

  return (
    <button
      type="button"
      onClick={() => onPick(item)}
      className={cn(
        'flex h-9 w-full items-center gap-2.5 px-3 text-left text-body transition-colors',
        item.danger ? 'text-danger hover:bg-danger-bg' : 'text-ink hover:bg-sunken',
      )}
    >
      {item.icon && (
        <Icon name={item.icon} size={15} className={item.danger ? undefined : 'text-muted'} />
      )}
      {item.label}
    </button>
  )
}

/**
 * Small drop-down menu (three-dot menus, account menu, notifications).
 * trigger: function (isOpen, toggle) => the button that opens the menu
 * items: array of { label, icon, onClick, danger } | 'divider' | { header }
 */
export function Menu({ trigger, items, align = 'right', width = 200 }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  const close = useCallback(() => setOpen(false), [])
  const toggle = () => setOpen((isOpen) => !isOpen)

  useClickOutside(menuRef, close, open)

  const pick = (item) => {
    close()
    item.onClick()
  }

  return (
    <div ref={menuRef} className="relative" onClick={(event) => event.stopPropagation()}>
      {trigger(open, toggle)}

      {open && (
        <div
          className={cn(
            'absolute top-full z-50 mt-2 rounded-lg border border-line bg-surface py-1.5 shadow-pop',
            align === 'right' ? 'right-0' : 'left-0',
          )}
          style={{ width }}
        >
          {items.map((item, index) => (
            <MenuItem key={index} item={item} onPick={pick} />
          ))}
        </div>
      )}
    </div>
  )
}