// What this file does:
// The student's inquiries page (/student/inquiries and /student/inquiries/:id).
// It only puts the pieces together: title + All/Active/Closed tabs, the list on the left,
// and the open inquiry on the right. On phones only one side shows at a time.

import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Container, PageHeader, SegmentedControl } from '@/components/ui'
import { EmptyState } from '@/components/feedback'
import { InquiryConversation } from '@/features/inquiries/components/InquiryConversation'
import { InquiryList } from '@/features/inquiries/components/InquiryList'
import { INQUIRY_FILTERS } from '@/features/inquiries/constants'
import { useMyInquiries } from '@/features/inquiries/hooks/useMyInquiries'
import { countByFilter, filterInquiries } from '@/features/inquiries/utils/inquiryFilters'
import { PATHS } from '@/routes/paths'
import { cn } from '@/utils/cn'

export function MyInquiriesPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const inquiries = useMyInquiries()
  const [filter, setFilter] = useState(INQUIRY_FILTERS.ALL)

  // With an id in the address, show that inquiry; without one, computers show the first
  const hasId = id !== undefined
  const openInquiry = hasId
    ? inquiries.find((inquiry) => inquiry.id === Number(id))
    : inquiries[0]

  return (
    <Container className="pb-16">
      <PageHeader
        title="Inquiries"
        description="Your conversations with hostel owners, in one place."
        actions={
          inquiries.length > 0 && (
            <SegmentedControl
              options={Object.values(INQUIRY_FILTERS)}
              value={filter}
              onChange={setFilter}
              counts={countByFilter(inquiries)}
            />
          )
        }
      />

      {inquiries.length === 0 ? (
        <div className="rounded-xl border border-line bg-surface">
          <EmptyState
            icon="inbox"
            title="No inquiries yet"
            description="When you send an inquiry to a hostel, the conversation will appear here."
            action={
              <Button icon="search" onClick={() => navigate(PATHS.student.search)}>
                Find a hostel
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid overflow-hidden rounded-xl border border-line bg-surface shadow-card lg:h-[calc(100vh-200px)] lg:min-h-[620px] lg:grid-cols-[360px_1fr]">
          <aside
            className={cn(
              'flex min-h-0 flex-col border-line lg:border-r',
              hasId && 'hidden lg:flex',
            )}
          >
            <InquiryList
              inquiries={filterInquiries(inquiries, filter)}
              openId={openInquiry?.id}
              filter={filter}
            />
          </aside>

          <section className={cn('flex min-h-0 flex-col', !hasId && 'hidden lg:flex')}>
            {openInquiry ? (
              <InquiryConversation inquiry={openInquiry} />
            ) : (
              <div className="flex flex-1 items-center justify-center">
                <EmptyState
                  icon="message"
                  title="Select an inquiry"
                  description="Choose a conversation on the left."
                />
              </div>
            )}
          </section>
        </div>
      )}
    </Container>
  )
}