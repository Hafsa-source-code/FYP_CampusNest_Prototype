// What this file does:
// The rounded "type a message" bar with a round send button at the bottom of a chat.
// Pressing Enter also sends. The box empties itself after sending.

import { useState } from 'react'
import { Icon } from '@/components/ui'

/** onSend(text): called with the trimmed message; placeholder: grey hint text */
export function MessageComposer({ onSend, placeholder }) {
  const [text, setText] = useState('')
  const canSend = text.trim().length > 0

  const send = () => {
    if (!canSend) return
    onSend(text.trim())
    setText('')
  }

  return (
    <div className="flex items-center gap-2 rounded-full border border-line-strong bg-surface py-1.5 pl-5 pr-1.5 transition-shadow focus-within:border-brand-700 focus-within:ring-[3px] focus-within:ring-brand-700/15">
      <input
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => event.key === 'Enter' && send()}
        placeholder={placeholder}
        aria-label="Message"
        className="min-w-0 flex-1 bg-transparent text-body text-ink outline-none placeholder:text-subtle"
      />
      <button
        type="button"
        onClick={send}
        disabled={!canSend}
        aria-label="Send message"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-700 text-white transition-colors hover:bg-brand-800 disabled:opacity-40"
      >
        <Icon name="send" size={16} />
      </button>
    </div>
  )
}