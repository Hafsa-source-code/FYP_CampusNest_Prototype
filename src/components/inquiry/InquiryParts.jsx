// TEMPORARY BRIDGE
// The student's inquiries page has been rebuilt; these old screens still import from here:
//   OwnerInquiries  → ChatThread, Composer, StatusTracker, DetailChip, StudentListItem
//   MarketplaceItem → Composer
// The real pieces now live in:
//   components/chat/ChatThread.jsx, components/chat/MessageComposer.jsx,
//   features/inquiries/components/InquiryStatusTracker.jsx, components/ui/InfoTile.jsx
// StudentListItem stays here (old code) until the owner pages are rebuilt in Step 5.7.

import { ChatThread as NewChatThread } from '@/components/chat/ChatThread'
import { Avatar, Icon, StatusBadge } from '@/components/ui'
import { cn } from '@/utils/cn'

export { MessageComposer as Composer } from '@/components/chat/MessageComposer'
export { InquiryStatusTracker as StatusTracker } from '@/features/inquiries/components/InquiryStatusTracker'
export { InfoTile as DetailChip } from '@/components/ui'

/** Old screens pass the whole inquiry; the new ChatThread takes just the messages. */
export function ChatThread({ inquiry, ...rest }) {
  return <NewChatThread messages={inquiry.chat} {...rest} />
}

/** Inbox row for the owner's side: student avatar instead of hostel photo. */
export function StudentListItem({ name, status, roomType, moveIn, preview, active, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-current={active ? 'true' : undefined}
      className={cn(
        'relative w-full text-left flex gap-3 px-4 py-3.5 transition-colors',
        active ? 'bg-brand-50' : 'hover:bg-sunken',
      )}
    >
      {active && <span className="absolute left-0 inset-y-2 w-1 rounded-r-full bg-brand-700" />}
      <Avatar name={name} size={42} />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-body font-semibold text-ink truncate">{name}</p>
          <StatusBadge status={status} />
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-caption text-muted">
          <span className="inline-flex items-center gap-1 truncate">
            <Icon name="door" size={11} />
            {roomType}
          </span>
          <span className="inline-flex items-center gap-1 shrink-0">
            <Icon name="calendar" size={11} />
            {moveIn}
          </span>
        </div>
        {preview && <p className="mt-1 text-small text-ink-2 truncate">{preview}</p>}
      </div>
    </button>
  )
}