import { useEffect, useState } from 'react'
import { navigate, cx } from '../lib'
import { Icon } from './icons'
import { Input, Logo } from './ui'
//  Slides for the photo panel
const u = (id) => `https://images.unsplash.com/${id}?w=1200&q=80&auto=format&fit=crop`
export const LOGIN_SLIDES = [
  {
    img: u('photo-1523240795612-9a054b0db644'),
    title: 'Find your place near campus',
    text: 'Verified hostels around Punjab University.',
  },
  {
    img: u('photo-1522771739844-6a9f6d5f14af'),
    title: 'Rooms you can trust',
    text: 'Every listing is checked by phone before it goes live.',
  },
  {
    img: u('photo-1529156069898-49953e39b3ac'),
    title: 'Live with people you click with',
    text: 'See your roommate match before you move in.',
  },
]
export const STUDENT_SLIDES = [
  {
    img: u('photo-1529156069898-49953e39b3ac'),
    title: 'Your next home, minus the guesswork',
    text: 'Compare rent, distance and real reviews in one place.',
  },
  {
    img: u('photo-1523240795612-9a054b0db644'),
    title: 'Reviews from real residents',
    text: 'Only students who moved in can leave a review.',
  },
  {
    img: u('photo-1522771739844-6a9f6d5f14af'),
    title: 'No brokers. No hidden fees.',
    text: 'Talk to hostel owners directly, inside CampusNest.',
  },
]
export const OWNER_SLIDES = [
  {
    img: u('photo-1541339907198-e08756dedf3f'),
    title: 'Fill your rooms before term starts',
    text: 'Reach students searching near your hostel.',
  },
  {
    img: u('photo-1513694203232-719a280e022f'),
    title: 'One inbox for every inquiry',
    text: 'No more midnight phone calls.',
  },
  {
    img: u('photo-1517486808906-6ca8b3f04846'),
    title: 'Know your occupancy at a glance',
    text: 'Track every room and seat from your dashboard.',
  },
]
//  Page frame
/**
 * One rounded card centred on the page: form LEFT, photo panel RIGHT.
 * Desktop: card never taller than the window, so the page doesn't scroll.
 * Mobile: photo panel hidden, form scrolls normally.
 */
