import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Field, Input } from '@/components/ui'
import { useFormFields } from '@/hooks/useFormFields'
import { PATHS } from '@/routes/paths'
import { requestPasswordReset } from '../api/authApi'
import { emailError } from '../utils/authValidation'
import { AuthResult } from './AuthResult'
import { AuthSubmitButton } from './AuthSubmitButton'
import { AuthTitle } from './AuthTitle'

/** Step 1 of password reset: ask for the email, then show "check your email". */
export function ForgotPasswordForm() {
  const navigate = useNavigate()
  const { values, bind } = useFormFields({ email: '' })
  const [submitted, setSubmitted] = useState(false)
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)

  const error = emailError(values.email, submitted)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitted(true)
    if (emailError(values.email, true)) return

    setBusy(true)
    await requestPasswordReset(values.email)
    setBusy(false)
    setSent(true)
  }

  if (sent) {
    return (
      <AuthResult
        icon="mail"
        title="Check your email"
        actions={
          <>
            {/* PROTOTYPE ONLY: stands in for clicking the link in the email */}
            <Button className="min-w-[180px]" onClick={() => navigate(PATHS.resetPassword)}>
              Open reset link
            </Button>
            <Button variant="secondary" className="min-w-[180px]" onClick={() => setSent(false)}>
              Use a different email
            </Button>
          </>
        }
      >
        We sent a link to <span className="font-semibold text-ink">{values.email}</span>. It expires
        in 30 minutes.
      </AuthResult>
    )
  }

  return (
    <>
      <AuthTitle title="Reset your password">
        Enter your email and we’ll send you a reset link.
      </AuthTitle>
      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <Field label="Email" error={error}>
          <Input
            icon="mail"
            type="email"
            placeholder="you@pu.edu.pk"
            autoComplete="email"
            invalid={!!error}
            {...bind('email')}
          />
        </Field>
        <AuthSubmitButton busy={busy} busyLabel="Sending…">
          Send reset link
        </AuthSubmitButton>
      </form>
    </>
  )
}
