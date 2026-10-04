import { afterAll, afterEach, beforeAll, vi } from 'vitest'
import { server } from './msw'

beforeAll(() => {
  server.listen({ onUnhandledFrame: 'error' })
})

afterEach(() => {
  server.resetHandlers()
  vi.restoreAllMocks()
  vi.useRealTimers()
  localStorage.clear()
})

afterAll(() => {
  server.close()
})