export function AuthLayout({ slides, children }) {
  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-canvas flex items-center justify-center sm:p-4 lg:p-6">
      <div className="w-full max-w-[1120px] lg:h-full lg:max-h-[760px] bg-surface sm:rounded-[28px] sm:border sm:border-line shadow-pop p-3 grid lg:grid-cols-[1.05fr_1fr]">
        {/* LEFT — form */}
        <div className="flex flex-col px-5 sm:px-10 lg:px-14 py-5 lg:py-4 lg:min-h-0 lg:overflow-y-auto">
          {/* Top bar: back link at top-left, lined up with the form's left edge */}
          <div className="w-full max-w-[420px] mx-auto flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="group -ml-3 inline-flex items-center gap-2 h-9 px-3 rounded-full text-body font-medium text-ink-2 hover:text-ink hover:bg-sunken focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-700/25 transition-colors"
            >
              <Icon
                name="arrowLeft"
                size={16}
                className="transition-transform group-hover:-translate-x-0.5"
              />
              Back to website
            </button>
            {/* Logo only on mobile — on desktop it sits on the photo */}
            <span className="lg:hidden">
              <Logo onClick={() => navigate('/')} />
            </span>
          </div>

          <div className="flex-1 flex items-center justify-center py-3">
            <div className="w-full max-w-[420px]">{children}</div>
          </div>
        </div>

        {/* RIGHT — photo. key resets the slider when the slide set changes (e.g. role toggle). */}
        <Showcase key={slides[0].img} slides={slides} />
      </div>
    </div>
  )
}
/** Photo panel with logo, rotating caption and slider dots. Pauses on hover and respects reduced motion. */
function Showcase({ slides }) {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (paused || reduce) return
    const t = setInterval(() => setI((x) => (x + 1) % slides.length), 6000)
    return () => clearInterval(t)
  }, [paused, slides.length])
  return (
    <div
      className="hidden lg:block relative rounded-[20px] overflow-hidden bg-charcoal min-h-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((s, k) => (
        <img
          key={s.img}
          src={s.img}
          alt=""
          onError={(e) => (e.currentTarget.style.display = 'none')}
          className={cx(
            'absolute inset-0 h-full w-full object-cover transition-opacity duration-700',
            k === i ? 'opacity-100' : 'opacity-0',
          )}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-[#022433] via-[#022433]/30 to-[#022433]/35" />

      <div className="absolute left-0 top-0 p-6">
        <Logo inverse onClick={() => navigate('/')} />
      </div>

      <div className="absolute inset-x-0 bottom-0 px-10 pb-8 text-center text-white">
        <p className="tracking-tight text-heading leading-tight font-semibold">{slides[i].title}</p>
        <p className="mt-2 text-body-lg leading-relaxed text-white/80">{slides[i].text}</p>
        <div className="mt-5 flex justify-center gap-1">
          {slides.map((_, k) => (
            <button
              key={k}
              type="button"
              aria-label={`Show slide ${k + 1}`}
              aria-current={k === i}
              onClick={() => setI(k)}
              className="group px-1 py-2.5 focus-visible:outline-none"
            >
              <span
                className={cx(
                  'block h-1 rounded-full transition-all group-focus-visible:ring-2 group-focus-visible:ring-white',
                  k === i ? 'w-8 bg-white' : 'w-5 bg-white/40 group-hover:bg-white/70',
                )}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
//  Form pieces
const FILLED =
  'h-11 w-full rounded-md bg-sunken border border-transparent px-4 text-body-lg text-ink placeholder:text-subtle outline-none transition-colors hover:border-line-strong focus:bg-surface focus:border-brand-700 focus:ring-[3px] focus:ring-brand-700/15'
/** Grey filled input (kept for any older screens that still use it). */
export function AuthInput({ invalid, className, ...rest }) {
  return (
    <input
      {...rest}
      className={cx(
        FILLED,
        invalid && 'border-danger focus:border-danger focus:ring-danger/15',
        className,
      )}
    />
  )
}
/** Password input — same style as Email (white, bordered, leading icon) with show/hide button. */
export function PasswordField({ invalid, ...rest }) {
  const [show, setShow] = useState(false)
  return (
    <Input
      {...rest}
      inputSize="md"
      icon="lock"
      invalid={invalid}
      type={show ? 'text' : 'password'}
      suffix={
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? 'Hide password' : 'Show password'}
          aria-pressed={show}
          className="h-9 w-9 rounded-[6px] flex items-center justify-center text-muted hover:text-ink hover:bg-sunken focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40"
        >
          <Icon name={show ? 'eyeOff' : 'eye'} size={17} />
        </button>
      }
    />
  )
}
/** Small red message under a field. */
export function FieldError({ children }) {
  if (!children) return null
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-small text-danger">
      <Icon name="alert" size={13} />
      {children}
    </p>
  )
}
const ROLES = [
  { value: 'Student', icon: 'graduation' },
  { value: 'Hostel owner', icon: 'building' },
]
/** Pill toggle for account type. Label is for screen readers; the options explain themselves visually. */
export function RoleToggle({ value, onChange }) {
  return (
    <div>
      <p id="role-label" className="sr-only">
        I'm joining as
      </p>
      <div
        role="radiogroup"
        aria-labelledby="role-label"
        className="grid grid-cols-2 rounded-full bg-sunken p-1"
      >
        {ROLES.map((r) => {
          const on = value === r.value
          return (
            <button
              key={r.value}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onChange(r.value)}
              className={cx(
                'h-10 rounded-full inline-flex items-center justify-center gap-2 text-body font-medium transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-700/25',
                on ? 'bg-brand-700 text-white shadow-card' : 'text-ink-2 hover:text-ink',
              )}
            >
              <Icon name={r.icon} size={16} />
              {r.value}
            </button>
          )
        })}
      </div>
    </div>
  )
}
/** Line with text in the middle, e.g. "Or try a demo account". */
export function OrDivider({ children, className }) {
  return (
    <div className={cx('flex items-center gap-3 text-small text-muted', className)}>
      <span className="h-px flex-1 bg-line" />
      {children}
      <span className="h-px flex-1 bg-line" />
    </div>
  )
}
/** Serif page title + one short line under it. */
export function AuthTitle({ title, children }) {
  return (
    <div>
      <h1 className="tracking-tight text-display-sm sm:text-display-sm leading-[1.1] font-semibold text-ink">
        {title}
      </h1>
      {children && <p className="mt-2 text-body-lg leading-relaxed text-ink-2">{children}</p>}
    </div>
  )
}
