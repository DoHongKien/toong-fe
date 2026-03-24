import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'

const ServerStatusContext = createContext({ isDown: false, retryNow: () => {} })

// Số lần thất bại liên tiếp trước khi hiển thị trang maintenance
const FAILURE_THRESHOLD = 2
// Interval tự động ping lại khi server down (ms)
const RETRY_INTERVAL_MS = 15_000
// URL dùng để health-check (endpoint nhẹ nhất không cần auth)
const HEALTH_URL = 'http://localhost:8080/api/v1/menus'

export const ServerStatusProvider = ({ children }) => {
  const [isDown, setIsDown] = useState(false)
  const [retrying, setRetrying] = useState(false)
  const failureCount = useRef(0)
  const retryTimer  = useRef(null)

  const markUp = useCallback(() => {
    failureCount.current = 0
    setIsDown(false)
  }, [])

  const markDown = useCallback(() => {
    failureCount.current += 1
    if (failureCount.current >= FAILURE_THRESHOLD) {
      setIsDown(true)
    }
  }, [])

  // Ping thủ công / tự động
  const pingHealth = useCallback(async () => {
    setRetrying(true)
    try {
      const ctrl = new AbortController()
      const tid  = setTimeout(() => ctrl.abort(), 8000)
      const res  = await fetch(HEALTH_URL, { signal: ctrl.signal, cache: 'no-store' })
      clearTimeout(tid)
      if (res.ok || res.status < 500) {
        markUp()
      } else {
        markDown()
      }
    } catch {
      markDown()
    } finally {
      setRetrying(false)
    }
  }, [markUp, markDown])

  // Lắng nghe sự kiện từ axios interceptor
  useEffect(() => {
    const handleDown = () => markDown()
    const handleUp   = () => markUp()
    window.addEventListener('server:down', handleDown)
    window.addEventListener('server:up',   handleUp)
    return () => {
      window.removeEventListener('server:down', handleDown)
      window.removeEventListener('server:up',   handleUp)
    }
  }, [markDown, markUp])

  // Tự động retry định kỳ khi đang down
  useEffect(() => {
    if (isDown) {
      retryTimer.current = setInterval(pingHealth, RETRY_INTERVAL_MS)
    } else {
      clearInterval(retryTimer.current)
    }
    return () => clearInterval(retryTimer.current)
  }, [isDown, pingHealth])

  return (
    <ServerStatusContext.Provider value={{ isDown, retrying, retryNow: pingHealth }}>
      {children}
    </ServerStatusContext.Provider>
  )
}

export const useServerStatus = () => useContext(ServerStatusContext)
