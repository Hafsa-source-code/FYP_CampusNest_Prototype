import { mockRequest } from '@/mocks/mockRequest'
import { DEMO_USERS } from '@/mocks/users'
import { USER_STATUS } from '@/utils/constants'

// ─────────────────────────────────────────────────────────────────
// MOCK VERSION. Every function here will become a real call to the
// ASP.NET backend (POST /api/auth/login, etc.). Pages never change:
// only the inside of these functions does.
//
// Passwords are NOT checked here on purpose: checking passwords is
// the backend's job and must never happen in the browser.
// ─────────────────────────────────────────────────────────────────

const users = [...DEMO_USERS] // new sign-ups are added here (lost on refresh)

const findByEmail = (email) =>
  users.find((user) => user.email.toLowerCase() === email.trim().toLowerCase())

/** What the backend sends back after login/sign-up: a token + the user's details. */
function sessionFor(user) {
  const { id, name, email, role } = user
  return { token: `mock-token-${id}`, user: { id, name, email, role } }
}

/** POST /api/auth/login → { token, user } */
export function login(email /*, password: checked by the backend */) {
  return mockRequest(() => {
    const user = findByEmail(email)
    if (!user) {
      throw new Error(
        'We couldn’t find an account with that email. Check the spelling or create an account.',
      )
    }
    if (user.status === USER_STATUS.BANNED) {
      throw new Error(
        `This account is suspended. ${user.banReason} Contact support@campusnest.pk if you think this is a mistake.`,
      )
    }
    return sessionFor(user)
  })
}

/** POST /api/auth/register → { token, user } */
export function register({ name, email, role }) {
  return mockRequest(() => {
    if (findByEmail(email))
      throw new Error('An account with this email already exists. Try logging in.')

    const user = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
      role,
      status: USER_STATUS.ACTIVE,
    }
    users.push(user)
    return sessionFor(user)
  })
}

/** POST /api/auth/forgot-password → sends an email with a reset link */
export function requestPasswordReset(/* email */) {
  return mockRequest(() => null)
}

/** POST /api/auth/reset-password → saves the new password */
export function resetPassword(/* token, newPassword */) {
  return mockRequest(() => null)
}
