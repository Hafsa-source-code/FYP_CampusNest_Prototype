import { useEffect, useRef, useState } from 'react'
import { useStore } from '../store'
// import type { Hostel } from '../store'
import { HostelCard } from '../components/HostelCard'
import { navigate, cx } from '../lib'
import { Icon } from '../components/icons'
import { Avatar, Container, Logo, Stars } from '../components/ui'
// Landing page — self-contained so it can be updated on its own.
const u = (id, w = 1400) => `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`
const IMG = {
  heroBuilding: u('photo-1460317442991-0ec209397118', 2000),
  campusBuilding: u('photo-1562774053-701939374585', 1600),
  apartmentBlock: u('photo-1545324418-cc1a3fa10c00'),
  apartmentTall: u('photo-1502005229762-cf1b2da7c5d6'),
  houseGreen: u('photo-1568605114967-8130f3a36994'),
  houseWhite: u('photo-1564013799919-ab600027ffc6'),
  houseModern: u('photo-1600585154340-be6161a56a0c'),
  houseDusk: u('photo-1600596542815-ffad4c1539a9', 1600),
  livingRoom: u('photo-1560185127-6ed189bf02f4', 1200),
  friends: u('photo-1522202176988-66273c2fd55f', 1200),
  heroRoom: u('photo-1555854877-bab0e564b8d5', 2000),
}
const VARIANT = {
  primary: 'bg-brand-700 text-white hover:bg-brand-800',
  secondary: 'bg-surface text-ink border border-line-strong hover:bg-sunken',
  ghost: 'text-ink-2 hover:bg-sunken hover:text-ink',
  inverse: 'bg-white text-brand-900 hover:bg-brand-50',
  outline: 'border border-white/70 text-white hover:bg-white/10',
}
/** Button with an optional separate arrow block on the right. */
function Button({
  variant = 'primary',
  size = 'md',
  icon,
  arrow,
  full,
  className,
  children,
  ...rest
}) {
  return (
    <button
      {...rest}
      className={cx(
        'inline-flex items-center justify-center gap-2 font-medium rounded-md transition-colors whitespace-nowrap disabled:opacity-45',
        VARIANT[variant],
        size === 'lg' ? 'h-12 px-5 text-body-lg' : 'h-10 px-4 text-body',
        full && 'w-full',
        arrow && 'pr-0 overflow-hidden',
        className,
      )}
    >
      {icon && <Icon name={icon} size={16} />}
      {children}
      {arrow && (
        <span
          className={cx(
            'ml-2 self-stretch flex items-center border-l',
            size === 'lg' ? 'px-4' : 'px-3',
            variant === 'primary' ? 'bg-black/15 border-white/20' : 'border-current/30',
          )}
        >
          <Icon name="arrowRight" size={16} />
        </span>
      )}
    </button>
  )
}
const AREAS = [
  'Any area near PU',
  'Canal Road',
  'Faisal Town',
  'Garden Town',
  'Gulberg III',
  'Johar Town',
  'Model Town',
  'Township',
]
const scrollTo = (h) => document.querySelector(h)?.scrollIntoView({ behavior: 'smooth' })
function Header() {
  const [open, setOpen] = useState(false)
  const links = [
    ['Hostels', '#featured'],
    ['Areas', '#areas'],
    ['Roommates', '#roommates'],
    ['For owners', '#owners'],
  ]
  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur border-b border-line">
      <Container className="h-[76px] flex items-center gap-8">
        <Logo onClick={() => navigate('/')} size="lg" />

        {/* Nav links pushed to the right, next to the buttons */}
        <nav className="hidden lg:flex items-center gap-8 ml-auto">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-lead font-semibold text-brand-700"
          >
            Home
          </button>
          {links.map(([l, h]) => (
            <button
              key={h}
              onClick={() => scrollTo(h)}
              className="text-lead font-medium text-ink-2 hover:text-ink transition-colors"
            >
              {l}
            </button>
          ))}
        </nav>

        <div className="ml-auto lg:ml-0 hidden  sm:flex items-center gap-3 ">
          {/* Log in is now a bordered button instead of plain text */}
          <Button
            variant="secondary"
            className="h-11 px-5 text-body-lg"
            onClick={() => navigate('/login')}
          >
            Log in
          </Button>
          <Button arrow className="h-11 pl-5 text-body-lg" onClick={() => navigate('/signup')}>
            Create account
          </Button>
        </div>

        <button
          className="ml-auto sm:hidden h-10 w-10 inline-flex items-center justify-center"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <Icon name={open ? 'x' : 'menu'} size={20} />
        </button>
      </Container>
      {open && (
        <div className="sm:hidden border-t border-line px-4 py-4 space-y-3 bg-surface">
          <Button full variant="secondary" onClick={() => navigate('/login')}>
            Log in
          </Button>
          <Button full onClick={() => navigate('/signup')}>
            Create account
          </Button>
        </div>
      )}
    </header>
  )
}
// Shared look for the search fields so they read clearly as boxes you can type in
const FIELD =
  'h-11 w-full rounded-md border border-line-strong bg-canvas px-3 text-body-lg font-medium text-ink outline-none transition-colors hover:border-muted focus:border-brand-700 focus:bg-surface focus:ring-2 focus:ring-brand-100'
