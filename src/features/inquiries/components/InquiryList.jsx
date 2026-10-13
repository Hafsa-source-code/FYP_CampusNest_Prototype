// What this file does:
// The left column of the inquiries page: "Conversations" and one row per inquiry
// (hostel photo, name, room type, date, last message, status). Clicking a row opens it.

import { generatePath, useNavigate } from 'react-router-dom'
import { Icon, Photo, StatusBadge } from '@/components/ui'
import { PATHS } from '@/routes/paths'
import { cn } from '@/utils/cn'

/** One inquiry in the list. The open one is tinted blue with a blue bar on the left. */
function InquiryRow({ inquiry, isOpen, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-current={isOpen ? 'true' : undefined}
      className={cn(
        'relative flex w-full gap-3 px-4 py-3.5 text-left transition-colors',
        isOpen ? 'bg-brand-50' : 'hover:bg-sunken',
      )}
    >
      {isOpen && <span className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-brand-700" />}
      <Photo src={inquiry.hostel.image} alt="" ratio="1/1" className="w-12 shrink-0 !rounded-full" />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="truncate text-body font-semibold text-ink">{inquiry.hostel.name}</p>
          <span className="shrink-0 text-tiny text-subtle">{inquiry.date}</span>
        </div>
        <p className="truncate text-caption text-muted">{inquiry.roomType.name}</p>
        {inquiry.preview && (
          <p className="mt-1 truncate text-small text-ink-2">{inquiry.preview}</p>
        )}
        <div className="mt-1.5">
          <StatusBadge status={inquiry.status} />
        </div>
      </div>
    </button>
  )
}

/**
 * inquiries: the ones under the chosen tab; openId: the inquiry shown on the right
 * filter: the chosen tab name (used in the "No active inquiries" message)
 */
export function InquiryList({ inquiries, openId, filter }) {
  const navigate = useNavigate()

  return (
    <>
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-line px-4">
        <p className="flex items-center gap-2 text-body font-semibold text-ink">
          <Icon name="inbox" size={16} className="text-brand-700" />
          Conversations
        </p>
        <span className="tabular text-caption text-muted">{inquiries.length}</span>
      </div>

      <div className="flex-1 divide-y divide-line overflow-y-auto">
        {inquiries.length === 0 ? (
          <p className="p-6 text-center text-small text-muted">
            No {filter.toLowerCase()} inquiries.
          </p>
        ) : (
          inquiries.map((inquiry) => (
            <InquiryRow
              key={inquiry.id}
              inquiry={inquiry}
              isOpen={inquiry.id === openId}
              onOpen={() => navigate(generatePath(PATHS.student.inquiry, { id: inquiry.id }))}
            />
          ))
        )}
      </div>
    </>
  )
}