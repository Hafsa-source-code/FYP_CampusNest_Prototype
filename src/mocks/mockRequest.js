// Pretends to be a server call: waits a moment, then returns the result
// (or throws the error). Lets pages show loading states before the real
// backend exists. Each feature's api file uses this until its real
// endpoint is ready.

const FAKE_DELAY_MS = 400

export function mockRequest(work) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(work())
      } catch (error) {
        reject(error)
      }
    }, FAKE_DELAY_MS)
  })
}
