import { useState } from 'react'
import { useStore } from '../store'
import { navigate, rs, cx } from '../lib'
import { Icon } from '../components/icons'
import {
  Badge,
  Button,
  Container,
  EmptyState,
  Field,
  Input,
  Photo,
  Select,
  Textarea,
  toast,
} from '../components/ui'
import {
  Breadcrumb,
  InfoChip,
  StepHeading,
  SeatLegend,
  RoomTile,
  ResidentPanel,
  ProfilePrompt,
} from '../components/room/RoomParts'
const MIN_MESSAGE = 10
const STAY_OPTIONS = ['3', '4', '6', '8', '10', '12']
export function RoomDetail({ hostelId, typeId }) {
  const s = useStore()
  const h = s.hostel(hostelId)
  const t = s.roomTypes.find((x) => x.id === typeId)
  const rooms = s.roomsFor(typeId)
  const firstFree = rooms.find((r) => r.freeSeats > 0)
  const [roomId, setRoomId] = useState(firstFree?.id)
  const [freeOnly, setFreeOnly] = useState(false)
  const [moveIn, setMoveIn] = useState('')
  const [duration, setDuration] = useState('6')
  const [message, setMessage] = useState('')
  if (!h || !t)
    return (
      <Container>
        <EmptyState
          icon="bed"
          title="Room not found"
          action={<Button onClick={() => navigate('/s/search')}>Back to search</Button>}
        />
      </Container>
    )
  // Data (unchanged logic)
  const room = rooms.find((r) => r.id === roomId)
  const profileReady = s.profile.saved
  const visible = freeOnly ? rooms.filter((r) => r.freeSeats > 0) : rooms
  const totalFree = rooms.reduce((a, r) => a + r.freeSeats, 0)
  const canSend = !!room && room.freeSeats > 0 && !!moveIn && message.trim().length >= MIN_MESSAGE
  const total = t.price * Number(duration)
  // Residents of one room, split into visible and private
  const residentsOf = (id) => {
    const all = s.residents.filter((x) => x.roomId === id)
    const shown = all.filter((x) => x.isPublic)
    const scores = shown.map((x) => x.matchScore).filter((n) => typeof n === 'number')
    return {
      shown,
      hidden: all.length - shown.length,
      best: profileReady && scores.length ? Math.max(...scores) : undefined,
    }
  }
  const selected = room ? residentsOf(room.id) : undefined
  const send = () => {
    if (!room || !canSend) return
    const id = s.createInquiry({
      hostelId: h.id,
      roomTypeId: t.id,
      roomId: room.id,
      moveIn: new Date(moveIn).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      duration: Number(duration),
      message: message.trim(),
    })
    toast('Inquiry sent to the owner')
    navigate(`/s/inquiries/${id}`)
  }
  return (
    <Container className="pt-6 pb-16">
      {/*  Header  */}
      <Breadcrumb
        items={[
          { label: 'Find a hostel', onClick: () => navigate('/s/search') },
          { label: h.name, onClick: () => navigate(`/s/hostel/${h.id}`) },
          { label: t.name },
        ]}
      />

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <h1 className="tracking-tight text-display-sm sm:text-display leading-[1.1] font-semibold text-ink">
          {t.name}
        </h1>
        {t.ac && (
          <Badge tone="brand" icon="snowflake">
            Air-conditioned
          </Badge>
        )}
      </div>
      <p className="mt-1 text-body text-muted">
        at <span className="font-medium text-ink">{h.name}</span> · {h.area}, Lahore
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <InfoChip icon="users">
          {t.seatsPerRoom} {t.seatsPerRoom === 1 ? 'person' : 'people'} per room
        </InfoChip>
        <InfoChip icon="door">{rooms.length} rooms</InfoChip>
        <InfoChip icon="bed">{totalFree} seats free</InfoChip>
        <InfoChip icon="tag">
          <span className="text-brand-700 font-semibold">{rs(t.price)}</span>
          &nbsp;/ seat / month
        </InfoChip>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2 h-[220px] sm:h-[340px] rounded-xl overflow-hidden">
        <Photo
          src={t.photoUrls[0]}
          alt={t.name}
          ratio="auto"
          rounded={false}
          className="col-span-3 sm:col-span-2 h-full"
        />
        <div className="hidden sm:grid grid-rows-2 gap-2">
          <Photo src={t.photoUrls[1]} alt="" ratio="auto" rounded={false} className="h-full" />
          <Photo src={t.photoUrls[2]} alt="" ratio="auto" rounded={false} className="h-full" />
        </div>
      </div>

      <div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-12">
        {/*  Step 1: room picker  */}
        <div className="lg:col-span-7">
          <StepHeading
            n={1}
            done={!!room}
            title="Choose your room"
            subtitle="Pick the room you'd like. The owner may offer another room of the same type if needed."
          />

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <SeatLegend />
            <div
              role="radiogroup"
              aria-label="Show rooms"
              className="inline-flex rounded-full bg-sunken p-1"
            >
              {[
                ['All rooms', false],
                ['Free seats only', true],
              ].map(([label, val]) => (
                <button
                  key={String(label)}
                  role="radio"
                  aria-checked={freeOnly === val}
                  onClick={() => setFreeOnly(val)}
                  className={cx(
                    'h-8 px-4 rounded-full text-small font-medium transition-colors',
                    freeOnly === val
                      ? 'bg-surface text-ink shadow-card'
                      : 'text-muted hover:text-ink',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {!profileReady && (
            <div className="mt-5">
              <ProfilePrompt onCreate={() => navigate('/s/roommates/profile')} />
            </div>
          )}

          <div className="mt-5 grid grid-cols-2 xl:grid-cols-3 gap-3">
            {visible.map((r) => {
              const res = residentsOf(r.id)
              return (
                <RoomTile
                  key={r.id}
                  number={r.number}
                  total={r.totalSeats}
                  free={r.freeSeats}
                  shown={res.shown}
                  hidden={res.hidden}
                  bestMatch={res.best}
                  selected={r.id === roomId}
                  onSelect={() => setRoomId(r.id)}
                />
              )
            })}
          </div>

          {room && selected && (
            <div className="mt-5">
              <ResidentPanel
                number={room.number}
                total={room.totalSeats}
                free={room.freeSeats}
                shown={selected.shown}
                hidden={selected.hidden}
                showMatch={profileReady}
              />
            </div>
          )}

          <p className="mt-4 flex items-center gap-2 text-small text-muted">
            <Icon name="lock" size={14} />
            Only residents who chose to be visible are shown, by first name.
          </p>
        </div>

        {/*  Step 2: inquiry form  */}
        <aside className="lg:col-span-5 mt-12 lg:mt-0">
          <div className="sticky top-24 rounded-xl bg-surface border border-line shadow-card p-6">
            <StepHeading
              n={2}
              title="Send an inquiry"
              subtitle="The owner replies on CampusNest, usually within 2 hours."
            />

            {/* Selected room summary */}
            <div className="mt-5 flex items-center gap-3 rounded-lg bg-sunken p-3">
              <Photo src={t.photoUrls[0]} alt="" ratio="1/1" className="w-14 shrink-0" />
              <div className="min-w-0">
                <p className="text-caption text-muted">Selected room</p>
                <p className="text-body-lg font-semibold text-ink truncate">
                  {room ? `Room ${room.number} · ${t.name}` : 'Choose a room on the left'}
                </p>
              </div>
              {room && (
                <Icon name="check" size={18} strokeWidth={2.5} className="ml-auto text-success" />
              )}
            </div>

            <div className="mt-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Move-in date" required>
                  <Input
                    type="date"
                    icon="calendar"
                    value={moveIn}
                    onChange={(e) => setMoveIn(e.target.value)}
                  />
                </Field>
                <Field label="Stay length">
                  <Select
                    icon="clock"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  >
                    {STAY_OPTIONS.map((m) => (
                      <option key={m} value={m}>
                        {m} months
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>
              <Field
                label="Message to the owner"
                required
                hint="Introduce yourself: university, programme, year, and when you'd like to visit."
              >
                <Textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Assalam-o-Alaikum, I'm a second-year BBA student at PU New Campus…"
                />
              </Field>
              {message.trim().length > 0 && message.trim().length < MIN_MESSAGE && (
                <p className="-mt-2 text-caption text-muted tabular">
                  {MIN_MESSAGE - message.trim().length} more characters needed
                </p>
              )}
            </div>

            {/* Cost estimate */}
            <div className="mt-5 rounded-lg border border-line p-4 space-y-2 text-body">
              <div className="flex justify-between text-muted">
                <span>
                  {rs(t.price)} × {duration} months
                </span>
                <span className="tabular text-ink">{rs(total)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-line font-semibold text-ink">
                <span>Estimated total</span>
                <span className="text-brand-700 tabular">{rs(total)}</span>
              </div>
            </div>

            <Button full size="lg" icon="send" className="mt-5" disabled={!canSend} onClick={send}>
              Send inquiry
            </Button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-small text-muted">
              <Icon name="shieldCheck" size={14} className="text-success" />
              No payment now. Your contact details stay private.
            </p>
          </div>
        </aside>
      </div>
    </Container>
  )
}
