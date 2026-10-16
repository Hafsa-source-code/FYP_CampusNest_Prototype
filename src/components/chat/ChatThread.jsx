// What this file does:
// Shows a conversation as chat bubbles: my messages on the right in blue, the other person's
// on the left in white with their initials. Scrolls to the newest message automatically.
// Used by inquiries (student and owner) and later by marketplace "Message seller".

import { useEffect, useRef } from 'react'
import { Avatar, Icon, IconCircle } from '@/components/ui'
import { cn } from '@/utils/cn'

/** One chat bubble with its time underneath. */
function MessageBubble({ message, isMine, otherName }) {
  return (
    <div className={cn('flex gap-2.5', isMine ? 'justify-end' : 'justify-start')}>
      {!isMine && <Avatar name={otherName} size={30} className="mt-auto" />}
      <div className="max-w-[80%] sm:max-w-[68%]">
        <div
          className={cn(
            'rounded-[18px] px-4 py-2.5 text-body leading-relaxed shadow-card',
            isMine
              ? 'rounded-br-[6px] bg-brand-700 text-white'
              : 'rounded-bl-[6px] border border-line bg-surface text-ink',
          )}
        >
          {message.text}
        </div>
        <p
          className={cn(
            'mt-1 flex items-center gap-1 text-tiny text-subtle',
            isMine && 'justify-end',
          )}
        >
          {message.time}
          {isMine && <Icon name="check" size={12} className="text-brand-700" />}
        </p>
      </div>
    </div>
  )
}

/**
 * messages: [{ id, from, text, time }]
 * me: which `from` value is "me" (e.g. 'student'); otherName: shown as initials on their bubbles
 */
export function ChatThread({ messages, me, otherName }) {
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'nearest' })
  }, [messages.length])

  if (messages.length === 0)
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <IconCircle icon="message" size={48} />
        <p className="mt-3 text-body font-semibold text-ink">No messages yet</p>
        <p className="mt-1 text-small text-muted">Start the conversation below.</p>
      </div>
    )

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          isMine={message.from === me}
          otherName={otherName}
        />
      ))}
      <div ref={endRef} />
    </div>
  )
}