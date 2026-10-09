import { useState } from 'react'
import { useStore } from '../store'
import { navigate, rs, IMG, cx } from '../lib'
import { Icon } from '../components/icons'
import { Avatar, Button, Container, EmptyState, Photo } from '../components/ui'
import { Breadcrumb } from '../components/room/RoomParts'
import { Composer } from '../components/inquiry/InquiryParts'
import { SellerTrust } from '../components/community/CommunityParts'
export function MarketplaceItem({ id }) {
  const s = useStore()
  const p = s.posts.find((x) => x.id === id && x.type === 'Marketplace')
  const [chatOpen, setChatOpen] = useState(false)
  const [chat, setChat] = useState([
    {
      me: false,
      text: 'Salam! Yes, it’s still available. I’m free on Saturday afternoon near the Main Library.',
      time: '10:30',
    },
  ])
  if (!p)
    return (
      <Container>
        <EmptyState
          icon="tag"
          title="Listing not found"
          action={<Button onClick={() => navigate('/s/community')}>Back to community</Button>}
        />
      </Container>
    )
  const photos = [p.image ?? IMG.lamp, IMG.sofa, IMG.lamp]
  const send = (text) => setChat((c) => [...c, { me: true, text, time: 'Now' }])
  return (
    <Container className="pt-6 pb-16">
      <Breadcrumb
        items={[
          { label: 'Community', onClick: () => navigate('/s/community') },
          { label: 'Marketplace' },
        ]}
      />

      <div className="mt-5 lg:grid lg:grid-cols-12 lg:gap-10">
        {/*  Item  */}
        <div className="lg:col-span-7">
          <div className="relative grid grid-cols-3 gap-2 h-[280px] sm:h-[360px] rounded-xl overflow-hidden">
            <Photo
              src={photos[0]}
              alt={p.title}
              ratio="auto"
              rounded={false}
              className="col-span-2 h-full"
            />
            <div className="grid grid-rows-2 gap-2">
              <Photo src={photos[1]} alt="" ratio="auto" rounded={false} className="h-full" />
              <Photo src={photos[2]} alt="" ratio="auto" rounded={false} className="h-full" />
            </div>
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 h-7 px-3 rounded-full bg-warning text-white text-caption font-semibold shadow-card">
              <Icon name="tag" size={13} />
              For sale
            </span>
          </div>

          <h1 className="mt-6 tracking-tight text-heading leading-tight font-semibold text-ink">
            {p.title}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-small text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Icon name="mapPin" size={14} />
              Johar Town, Lahore
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="clock" size={14} />
              Listed {p.time}
            </span>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <p className="tracking-tight text-display-sm leading-none font-semibold text-brand-700 tabular">
              {rs(p.price ?? 0)}
            </p>
            <span className="h-7 px-3 rounded-full bg-sunken text-caption font-medium text-ink-2 inline-flex items-center">
              Negotiable
            </span>
          </div>

          <div className="mt-6 rounded-xl border border-line bg-surface p-5">
            <h2 className="flex items-center gap-2 text-body-lg font-semibold text-ink">
              <Icon name="info" size={16} className="text-brand-700" />
              Description
            </h2>
            <p className="mt-2 text-body-lg leading-relaxed text-ink-2">{p.body}</p>
          </div>
        </div>

        {/*  Seller + chat  */}
        <aside className="lg:col-span-5 mt-8 lg:mt-0">
          <div className="sticky top-24 space-y-3">
            <div className="rounded-xl border border-line bg-surface shadow-card p-5">
              <p className="text-tiny font-semibold uppercase tracking-[0.12em] text-muted">
                Seller
              </p>
              <div className="mt-3 flex items-center gap-3">
                <Avatar name={p.author} size={46} />
                <div className="min-w-0">
                  <p className="text-lead font-semibold text-ink">{p.author}</p>
                  {p.seller && (
                    <div className="mt-1">
                      <SellerTrust seller={p.seller} />
                    </div>
                  )}
                </div>
              </div>

              {p.seller && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {[
                    ['calendar', `${p.seller.months} months`, 'Member for'],
                    ['shieldCheck', String(p.seller.stays), 'Verified stays'],
                  ].map(([icon, v, l]) => (
                    <div
                      key={l}
                      className="flex items-center gap-2.5 rounded-lg bg-sunken px-3 py-2.5"
                    >
                      <Icon name={icon} size={16} className="text-brand-700" />
                      <div>
                        <p className="text-tiny text-muted">{l}</p>
                        <p className="text-body font-semibold text-ink tabular">{v}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!chatOpen ? (
                <Button
                  full
                  size="lg"
                  icon="message"
                  className="mt-5"
                  onClick={() => setChatOpen(true)}
                >
                  Message seller
                </Button>
              ) : (
                <div className="mt-5">
                  <div className="flex gap-2.5 rounded-lg border border-[#EFDDB3] bg-warning-bg p-3 text-small text-warning">
                    <Icon name="alert" size={16} className="mt-0.5 shrink-0" />
                    <p>
                      <span className="font-semibold">Stay safe:</span> meet in a public place,
                      ideally on campus, during daylight. Never pay in advance.
                    </p>
                  </div>
                  <div className="mt-4 space-y-3 max-h-60 overflow-y-auto pr-1">
                    {chat.map((m, i) => (
                      <div key={i} className={cx('flex', m.me && 'justify-end')}>
                        <div className="max-w-[82%]">
                          <div
                            className={cx(
                              'rounded-[16px] px-3.5 py-2 text-body leading-relaxed',
                              m.me
                                ? 'bg-brand-700 text-white rounded-br-[6px]'
                                : 'bg-surface border border-line text-ink rounded-bl-[6px]',
                            )}
                          >
                            {m.text}
                          </div>
                          <p className={cx('mt-1 text-tiny text-subtle', m.me && 'text-right')}>
                            {m.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3">
                    <Composer placeholder="Write a message…" onSend={send} />
                  </div>
                </div>
              )}
            </div>
            <p className="px-1 flex gap-2 text-caption text-muted">
              <Icon name="lock" size={13} className="mt-0.5 shrink-0" />
              Your phone number and email are never shown to the seller.
            </p>
          </div>
        </aside>
      </div>
    </Container>
  )
}
