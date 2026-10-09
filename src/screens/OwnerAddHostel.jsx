import { useState } from 'react'
import { useStore } from '../store'
import { navigate, rs, HOSTEL_PHOTOS } from '../lib'
import { Icon } from '../components/icons'
import { Button, EmptyState, Field, Input, Photo, Textarea, toast } from '../components/ui'
import {
  FormStepper,
  StepCard,
  FacilityPicker,
  PhotoGrid,
  RoomTypeEditor,
  ListingPreview,
  Checklist,
  STEPS,
  TYPE_OPTS,
  MIN_PHOTOS,
  emptyDraft,
  seatsOf,
} from '../components/owner/HostelFormParts'
//  Shared header
function FormHeader({ title, subtitle }) {
  return (
    <div className="pt-6 pb-5">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-small text-muted">
        <button
          onClick={() => navigate('/o/hostels')}
          className="inline-flex items-center gap-1.5 hover:text-ink"
        >
          <Icon name="arrowLeft" size={14} />
          My hostels
        </button>
        <Icon name="chevronRight" size={14} className="text-subtle" />
        <span className="font-medium text-ink">{title}</span>
      </nav>
      <h1 className="mt-3 tracking-tight text-heading leading-tight font-semibold text-ink">
        {title}
      </h1>
      {subtitle && <p className="text-small text-muted">{subtitle}</p>}
    </div>
  )
}
//  Edit an existing hostel
function EditHostel({ id }) {
  const s = useStore()
  const h = s.hostel(id)
  const [name, setName] = useState(h?.name ?? '')
  const [description, setDescription] = useState(h?.description ?? '')
  const [address, setAddress] = useState(h?.address ?? '')
  const [facilities, setFacilities] = useState(h?.facilities ?? [])
  if (!h) return <EmptyState title="Hostel not found" />
  // Edit rule (unchanged): address change or a rejected listing → back to Pending for re-verification
  const addressChanged = address !== h.address
  const resubmit = h.status === 'Rejected' || addressChanged
  const toggle = (f) => setFacilities((x) => (x.includes(f) ? x.filter((y) => y !== f) : [...x, f]))
  const save = () => {
    s.updateHostel(h.id, {
      name,
      description,
      address,
      facilities,
      ...(resubmit ? { status: 'Pending', rejectReason: undefined } : {}),
    })
    if (resubmit)
      s.createReport({
        type: 'Hostel Verification',
        title: name,
        address,
        hostelId: h.id,
        photos: h.gallery,
        rooms: `${s.typesFor(h.id).length} room types`,
        ownerPhone: '+92 301 4418 220',
      })
    toast(resubmit ? 'Sent for verification' : 'Changes saved')
    navigate('/o/hostels')
  }
  return (
    <div className="pb-8">
      <FormHeader title={`Edit ${h.name}`} />
      <div className="grid xl:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
        <div className="min-w-0 space-y-4">
          {h.status === 'Rejected' && (
            <div className="flex gap-3 rounded-xl border border-[#F3CCC7] bg-danger-bg p-4 text-body text-danger">
              <Icon name="x" size={18} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">Why this listing wasn't approved</p>
                <p className="text-ink-2">{h.rejectReason}</p>
              </div>
            </div>
          )}

          <StepCard icon="info" title="Basics">
            <div className="space-y-4">
              <Field label="Hostel name">
                <Input icon="building" value={name} onChange={(e) => setName(e.target.value)} />
              </Field>
              <Field label="Description">
                <Textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Field>
              <Field
                label="Full address"
                hint={
                  addressChanged
                    ? undefined
                    : 'Changing the address sends the listing for re-verification.'
                }
              >
                <Input value={address} onChange={(e) => setAddress(e.target.value)} icon="mapPin" />
              </Field>
              {addressChanged && (
                <div className="flex gap-2.5 rounded-lg border border-[#EFDDB3] bg-warning-bg p-3 text-small text-warning">
                  <Icon name="alert" size={15} className="mt-0.5 shrink-0" />
                  Saving will send this listing for re-verification. It stays hidden until approved.
                </div>
              )}
            </div>
          </StepCard>

          <StepCard icon="sparkles" title="Facilities" hint="Tap to turn each facility on or off.">
            <FacilityPicker value={facilities} onToggle={toggle} />
          </StepCard>

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => navigate('/o/hostels')}>
              Cancel
            </Button>
            <Button icon={resubmit ? 'send' : 'check'} onClick={save} disabled={!name || !address}>
              {resubmit ? 'Save and resubmit' : 'Save changes'}
            </Button>
          </div>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-24">
          <Photo src={h.image} alt={h.name} ratio="4/3" />
          <div className="rounded-xl border border-line bg-surface p-5">
            <p className="flex items-center gap-2 text-small font-semibold text-ink">
              <Icon name="shieldCheck" size={15} className="text-brand-700" />
              What needs re-verification
            </p>
            <ul className="mt-3 space-y-2 text-small">
              <li className="flex gap-2 text-ink-2">
                <Icon
                  name="check"
                  size={14}
                  strokeWidth={2.5}
                  className="mt-0.5 text-success shrink-0"
                />
                Name, description and facilities update instantly.
              </li>
              <li className="flex gap-2 text-ink-2">
                <Icon name="clock" size={14} className="mt-0.5 text-warning shrink-0" />A new
                address goes back to our team and stays hidden until approved — usually within one
                business day.
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
//  Success screen
function Submitted({ name, phone }) {
  const next = [
    {
      icon: 'phone',
      title: 'We call you',
      text: `On ${phone}, within 1–2 business days.`,
    },
    {
      icon: 'shieldCheck',
      title: 'We verify',
      text: 'We confirm the details and photos.',
    },
    {
      icon: 'check',
      title: 'You go live',
      text: `${name} appears in student search.`,
    },
  ]
  return (
    <div className="max-w-[640px] mx-auto pt-12 pb-8">
      <div className="rounded-xl border border-line bg-surface p-8 text-center shadow-card">
        <span className="mx-auto h-16 w-16 rounded-full bg-success-bg text-success flex items-center justify-center">
          <Icon name="check" size={30} strokeWidth={2.5} />
        </span>
        <h1 className="mt-5 tracking-tight text-heading font-semibold text-ink">
          Submitted for verification
        </h1>
        <p className="mt-1.5 text-body text-muted">Thanks — here's what happens next.</p>
        <ol className="mt-6 grid sm:grid-cols-3 gap-3 text-left">
          {next.map((n, i) => (
            <li key={n.title} className="rounded-lg bg-sunken p-4">
              <span className="relative inline-block">
                <span className="h-9 w-9 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center">
                  <Icon name={n.icon} size={16} />
                </span>
                <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-brand-700 text-white text-micro font-bold flex items-center justify-center">
                  {i + 1}
                </span>
              </span>
              <p className="mt-2 text-small font-semibold text-ink">{n.title}</p>
              <p className="text-caption text-muted">{n.text}</p>
            </li>
          ))}
        </ol>
        <Button className="mt-7" iconRight="chevronRight" onClick={() => navigate('/o/hostels')}>
          Go to My hostels
        </Button>
      </div>
    </div>
  )
}
/** One block on the Review step with an "Edit" link back to its step. */
function ReviewBlock({ icon, title, onEdit, children }) {
  return (
    <div className="py-4 first:pt-0 border-b border-line last:border-b-0">
      <div className="flex items-center justify-between gap-3 mb-2">
        <p className="flex items-center gap-2 text-small font-semibold text-ink">
          <Icon name={icon} size={14} className="text-brand-700" />
          {title}
        </p>
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-1 text-caption font-semibold text-brand-700 hover:text-brand-800"
        >
          <Icon name="edit" size={12} />
          Edit
        </button>
      </div>
      <div className="text-body text-ink-2">{children}</div>
    </div>
  )
}
//  Add a new hostel (6 steps)
export function OwnerAddHostel({ editId }) {
  const s = useStore()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [facilities, setFacilities] = useState([])
  const [photos, setPhotos] = useState([])
  const [rooms, setRooms] = useState([emptyDraft()])
  const [done, setDone] = useState(false)
  if (editId) return <EditHostel id={editId} />
  // Room helpers (unchanged logic)
  const upd = (key, c) => setRooms((list) => list.map((r) => (r.key === key ? { ...r, ...c } : r)))
  const addRange = (r) => {
    const a = parseInt(r.from),
      b = parseInt(r.to)
    if (isNaN(a) || isNaN(b) || b < a || b - a > 60) return
    upd(r.key, {
      numbers: Array.from(
        new Set([...r.numbers, ...Array.from({ length: b - a + 1 }, (_, i) => String(a + i))]),
      ),
      from: '',
      to: '',
    })
  }
  const toggleFacility = (f) =>
    setFacilities((x) => (x.includes(f) ? x.filter((y) => y !== f) : [...x, f]))
  // Step validation (unchanged rules)
  const roomsValid = rooms.every((r) => r.type && Number(r.price) > 0 && r.numbers.length > 0)
  const valid = [
    name.trim().length > 2 &&
      description.trim().length > 20 &&
      /\d{10,}/.test(phone.replace(/\D/g, '')),
    address.trim().length > 10,
    facilities.length > 0,
    photos.length >= MIN_PHOTOS,
    roomsValid,
    true,
  ]
  const totalRooms = rooms.reduce((a, r) => a + r.numbers.length, 0)
  const totalSeats = rooms.reduce((a, r) => a + r.numbers.length * seatsOf(r), 0)
  const priced = rooms.filter((r) => Number(r.price) > 0)
  const fromPrice = priced.length ? Math.min(...priced.map((r) => Number(r.price))) : undefined
  const submit = () => {
    s.addHostel({
      ownerId: s.currentUser.id,
      name,
      description,
      address,
      facilities,
      photos,
      ownerPhone: phone,
      roomTypes: rooms.map((r) => ({
        type: r.type,
        ac: r.ac,
        price: Number(r.price),
        seatsPerRoom: seatsOf(r),
        roomNumbers: r.numbers,
      })),
    })
    setDone(true)
  }
  if (done) return <Submitted name={name} phone={phone} />
  const cur = STEPS[step]
  return (
    <div className="pb-8">
      <FormHeader
        title="Add a hostel"
        subtitle="Takes about 10 minutes. You can list more room types later."
      />
      <FormStepper step={step} onJump={setStep} />

      <div className="grid xl:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
        <div className="min-w-0">
          {step === 0 && (
            <StepCard icon={cur.icon} title="Basics" hint="Tell students what your hostel is like.">
              <div className="space-y-4">
                <Field label="Hostel name" required>
                  <Input
                    icon="building"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Green Court Hostel"
                  />
                </Field>
                <Field
                  label="Description"
                  required
                  hint="Who is it for, what's nearby, what makes it different. At least 20 characters."
                >
                  <Textarea
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="A female hostel in a quiet block of Model Town, 1.4 km from PU New Campus…"
                  />
                </Field>
                <Field
                  label="Your phone number"
                  required
                  hint="Only our verification team sees this. It's never shown to students."
                >
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 3XX XXXXXXX"
                    icon="phone"
                    inputMode="tel"
                  />
                </Field>
              </div>
            </StepCard>
          )}

          {step === 1 && (
            <StepCard
              icon={cur.icon}
              title="Location"
              hint="Students use this to see distance and travel time to campus."
            >
              <div className="space-y-4">
                <Field label="Full address" required>
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House number, street, block, area, Lahore"
                    icon="mapPin"
                  />
                </Field>
                <Field
                  label="Pin on the map"
                  hint="Drag the map so the pin sits on your building's entrance."
                >
                  <div className="relative h-64 rounded-xl border border-line bg-[#EEF1EC] overflow-hidden">
                    <svg
                      className="absolute inset-0 h-full w-full"
                      preserveAspectRatio="none"
                      viewBox="0 0 800 256"
                      aria-hidden="true"
                    >
                      <path
                        d="M0 160 C220 140 420 190 800 130"
                        stroke="#fff"
                        strokeWidth="18"
                        fill="none"
                      />
                      <path d="M300 0 L330 256" stroke="#fff" strokeWidth="12" />
                      <path d="M0 60 L800 80" stroke="#fff" strokeWidth="8" />
                    </svg>
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full flex flex-col items-center">
                      <span className="rounded-full bg-charcoal text-white text-caption font-semibold px-3 py-1.5 shadow-pop whitespace-nowrap">
                        {name || 'Your hostel'}
                      </span>
                      <span className="mt-1 h-9 w-9 rounded-full bg-charcoal text-white ring-4 ring-white flex items-center justify-center">
                        <Icon name="mapPin" size={17} />
                      </span>
                    </div>
                  </div>
                </Field>
              </div>
            </StepCard>
          )}

          {step === 2 && (
            <StepCard
              icon={cur.icon}
              title="Facilities"
              hint="Tap everything you offer. AC is set per room type in the Rooms step."
            >
              <FacilityPicker value={facilities} onToggle={toggleFacility} />
            </StepCard>
          )}

          {step === 3 && (
            <StepCard
              icon={cur.icon}
              title="Photos"
              hint="At least 3 recent daylight photos: the building, a room and a shared space. Listings with 6+ photos get twice the inquiries."
            >
              <PhotoGrid
                photos={photos}
                onAdd={() =>
                  setPhotos([...photos, HOSTEL_PHOTOS[photos.length % HOSTEL_PHOTOS.length]])
                }
                onRemove={(i) => setPhotos(photos.filter((_, j) => j !== i))}
              />
            </StepCard>
          )}

          {step === 4 && (
            <StepCard
              icon={cur.icon}
              title="Rooms"
              hint="Add each room type, its rent and its room numbers."
            >
              <div className="space-y-3">
                {rooms.map((r, i) => (
                  <RoomTypeEditor
                    key={r.key}
                    index={i}
                    draft={r}
                    canRemove={rooms.length > 1}
                    onChange={(c) => upd(r.key, c)}
                    onRemove={() => setRooms(rooms.filter((x) => x.key !== r.key))}
                    onAddRange={() => addRange(r)}
                  />
                ))}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <Button
                    variant="secondary"
                    icon="plus"
                    onClick={() => setRooms([...rooms, emptyDraft()])}
                  >
                    Add another room type
                  </Button>
                  <p className="text-small text-muted tabular">
                    {rooms.length} room {rooms.length === 1 ? 'type' : 'types'} · {totalRooms} rooms
                    · {totalSeats} seats
                  </p>
                </div>
              </div>
            </StepCard>
          )}

          {step === 5 && (
            <StepCard
              icon={cur.icon}
              title="Review"
              hint="Check everything before sending it to our team."
            >
              <ReviewBlock icon="info" title="Basics" onEdit={() => setStep(0)}>
                <p className="font-semibold text-ink">{name}</p>
                <p className="mt-1 line-clamp-3">{description}</p>
                <p className="mt-1 flex items-center gap-1.5 text-small text-muted">
                  <Icon name="phone" size={12} />
                  {phone} <span className="text-subtle">(private)</span>
                </p>
              </ReviewBlock>
              <ReviewBlock icon="mapPin" title="Location" onEdit={() => setStep(1)}>
                {address}
              </ReviewBlock>
              <ReviewBlock icon="sparkles" title="Facilities" onEdit={() => setStep(2)}>
                <div className="flex flex-wrap gap-1.5">
                  {facilities.map((f) => (
                    <span
                      key={f}
                      className="h-6 px-2 rounded-full bg-sunken text-caption font-medium text-ink-2 inline-flex items-center"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </ReviewBlock>
              <ReviewBlock
                icon="image"
                title={`Photos (${photos.length})`}
                onEdit={() => setStep(3)}
              >
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {photos.map((p, i) => (
                    <Photo key={i} src={p} alt="" ratio="1/1" />
                  ))}
                </div>
              </ReviewBlock>
              <ReviewBlock
                icon="bed"
                title={`Rooms · ${totalRooms} rooms · ${totalSeats} seats`}
                onEdit={() => setStep(4)}
              >
                <ul className="space-y-1.5">
                  {rooms.map((r) => (
                    <li key={r.key} className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-ink">
                        {TYPE_OPTS.find((t) => t.v === r.type)?.label}
                      </span>
                      {r.ac && (
                        <span className="inline-flex items-center gap-1 h-5 px-1.5 rounded-full bg-brand-50 text-brand-700 text-micro font-semibold">
                          <Icon name="snowflake" size={10} />
                          AC
                        </span>
                      )}
                      <span className="text-muted">
                        · {r.numbers.length} rooms ·{' '}
                        <span className="font-semibold text-brand-700">{rs(Number(r.price))}</span>{' '}
                        per seat
                      </span>
                    </li>
                  ))}
                </ul>
              </ReviewBlock>
              <div className="mt-4 flex gap-2.5 rounded-lg border border-brand-200 bg-brand-50 p-3.5 text-small text-ink-2">
                <Icon name="shieldCheck" size={16} className="mt-0.5 shrink-0 text-brand-700" />
                After you submit, our team calls you to confirm the details. Your listing goes live
                once it's verified.
              </div>
            </StepCard>
          )}

          {/* Navigation */}
          <div className="mt-4 flex justify-between gap-2">
            <Button
              variant="secondary"
              icon={step === 0 ? undefined : 'arrowLeft'}
              onClick={() => (step === 0 ? navigate('/o/hostels') : setStep(step - 1))}
            >
              {step === 0 ? 'Cancel' : 'Back'}
            </Button>
            {step < STEPS.length - 1 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!valid[step]}
                iconRight="arrowRight"
              >
                Continue
              </Button>
            ) : (
              <Button icon="send" onClick={submit}>
                Submit for verification
              </Button>
            )}
          </div>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-24">
          <ListingPreview
            photo={photos[0]}
            name={name}
            address={address}
            rooms={totalRooms}
            seats={totalSeats}
            from={fromPrice}
          />
          <Checklist valid={valid} />
        </aside>
      </div>
    </div>
  )
}
