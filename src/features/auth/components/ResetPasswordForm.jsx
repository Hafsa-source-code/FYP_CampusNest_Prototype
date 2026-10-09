import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Field, PasswordInput } from '@/components/ui'
import { useFormFields } from '@/hooks/useFormFields'
import { PATHS } from '@/routes/paths'
import { resetPassword } from '../api/authApi'
import { allValid, confirmPasswordError, passwordError } from '../utils/authValidation'
import { AuthResult } from './AuthResult'
import { AuthSubmitButton } from './AuthSubmitButton'
import { AuthTitle } from './AuthTitle'

/** Step 2 of password reset (opened from the email link): choose a new password. */
export function ResetPasswordForm() {
  const navigate = useNavigate()
  const { values, bind } = useFormFields({ password: '', confirm: '' })
  const [submitted, setSubmitted] = useState(false)
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)

  const errors = {
    password: passwordError(values.password, submitted),
    confirm: confirmPasswordError(values.password, values.confirm, submitted),
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitted(true)
    const formIsValid = allValid(
      passwordError(values.password, true),
      confirmPasswordError(values.password, values.confirm, true),
    )
    if (!formIsValid) return

    setBusy(true)
    await resetPassword(null, values.password) // the real token will come from the email link
    setBusy(false)
    setDone(true)
  }

  if (done) {
    return (
      <AuthResult
        icon="check"
        tone="success"
        title="Password updated"
        actions={
          <Button className="min-w-[180px]" onClick={() => navigate(PATHS.login)}>
            Go to log in
          </Button>
        }
      >
        You can now log in with your new password.
      </AuthResult>
    )
  }

  return (
    <>
      <AuthTitle title="Choose a new password">
        Use 8+ characters you don’t use elsewhere.
      </AuthTitle>
      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
        <Field label="New password" error={errors.password}>
          <PasswordInput
            placeholder="At least 8 characters"
            autoComplete="new-password"
            invalid={!!errors.password}
            {...bind('password')}
          />
        </Field>
        <Field label="Confirm new password" error={errors.confirm}>
          <PasswordInput
            placeholder="Re-enter your password"
            autoComplete="new-password"
            invalid={!!errors.confirm}
            {...bind('confirm')}
          />
        </Field>
        <AuthSubmitButton busy={busy} busyLabel="Saving…">
          Update password
        </AuthSubmitButton>
      </form>
    </>
  )
}
