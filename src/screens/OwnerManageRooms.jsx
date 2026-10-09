import { useState } from 'react'
import { useStore } from '../store'
import { rs, cx } from '../lib'
import { Icon } from '../components/icons'
import { Avatar, Button, Field, Input, Modal, toast } from '../components/ui'
import { ConsoleTitle, StatTile } from '../components/admin/AdminParts'
import { SeatIcons } from '../components/room/RoomParts'
const MAX_BULK = 50 // safety cap for one "add rooms" action
//  Small pieces used only on this page
/** Thin occupancy bar. */
function Bar({ pct, className }) {
  return (
    <div className={cx('h-1.5 rounded-full bg-sunken overflow-hidden', className)}>
      <div className="h-full rounded-full bg-brand-700" style={{ width: `${pct}%` }} />
    </div>
  )
}
/** Coloured icon circle at the top of a pop-up. */
function ModalIcon({ icon, tone }) {
  return (
    <span className={cx('mb-4 h-11 w-11 rounded-full flex items-center justify-center', tone)}>
      <Icon name={icon} size={20} />
    </span>
  )
}
/** One physical room: number, seat circles, residents, remove button. */
function RoomCard({ room, residents, onMoveOut, onRemove }) {
  const full = room.freeSeats === 0
  const empty = residents.length === 0
  return (
    <div className="rounded-lg border border-line bg-surface p-4 flex flex-col">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-tiny font-semibold uppercase tracking-[0.1em] text-muted">Room</p>
          <p className="tracking-tight text-heading leading-none font-semibold text-ink">
            {room.number}
          </p>
        </div>
        <button
          onClick={onRemove}
          disabled={!empty}
          aria-label={empty ? `Remove room ${room.number}` : 'Move residents out before removing'}
          title={empty ? `Remove room ${room.number}` : 'Move residents out before removing'}
          className="h-8 w-8 rounded-full flex items-center justify-center text-muted hover:bg-danger-bg hover:text-danger transition-colors disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-muted"
        >
          <Icon name="trash" size={15} />
        </button>
      </div>

      <div className="mt-3">
        <SeatIcons total={room.totalSeats} free={room.freeSeats} size={24} />
      </div>
      <p
        className={cx(
          'mt-1.5 text-caption font-medium tabular',
          full ? 'text-muted' : 'text-success',
        )}
      >
        {full ? 'Full' : `${room.freeSeats} of ${room.totalSeats} seats free`}
      </p>

      <div className="mt-3 pt-3 border-t border-line flex-1">
        {empty ? (
          <p className="flex items-center gap-1.5 text-caption text-subtle">
            <Icon name="sparkles" size={12} />
            Empty — ready for new residents
          </p>
        ) : (
          <ul className="space-y-2">
            {residents.map((x) => (
              <li key={x.id} className="flex items-center gap-2.5">
                <Avatar name={x.name} size={30} />
                <div className="min-w-0 flex-1">
                  <p className="text-small font-semibold text-ink truncate">{x.name}</p>
                  <p className="flex items-center gap-1 text-tiny text-muted">
                    <Icon name="calendar" size={10} />
                    since {x.movedIn}
                  </p>
                </div>
                <button
                  onClick={() => onMoveOut(x)}
                  title={`Mark ${x.name} as moved out`}
                  className="inline-flex items-center gap-1 h-7 px-2 rounded-full text-tiny font-semibold text-muted hover:bg-danger-bg hover:text-danger transition-colors"
                >
                  <Icon name="logout" size={12} />
                  Move out
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
//  Page
export function OwnerManageRooms() {
  const s = useStore()
  const h = s.hostel(s.ownerHostelId)
  const types = h ? s.typesFor(h.id) : []
  const [open, setOpen] = useState(types.slice(0, 1).map((t) => t.id))
  const [moveOut, setMoveOut] = useState(null)
  const [remove, setRemove] = useState(null)
  const [adding, setAdding] = useState(null)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  if (!h) return null
  // Live numbers (unchanged)
  const total = s.totalSeats(h.id),
    free = s.freeSeats(h.id)
  const filled = total - free
  const occPct = total ? Math.round((filled / total) * 100) : 0
  const roomCount = s.rooms.filter((r) => r.hostelId === h.id).length
  const toggle = (id) => setOpen((o) => (o.includes(id) ? o.filter((x) => x !== id) : [...o, id]))
  const allOpen = open.length === types.length
  const toggleAll = () => setOpen(allOpen ? [] : types.map((t) => t.id))
  // "Add rooms" preview: 211 → 214 becomes [211, 212, 213, 214]
  const a = parseInt(from),
    b = to ? parseInt(to) : a
  const rangeOk = !!from && (!to || b >= a) && b - a < MAX_BULK
  const preview = rangeOk ? Array.from({ length: b - a + 1 }, (_, i) => String(a + i)) : []
  return (
    <>
      <ConsoleTitle
        icon="bed"
        title="Rooms & residents"
        subtitle={`${h.name} · Changes here update what students see immediately.`}
        action={
          types.length > 1 && (
            <Button
              variant="secondary"
              size="sm"
              icon={allOpen ? 'minus' : 'plus'}
              onClick={toggleAll}
            >
              {allOpen ? 'Collapse all' : 'Expand all'}
            </Button>
          )
        }
      />

      {/*  Stats  */}
      <div className="grid sm:grid-cols-3 gap-3 mb-5">
        <StatTile
          icon="users"
          label="Seats filled"
          value={
            <>
              {filled}
              <span className="text-body-lg text-muted font-normal"> / {total}</span>
            </>
          }
          sub={
            <span className="block mt-1">
              <Bar pct={occPct} />
              <span className="mt-1 block">{occPct}% occupied</span>
            </span>
          }
        />
        <StatTile
          icon="bed"
          label="Free seats"
          value={free}
          sub="visible to students"
          tone="bg-success-bg text-success"
        />
        <StatTile icon="door" label="Rooms" value={roomCount} sub={`${types.length} room types`} />
      </div>

      {/*  One section per room type  */}
      <div className="space-y-3">
        {types.map((t) => {
          const rooms = s.roomsFor(t.id)
          const isOpen = open.includes(t.id)
          const tTotal = rooms.reduce((x, r) => x + r.totalSeats, 0)
          const tFree = rooms.reduce((x, r) => x + r.freeSeats, 0)
          const tPct = tTotal ? Math.round(((tTotal - tFree) / tTotal) * 100) : 0
          return (
            <section
              key={t.id}
              className={cx(
                'rounded-xl border bg-surface overflow-hidden transition-shadow',
                isOpen ? 'border-brand-200 shadow-card' : 'border-line',
              )}
            >
              {/* Header */}
              <div className="flex flex-wrap items-center gap-3 p-4 sm:p-5">
                <button
                  onClick={() => toggle(t.id)}
                  aria-expanded={isOpen}
                  className="flex items-center gap-3 flex-1 min-w-[240px] text-left"
                >
                  <span className="h-10 w-10 shrink-0 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center">
                    <Icon name="bed" size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-lead font-semibold text-ink">{t.name}</span>
                      {t.ac && (
                        <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full bg-brand-50 text-brand-700 text-tiny font-semibold">
                          <Icon name="snowflake" size={11} />
                          AC
                        </span>
                      )}
                      <span
                        className={cx(
                          'inline-flex items-center h-5 px-2 rounded-full text-tiny font-semibold',
                          tFree ? 'bg-success-bg text-success' : 'bg-sunken text-muted',
                        )}
                      >
                        {tFree ? `${tFree} free` : 'Full'}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-caption text-muted">
                      <span className="tabular">
                        <span className="font-semibold text-brand-700">{rs(t.price)}</span> / seat
                      </span>
                      <span>·</span>
                      <span>{rooms.length} rooms</span>
                      <Bar pct={tPct} className="hidden sm:block w-24" />
                      <span className="hidden sm:inline tabular">{tPct}%</span>
                    </div>
                  </div>
                  <Icon
                    name="chevronDown"
                    size={18}
                    className={cx(
                      'text-muted transition-transform shrink-0',
                      isOpen && 'rotate-180',
                    )}
                  />
                </button>
                <Button
                  size="sm"
                  variant="secondary"
                  icon="plus"
                  onClick={() => {
                    setFrom('')
                    setTo('')
                    setAdding(t.id)
                  }}
                >
                  Add rooms
                </Button>
              </div>

              {/* Rooms */}
              {isOpen && (
                <div className="border-t border-line bg-canvas p-4 sm:p-5">
                  {rooms.length === 0 ? (
                    <p className="text-body text-muted">
                      No rooms yet. Use <span className="font-semibold text-ink">Add rooms</span> to
                      create them.
                    </p>
                  ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3">
                      {rooms.map((r) => (
                        <RoomCard
                          key={r.id}
                          room={r}
                          residents={s.residents.filter((x) => x.roomId === r.id)}
                          onMoveOut={setMoveOut}
                          onRemove={() => setRemove(r)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </section>
          )
        })}
      </div>

      {/*  Move out  */}
      <Modal
        open={!!moveOut}
        onClose={() => setMoveOut(null)}
        size="sm"
        title={`Mark ${moveOut?.name} as moved out?`}
        description="Their seat becomes available to students straight away."
        footer={
          <>
            <Button variant="secondary" onClick={() => setMoveOut(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              icon="logout"
              onClick={() => {
                if (moveOut) s.moveOut(moveOut.id)
                setMoveOut(null)
                toast('Seat is now free')
              }}
            >
              Confirm move-out
            </Button>
          </>
        }
      >
        <ModalIcon icon="logout" tone="bg-danger-bg text-danger" />
      </Modal>

      {/*  Remove room  */}
      <Modal
        open={!!remove}
        onClose={() => setRemove(null)}
        size="sm"
        title={`Remove room ${remove?.number}?`}
        description="The room is empty. Removing it reduces your total seat count."
        footer={
          <>
            <Button variant="secondary" onClick={() => setRemove(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              icon="trash"
              onClick={() => {
                if (remove) s.removeRoom(remove.id)
                setRemove(null)
                toast('Room removed')
              }}
            >
              Remove room
            </Button>
          </>
        }
      >
        <ModalIcon icon="trash" tone="bg-danger-bg text-danger" />
      </Modal>

      {/*  Add rooms (bulk)  */}
      <Modal
        open={adding !== null}
        onClose={() => setAdding(null)}
        size="sm"
        title="Add rooms"
        description={types.find((t) => t.id === adding)?.name}
        footer={
          <>
            <Button variant="secondary" onClick={() => setAdding(null)}>
              Cancel
            </Button>
            <Button
              icon="plus"
              disabled={!preview.length}
              onClick={() => {
                if (adding) s.addRooms(adding, preview)
                setAdding(null)
                toast(`${preview.length} room${preview.length > 1 ? 's' : ''} added`)
              }}
            >
              Add {preview.length > 0 ? preview.length : ''}{' '}
              {preview.length === 1 ? 'room' : 'rooms'}
            </Button>
          </>
        }
      >
        <ModalIcon icon="door" tone="bg-brand-50 text-brand-700" />
        <div className="grid grid-cols-2 gap-3">
          <Field label="From room">
            <Input
              icon="door"
              value={from}
              onChange={(e) => setFrom(e.target.value.replace(/\D/g, ''))}
              placeholder="211"
            />
          </Field>
          <Field label="To room" optional>
            <Input
              icon="door"
              value={to}
              onChange={(e) => setTo(e.target.value.replace(/\D/g, ''))}
              placeholder="214"
            />
          </Field>
        </div>
        {from && !rangeOk && (
          <p className="mt-2 flex items-center gap-1.5 text-caption text-danger">
            <Icon name="alert" size={12} />
            {b < a
              ? '"To" must be the same or higher than "From".'
              : `Add up to ${MAX_BULK} rooms at a time.`}
          </p>
        )}
        {preview.length > 0 && (
          <div className="mt-4 rounded-lg bg-sunken p-3 mb-2">
            <p className="text-caption font-semibold text-ink">
              Will add {preview.length} {preview.length === 1 ? 'room' : 'rooms'}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {preview.slice(0, 12).map((n) => (
                <span
                  key={n}
                  className="h-6 px-2 rounded-full bg-surface border border-line text-caption font-semibold text-ink-2 tabular inline-flex items-center"
                >
                  {n}
                </span>
              ))}
              {preview.length > 12 && (
                <span className="h-6 px-2 text-caption text-muted inline-flex items-center">
                  +{preview.length - 12} more
                </span>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
