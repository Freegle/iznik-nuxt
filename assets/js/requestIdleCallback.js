const requestIdleCallback =
  typeof window !== 'undefined' && window.requestIdleCallback
    ? window.requestIdleCallback
    : cb => {
        const start = Date.now()
        return setTimeout(() => {
          const data = {
            didTimeout: false,
            timeRemaining() {
              return Math.max(0, 50 - (Date.now() - start))
            }
          }
          cb(data)
        }, 1)
      }

export default requestIdleCallback
