import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Field, Input, PasswordInput, TextLink } from '@/components/ui'
import { Notice } from '@/components/feedback'
import { useAuth } from '@/hooks/useAuth'
import { useFormFields } from '@/hooks/useFormFields'
import { PATHS } from '@/routes/paths'
import { homePathFor } from '@/routes/roleHome'
import { AuthSubmitButton } from './AuthSubmitButton'
import { DemoAccounts } from './DemoAccounts'

const DEMO_PASSWORD = 'demo-password' // the mock backend doesn't check passwords

export function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { values, bind } = useFormFields({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  /** Log in, then go back to the page they wanted, or to their home page. */
  const logInAs = async (email, password) => {
    setBusy(true)
    setError(null)
    try {
      const user = await login(email, password)
      navigate(location.state?.from ?? homePathFor(user.role), { replace: true })
    } catch (loginError) {
      setError(loginError.message)
      setBusy(false)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!values.email.trim() || !values.password) {
      setError('Enter your email and password to log in.')
      return
    }
    logInAs(values.email, values.password)
  }

  return (
    <>
      {error && (
        <Notice tone="danger" className="mt-4">
          {error}
        </Notice>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
        <Field label="Email">
          <Input
            icon="mail"
            type="email"
            placeholder="you@pu.edu.pk"
            autoComplete="email"
            {...bind('email')}
          />
        </Field>

        <div>
          <Field label="Password">
            <PasswordInput
              placeholder="Enter your password"
              autoComplete="current-password"
              {...bind('password')}
            />
          </Field>
          <div className="mt-1.5 flex justify-end">
            <TextLink to={PATHS.forgotPassword} className="text-small">
              Forgot password?
            </TextLink>
          </div>
        </div>

        <AuthSubmitButton busy={busy} busyLabel="Logging in…">
          Log in
        </AuthSubmitButton>
      </form>

      <DemoAccounts disabled={busy} onPick={(email) => logInAs(email, DEMO_PASSWORD)} />

      <p className="mt-4 text-center text-body text-muted">
        New to CampusNest? <TextLink to={PATHS.signup}>Create an account</TextLink>
      </p>
    </>
  )
}
