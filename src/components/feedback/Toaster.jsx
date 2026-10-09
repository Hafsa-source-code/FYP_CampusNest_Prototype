import { useEffect, useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import { subscribeToToasts } from './toastStore'

const VISIBLE_FOR_MS = 3200

/** Shows toast messages. Place it ONCE in the app; then call toast('Saved') from anywhere. */
export function Toaster() {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    return subscribeToToasts((text) => {
      const id = crypto.randomUUID()
      setMessages((current) => [...current, { id, text }])
      setTimeout(() => {
        setMessages((current) => current.filter((message) => message.id !== id))
      }, VISIBLE_FOR_MS)
    })
  }, [])

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[200] flex -translate-x-1/2 flex-col items-center gap-2">
      {messages.map((message) => (
        <div
          key={message.id}
          role="status"
          className="flex h-11 items-center gap-2 rounded-md bg-ink px-4 text-body text-white shadow-pop"
        >
          <Icon name="check" size={15} className="text-[#8FD1AE]" />
          {message.text}
        </div>
      ))}
    </div>
  )
}
