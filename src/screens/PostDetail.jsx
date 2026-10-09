import { useState } from 'react'
import { useStore } from '../store'
import { navigate } from '../lib'
import { Icon } from '../components/icons'
import { Avatar, Button, Container, EmptyState, IconButton, Menu, Textarea } from '../components/ui'
import { Breadcrumb } from '../components/room/RoomParts'
import {
  ReportModal,
  TYPE_LABEL,
  CommunitySidebar,
  TypePill,
  HostelChip,
} from '../components/community/CommunityParts'
export function PostDetail({ id }) {
  const s = useStore()
  const p = s.posts.find((x) => x.id === id)
  const [comment, setComment] = useState('')
  const [report, setReport] = useState(null)
  if (!p)
    return (
      <Container>
        <EmptyState
          icon="message"
          title="Post not found"
          action={<Button onClick={() => navigate('/s/community')}>Back to community</Button>}
        />
      </Container>
    )
  const h = p.hostelId ? s.hostel(p.hostelId) : undefined
  const n = p.comments.length
  const post = () => {
    s.addComment(p.id, comment.trim())
    setComment('')
  }
  return (
    <Container className="pt-6 pb-16">
      <Breadcrumb
        items={[
          { label: 'Community', onClick: () => navigate('/s/community') },
          { label: TYPE_LABEL[p.type] },
        ]}
      />

      <div className="mt-5 grid lg:grid-cols-[minmax(0,1fr)_320px] gap-8 items-start">
        <div className="min-w-0">
          {/*  The post  */}
          <article className="rounded-xl border border-line bg-surface p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <Avatar name={p.author} size={42} />
                <div>
                  <p className="text-body font-semibold text-ink">{p.author}</p>
                  <p className="flex items-center gap-1 text-caption text-muted">
                    <Icon name="clock" size={12} />
                    {p.time}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <TypePill type={p.type} />
                <Menu
                  trigger={(_, t) => (
                    <IconButton icon="more" label="Post options" size="sm" onClick={t} />
                  )}
                  items={[
                    {
                      label: 'Report post',
                      icon: 'flag',
                      onClick: () => setReport({ kind: 'post', text: p.body }),
                    },
                  ]}
                />
              </div>
            </div>
            <h1 className="mt-5 tracking-tight text-heading leading-tight font-semibold text-ink">
              {p.title}
            </h1>
            <p className="mt-3 text-body-lg leading-relaxed text-ink-2 whitespace-pre-line">
              {p.body}
            </p>
            {h && (
              <div className="mt-5">
                <HostelChip name={h.name} onClick={() => navigate(`/s/hostel/${h.id}`)} />
              </div>
            )}
          </article>

          {/*  Answers  */}
          <h2 className="mt-8 mb-3 flex items-center gap-2 tracking-tight text-title font-semibold text-ink">
            <Icon name="message" size={18} className="text-brand-700" />
            {n} {n === 1 ? 'answer' : 'answers'}
          </h2>

          <div className="space-y-3">
            {n === 0 && (
              <div className="rounded-xl border border-dashed border-line-strong bg-surface p-6 text-center text-body text-muted">
                No answers yet. Share what you know.
              </div>
            )}
            {p.comments.map((c) => (
              <div
                key={c.id}
                className="rounded-xl border border-line bg-surface p-4 sm:p-5 flex gap-3"
              >
                <Avatar name={c.author} size={34} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-body">
                      <span className="font-semibold text-ink">{c.author}</span>{' '}
                      <span className="text-muted">· {c.time}</span>
                    </p>
                    <Menu
                      trigger={(_, t) => (
                        <IconButton icon="more" label="Comment options" size="sm" onClick={t} />
                      )}
                      items={[
                        {
                          label: 'Report comment',
                          icon: 'flag',
                          onClick: () => setReport({ kind: 'comment', text: c.text }),
                        },
                      ]}
                    />
                  </div>
                  <p className="mt-1 text-body-lg leading-relaxed text-ink-2">{c.text}</p>
                </div>
              </div>
            ))}

            {/*  Reply box  */}
            <div className="rounded-xl border border-brand-200 bg-brand-50/50 p-4 sm:p-5 flex gap-3">
              <Avatar name={s.currentUser.name} size={34} />
              <div className="flex-1 min-w-0">
                <Textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write an answer…"
                />
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <span className="flex items-center gap-1.5 text-caption text-muted">
                    <Icon name="lock" size={12} />
                    No phone numbers or WhatsApp links.
                  </span>
                  <Button icon="send" disabled={!comment.trim()} onClick={post}>
                    Post answer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <CommunitySidebar />
      </div>

      <ReportModal
        open={!!report}
        onClose={() => setReport(null)}
        target={report?.kind ?? 'post'}
        onSubmit={(reason) =>
          s.createReport({
            type: 'Reported Post',
            title: report?.kind === 'comment' ? `Comment on “${p.title}”` : p.title,
            reportReason: reason,
            content: report?.text,
            postId: p.id,
          })
        }
      />
    </Container>
  )
}
