// What this file does:
// The right side of the inquiries page: one open inquiry from top to bottom —
// header, summary, chat messages, and the message bar (or "This conversation is closed").

import { Icon } from '@/components/ui'
import { ChatThread } from '@/components/chat/ChatThread'
import { MessageComposer } from '@/components/chat/MessageComposer'
import { SENDER } from '../constants'
import { useInquiryActions } from '../hooks/useInquiryActions'
import { isOpenInquiry } from '../utils/inquiryFilters'
import { ConversationHeader } from './ConversationHeader'
import { InquiryOverview } from './InquiryOverview'

/** Grey line under the message bar, or in its place when the chat is closed. */
function FooterNote({ children }) {
  return (
    <p className="flex items-center justify-center gap-1.5 text-caption text-muted">
      <Icon name="lock" size={12} />
      {children}
    </p>
  )
}

/** inquiry: from useMyInquiries */
export function InquiryConversation({ inquiry }) {
  const { sendMessage } = useInquiryActions()

  return (
    <>
      <ConversationHeader inquiry={inquiry} />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <InquiryOverview inquiry={inquiry} />
        <div className="min-h-[240px] bg-canvas p-4 sm:p-6">
          <ChatThread messages={inquiry.chat} me={SENDER.STUDENT} otherName={inquiry.hostel.name} />
        </div>
      </div>

      <div className="shrink-0 border-t border-line p-3 sm:p-4">
        {isOpenInquiry(inquiry) ? (
          <>
            <MessageComposer
              placeholder={`Message ${inquiry.hostel.name}…`}
              onSend={(text) => sendMessage(inquiry.id, text)}
            />
            <div className="mt-2">
              <FooterNote>Your number is never shared</FooterNote>
            </div>
          </>
        ) : (
          <FooterNote>This conversation is closed.</FooterNote>
        )}
      </div>
    </>
  )
}