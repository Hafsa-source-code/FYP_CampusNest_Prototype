// Saves who is logged in, so a page refresh doesn't log you out.
// Stored in the browser's localStorage under one key.
// Note: anything in localStorage can be read by scripts on the page, which is
// why the backend must keep tokens short-lived (our JWT expires in 2–4 hours).

const SESSION_KEY = 'campusnest.session'

export function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

/** Returns { token, user } or null if nobody is logged in. */
export function loadSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY))
  } catch {
    return null // damaged data: treat as logged out
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}
