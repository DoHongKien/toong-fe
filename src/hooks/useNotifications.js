import { useState, useEffect, useCallback, useRef } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { adminApi } from '../api/api'

const USE_WEBSOCKET = import.meta.env.VITE_USE_WEBSOCKET === 'true'
const WS_BASE_URL   = import.meta.env.VITE_WS_URL || 'http://localhost:8080'

// ─── helpers ────────────────────────────────────────────────────────────────

/** Merge incoming list into existing, dedup by id */
const mergeNotifications = (existing, incoming) => {
  const map = new Map(existing.map(n => [n.id, n]))
  incoming.forEach(n => { if (!map.has(n.id)) map.set(n.id, n) })
  return Array.from(map.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

// ─── hook ────────────────────────────────────────────────────────────────────

/**
 * useNotifications
 *
 * Hai chế độ được kiểm soát bởi biến env VITE_USE_WEBSOCKET:
 *   false (default) → polling REST mỗi 60s (logic cũ)
 *   true            → WebSocket STOMP realtime, fallback fetch missed notifs khi reconnect
 *
 * Trả về: { notifications, unreadCount, notifLoading, fetchNotifications, markAsRead, markAllRead }
 */
const useNotifications = () => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount]     = useState(0)
  const [notifLoading, setNotifLoading]   = useState(false)

  const pollRef   = useRef(null)
  const clientRef = useRef(null)

  // ── shared: fetch from REST (used by both modes) ─────────────────────────
  const fetchNotifications = useCallback(async () => {
    try {
      const res   = await adminApi.getNotifications({ limit: 20 })
      const inner = res.data?.data ?? {}
      const data  = Array.isArray(inner.data) ? inner.data : Array.isArray(inner) ? inner : []
      const count = inner.unreadCount ?? data.filter(n => !n.isRead).length
      setNotifications(data)
      setUnreadCount(count)
    } catch {
      // silent fail — avoid crashing UI
    }
  }, [])

  // ── shared: merge new push into state ────────────────────────────────────
  const handleIncomingPush = useCallback((notification) => {
    setNotifications(prev => {
      // Avoid duplicate if already exists
      if (prev.some(n => n.id === notification.id)) return prev
      return [notification, ...prev]
    })
    if (!notification.isRead) {
      setUnreadCount(prev => prev + 1)
    }
  }, [])

  // ── shared: fetch missed then merge (used on WS onConnect) ───────────────
  const fetchAndMerge = useCallback(async () => {
    try {
      const res   = await adminApi.getNotifications({ limit: 20 })
      const inner = res.data?.data ?? {}
      const data  = Array.isArray(inner.data) ? inner.data : Array.isArray(inner) ? inner : []
      const count = inner.unreadCount ?? data.filter(n => !n.isRead).length
      setNotifications(prev => mergeNotifications(prev, data))
      setUnreadCount(count)
    } catch {
      // silent
    }
  }, [])

  // ── mark single read ──────────────────────────────────────────────────────
  const markAsRead = useCallback(async (id) => {
    setNotifications(prev => {
      const notif = prev.find(n => n.id === id)
      if (!notif || notif.isRead) return prev
      return prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    })
    setUnreadCount(prev => Math.max(0, prev - 1))
    try {
      await adminApi.markNotificationRead(id)
    } catch { /* silent */ }
  }, [])

  // ── mark all read ─────────────────────────────────────────────────────────
  const markAllRead = useCallback(async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    setUnreadCount(0)
    try {
      await adminApi.markAllNotificationsRead()
    } catch { /* silent */ }
  }, [])

  // ─────────────────────────────────────────────────────────────────────────
  // MODE A: Polling (VITE_USE_WEBSOCKET=false)
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (USE_WEBSOCKET) return

    setNotifLoading(true)
    fetchNotifications().finally(() => setNotifLoading(false))
    pollRef.current = setInterval(fetchNotifications, 60_000)

    return () => clearInterval(pollRef.current)
  }, [fetchNotifications])

  // ─────────────────────────────────────────────────────────────────────────
  // MODE B: WebSocket (VITE_USE_WEBSOCKET=true)
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!USE_WEBSOCKET) return

    // Initial load from REST (missed notifications)
    setNotifLoading(true)
    fetchNotifications().finally(() => setNotifLoading(false))

    const token = localStorage.getItem('toong_cms_token')

    const client = new Client({
      webSocketFactory: () => new SockJS(`${WS_BASE_URL}/ws`),

      // Gửi JWT trong STOMP CONNECT header
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },

      // Tự động reconnect sau 5 giây
      reconnectDelay: 5000,

      onConnect: () => {
        console.log('[WS-Notif] Connected')

        // Fetch missed notifications mỗi lần (re)connect
        fetchAndMerge()

        // Subscribe real-time push
        client.subscribe('/user/queue/notifications', (message) => {
          try {
            const notification = JSON.parse(message.body)
            handleIncomingPush(notification)
          } catch (err) {
            console.error('[WS-Notif] Parse error', err)
          }
        })
      },

      onDisconnect: () => {
        console.log('[WS-Notif] Disconnected')
      },

      onStompError: (frame) => {
        console.error('[WS-Notif] STOMP error', frame)
      },
    })

    client.activate()
    clientRef.current = client

    return () => {
      client.deactivate()
      clientRef.current = null
    }
  }, [fetchNotifications, fetchAndMerge, handleIncomingPush])

  return {
    notifications,
    unreadCount,
    notifLoading,
    fetchNotifications,
    markAsRead,
    markAllRead,
  }
}

export default useNotifications
