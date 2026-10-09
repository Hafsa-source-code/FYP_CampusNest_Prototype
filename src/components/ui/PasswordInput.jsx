import { useState } from 'react'
import { Icon } from './Icon'
import { Input } from './Input'

/** Password box with a lock icon and a show/hide (eye) button. */
export function PasswordInput(props) {
  const [visible, setVisible] = useState(false)

  const toggleButton = (
    <button
      type="button"
      onClick={() => setVisible((isVisible) => !isVisible)}
      aria-label={visible ? 'Hide password' : 'Show password'}
      aria-pressed={visible}
      className="flex h-9 w-9 items-center justify-center rounded-[6px] text-muted hover:bg-sunken hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40"
    >
      <Icon name={visible ? 'eyeOff' : 'eye'} size={17} />
    </button>
  )

  return <Input {...props} icon="lock" type={visible ? 'text' : 'password'} suffix={toggleButton} />
}
