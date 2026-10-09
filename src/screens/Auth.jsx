import { useState } from 'react'
import { useStore } from '../store'
import { navigate } from '../lib'
import { Icon } from '../components/icons'
import { Button, Field, Input, Notice } from '../components/ui'
import {
  AuthLayout,
  AuthTitle,
  LOGIN_SLIDES,
  OrDivider,
  OWNER_SLIDES,
  PasswordField,
  RoleToggle,
  STUDENT_SLIDES,
} from '../components/AuthLayout'
// Where each role lands after logging in
export const homeFor = (u) =>
  u.role === 'Admin' ? '/a/moderation' : u.role === 'Hostel Owner' ? '/o/dashboard' : '/s/search'
const LINK = 'font-semibold text-brand-700 hover:text-brand-800'
/** Standard-size primary button, centred under the form. Same on every auth screen. */
function SubmitButton({ children }) {
  return (
    <div className="flex justify-center">
      <Button type="submit" size="md" className="min-w-[180px]">
        {children}
      </Button>
    </div>
  )
}
//  Login
export function Login() {
  const { login, signIn, users } = useStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const submit = (e) => {
    e?.preventDefault()
    if (!email.trim() || !password) return setError('Enter your email and password to log in.')
    const u = login(email)
    if (!u)
      return setError(
        'We couldn’t find an account with that email. Check the spelling or create an account.',
      )
    // Banned check happens before entry (Admin module rule)
    if (u.status === 'Banned')
      return setError(
        <>
          <strong>This account is suspended.</strong> {u.banReason} Contact support@campusnest.pk if
          you think this is a mistake.
        </>,
      )
    navigate(homeFor(u))
  }
  const demo = (id) => {
    const u = users.find((x) => x.id === id)
    signIn(id)
    navigate(homeFor(u))
  }
  return (
    <AuthLayout slides={LOGIN_SLIDES}>
      <AuthTitle
        title={
          <>
            Welcome <span className="text-brand-700">back</span>
          </>
        }
      >
        Log in to see your saved hostels and messages.
      </AuthTitle>

      {error && (
        <Notice tone="danger" className="mt-4">
          {error}
        </Notice>
      )}

      <form onSubmit={submit} className="mt-5 space-y-3">
        <Field label="Email">
          <Input
            icon="mail"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError(null)
            }}
            placeholder="you@pu.edu.pk"
            autoComplete="email"
          />
        </Field>
        <div>
          <Field label="Password">
            <PasswordField
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError(null)
              }}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </Field>
          <div className="mt-1.5 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/forgot')}
              className={`text-small ${LINK}`}
            >
              Forgot password?
            </button>
          </div>
        </div>
        <SubmitButton>Log in</SubmitButton>
      </form>

      {/* Prototype only — lets the examiner jump straight into each role */}
      <div className="mt-6">
        <OrDivider>Try a demo account</OrDivider>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            [1, 'Student', 'graduation'],
            [2, 'Owner', 'building'],
            [10, 'Admin', 'shield'],
          ].map(([id, label, icon]) => (
            <button
              key={label}
              type="button"
              onClick={() => demo(id)}
              className="flex flex-col items-center gap-1 rounded-lg border border-line-strong bg-surface py-2.5 text-small font-medium text-ink-2 hover:border-brand-700 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-700/25 transition-colors"
            >
              <Icon name={icon} size={17} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 text-body text-muted text-center">
        New to CampusNest?{' '}
        <button type="button" onClick={() => navigate('/signup')} className={LINK}>
          Create an account
        </button>
      </p>
    </AuthLayout>
  )
}
//  Sign up
export function Signup({ initialRole }) {
  const { signIn } = useStore()
  const [role, setRole] = useState(initialRole === 'owner' ? 'Hostel owner' : 'Student')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [tried, setTried] = useState(false)
  const short = !!password && password.length < 8
  const mismatch = !!confirm && confirm !== password
  const valid = name.trim() && email.includes('@') && password.length >= 8 && password === confirm
  const isStudent = role === 'Student'
  // Errors show while typing (short / mismatch) or after the user presses submit (tried)
  const nameErr = tried && !name.trim()
  const emailErr = tried && !email.includes('@')
  const passErr = short || (tried && password.length < 8)
  const confirmErr = mismatch || (tried && !confirm)
  const submit = (e) => {
    e.preventDefault()
    if (!valid) return setTried(true)
    if (isStudent) {
      signIn(1)
      navigate('/s/search')
    } else {
      signIn(2)
      navigate('/o/hostels/new')
    }
  }
  return (
    <AuthLayout slides={isStudent ? STUDENT_SLIDES : OWNER_SLIDES}>
      <AuthTitle
        title={
          <>
            Create your <span className="text-brand-700">account</span>
          </>
        }
      >
        {/* Subtitle changes with the role, so the student email tip lives here instead of under the field */}
        {isStudent
          ? 'Use your university email to get a verified badge.'
          : 'List your hostel free and reach verified students.'}
      </AuthTitle>

      <form onSubmit={submit} className="mt-4 space-y-3">
        <RoleToggle value={role} onChange={setRole} />
        <Field label="Full name" error={nameErr ? 'Enter your full name.' : undefined}>
          <Input
            icon="user"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Areesha Khan"
            autoComplete="name"
            invalid={nameErr}
          />
        </Field>
        <Field
          label="Email"
          error={emailErr ? 'Enter a valid email, like you@pu.edu.pk.' : undefined}
        >
          <Input
            icon="mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={isStudent ? 'you@pu.edu.pk' : 'you@example.com'}
            autoComplete="email"
            invalid={emailErr}
          />
        </Field>
        <Field label="Password" error={passErr ? 'Use at least 8 characters.' : undefined}>
          <PasswordField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            invalid={passErr}
            autoComplete="new-password"
          />
        </Field>
        <Field
          label="Confirm password"
          error={
            mismatch ? 'Passwords don’t match.' : confirmErr ? 'Re-enter your password.' : undefined
          }
        >
          <PasswordField
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Re-enter your password"
            invalid={confirmErr}
            autoComplete="new-password"
          />
        </Field>
        <SubmitButton>{isStudent ? 'Create student account' : 'Create owner account'}</SubmitButton>
      </form>

      <p className="mt-3 text-body text-muted text-center">
        Already have an account?{' '}
        <button type="button" onClick={() => navigate('/login')} className={LINK}>
          Log in
        </button>
      </p>
    </AuthLayout>
  )
}
//  Forgot password
export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [tried, setTried] = useState(false)
  const ok = email.includes('@')
  return (
    <AuthLayout slides={LOGIN_SLIDES}>
      {sent ? (
        <>
          <span className="h-12 w-12 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center">
            <Icon name="mail" size={22} />
          </span>
          <div className="mt-5">
            <AuthTitle title="Check your email">
              We sent a link to <span className="font-semibold text-ink">{email}</span>. It expires
              in 30 minutes.
            </AuthTitle>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button size="md" className="min-w-[180px]" onClick={() => navigate('/reset')}>
              Open reset link
            </Button>
            <Button
              size="md"
              variant="secondary"
              className="min-w-[180px]"
              onClick={() => setSent(false)}
            >
              Use a different email
            </Button>
          </div>
        </>
      ) : (
        <>
          <AuthTitle title="Reset your password">
            Enter your email and we’ll send you a reset link.
          </AuthTitle>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (ok) setSent(true)
              else setTried(true)
            }}
            className="mt-5 space-y-4"
          >
            <Field
              label="Email"
              error={tried && !ok ? 'Enter a valid email, like you@pu.edu.pk.' : undefined}
            >
              <Input
                icon="mail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@pu.edu.pk"
                autoComplete="email"
                invalid={tried && !ok}
              />
            </Field>
            <SubmitButton>Send reset link</SubmitButton>
          </form>
        </>
      )}
      <p className="mt-6 text-body text-muted text-center">
        <button
          type="button"
          onClick={() => navigate('/login')}
          className={`inline-flex items-center gap-1.5 ${LINK}`}
        >
          <Icon name="arrowLeft" size={14} />
          Back to log in
        </button>
      </p>
    </AuthLayout>
  )
}
//  Reset password
export function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [done, setDone] = useState(false)
  const [tried, setTried] = useState(false)
  const valid = password.length >= 8 && password === confirm
  const passErr = (!!password && password.length < 8) || (tried && password.length < 8)
  const mismatch = !!confirm && confirm !== password
  const confirmErr = mismatch || (tried && !confirm)
  return (
    <AuthLayout slides={LOGIN_SLIDES}>
      {done ? (
        <>
          <span className="h-12 w-12 rounded-full bg-success-bg text-success flex items-center justify-center">
            <Icon name="check" size={22} />
          </span>
          <div className="mt-5">
            <AuthTitle title="Password updated">
              You can now log in with your new password.
            </AuthTitle>
          </div>
          <div className="mt-6 flex justify-center">
            <Button size="md" className="min-w-[180px]" onClick={() => navigate('/login')}>
              Go to log in
            </Button>
          </div>
        </>
      ) : (
        <>
          <AuthTitle title="Choose a new password">
            Use 8+ characters you don’t use elsewhere.
          </AuthTitle>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (valid) setDone(true)
              else setTried(true)
            }}
            className="mt-5 space-y-3"
          >
            <Field label="New password" error={passErr ? 'Use at least 8 characters.' : undefined}>
              <PasswordField
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                invalid={passErr}
                autoComplete="new-password"
              />
            </Field>
            <Field
              label="Confirm new password"
              error={
                mismatch
                  ? 'Passwords don’t match.'
                  : confirmErr
                    ? 'Re-enter your password.'
                    : undefined
              }
            >
              <PasswordField
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Re-enter your password"
                invalid={confirmErr}
                autoComplete="new-password"
              />
            </Field>
            <SubmitButton>Update password</SubmitButton>
          </form>
        </>
      )}
      <p className="mt-6 text-body text-muted text-center">
        <button
          type="button"
          onClick={() => navigate('/login')}
          className={`inline-flex items-center gap-1.5 ${LINK}`}
        >
          <Icon name="arrowLeft" size={14} />
          Back to log in
        </button>
      </p>
    </AuthLayout>
  )
}
