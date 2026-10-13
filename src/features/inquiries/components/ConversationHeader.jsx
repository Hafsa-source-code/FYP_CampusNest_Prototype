// What this file does:
// The top bar of an open inquiry: back arrow (phones), hostel photo and name, room,
// status badge, and a "⋯" menu with "View hostel" and (while pending) "Cancel inquiry".
// Cancelling asks "Are you sure?" first.

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, IconButton, Menu, Modal, Photo, StatusBadge } from '@/components/ui'
import { useCampus } from '@/features/hostels/hooks/useCampus'
import { hostelLink } from '@/features/hostels/utils/hostelLinks'
import { PATHS } from '@/routes/paths'
import { INQUIRY_STATUS } from '../constants'
import { useInquiryActions } from '../hooks/useInquiryActions'

/** "Cancel this inquiry?" pop-up. */
function CancelInquiryModal({ open, onClose, onConfirm }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      title="Cancel this inquiry?"
      description="The owner will be told you're no longer interested. You can send a new inquiry later."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Keep inquiry
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Cancel inquiry
          </Button>
        </>
      }
    />
  )
}

/** inquiry: from useMyInquiries */
export function ConversationHeader({ inquiry }) {
  const navigate = useNavigate()
  const { campus } = useCampus()
  const { cancel } = useInquiryActions()
  const [confirmingCancel, setConfirmingCancel] = useState(false)

  const { hostel, roomType, roomNumber, status } = inquiry
  const hostelPage = hostelLink(hostel.id, campus)

  const menuItems = [
    { label: 'View hostel', icon: 'building', onClick: () => navigate(hostelPage) },
    ...(status === INQUIRY_STATUS.PENDING
      ? [
          'divider',
          {
            label: 'Cancel inquiry',
            icon: 'x',
            danger: true,
            onClick: () => setConfirmingCancel(true),
          },
        ]
      : []),
  ]

  const confirmCancel = () => {
    cancel(inquiry.id)
    setConfirmingCancel(false)
  }

  return (
    <div className="flex shrink-0 items-center gap-3 border-b border-line px-4 py-3.5 sm:px-5">
      <IconButton
        icon="arrowLeft"
        label="All inquiries"
        className="-ml-1 lg:hidden"
        onClick={() => navigate(PATHS.student.inquiries)}
      />
      <Photo src={hostel.image} alt="" ratio="1/1" className="w-11 shrink-0 !rounded-full" />
      <div className="min-w-0 flex-1">
        <Link
          to={hostelPage}
          className="block truncate text-body-lg font-semibold text-ink hover:text-brand-700"
        >
          {hostel.name}
        </Link>
        <p className="truncate text-small text-muted">
          {roomType.name}
          {roomNumber && ` · Room ${roomNumber}`}
        </p>
      </div>
      <StatusBadge status={status} />
      <Menu
        trigger={(_, toggle) => <IconButton icon="more" label="Inquiry options" onClick={toggle} />}
        items={menuItems}
      />

      <CancelInquiryModal
        open={confirmingCancel}
        onClose={() => setConfirmingCancel(false)}
        onConfirm={confirmCancel}
      />
    </div>
  )
}