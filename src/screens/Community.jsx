import { useState } from 'react'
import { useStore } from '../store'
import { navigate, cx } from '../lib'
import { Icon } from '../components/icons'
import { Button, Container, EmptyState } from '../components/ui'
import {
  TYPE_META,
  TYPE_LABEL,
  postLink,
  ReportModal,
  CommunitySidebar,
  PostCard,
  PageTitle,
} from '../components/community/CommunityParts'
// Keep these exports so any page that imported them from here keeps working
export { TYPE_LABEL, postLink, ReportModal, CommunitySidebar }
const TABS = [
  { label: 'All', type: null, icon: 'grid' },
  { label: 'Questions', type: 'Question', icon: TYPE_META.Question.icon },
  { label: 'Experiences', type: 'Experience', icon: TYPE_META.Experience.icon },
  {
    label: 'Marketplace',
    type: 'Marketplace',
    icon: TYPE_META.Marketplace.icon,
  },
  {
    label: 'Study partners',
    type: 'Study Partners',
    icon: TYPE_META['Study Partners'].icon,
  },
]
export function Community() {
  const s = useStore()
  const [type, setType] = useState(null)
  const [reporting, setReporting] = useState(null)
  const posts = s.posts.filter((p) => !type || p.type === type)
  const countOf = (t) => (t ? s.posts.filter((p) => p.type === t).length : s.posts.length)
  return (
    <Container className="pb-16">
      <PageTitle
        icon="message"
        title="Community"
        subtitle="Questions, experiences and second-hand essentials from students near PU New Campus."
        action={
          <Button icon="plus" onClick={() => navigate('/s/community/new')}>
            New post
          </Button>
        }
      />

      <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-8 items-start">
        <div className="min-w-0">
          {/* Category pills */}
          <div role="tablist" className="mb-5 flex gap-2 overflow-x-auto pb-1">
            {TABS.map((t) => {
              const on = type === t.type
              return (
                <button
                  key={t.label}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setType(t.type)}
                  className={cx(
                    'h-9 shrink-0 px-3.5 rounded-full border inline-flex items-center gap-2 text-small font-medium transition-colors',
                    on
                      ? 'border-brand-700 bg-brand-700 text-white'
                      : 'border-line-strong bg-surface text-ink-2 hover:border-brand-200',
                  )}
                >
                  <Icon name={t.icon} size={14} />
                  {t.label}
                  <span
                    className={cx(
                      'h-5 min-w-5 px-1.5 rounded-full text-tiny font-semibold leading-5 tabular',
                      on ? 'bg-white/20' : 'bg-sunken text-muted',
                    )}
                  >
                    {countOf(t.type)}
                  </span>
                </button>
              )
            })}
          </div>

          {posts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-line-strong bg-surface">
              <EmptyState
                icon="message"
                title="Nothing here yet"
                description="Be the first to post in this category."
                action={
                  <Button icon="plus" onClick={() => navigate('/s/community/new')}>
                    New post
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((p) => {
                const h = p.hostelId ? s.hostel(p.hostelId) : undefined
                return (
                  <PostCard
                    key={p.id}
                    post={p}
                    hostelName={h?.name}
                    onOpen={() => navigate(postLink(p))}
                    onHostel={h ? () => navigate(`/s/hostel/${h.id}`) : undefined}
                    onReport={() => setReporting(p)}
                  />
                )
              })}
            </div>
          )}
        </div>

        <CommunitySidebar onTopic={setType} />
      </div>

      <ReportModal
        open={!!reporting}
        onClose={() => setReporting(null)}
        target="post"
        onSubmit={(reason) =>
          reporting &&
          s.createReport({
            type: 'Reported Post',
            title: reporting.title,
            reportReason: reason,
            content: reporting.body,
            postId: reporting.id,
          })
        }
      />
    </Container>
  )
}
