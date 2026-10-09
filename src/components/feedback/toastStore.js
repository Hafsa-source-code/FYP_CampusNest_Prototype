// A tiny message board: toast() posts a message, the <Toaster /> listens and shows it.
// This lets ANY file show a toast without passing functions around.

const listeners = new Set()

/** Show a short confirmation message at the bottom of the screen. */
export function toast(message) {
  listeners.forEach((listener) => listener(message))
}

/** Used only by <Toaster />. Returns a function that stops listening. */
export function subscribeToToasts(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
