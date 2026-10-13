// What this file does:
// What a student can do with one of their inquiries: send a message, or cancel it.
// TEMPORARY: writes to the demo store; later these call the backend.

import { useStore } from '@/store'
import { SENDER } from '../constants'

export function useInquiryActions() {
  const { sendInquiryMessage, cancelInquiry } = useStore()

  return {
    sendMessage: (inquiryId, text) => sendInquiryMessage(inquiryId, SENDER.STUDENT, text),
    cancel: (inquiryId) => cancelInquiry(inquiryId),
  }
}