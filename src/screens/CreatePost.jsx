import { useState } from 'react'
import { useStore } from '../store'
import { navigate, IMG, cx } from '../lib'
import { Icon } from '../components/icons'
import { Button, Container, Field, Input, Select, Textarea, toast } from '../components/ui'
import { Breadcrumb } from '../components/room/RoomParts'
import { TYPE_META, postLink, Counter } from '../components/community/CommunityParts'
const TYPES = [
  { type: 'Question', desc: 'Ask for advice or information' },
  { type: 'Experience', desc: 'Share what living somewhere is like' },
  { type: 'Marketplace', desc: 'Sell second-hand essentials' },
  { type: 'Study Partners', desc: 'Find people to study with' },
]
const TIPS = [
  'Put the question in the title, not only in the details.',
  'Mention your campus, budget and move-in month.',
  'Tag the hostel you’re asking about so residents see it.',
  'For items for sale, add a clear daylight photo and a fair price.',
]
const MIN_TITLE = 8
const MIN_BODY = 20
// Server-side in the real app; here it blocks Pakistani phone formats in the text (unchanged)
const PHONE = /(\+92|0092|\b0)3\d{2}[\s-]?\d{7}\b|\b\d{4}[\s-]?\d{7}\b/
export function CreatePost() {
  const s = useStore()
  const [type, setType] = useState('Question')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [hostelId, setHostelId] = useState('')
  const [price, setPrice] = useState('')
  const [photo, setPhoto] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  // Rules (unchanged)
  const isSale = type === 'Marketplace'
  const phoneError = PHONE.test(body) || PHONE.test(title)
  const similar =
    type === 'Question' && !dismissed && /commut|model town|gulberg|distance|travel/i.test(title)
      ? s.posts.find((p) => p.id === 1)
      : undefined
  const canPost =
    title.trim().length >= MIN_TITLE &&
    body.trim().length >= MIN_BODY &&
    !phoneError &&
    (!isSale || Number(price) > 0)
  const publish = () => {
    const id = s.createPost({
      type,
      title: title.trim(),
      body: body.trim(),
      hostelId: hostelId ? Number(hostelId) : undefined,
      price: isSale ? Number(price) : undefined,
      image: isSale && photo ? IMG.lamp : undefined,
      seller: isSale ? { months: 20, stays: 1 } : undefined,
    })
    toast('Post published')
    navigate(postLink({ id, type }))
  }
  return (
    <Container className="pt-6 pb-16">
      <Breadcrumb
        items={[
          { label: 'Community', onClick: () => navigate('/s/community') },
          { label: 'New post' },
        ]}
      />
      <h1 className="mt-3 mb-5 tracking-tight text-heading leading-tight font-semibold text-ink">
        New post
      </h1>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-8 items-start">
        <div className="min-w-0">
          <div className="rounded-xl border border-line bg-surface p-5 sm:p-6 space-y-5">
            {/* Post type */}
            <div>
              <p className="mb-2 text-small font-medium text-ink">What kind of post is this?</p>
              <div role="radiogroup" className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {TYPES.map((t) => {
                  const m = TYPE_META[t.type]
                  const on = type === t.type
                  return (
                    <button
                      key={t.type}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => setType(t.type)}
                      className={cx(
                        'relative text-left rounded-lg border-2 p-3 transition-colors',
                        on
                          ? 'border-brand-700 bg-brand-50/60'
                          : 'border-line hover:border-brand-200',
                      )}
                    >
                      <span
                        className={cx(
                          'h-9 w-9 rounded-full flex items-center justify-center',
                          m.tone,
                        )}
                      >
                        <Icon name={m.icon} size={16} />
                      </span>
                      <p className="mt-2 text-body font-semibold text-ink">{m.label}</p>
                      <p className="text-caption text-muted leading-snug">{t.desc}</p>
                      {on && (
                        <span className="absolute right-2.5 top-2.5 h-5 w-5 rounded-full bg-brand-700 text-white flex items-center justify-center">
                          <Icon name="check" size={11} strokeWidth={3} />
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Title */}
            <div>
              <Field
                label="Title"
                hint={
                  type === 'Question'
                    ? 'Write it as a question others would search for.'
                    : undefined
                }
              >
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    type === 'Question'
                      ? 'e.g. How long is the commute from Model Town at 8 am?'
                      : isSale
                        ? 'e.g. Study table and chair, good condition'
                        : 'Give your post a clear title'
                  }
                />
              </Field>
              <div className="mt-1 flex justify-end">
                <Counter n={title.trim().length} min={MIN_TITLE} />
              </div>
            </div>

            {/* Duplicate-question check */}
            {similar && (
              <div className="rounded-xl border border-brand-200 bg-brand-50 p-4">
                <p className="flex items-center gap-2 text-body font-semibold text-brand-800">
                  <span className="h-7 w-7 rounded-full bg-brand-700 text-white flex items-center justify-center">
                    <Icon name="sparkles" size={13} />
                  </span>
                  Already answered — this might help
                </p>
                <div className="mt-3 rounded-lg bg-surface border border-line p-4">
                  <p className="text-body font-semibold text-ink">{similar.title}</p>
                  <p className="mt-1.5 text-small text-muted leading-relaxed">
                    <span className="font-medium text-ink-2">
                      Top answer · {similar.comments[0]?.author}:
                    </span>{' '}
                    {similar.comments[0]?.text}
                  </p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    icon="check"
                    onClick={() => navigate(`/s/community/${similar.id}`)}
                  >
                    This answers my question
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => setDismissed(true)}>
                    Post anyway
                  </Button>
                </div>
              </div>
            )}

            {/* Details */}
            <div>
              <Field
                label="Details"
                error={
                  phoneError
                    ? 'Phone numbers aren’t allowed in posts. Keep contact on CampusNest chat.'
                    : undefined
                }
              >
                <Textarea
                  rows={5}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  invalid={phoneError}
                  placeholder="Add the details people need to help you."
                />
              </Field>
              {!phoneError && (
                <div className="mt-1 flex justify-end">
                  <Counter n={body.trim().length} min={MIN_BODY} />
                </div>
              )}
            </div>

            {/* Hostel + price */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Tag a hostel" optional>
                <Select
                  icon="building"
                  value={hostelId}
                  onChange={(e) => setHostelId(e.target.value)}
                >
                  <option value="">No hostel</option>
                  {s.hostels
                    .filter((h) => h.status === 'Approved')
                    .map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name}
                      </option>
                    ))}
                </Select>
              </Field>
              {isSale && (
                <Field label="Price" required>
                  <span className="relative block">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-small font-semibold text-muted">
                      Rs
                    </span>
                    <Input
                      inputMode="numeric"
                      className="pl-10"
                      value={price}
                      onChange={(e) => setPrice(e.target.value.replace(/\D/g, ''))}
                      placeholder="3,500"
                    />
                  </span>
                </Field>
              )}
            </div>

            {/* Photo (for sale only) */}
            {isSale && (
              <Field label="Photo" optional>
                <button
                  type="button"
                  onClick={() => setPhoto(!photo)}
                  className={cx(
                    'w-full h-24 rounded-lg border-2 border-dashed flex items-center justify-center gap-3 text-small transition-colors',
                    photo
                      ? 'border-success bg-success-bg text-success'
                      : 'border-line-strong text-muted hover:border-brand-200 hover:text-brand-700',
                  )}
                >
                  <span
                    className={cx(
                      'h-10 w-10 rounded-full flex items-center justify-center',
                      photo ? 'bg-success text-white' : 'bg-sunken',
                    )}
                  >
                    <Icon name={photo ? 'check' : 'upload'} size={17} />
                  </span>
                  {photo
                    ? 'item-photo.jpg added — click to remove'
                    : 'Click to upload a photo (JPG or PNG, up to 10 MB)'}
                </button>
              </Field>
            )}

            {isSale && (
              <div className="flex gap-2.5 rounded-lg bg-sunken p-3 text-small text-ink-2">
                <Icon name="shield" size={16} className="mt-0.5 shrink-0 text-brand-700" />
                Buyers message you through CampusNest. Meet in a public place, ideally on campus,
                during daylight.
              </div>
            )}
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => navigate('/s/community')}>
              Cancel
            </Button>
            <Button icon="send" disabled={!canPost} onClick={publish}>
              Publish post
            </Button>
          </div>
        </div>

        {/*  Tips + safety  */}
        <aside className="space-y-4 lg:sticky lg:top-24">
          <div className="rounded-xl border border-line bg-surface p-5">
            <p className="flex items-center gap-2 text-small font-semibold text-ink">
              <Icon name="zap" size={14} className="text-brand-700" />
              Posts that get answered fast
            </p>
            <ol className="mt-3 space-y-3">
              {TIPS.map((t, i) => (
                <li key={i} className="flex gap-3 text-small text-ink-2">
                  <span className="h-6 w-6 shrink-0 rounded-full bg-brand-700 text-white text-tiny font-bold flex items-center justify-center tabular">
                    {i + 1}
                  </span>
                  {t}
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-xl bg-charcoal text-white p-5">
            <p className="flex items-center gap-2 text-body-lg font-semibold">
              <Icon name="shield" size={16} />
              Stay safe
            </p>
            <p className="mt-2 text-small text-white/70 leading-relaxed">
              Phone numbers, WhatsApp links and emails are blocked in posts. Keep conversations on
              CampusNest until you’ve met in person.
            </p>
          </div>
        </aside>
      </div>
    </Container>
  )
}
