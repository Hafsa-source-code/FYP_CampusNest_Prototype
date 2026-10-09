import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Field, Input, PasswordInput, TextLink } from '@/components/ui'
import { Notice } from '@/components/feedback'
import { useAuth } from '@/hooks/useAuth'
import { useFormFields } from '@/hooks/useFormFields'
import { PATHS } from '@/routes/paths'
import { ROLES } from '@/utils/constants'
import {
  allValid,
  confirmPasswordError,
  emailError,
  nameError,
  passwordError,
} from '../utils/authValidation'
import { AuthSubmitButton } from './AuthSubmitButton'
import { RoleToggle } from './RoleToggle'

// Where each role goes right after creating an account
const FIRST_PAGE_FOR_ROLE = {
  [ROLES.STUDENT]: PATHS.student.search,
  [ROLES.OWNER]: PATHS.owner.newHostel,
}

/** Sign-up form. The page owns `role` because the photos beside the form change with it. */
export function SignupForm({ role, onRoleChange }) {
  const { register } = useAuth()
  const navigate = useNavigate()
  const { values, bind } = useFormFields({ name: '', email: '', password: '', confirm: '' })
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState(null)
  const [busy, setBusy] = useState(false)

  const isStudent = role === ROLES.STUDENT
  const errors = {
    name: nameError(values.name, submitted),
    email: emailError(values.email, submitted),
    password: passwordError(values.password, submitted),
    confirm: confirmPasswordError(values.password, values.confirm, submitted),
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitted(true)

    // Check again as "submitted" so empty fields count as errors too
    const formIsValid = allValid(
      nameError(values.name, true),
      emailError(values.email, true),
      passwordError(values.password, true),
      confirmPasswordError(values.password, values.confirm, true),
    )
    if (!formIsValid) return

    setBusy(true)
    setServerError(null)
    try {
      await register({ name: values.name, email: values.email, password: values.password, role })
      navigate(FIRST_PAGE_FOR_ROLE[role], { replace: true })
    } catch (registerError) {
      setServerError(registerError.message)
      setBusy(false)
    }
  }

  return (
    <>
      {serverError && (
        <Notice tone="danger" className="mt-4">
          {serverError}
        </Notice>
      )}

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <RoleToggle value={role} onChange={onRoleChange} />

        <Field label="Full name" error={errors.name}>
          <Input
            icon="user"
            placeholder="Areesha Khan"
            autoComplete="name"
            invalid={!!errors.name}
            {...bind('name')}
          />
        </Field>

        <Field label="Email" error={errors.email}>
          <Input
            icon="mail"
            type="email"
            placeholder={isStudent ? 'you@pu.edu.pk' : 'you@example.com'}
            autoComplete="email"
            invalid={!!errors.email}
            {...bind('email')}
          />
        </Field>

        <Field label="Password" error={errors.password}>
          <PasswordInput
            placeholder="At least 8 characters"
            autoComplete="new-password"
            invalid={!!errors.password}
            {...bind('password')}
          />
        </Field>

        <Field label="Confirm password" error={errors.confirm}>
          <PasswordInput
            placeholder="Re-enter your password"
            autoComplete="new-password"
            invalid={!!errors.confirm}
            {...bind('confirm')}
          />
        </Field>

        <AuthSubmitButton busy={busy} busyLabel="Creating account…">
          {isStudent ? 'Create student account' : 'Create owner account'}
        </AuthSubmitButton>
      </form>

      <p className="mt-3 text-center text-body text-muted">
        Already have an account? <TextLink to={PATHS.login}>Log in</TextLink>
      </p>
    </>
  )
}
