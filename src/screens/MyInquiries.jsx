import { useState } from 'react'
import { useStore } from '../store'
import { navigate, rs, cx } from '../lib'
import { Icon } from '../components/icons'
import {
  Button,
  Container,
  EmptyState,
  Field,
  IconButton,
  Menu,
  Modal,
  Notice,
  Photo,
  StatusBadge,
  Stars,
  Textarea,
  toast,
} from '../components/ui'
import {
  ChatThread,
  Composer,
  InquiryListItem,
  FilterTabs,
  StatusTracker,
  DetailChip,
  StarPicker,
} from '../components/inquiry/InquiryParts'
// Keep these exports so the owner's inquiries page keeps working
export { ChatThread, Composer }
const FILTERS = ['All', 'Active', 'Closed']
const ACTIVE_STATUSES = ['Pending', 'Moved In']
const MIN_REVIEW = 20
export function MyInquiries({ selectedId }) {
  const s = useStore()
  const mine = s.inquiries.filter((i) => i.studentId === s.currentUser.id)
  const selected =
    mine.find((i) => i.id === selectedId) ?? (selectedId === undefined ? mine[0] : undefined)
  const [filter, setFilter] = useState('All')
  const [reviewOpen, setReviewOpen] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [stars, setStars] = useState(0)
  const [text, setText] = useState('')
  // Data for the selected conversation (unchanged)
  const review = selected && s.reviews.find((r) => r.inquiryId === selected.id)
  const h = selected && s.hostel(selected.hostelId)
  const type = selected && s.roomTypes.find((t) => t.id === selected.roomTypeId)
  const room =
    selected && s.rooms.find((r) => r.id === (selected.assignedRoomId ?? selected.roomId))
  const openReview = () => {
    setStars(review?.rating ?? 0)
    setText(review?.text ?? '')
    setReviewOpen(true)
  }
  // List filtering
  const isActive = (status) => ACTIVE_STATUSES.includes(status)
  const counts = {
    All: mine.length,
    Active: mine.filter((i) => isActive(i.status)).length,
    Closed: mine.filter((i) => !isActive(i.status)).length,
  }
  const listed = mine.filter(
    (i) => filter === 'All' || (filter === 'Active') === isActive(i.status),
  )
  const previewOf = (chat) => {
    const last = chat[chat.length - 1]
    return last ? `${last.from === 'student' ? 'You: ' : ''}${last.text}` : undefined
  }
  return (
    <Container className="pb-16">
      {/*  Page title + filter tabs  */}
      <div className="pt-8 pb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="tracking-tight text-display-sm leading-tight font-semibold text-ink">
            Inquiries
          </h1>
          <p className="mt-1 text-body text-muted">
            Your conversations with hostel owners, in one place.
          </p>
        </div>
        {mine.length > 0 && (
          <FilterTabs options={FILTERS} value={filter} counts={counts} onChange={setFilter} />
        )}
      </div>

      {mine.length === 0 ? (
        <div className="rounded-xl border border-line bg-surface">
          <EmptyState
            icon="inbox"
            title="No inquiries yet"
            description="When you send an inquiry to a hostel, the conversation will appear here."
            action={
              <Button icon="search" onClick={() => navigate('/s/search')}>
                Find a hostel
              </Button>
            }
          />
        </div>
      ) : (
        <div className="rounded-xl border border-line bg-surface shadow-card overflow-hidden grid lg:grid-cols-[360px_1fr] lg:h-[calc(100vh-200px)] lg:min-h-[620px]">
          {/*  Left: conversation list  */}
          <aside
            className={cx(
              'lg:border-r border-line flex flex-col min-h-0',
              selectedId !== undefined && 'hidden lg:flex',
            )}
          >
            <div className="h-14 px-4 flex items-center justify-between border-b border-line shrink-0">
              <p className="text-body font-semibold text-ink flex items-center gap-2">
                <Icon name="inbox" size={16} className="text-brand-700" />
                Conversations
              </p>
              <span className="text-caption text-muted tabular">{listed.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-line">
              {listed.length === 0 ? (
                <p className="p-6 text-center text-small text-muted">
                  No {filter.toLowerCase()} inquiries.
                </p>
              ) : (
                listed.map((i) => {
                  const hh = s.hostel(i.hostelId)
                  return (
                    <InquiryListItem
                      key={i.id}
                      photo={hh?.image}
                      hostelName={hh?.name}
                      roomType={s.roomTypes.find((t) => t.id === i.roomTypeId)?.name}
                      status={i.status}
                      date={i.date}
                      preview={previewOf(i.chat)}
                      active={selected?.id === i.id}
                      onClick={() => navigate(`/s/inquiries/${i.id}`)}
                    />
                  )
                })
              )}
            </div>
          </aside>

          {/*  Right: selected conversation  */}
          {selected && h && type ? (
            <section
              className={cx('flex flex-col min-h-0', selectedId === undefined && 'hidden lg:flex')}
            >
              {/* Chat header */}
              <div className="px-4 sm:px-5 py-3.5 border-b border-line flex items-center gap-3 shrink-0">
                <IconButton
                  icon="arrowLeft"
                  label="All inquiries"
                  className="lg:hidden -ml-1"
                  onClick={() => navigate('/s/inquiries')}
                />
                <Photo src={h.image} alt="" ratio="1/1" className="w-11 shrink-0 !rounded-full" />
                <div className="min-w-0 flex-1">
                  <button
                    onClick={() => navigate(`/s/hostel/${h.id}`)}
                    className="text-body-lg font-semibold text-ink hover:text-brand-700 truncate block"
                  >
                    {h.name}
                  </button>
                  <p className="text-small text-muted truncate">
                    {type.name}
                    {room ? ` · Room ${room.number}` : ''}
                  </p>
                </div>
                <StatusBadge status={selected.status} />
                <Menu
                  trigger={(_, t) => <IconButton icon="more" label="Inquiry options" onClick={t} />}
                  items={[
                    {
                      label: 'View hostel',
                      icon: 'building',
                      onClick: () => navigate(`/s/hostel/${h.id}`),
                    },
                    ...(selected.status === 'Pending'
                      ? [
                          'divider',
                          {
                            label: 'Cancel inquiry',
                            icon: 'x',
                            danger: true,
                            onClick: () => setCancelOpen(true),
                          },
                        ]
                      : []),
                  ]}
                />
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto">
                {/* Status + details */}
                <div className="p-4 sm:p-5 border-b border-line space-y-5">
                  <StatusTracker status={selected.status} />
                  <div className="grid grid-cols-2 xl:grid-cols-4 gap-2.5">
                    <DetailChip
                      icon="calendar"
                      label="Move-in"
                      value={selected.actualMoveIn ?? selected.moveIn}
                    />
                    <DetailChip
                      icon="clock"
                      label="Stay length"
                      value={`${selected.duration} months`}
                    />
                    <DetailChip icon="tag" label="Rent" value={`${rs(type.price)} / seat`} />
                    <DetailChip icon="send" label="Sent" value={selected.date} />
                  </div>

                  {selected.status === 'Declined' && (
                    <Notice tone="danger" title="The owner declined this inquiry">
                      {selected.declineReason ?? 'No reason was given.'}
                    </Notice>
                  )}
                  {selected.status === 'Expired' && (
                    <Notice tone="neutral" icon="clock" title="This inquiry expired">
                      The owner didn't respond within 14 days. You can send a new inquiry from the
                      hostel page.
                    </Notice>
                  )}
                  {selected.status === 'Cancelled' && (
                    <Notice tone="neutral" icon="x" title="You cancelled this inquiry" />
                  )}
                  {selected.status === 'Moved In' && !review && (
                    <Notice
                      tone="success"
                      icon="star"
                      title={`You moved in on ${selected.actualMoveIn}`}
                      action={
                        <Button size="sm" icon="pen" onClick={openReview}>
                          Write a review
                        </Button>
                      }
                    >
                      Help the next student decide — your review will be marked as a verified stay.
                    </Notice>
                  )}
                  {selected.status === 'Moved In' && review && (
                    <div className="rounded-lg border border-line bg-sunken/50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="flex items-center gap-1.5 text-small font-semibold text-ink">
                          <Icon name="star" size={14} filled className="text-star" />
                          Your review
                        </p>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" icon="edit" onClick={openReview}>
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="danger-ghost"
                            icon="trash"
                            onClick={() => {
                              s.deleteReview(selected.id)
                              toast('Review deleted')
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                      <Stars value={review.rating} size={14} className="mt-1" />
                      <p className="mt-2 text-body text-ink-2 leading-relaxed">{review.text}</p>
                      {review.reply && (
                        <div className="mt-3 rounded-md bg-surface border border-line p-3">
                          <p className="flex items-center gap-1.5 text-caption font-semibold text-ink">
                            <Icon name="message" size={12} />
                            Owner replied
                          </p>
                          <p className="mt-1 text-small text-muted">{review.reply}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Messages */}
                <div className="p-4 sm:p-6 bg-canvas min-h-[240px]">
                  <ChatThread inquiry={selected} me="student" otherName={h.name} />
                </div>
              </div>

              {/* Message bar */}
              {selected.status === 'Pending' || selected.status === 'Moved In' ? (
                <div className="p-3 sm:p-4 border-t border-line shrink-0">
                  <Composer
                    placeholder={`Message ${h.name}…`}
                    onSend={(t) => s.sendInquiryMessage(selected.id, 'student', t)}
                  />
                  <p className="mt-2 flex items-center justify-center gap-1.5 text-caption text-muted">
                    <Icon name="lock" size={12} />
                    Your number is never shared
                  </p>
                </div>
              ) : (
                <div className="p-4 border-t border-line flex items-center justify-center gap-1.5 text-small text-muted shrink-0">
                  <Icon name="lock" size={13} />
                  This conversation is closed.
                </div>
              )}
            </section>
          ) : (
            <div className="hidden lg:flex items-center justify-center">
              <EmptyState
                icon="message"
                title="Select an inquiry"
                description="Choose a conversation on the left."
              />
            </div>
          )}
        </div>
      )}

      {/*  Review pop-up  */}
      <Modal
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        title={`Review your stay at ${h?.name ?? ''}`}
        description="Be specific and fair — this helps the next student and the owner."
        footer={
          <>
            <Button variant="secondary" onClick={() => setReviewOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!stars || text.trim().length < MIN_REVIEW}
              onClick={() => {
                if (selected) {
                  s.submitReview(selected.id, stars, text.trim())
                  setReviewOpen(false)
                  toast(review ? 'Review updated' : 'Review published')
                }
              }}
            >
              {review ? 'Save changes' : 'Publish review'}
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <div>
            <p className="mb-2 text-small font-medium text-ink">Overall rating</p>
            <StarPicker value={stars} onChange={setStars} />
          </div>
          <Field
            label="Your review"
            hint="Think about cleanliness, management, food, safety and the commute."
          >
            <Textarea
              rows={5}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What should the next student know?"
            />
          </Field>
          <p
            className={cx(
              '-mt-3 text-caption tabular',
              text.trim().length >= MIN_REVIEW ? 'text-success' : 'text-muted',
            )}
          >
            {text.trim().length}/{MIN_REVIEW} characters minimum
          </p>
        </div>
      </Modal>

      {/*  Cancel pop-up  */}
      <Modal
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        size="sm"
        title="Cancel this inquiry?"
        description="The owner will be told you're no longer interested. You can send a new inquiry later."
        footer={
          <>
            <Button variant="secondary" onClick={() => setCancelOpen(false)}>
              Keep inquiry
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (selected) s.cancelInquiry(selected.id)
                setCancelOpen(false)
              }}
            >
              Cancel inquiry
            </Button>
          </>
        }
      />
    </Container>
  )
}
