import { useState } from 'react'
import { useStore } from '../store'
import { navigate } from '../lib'
import {
  Button,
  Card,
  Choice,
  Container,
  Field,
  Input,
  PageHeader,
  Switch,
  toast,
} from '../components/ui'
const HOBBIES = [
  'Hometown',
  'Religion',
  'Department/ Job type',
  'Reading',
  'Coding',
  'Badminton',
  'Cricket',
  'Cooking',
  'Gym',
  'Art',
  'Photography',
  'Music',
  'Gaming',
  'Films',
  'Writing',
]
function Row({ title, description, children }) {
  return (
    <div className="grid md:grid-cols-[260px_1fr] gap-3 md:gap-10 py-6 first:pt-0 last:pb-0">
      <div>
        <h3 className="text-body font-semibold text-ink">{title}</h3>
        {description && <p className="mt-1 text-small text-muted leading-relaxed">{description}</p>}
      </div>
      <div>{children}</div>
    </div>
  )
}
export function RoommateProfile() {
  const s = useStore()
  const [p, setP] = useState(() => {
    const { saved: _, ...rest } = s.profile
    return rest
  })
  const set = (k, v) => setP((x) => ({ ...x, [k]: v }))
  const save = () => {
    s.saveProfile(p)
    toast('Roommate profile saved')
    navigate('/s/roommates')
  }
  return (
    <Container>
      <PageHeader
        title="Roommate profile"
        description="Used only to calculate compatibility. Other students never see your answers — only a match score and the traits you share."
        back={{
          label: 'Roommate matches',
          onClick: () => navigate('/s/roommates'),
        }}
      />

      <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-8 items-start">
        <div className="min-w-0">
          <Card>
            <div className="divide-y divide-line">
              <Row title="Budget" description="Monthly rent per seat you're comfortable with.">
                <div className="grid grid-cols-2 gap-3 max-w-sm">
                  <Field label="Minimum (Rs)">
                    <Input
                      inputMode="numeric"
                      value={p.budgetMin}
                      onChange={(e) => set('budgetMin', Number(e.target.value.replace(/\D/g, '')))}
                    />
                  </Field>
                  <Field label="Maximum (Rs)">
                    <Input
                      inputMode="numeric"
                      value={p.budgetMax}
                      onChange={(e) => set('budgetMax', Number(e.target.value.replace(/\D/g, '')))}
                    />
                  </Field>
                </div>
              </Row>
              <Row title="Cleanliness" description="How tidy do you keep shared space?">
                <div className="max-w-sm">
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={p.cleanliness}
                    onChange={(e) => set('cleanliness', Number(e.target.value))}
                    className="w-full accent-[var(--color-charcoal)]"
                  />
                  <div className="mt-1 flex justify-between text-small text-muted">
                    <span>Relaxed</span>
                    <span className="font-medium text-ink tabular">{p.cleanliness} / 5</span>
                    <span>Very tidy</span>
                  </div>
                </div>
              </Row>
             <Row title="Religion">
              <Choice
                options={['Muslim', 'Christian', 'Hindu', 'Other']}
                value={p.religion}
                onChange={(v) => set('religion', v)}
              />
            </Row>
              <Row title="Sleep schedule">
                <Choice
                  options={['Early bird', 'Night owl', 'Flexible']}
                  value={p.sleep}
                  onChange={(v) => set('sleep', v)}
                />
              </Row>
              <Row title="Study habits">
                <Choice
                  options={['Quiet', 'Group', 'Flexible']}
                  value={p.study}
                  onChange={(v) => set('study', v)}
                />
              </Row>
              <Row title="Smoking">
                <Choice
                  options={['No', 'Yes', "Don't mind"]}
                  value={p.smoking}
                  onChange={(v) => set('smoking', v)}
                />
              </Row>
              <Row title="Visitors in the room">
                <Choice
                  options={['Rarely', 'Sometimes', 'Often']}
                  value={p.visitors}
                  onChange={(v) => set('visitors', v)}
                />
              </Row>
              <Row title="Noise tolerance">
                <Choice
                  options={['Low', 'Medium', 'High']}
                  value={p.noise}
                  onChange={(v) => set('noise', v)}
                />
              </Row>
              <Row title="Interests" description="Pick up to five.">
                <Choice
                  size="sm"
                  options={HOBBIES}
                  value={p.hobbies}
                  onChange={(h) =>
                    set(
                      'hobbies',
                      p.hobbies.includes(h)
                        ? p.hobbies.filter((x) => x !== h)
                        : p.hobbies.length < 5
                          ? [...p.hobbies, h]
                          : p.hobbies,
                    )
                  }
                />
              </Row>
              <Row
                title="Show me to students viewing my room"
                description="Your first name, match score and shared traits appear when someone looks at your room. Off by default."
              >
                <div className="flex items-center gap-3">
                  <Switch
                    checked={p.visible}
                    onChange={(v) => set('visible', v)}
                    label="Visible to other students"
                  />
                  <span className="text-body text-ink-2">{p.visible ? 'Visible' : 'Hidden'}</span>
                </div>
              </Row>
            </div>
          </Card>

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => navigate('/s/roommates')}>
              Cancel
            </Button>
            <Button onClick={save}>Save profile</Button>
          </div>
        </div>
        <aside className="space-y-6 lg:sticky lg:top-24">
          <div className="rounded-lg bg-charcoal text-white p-6">
            <p className="text-caption font-medium uppercase tracking-wide text-white/60">
              Your profile at a glance
            </p>
            <dl className="mt-4 space-y-3 text-body">
              {[
                ['Budget', `Rs ${p.budgetMin.toLocaleString()}–${p.budgetMax.toLocaleString()}`],
                ['Religion',p.religion],
                ['Sleep', p.sleep],
                ['Study', p.study],
                ['Cleanliness', `${p.cleanliness} / 5`],
                ['Visitors', p.visitors],
                ['Noise', p.noise],
                ['Smoking', p.smoking],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between gap-4 border-b border-white/10 pb-2.5 last:border-0"
                >
                  <dt className="text-white/60">{k}</dt>
                  <dd className="font-medium text-right">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-small text-white/60">
              {p.visible ? 'Visible to students viewing your room.' : 'Hidden from other students.'}
            </p>
          </div>
          <Card>
            <p className="text-small font-semibold text-ink">How matching works</p>
            <p className="mt-2 text-body text-muted leading-relaxed">
              We compare sleep, study, cleanliness, visitors, noise, smoking and budget. Each shared
              trait raises the score; big differences lower it. Other students never see your
              answers — only the score and what you have in common.
            </p>
          </Card>
        </aside>
      </div>
    </Container>
  )
}
