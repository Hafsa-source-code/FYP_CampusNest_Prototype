import { useState } from 'react'
import { useStore } from '../store'
import { navigate, rs } from '../lib'
import { Icon } from '../components/icons'
import { Button, Container, EmptyState } from '../components/ui'
import {
  ProfileSummaryCard,
  MatchCard,
  MatchGate,
  PillGroup,
  HowMatchingWorks,
} from '../components/roommate/RoommateParts'
// Demo matches (unchanged)
const MATCHES = [
  {
    id: 1,
    name: 'Sara',
    programme: 'LLB, 2nd year',
    score: 87,
    hostelId: 1,
    roomTypeId: 2,
    sleep: 'Night owl',
    budgetMax: 17000,
    shared: ['Night owl', 'Quiet study', 'Non-smoker'],
    differs: 'Cleanliness 3 vs your 4',
    summary:
      'You both study late and prefer silence after 10 pm. Sara is slightly more relaxed about tidiness — easy to settle with a simple cleaning rota.',
  },
  {
    id: 2,
    name: 'Zainab',
    programme: 'BS Computer Science, 3rd year',
    score: 79,
    hostelId: 1,
    roomTypeId: 2,
    sleep: 'Early bird',
    budgetMax: 16000,
    shared: ['Budget overlaps', 'Non-smoker', 'Rarely has visitors'],
    differs: 'Early bird vs night owl',
    summary:
      'Similar budgets and a shared preference for a calm, visitor-free room. The main difference is sleep: Zainab is usually in bed by 11 pm.',
  },
  {
    id: 3,
    name: 'Amna',
    programme: 'BBA, 1st year',
    score: 71,
    hostelId: 4,
    roomTypeId: 6,
    sleep: 'Flexible',
    budgetMax: 18000,
    shared: ['Quiet study', 'Similar budget'],
    differs: 'Visitors often vs rarely',
    summary:
      'You would study well together, but Amna often has friends over in the evening, which may clash with your preference for a quiet room.',
  },
  {
    id: 4,
    name: 'Hira',
    programme: 'BS Physics, 4th year',
    score: 66,
    hostelId: 5,
    roomTypeId: 8,
    sleep: 'Night owl',
    budgetMax: 14000,
    shared: ['Night owl', 'Reading'],
    differs: 'Noise tolerance high vs low',
    summary:
      'Compatible schedules and interests. Hira is comfortable with more noise than you are.',
  },
]
const SLEEP_OPTIONS = ['Any', 'Early bird', 'Night owl', 'Flexible'].map((v) => ({
  value: v,
  label: v,
}))
const BUDGET_OPTIONS = ['Any', '14000', '16000', '18000'].map((v) => ({
  value: v,
  label: v === 'Any' ? 'Any budget' : `Up to ${rs(Number(v))}`,
}))
function PageTitle({ action }) {
  return (
    <div className="pt-6 pb-5 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="h-10 w-10 shrink-0 rounded-full bg-brand-700 text-white flex items-center justify-center">
          <Icon name="users" size={18} />
        </span>
        <div>
          <h1 className="tracking-tight text-heading leading-tight font-semibold text-ink">
            Roommate matches
          </h1>
          <p className="text-small text-muted">
            Students looking at the same hostels as you, ranked by compatibility.
          </p>
        </div>
      </div>
      {action}
    </div>
  )
}
export function RoommateMatches() {
  const s = useStore()
  const [sleep, setSleep] = useState('Any')
  const [budget, setBudget] = useState('Any')
  const toProfile = () => navigate('/s/roommates/profile')
  if (!s.profile.saved) {
    return (
      <Container className="pb-16">
        <PageTitle />
        <MatchGate onCreate={toProfile} />
      </Container>
    )
  }
  // Filtering + sorting (unchanged)
  const list = MATCHES.filter((m) => sleep === 'Any' || m.sleep === sleep)
    .filter((m) => budget === 'Any' || m.budgetMax <= Number(budget))
    .sort((a, b) => b.score - a.score)
  const reset = () => {
    setSleep('Any')
    setBudget('Any')
  }
  return (
    <Container className="pb-16">
      <PageTitle
        action={
          <Button variant="secondary" icon="pen" onClick={toProfile}>
            Edit profile
          </Button>
        }
      />

      <div className="grid lg:grid-cols-[300px_minmax(0,1fr)] gap-8 items-start">
        {/*  Left: profile + filters + info  */}
        <aside className="space-y-5 lg:sticky lg:top-24">
          <ProfileSummaryCard
            sleep={s.profile.sleep}
            study={s.profile.study}
            budgetMin={s.profile.budgetMin}
            budgetMax={s.profile.budgetMax}
            cleanliness={s.profile.cleanliness}
            onEdit={toProfile}
          />

          <div className="rounded-xl border border-line bg-surface p-5 space-y-5">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-body font-semibold text-ink">
                <Icon name="filter" size={15} className="text-brand-700" />
                Filter matches
              </p>
              {(sleep !== 'Any' || budget !== 'Any') && (
                <button
                  onClick={reset}
                  className="text-caption font-semibold text-brand-700 hover:text-brand-800"
                >
                  Reset
                </button>
              )}
            </div>
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-caption font-medium text-muted">
                <Icon name="moon" size={13} />
                Sleep schedule
              </p>
              <PillGroup options={SLEEP_OPTIONS} value={sleep} onChange={setSleep} />
            </div>
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-caption font-medium text-muted">
                <Icon name="tag" size={13} />
                Budget
              </p>
              <PillGroup options={BUDGET_OPTIONS} value={budget} onChange={setBudget} />
            </div>
            <p className="pt-4 border-t border-line text-small text-muted">
              <span className="font-semibold text-ink tabular">{list.length}</span>{' '}
              {list.length === 1 ? 'match' : 'matches'}
            </p>
          </div>

          <div className="flex gap-3 rounded-lg bg-sunken p-4 text-small text-ink-2 leading-relaxed">
            <Icon name="info" size={16} className="mt-0.5 shrink-0 text-brand-700" />
            Matches help you decide — they don't book anything. Each student sends their own inquiry
            to the hostel.
          </div>
        </aside>

        {/*  Right: match cards  */}
        <div className="min-w-0">
          {list.length === 0 ? (
            <div className="rounded-xl border border-dashed border-line-strong bg-surface">
              <EmptyState
                icon="users"
                title="No matches with these filters"
                description="Try a different sleep schedule or a higher budget."
                action={
                  <Button variant="secondary" onClick={reset}>
                    Reset filters
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="grid xl:grid-cols-2 gap-5 pt-3">
              {list.map((m, i) => (
                <MatchCard
                  key={m.id}
                  m={m}
                  top={i === 0}
                  hostelName={s.hostel(m.hostelId)?.name}
                  onViewRoom={() => navigate(`/s/hostel/${m.hostelId}/room/${m.roomTypeId}`)}
                  onViewHostel={() => navigate(`/s/hostel/${m.hostelId}`)}
                />
              ))}
            </div>
          )}
          <div className="mt-6 lg:hidden">
            <HowMatchingWorks />
          </div>
        </div>
      </div>
    </Container>
  )
}
