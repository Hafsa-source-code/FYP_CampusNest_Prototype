// Form checks for the auth pages. Each returns an error message, or null if fine.
// `submitted` = the user already pressed the button, so show every problem.
// Some problems (password too short, passwords don't match) show while typing.

export const MIN_PASSWORD_LENGTH = 8

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/

export function nameError(name, submitted) {
  return submitted && !name.trim() ? 'Enter your full name.' : null
}

export function emailError(email, submitted) {
  return submitted && !EMAIL_PATTERN.test(email.trim())
    ? 'Enter a valid email, like you@pu.edu.pk.'
    : null
}

export function passwordError(password, submitted) {
  const typedOrSubmitted = password.length > 0 || submitted
  return typedOrSubmitted && password.length < MIN_PASSWORD_LENGTH
    ? `Use at least ${MIN_PASSWORD_LENGTH} characters.`
    : null
}

export function confirmPasswordError(password, confirm, submitted) {
  if (confirm && confirm !== password) return 'Passwords don’t match.'
  if (submitted && !confirm) return 'Re-enter your password.'
  return null
}

/** True when none of the given checks found a problem. */
export function allValid(...errors) {
  return errors.every((error) => error === null)
}
