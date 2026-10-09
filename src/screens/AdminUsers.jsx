import { useState } from 'react'
import { useStore } from '../store'
import { cx } from '../lib'
import { Icon } from '../components/icons'
import {
  Avatar,
  Button,
  EmptyState,
  Field,
  Input,
  Modal,
  StatusBadge,
  Table,
  Td,
  Textarea,
  toast,
} from '../components/ui'
import { ConsoleTitle, PillTabs } from '../components/admin/AdminParts'
function RolePill({ role }) {
  const student = role === 'Student'
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-caption font-medium',
        student ? 'bg-sunken text-ink-2' : 'bg-brand-50 text-brand-700',
      )}
    >
      <Icon name={student ? 'graduation' : 'building'} size={12} />
      {student ? 'Student' : 'Owner'}
    </span>
  )
}
/** Pop-up header row with a coloured icon circle. */
function ModalIcon({ icon, tone }) {
  return (
    <span className={cx('mb-4 h-11 w-11 rounded-full flex items-center justify-center', tone)}>
      <Icon name={icon} size={20} />
    </span>
  )
}
export function AdminUsers() {
  const s = useStore()
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('All')
  const [ban, setBan] = useState(null)
  const [unban, setUnban] = useState(null)
  const [reason, setReason] = useState('')
  // Same filtering as before (admins are never listed)
  const people = s.users.filter((u) => u.role !== 'Admin')
  const matches = (f, u) =>
    f === 'All' ||
    (f === 'Students' && u.role === 'Student') ||
    (f === 'Owners' && u.role === 'Hostel Owner') ||
    (f === 'Suspended' && u.status === 'Banned')
  const list = people
    .filter((u) => matches(filter, u))
    .filter((u) => !q || `${u.name} ${u.email}`.toLowerCase().includes(q.toLowerCase()))
  const tabs = [
    ['All', 'grid'],
    ['Students', 'graduation'],
    ['Owners', 'building'],
    ['Suspended', 'ban'],
  ].map(([key, icon]) => ({
    key,
    label: key,
    icon,
    count: people.filter((u) => matches(key, u)).length,
  }))
  return (
    <>
      <ConsoleTitle
        icon="users"
        title="Users"
        subtitle="Search accounts and suspend anyone who breaks the community rules."
      />

      <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between mb-4">
        <PillTabs options={tabs} value={filter} onChange={setFilter} />
        <div className="md:w-72">
          <Input
            icon="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name or email"
          />
        </div>
      </div>

      <div className="rounded-xl border border-line bg-surface shadow-card overflow-hidden">
        {list.length === 0 ? (
          <EmptyState
            icon="users"
            title="No users found"
            description="Try a different filter or search term."
          />
        ) : (
          <Table
            head={[
              'User',
              { label: 'Role', className: 'hidden md:table-cell' },
              { label: 'Joined', className: 'hidden lg:table-cell' },
              'Status',
              { label: '', align: 'right' },
            ]}
          >
            {list.map((u) => (
              <tr key={u.id} className="hover:bg-canvas transition-colors">
                <Td>
                  <div className="flex items-center gap-3 py-2">
                    <Avatar name={u.name} size={38} />
                    <div className="min-w-0">
                      <p className="font-semibold text-ink">{u.name}</p>
                      <p className="text-small text-muted truncate">{u.email}</p>
                      {u.banReason && (
                        <p className="mt-1 inline-flex items-start gap-1.5 rounded-md bg-danger-bg px-2 py-1 text-caption text-danger max-w-[380px]">
                          <Icon name="alert" size={12} className="mt-0.5 shrink-0" />
                          <span className="truncate">{u.banReason}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </Td>
                <Td className="hidden md:table-cell">
                  <RolePill role={u.role} />
                </Td>
                <Td className="hidden lg:table-cell whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 text-muted">
                    <Icon name="calendar" size={13} />
                    {u.joined}
                  </span>
                </Td>
                <Td>
                  <StatusBadge status={u.status === 'Banned' ? 'Suspended' : 'Active'} />
                </Td>
                <Td align="right">
                  {u.status === 'Active' ? (
                    <Button
                      size="sm"
                      variant="danger-ghost"
                      icon="ban"
                      onClick={() => {
                        setReason('')
                        setBan(u)
                      }}
                    >
                      Suspend
                    </Button>
                  ) : (
                    <Button size="sm" variant="secondary" icon="check" onClick={() => setUnban(u)}>
                      Restore
                    </Button>
                  )}
                </Td>
              </tr>
            ))}
          </Table>
        )}
      </div>

      {/*  Suspend  */}
      <Modal
        open={!!ban}
        onClose={() => setBan(null)}
        title={`Suspend ${ban?.name}?`}
        description="They'll be logged out and can't log in again until restored. Their listings and posts are hidden."
        footer={
          <>
            <Button variant="secondary" onClick={() => setBan(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              icon="ban"
              disabled={!reason.trim()}
              onClick={() => {
                if (ban) s.setUserBan(ban.id, true, reason.trim())
                setBan(null)
                toast('Account suspended')
              }}
            >
              Suspend account
            </Button>
          </>
        }
      >
        <ModalIcon icon="ban" tone="bg-danger-bg text-danger" />
        <Field label="Reason" required hint="Shown to the user when they try to log in.">
          <Textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Repeatedly shared phone numbers in community posts."
          />
        </Field>
      </Modal>

      {/*  Restore  */}
      <Modal
        open={!!unban}
        onClose={() => setUnban(null)}
        size="sm"
        title={`Restore ${unban?.name}?`}
        description="They'll regain full access immediately."
        footer={
          <>
            <Button variant="secondary" onClick={() => setUnban(null)}>
              Cancel
            </Button>
            <Button
              icon="check"
              onClick={() => {
                if (unban) s.setUserBan(unban.id, false)
                setUnban(null)
                toast('Account restored')
              }}
            >
              Restore account
            </Button>
          </>
        }
      >
        <ModalIcon icon="check" tone="bg-success-bg text-success" />
      </Modal>
    </>
  )
}
