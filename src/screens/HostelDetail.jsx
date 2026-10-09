import { useState } from 'react'
import { useStore } from '../store'
import { navigate } from '../lib'
import { Icon, FACILITY_ICON } from '../components/icons'
import {
  Button,
  Container,
  EmptyState,
  Field,
  Modal,
  Photo,
  Textarea,
  toast,
} from '../components/ui'
import {
  Section,
  SectionTabs,
  useActiveSection,
  PillButton,
  FactTile,
  FacilityItem,
  RoomTypeCard,
  LocationMap,
  TravelCard,
  ReviewSummary,
  ReviewCard,
  BookingCard,
  MobileBookingBar,
} from '../components/hostel/DetailParts'
const CAMPUS = 'PU New Campus'
const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'rooms', label: 'Rooms' },
  { id: 'location', label: 'Location' },
  { id: 'reviews', label: 'Reviews' },
]
export function HostelDetail({ id }) {
  const s = useStore()
  const h = s.hostel(id)
  const active = useActiveSection(TABS.map((t) => t.id))
  const [reportId, setReportId] = useState(null)
  const [reason, setReason] = useState('')
  const [allPhotos, setAllPhotos] = useState(false)
  if (!h)
    return (
      <Container>
        <EmptyState
          icon="building"
          title="Hostel not found"
          action={<Button onClick={() => navigate('/s/search')}>Back to search</Button>}
        />
      </Container>
    )
  // Data (unchanged)
  const types = s.typesFor(h.id)
  const reviews = s.reviews.filter((r) => r.hostelId === h.id)
  const saved = s.wishlistIds.includes(h.id)
  const free = s.freeSeats(h.id)
  const price = s.startingPrice(h.id)
  const walk = Math.round(h.distance * 12.5)
  const travel = [
    {
      icon: 'walk',
      mode: 'Walk',
      time: `${walk} min`,
      note: `${h.distance} km`,
    },
    {
      icon: 'bus',
      mode: 'Metro / van',
      time: `${Math.max(6, Math.round(walk / 2))} min`,
      note: 'incl. 4 min walk to stop',
    },
    {
      icon: 'car',
      mode: 'Rickshaw / car',
      time: `${Math.max(3, Math.round(h.distance * 4))} min`,
      note: 'at 8 am traffic',
    },
  ]
  const back = () => (history.length > 1 ? history.back() : navigate('/s/search'))
  const toRooms = () => document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth' })
  const share = () => {
    navigator.clipboard?.writeText(location.href)
    toast('Link copied')
  }
  const toggleSave = () => {
    s.toggleWishlist(h.id)
    toast(saved ? 'Removed from saved' : 'Saved to your list')
  }
  return (
    <>
      {/*  Header: breadcrumb, title, actions, gallery  */}
      <Container className="pt-6">
        <div className="flex items-center justify-between gap-4">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 min-w-0 text-small text-muted"
          >
            <button onClick={back} className="inline-flex items-center gap-1.5 hover:text-ink">
              <Icon name="arrowLeft" size={14} />
              Find a hostel
            </button>
            <Icon name="chevronRight" size={14} className="text-subtle shrink-0" />
            <span className="hidden sm:inline">{h.area}</span>
            <Icon name="chevronRight" size={14} className="hidden sm:inline text-subtle shrink-0" />
            <span className="font-medium text-ink truncate">{h.name}</span>
          </nav>
          <div className="flex gap-2 shrink-0">
            <PillButton icon="share" onClick={share}>
              Share
            </PillButton>
            <PillButton icon="heart" filled={saved} active={saved} onClick={toggleSave}>
              {saved ? 'Saved' : 'Save'}
            </PillButton>
          </div>
        </div>

        <h1 className="mt-5 tracking-tight text-display-sm sm:text-display leading-[1.1] font-semibold text-ink">
          {h.name}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-body text-muted">
          {h.rating > 0 ? (
            <span className="inline-flex items-center gap-1.5 font-semibold text-ink">
              <Icon name="star" size={15} filled className="text-star" strokeWidth={1.5} />
              {h.rating.toFixed(1)}
              <span className="font-normal text-muted">({h.reviewCount} reviews)</span>
            </span>
          ) : (
            <span>New on CampusNest</span>
          )}
          {h.verifiedStays > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <Icon name="shieldCheck" size={15} className="text-success" />
              {h.verifiedStays} verified stays
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Icon name="mapPin" size={15} />
            {h.address}
          </span>
        </div>

        <div className="relative mt-6">
          <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[260px] sm:h-[440px] rounded-xl overflow-hidden">
            {h.gallery.slice(0, 5).map((src, i) => (
              <button
                key={i}
                onClick={() => setAllPhotos(true)}
                aria-label={`Open photo ${i + 1}`}
                className={
                  i === 0
                    ? h.gallery.length > 1
                      ? 'col-span-4 sm:col-span-2 row-span-2'
                      : 'col-span-4 row-span-2'
                    : 'hidden sm:block'
                }
              >
                <Photo
                  src={src}
                  alt={`${h.name} photo ${i + 1}`}
                  ratio="auto"
                  rounded={false}
                  className="h-full hover:opacity-90 transition-opacity"
                />
              </button>
            ))}
          </div>
          <button
            onClick={() => setAllPhotos(true)}
            className="absolute right-4 bottom-4 h-9 px-4 rounded-full bg-white/95 shadow-pop inline-flex items-center gap-2 text-small font-semibold text-ink hover:bg-white"
          >
            <Icon name="grid" size={15} />
            Show all {h.gallery.length} photos
          </button>
        </div>
      </Container>

      {/*  Body: sticky tabs, content left, price card right  */}
      <Container className="mt-8 pb-24 lg:pb-0">
        <SectionTabs tabs={TABS} active={active} />

        <div className="lg:grid lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-8">
            <Section id="overview" title="About this hostel">
              <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-7">
                <FactTile icon="users" label="Hostel for" value={`${h.gender} students`} />
                <FactTile icon="walk" label="Distance" value={`${h.distance} km to campus`} />
                <FactTile icon="bed" label="Seats free" value={free} />
                <FactTile icon="calendar" label="Listed since" value={h.listedOn} />
              </div>
              <p className="text-body-lg leading-relaxed text-ink-2 max-w-[65ch]">
                {h.description}
              </p>

              <h3 className="mt-9 mb-5 text-lead font-semibold text-ink">Facilities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6">
                {h.facilities.map((f) => (
                  <FacilityItem key={f} icon={FACILITY_ICON[f] ?? 'check'} label={f} />
                ))}
              </div>
            </Section>

            <Section
              id="rooms"
              title="Rooms"
              aside={
                <span className="text-body text-muted">
                  {types.length} room {types.length === 1 ? 'type' : 'types'}
                </span>
              }
            >
              <div className="space-y-4">
                {types.map((t) => {
                  const rooms = s.roomsFor(t.id)
                  return (
                    <RoomTypeCard
                      key={t.id}
                      name={t.name}
                      photo={t.photoUrls[0]}
                      ac={t.ac}
                      seatsPerRoom={t.seatsPerRoom}
                      roomCount={rooms.length}
                      price={t.price}
                      freeSeats={rooms.reduce((a, r) => a + r.freeSeats, 0)}
                      onChoose={() => navigate(`/s/hostel/${h.id}/room/${t.id}`)}
                    />
                  )
                })}
              </div>
            </Section>

            <Section
              id="location"
              title="Location"
              aside={
                <span className="inline-flex items-center gap-1.5 text-body text-muted">
                  <Icon name="mapPin" size={14} />
                  {h.area}, Lahore
                </span>
              }
            >
              <LocationMap hostelName={h.name} campus={CAMPUS} />
              <div className="mt-4 grid sm:grid-cols-3 gap-3">
                {travel.map((t) => (
                  <TravelCard key={t.mode} {...t} />
                ))}
              </div>
            </Section>

            <Section
              id="reviews"
              title="Reviews"
              aside={
                h.reviewCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 text-body font-semibold text-ink">
                    <Icon name="star" size={15} filled className="text-star" strokeWidth={1.5} />
                    {h.rating.toFixed(1)}
                    <span className="font-normal text-muted">· {h.reviewCount} reviews</span>
                  </span>
                )
              }
            >
              {reviews.length === 0 ? (
                <div className="rounded-xl border border-dashed border-line-strong bg-surface">
                  <EmptyState
                    icon="star"
                    title="No reviews yet"
                    description="Only students who have moved in can leave a review."
                  />
                </div>
              ) : (
                <>
                  <ReviewSummary count={h.reviewCount} />
                  <div className="grid md:grid-cols-2 gap-4">
                    {reviews.map((r) => (
                      <ReviewCard
                        key={r.id}
                        name={r.studentName}
                        date={r.date}
                        rating={r.rating}
                        text={r.text}
                        reply={r.reply}
                        onReport={() => setReportId(r.id)}
                      />
                    ))}
                  </div>
                </>
              )}
            </Section>
          </div>

          <aside className="hidden lg:block lg:col-span-4 pt-10">
            <div className="sticky top-36">
              <BookingCard price={price} free={free} typesCount={types.length} onChoose={toRooms} />
            </div>
          </aside>
        </div>
      </Container>

      <MobileBookingBar price={price} free={free} onChoose={toRooms} />

      {/*  Pop-ups  */}
      <Modal
        open={allPhotos}
        onClose={() => setAllPhotos(false)}
        title={`${h.name} — photos`}
        size="lg"
      >
        <div className="grid grid-cols-2 gap-2 pb-4">
          {h.gallery.map((src, i) => (
            <Photo
              key={i}
              src={src}
              alt={`Photo ${i + 1}`}
              ratio="3/2"
              className={i === 0 ? 'col-span-2' : ''}
            />
          ))}
        </div>
      </Modal>

      <Modal
        open={reportId !== null}
        onClose={() => {
          setReportId(null)
          setReason('')
        }}
        title="Report this review"
        description="Our moderation team reviews every report within 24 hours."
        footer={
          <>
            <Button variant="secondary" onClick={() => setReportId(null)}>
              Cancel
            </Button>
            <Button
              disabled={!reason.trim()}
              onClick={() => {
                s.createReport({
                  type: 'Reported Review',
                  title: `Review on ${h.name}`,
                  reportReason: reason,
                  content: reviews.find((r) => r.id === reportId)?.text,
                  reviewId: reportId,
                })
                setReportId(null)
                setReason('')
                toast('Report sent to moderators')
              }}
            >
              Send report
            </Button>
          </>
        }
      >
        <Field label="What's wrong with this review?">
          <Textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="For example: the reviewer never lived here, or it contains abusive language."
          />
        </Field>
      </Modal>
    </>
  )
}