/** True once the element is mostly on screen — used to slide the search card in on scroll. */
function useReveal(ratio = 0.6) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.intersectionRatio >= ratio) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: [0, ratio] },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ratio])
  return [ref, shown]
}
function Hero() {
  const [area, setArea] = useState(AREAS[0])
  const [budget, setBudget] = useState('')
  const [room, setRoom] = useState('Any room')
  const [who, setWho] = useState('Any')
  const [dockRef, dockShown] = useReveal()
  const go = () =>
    navigate(
      `/s/search?uni=${encodeURIComponent('PU New Campus')}${area !== AREAS[0] ? `&area=${encodeURIComponent(area)}` : ''}${budget ? `&max=${budget}` : ''}`,
    )
  return (
    <section className="pt-4">
      <Container>
        {/* Hero fills the first screen: only text + photo are visible on arrival */}
        <div className="relative rounded-[28px] overflow-hidden bg-charcoal md:min-h-[calc(100svh-104px)] md:flex md:items-center">
          {/* Photo sits in the background on the right ~60%, fading into the navy behind the text */}
          <div className="absolute inset-y-0 right-0 w-full md:w-[60%]">
            <img
              src={IMG.heroRoom}
              alt="Clean, bright hostel room with bunk beds"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-y-0 left-0 w-1/2 hidden md:block bg-gradient-to-r from-charcoal via-charcoal/60 to-transparent" />
            <div className="absolute inset-0 md:hidden bg-charcoal/75" />
          </div>

          {/* Text column — kept narrow so lines stay short and easy to read */}
          <div className="relative px-6 sm:px-12 lg:px-16 pt-14 pb-20 md:py-24 max-w-[600px] text-white">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/25 px-3.5 h-8 text-small font-medium text-white/90">
              <Icon name="shieldCheck" size={14} className="text-brand-200" /> 214 verified hostels
              near Punjab University
            </p>
            <h1 className="mt-6 tracking-tight text-display sm:text-display-lg lg:text-display-lg leading-[1.08] font-semibold">
              Find a hostel near PU that feels like <span className="text-[#5DB7E8]">home.</span>
            </h1>
            <p className="mt-5 text-lead leading-relaxed text-white/80 max-w-[440px]">
              Compare rent, distance to campus and reviews from real students — every hostel checked
              by our team.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" arrow onClick={() => navigate('/s/search')}>
                Browse hostels
              </Button>
              <Button
                size="lg"
                variant="outline"
                arrow
                onClick={() => navigate('/signup?role=owner')}
              >
                List your hostel
              </Button>
            </div>
          </div>
        </div>

        {/* Search card — overlaps the hero's bottom edge and slides in once you scroll to it */}
        <div
          ref={dockRef}
          className={cx(
            'mt-6 transition-all duration-700 ease-out',
            dockShown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none',
          )}
        >
          <div className="rounded-xl bg-surface border border-line shadow-card px-4 py-3.5">
            {' '}
            <div className="grid sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_auto] gap-3 items-end">
              <label className="block">
                <span className="block mb-1 text-tiny font-semibold uppercase tracking-wide text-muted">
                  Area
                </span>
                <span className="relative block">
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className={cx(FIELD, 'appearance-none pr-9 cursor-pointer')}
                  >
                    {AREAS.map((a) => (
                      <option key={a}>{a}</option>
                    ))}
                  </select>
                  <Icon
                    name="chevronDown"
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
                  />
                </span>
              </label>
              <label className="block">
                <span className="block mb-1 text-tiny font-semibold uppercase tracking-wide text-muted">
                  Max rent / month
                </span>
                <span className="relative block">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-body-lg font-medium text-muted">
                    Rs
                  </span>
                  <input
                    value={budget}
                    onChange={(e) => setBudget(e.target.value.replace(/\D/g, ''))}
                    inputMode="numeric"
                    placeholder="e.g. 18000"
                    className={cx(FIELD, 'pl-10 placeholder:text-subtle placeholder:font-normal')}
                  />
                </span>
              </label>
              <label className="block">
                <span className="block mb-1 text-tiny font-semibold uppercase tracking-wide text-muted">
                  Room type
                </span>
                <span className="relative block">
                  <select
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className={cx(FIELD, 'appearance-none pr-9 cursor-pointer')}
                  >
                    {['Any room', 'Single room', '2-seater', '3-seater', '4-seater or more'].map(
                      (r) => (
                        <option key={r}>{r}</option>
                      ),
                    )}
                  </select>
                  <Icon
                    name="chevronDown"
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
                  />
                </span>
              </label>
              <Button arrow icon="search" className="h-11 w-full lg:w-auto" onClick={go}>
                Search hostels
              </Button>
            </div>
            <div className="mt-3 pt-3 border-t border-line flex flex-wrap items-center gap-2">
              <span className="text-small font-medium text-muted mr-1">Hostel for:</span>
              {['Any', 'Girls', 'Boys'].map((w) => (
                <button
                  key={w}
                  onClick={() => setWho(w)}
                  aria-pressed={who === w}
                  className={cx(
                    'h-7 px-3 rounded-full text-small font-medium border transition-colors',
                    who === w
                      ? 'bg-charcoal text-white border-charcoal'
                      : 'border-line-strong text-ink-2 hover:border-muted',
                  )}
                >
                  {w}
                </button>
              ))}
              <span className="ml-auto text-small text-muted flex items-center gap-1.5">
                <Icon name="shieldCheck" size={14} className="text-success" />
                Every listing verified by phone
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
// function Marquee() {
//   const words = ['Find where you’ll live', 'Find who you’ll live with', 'No brokers', 'Verified reviews', 'Real travel times']
//   const row = [...words, ...words]
//   return (
//     <div className="py-10 overflow-hidden select-none" aria-hidden="true">
//       <div className="cn-marquee flex w-max items-center gap-10 whitespace-nowrap">
//         {[...row, ...row].map((w, i) => (
//           <span key={i} className="flex items-center gap-10 tracking-tight text-heading lg:text-display font-semibold text-outline">
//             {w}<Icon name="sparkles" size={24} className="text-brand-700" />
//           </span>
//         ))}
//       </div>
//     </div>
//   )
// }
function SectionHead({ eyebrow, title, aside, action }) {
  return (
    <div className="grid lg:grid-cols-12 gap-6 items-end mb-10">
      <div className="lg:col-span-8">
        <p className="text-small font-semibold uppercase tracking-[0.12em] text-brand-700">
          {eyebrow}
        </p>
        <h2 className="mt-3 tracking-tight text-display-sm lg:text-display leading-[1.1] font-semibold text-ink">
          {title}
        </h2>
      </div>
      <div className="lg:col-span-4 lg:justify-self-end flex flex-col lg:items-end gap-4">
        {aside && (
          <p className="text-body-lg leading-relaxed text-muted lg:text-right max-w-md">{aside}</p>
        )}
        {action}
      </div>
    </div>
  )
}
function Featured() {
  const { hostels } = useStore()
  const list = hostels
    .filter((h) => h.status === 'Approved')
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4)
  return (
    <section id="featured" className="pt-16 lg:pt-20 pb-24 scroll-mt-24">
      <Container>
        <SectionHead
          eyebrow="Top rated this term"
          title="Hostels students keep recommending"
          action={
            <Button variant="secondary" arrow onClick={() => navigate('/s/search')}>
              View all hostels
            </Button>
          }
        />
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {list.map((h) => (
            <HostelCard key={h.id} hostel={h} compare={false} />
          ))}
        </div>
      </Container>
    </section>
  )
}
function WhySection() {
  const tiles = [
    {
      icon: 'clock',
      title: 'Real travel times',
      text: 'Walk, van and rickshaw times at 8 am — not straight-line distance.',
    },
    {
      icon: 'shieldCheck',
      title: 'Verified by phone',
      text: 'Our team calls every owner and checks photos before a listing goes live.',
    },
    {
      icon: 'star',
      title: 'Reviews from residents only',
      text: 'You can review a hostel only after the owner confirms you moved in.',
    },
  ]
  return (
    <section className="py-24 bg-surface border-y border-line">
      <Container>
        <SectionHead
          eyebrow="Why CampusNest"
          title={<>Built for students, not brokers</>}
          aside="Everything you'd normally find out after paying the deposit — shown before you send a single message."
        />
        <div className="grid lg:grid-cols-12 gap-5">
          <div className="lg:col-span-5 grid gap-5">
            {tiles.map((t) => (
              <div key={t.title} className="flex gap-5 rounded-xl bg-canvas border border-line p-6">
                <span className="h-12 w-12 shrink-0 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center">
                  <Icon name={t.icon} size={22} />
                </span>
                <div>
                  <h3 className="tracking-tight text-title-sm font-semibold text-ink">{t.title}</h3>
                  <p className="mt-1.5 text-body leading-relaxed text-muted">{t.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-7 relative min-h-[420px] rounded-xl overflow-hidden">
            <img
              src={IMG.campusBuilding}
              alt="University campus building"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute left-6 right-6 bottom-6 flex flex-wrap items-end justify-between gap-4 text-white">
              <div>
                <p className="tracking-tight text-heading font-semibold">12 minutes</p>
                <p className="text-body text-white/80">
                  average door-to-gate time for CampusNest residents
                </p>
              </div>
              <Button variant="inverse" arrow onClick={() => navigate('/s/search')}>
                Search near your campus
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
function Areas() {
  const areas = [
    { name: 'Model Town', count: 38, img: IMG.houseGreen },
    { name: 'Johar Town', count: 52, img: IMG.apartmentBlock },
    { name: 'Garden Town', count: 41, img: IMG.apartmentTall },
    { name: 'Faisal Town', count: 27, img: IMG.houseWhite },
    { name: 'Canal Road', count: 19, img: IMG.houseModern },
  ]
  const Tile = ({ a, big }) => (
    <button
      onClick={() => navigate('/s/search')}
      className={cx(
        'group relative overflow-hidden rounded-xl text-left',
        big ? 'row-span-2 min-h-[420px]' : 'min-h-[200px]',
      )}
    >
      <img
        src={a.img}
        alt={a.name}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
      <div
        className={cx(
          'absolute left-4 right-4 bottom-4 rounded-md bg-black/35 backdrop-blur-md border border-white/15 text-white',
          big ? 'p-5 text-center' : 'px-4 py-3',
        )}
      >
        <p
          className={cx(
            'tracking-tight font-semibold',
            big ? 'text-title tracking-wide' : 'text-lead',
          )}
        >
          {a.name}
        </p>
        <p className="text-small text-white/75">{a.count} hostels</p>
      </div>
    </button>
  )
  return (
    <section id="areas" className="py-24 scroll-mt-24">
      <Container>
        <SectionHead
          eyebrow="Explore by area"
          title={
            <>
              Find your neighbourhood
              <br />
              near campus
            </>
          }
          aside="All within a short ride of Punjab University — from quiet Model Town to the busy hostel lanes of Johar Town."
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-4">
          <div className="col-span-2 lg:row-span-2 grid">
            <Tile a={areas[0]} big />
          </div>
          {areas.slice(1).map((a) => (
            <Tile key={a.name} a={a} />
          ))}
        </div>
      </Container>
    </section>
  )
}
function Roommates() {
  return (
    <section id="roommates" className="pb-24 scroll-mt-24">
      <Container>
        <div className="rounded-[28px] bg-sunken grid lg:grid-cols-2 gap-12 items-center p-6 sm:p-10 lg:p-14">
          <div className="relative h-[420px]">
            <div className="absolute left-0 top-0 w-[62%] h-[70%] rounded-xl overflow-hidden shadow-pop">
              <img
                src={IMG.livingRoom}
                alt="Shared lounge"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute right-0 bottom-0 w-[58%] h-[68%] rounded-xl overflow-hidden shadow-pop ring-8 ring-sunken">
              <img
                src={IMG.friends}
                alt="Students studying together"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute left-6 bottom-8 rounded-lg bg-surface shadow-pop px-4 py-3 flex items-center gap-3">
              <span className="h-11 w-11 rounded-full border-[3px] border-brand-700 flex items-center justify-center text-body font-bold text-ink tabular">
                87%
              </span>
              <div>
                <p className="text-body font-semibold text-ink">Sara · LLB, 2nd year</p>
                <p className="text-caption text-muted">Night owl · quiet study · non-smoker</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-small font-semibold uppercase tracking-[0.12em] text-brand-700">
              Roommate matching
            </p>
            <h2 className="mt-3 tracking-tight text-display-sm lg:text-display leading-[1.1] font-semibold text-ink">
              Know who you'll share a room with — before you move in
            </h2>
            <p className="mt-5 text-lead leading-relaxed text-muted">
              Answer eight questions about your routine. When you look at a room, you'll see how
              well you match the residents who chose to be visible.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                'Compatibility score with a plain-language reason',
                'Residents choose whether they appear — off by default',
                'First names only; contact details never shared',
              ].map((p) => (
                <li key={p} className="flex gap-3 text-body-lg text-ink-2">
                  <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-brand-700 text-white flex items-center justify-center">
                    <Icon name="check" size={12} strokeWidth={3} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" arrow onClick={() => navigate('/s/roommates/profile')}>
                Create roommate profile
              </Button>
              <Button size="lg" variant="secondary" arrow onClick={() => navigate('/s/roommates')}>
                See matches
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
function Reviews() {
  const { reviews, hostel } = useStore()
  const list = reviews.slice(0, 3)
  return (
    <section className="pb-24">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-small font-semibold uppercase tracking-[0.12em] text-brand-700">
            Verified reviews
          </p>
          <h2 className="mt-3 tracking-tight text-display-sm lg:text-display leading-[1.1] font-semibold text-ink">
            Heard from people who lived there
          </h2>
        </div>
        <div className="grid lg:grid-cols-[260px_1fr] gap-6 items-stretch">
          <div className="rounded-xl bg-charcoal text-white p-8 flex flex-col justify-center">
            <p className="text-body uppercase tracking-wide text-white/60">Average rating</p>
            <p className="mt-2 tracking-tight text-display-lg font-semibold leading-none">4.6</p>
            <Stars value={4.6} size={18} className="mt-3" />
            <p className="mt-3 text-body text-white/70">from 1,240 verified stays</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {list.map((r) => (
              <figure
                key={r.id}
                className="rounded-xl bg-surface border border-line p-6 flex flex-col"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={r.studentName} size={42} />
                  <div className="flex-1 min-w-0">
                    <p className="text-body font-semibold text-ink truncate">{r.studentName}</p>
                    <p className="text-caption text-muted truncate">{hostel(r.hostelId)?.name}</p>
                    <p className="text-caption text-muted">{r.date}</p>
                  </div>
                  <Icon name="shieldCheck" size={18} className="text-success shrink-0" />
                </div>
                <Stars value={r.rating} size={14} className="mt-4" />
                <blockquote className="mt-3 text-body leading-relaxed text-ink-2 flex-1">
                  “{r.text}”
                </blockquote>
              </figure>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
function Owners() {
  return (
    <section id="owners" className="pb-24 scroll-mt-24">
      <Container>
        <div className="relative rounded-[28px] overflow-hidden min-h-[440px] flex items-center">
          <img
            src={IMG.houseModern}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#022433]/92 via-[#022433]/70 to-[#022433]/20" />
          <div className="relative grid lg:grid-cols-12 gap-10 items-center w-full px-6 sm:px-12 lg:px-16 py-14 text-white">
            <div className="lg:col-span-7">
              <p className="text-small font-semibold uppercase tracking-[0.12em] text-brand-200">
                For hostel owners
              </p>
              <h2 className="mt-3 tracking-tight text-display-sm lg:text-display leading-[1.08] font-semibold">
                Fill your rooms with students who have already chosen you
              </h2>
              <p className="mt-5 text-white/75 text-lead leading-relaxed max-w-xl">
                List for free, answer every inquiry from one inbox, track occupancy room by room,
                and build a reputation on reviews only real residents can leave.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" arrow onClick={() => navigate('/signup?role=owner')}>
                  List your hostel
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
                  Owner log in
                </Button>
              </div>
            </div>
            <dl className="lg:col-span-5 grid grid-cols-2 gap-3">
              {[
                ['0%', 'commission or broker fee'],
                ['< 2 hrs', 'average reply time'],
                ['92%', 'average occupancy'],
                ['1–2 days', 'to verify a listing'],
              ].map(([v, l]) => (
                <div
                  key={l}
                  className="rounded-lg bg-white/10 border border-white/15 backdrop-blur-md p-5"
                >
                  <dd className="tracking-tight text-heading font-semibold tabular">{v}</dd>
                  <dt className="mt-1 text-small text-white/70">{l}</dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Container>
    </section>
  )
}
function Footer() {
  const cols = [
    ['Students', ['Find a hostel', 'Compare hostels', 'Roommate matching', 'Community']],
    ['Owners', ['List your hostel', 'Owner guide', 'Verification']],
    ['Company', ['About', 'Safety', 'Help centre', 'Contact']],
  ]
  return (
    <footer className="pb-4">
      <Container>
        <div className="rounded-[28px] overflow-hidden">
          <div className="h-[220px] relative">
            <img
              src={IMG.apartmentBlock}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-charcoal" />
          </div>
          <div className="bg-charcoal text-white px-6 sm:px-12 lg:px-16 pt-10 pb-4 relative overflow-hidden">
            <div className="grid sm:grid-cols-2 lg:grid-cols-12 gap-10">
              {' '}
              <div className="lg:col-span-4">
                <Logo inverse size="lg" />
                <p className="mt-5 text-body leading-relaxed text-white/65 max-w-xs">
                  Verified student housing near Lahore's universities. 21-A, Main Boulevard, Gulberg
                  III, Lahore.
                </p>
                <p className="mt-3 text-body text-white/65">hello@campusnest.pk</p>
              </div>
              {cols.map(([h, ls]) => (
                <div key={h} className="lg:col-span-2">
                  <p className="tracking-tight text-lead font-semibold">{h}</p>
                  <ul className="mt-4 space-y-2.5">
                    {ls.map((l) => (
                      <li key={l}>
                        <a href="#/s/search" className="text-body text-white/65 hover:text-white">
                          {l}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="lg:col-span-2">
                <p className="tracking-tight text-lead font-semibold">New listings</p>
                <p className="mt-4 text-body text-white/65">
                  One email a week, only when hostels open near your campus.
                </p>
                <div className="mt-4 flex rounded-md border border-white/25 overflow-hidden">
                  <input
                    placeholder="Your email"
                    className="min-w-0 flex-1 bg-transparent px-3 h-10 text-body text-white placeholder:text-white/40 outline-none"
                  />
                  <button
                    className="px-3 bg-brand-700 hover:bg-brand-800 flex items-center"
                    aria-label="Subscribe"
                  >
                    <Icon name="arrowRight" size={16} />
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-2 text-small text-white/50">
              <span>© 2026 CampusNest. Made in Lahore.</span>
              <span className="flex gap-6">
                <a href="#/" className="hover:text-white">
                  Privacy
                </a>
                <a href="#/" className="hover:text-white">
                  Terms
                </a>
              </span>
            </div>
            <div className="@container mt-6 -mb-6">
              <p
                aria-hidden="true"
                className="tracking-tight font-bold leading-none text-center text-white/[0.06] text-[14.5cqw] tracking-tight select-none whitespace-nowrap"
              >
                CampusNest
              </p>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}
export function Landing() {
  return (
    <div className="min-h-screen bg-canvas">
      <Header />
      <Hero />
      {/* <Marquee /> */}
      <Featured />
      <WhySection />
      <Areas />
      <Roommates />
      <Reviews />
      <Owners />
      <Footer />
    </div>
  )
}
