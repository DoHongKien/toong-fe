import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const MONTH_NAMES = [
  'Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6',
  'Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12',
]
const DAY_NAMES = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

/**
 * DatePickerCalendar
 * value: DD/MM/YYYY | ''
 * onChange: (DD/MM/YYYY) => void
 * allowedDates: string[] — DD/MM/YYYY dates that can be selected
 * hasError: boolean
 */
const DatePickerCalendar = ({ value, onChange, allowedDates = [], hasError }) => {
  const [open, setOpen] = useState(false)
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0 })
  const triggerRef = useRef(null)
  const popupRef = useRef(null)

  // Initial view month: first allowed date or today
  const getInitialView = () => {
    if (allowedDates.length > 0) {
      const [, m, y] = allowedDates[0].split('/').map(Number)
      return { month: m - 1, year: y }
    }
    const n = new Date()
    return { month: n.getMonth(), year: n.getFullYear() }
  }

  const [view, setView] = useState(getInitialView)

  const allowedSet = new Set(allowedDates)

  // Calculate popup position from trigger rect
  const openPopup = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPopupPos({
        top: rect.bottom + window.scrollY + 6,
        left: rect.left + window.scrollX,
      })
    }
    setOpen(true)
  }

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target) &&
        popupRef.current  && !popupRef.current.contains(e.target)
      ) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Build calendar grid
  const buildGrid = () => {
    const { month, year } = view
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const cells = []
    for (let i = 0; i < firstDay; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) {
      const dd = String(d).padStart(2, '0')
      const mm = String(month + 1).padStart(2, '0')
      const dateStr = `${dd}/${mm}/${year}`
      cells.push({ day: d, dateStr, allowed: allowedSet.has(dateStr) })
    }
    return cells
  }

  const prevMonth = () => setView(v => {
    const m = v.month === 0 ? 11 : v.month - 1
    const y = v.month === 0 ? v.year - 1 : v.year
    return { month: m, year: y }
  })

  const nextMonth = () => setView(v => {
    const m = v.month === 11 ? 0 : v.month + 1
    const y = v.month === 11 ? v.year + 1 : v.year
    return { month: m, year: y }
  })

  const selectDate = (dateStr) => {
    onChange(dateStr)
    setOpen(false)
  }

  const grid = buildGrid()

  const popup = open && createPortal(
    <div
      ref={popupRef}
      className="dpc-popup"
      style={{ position: 'absolute', top: popupPos.top, left: popupPos.left }}
    >
      <div className="dpc-header">
        <button type="button" className="dpc-nav" onClick={prevMonth} aria-label="Tháng trước">
          <ChevronLeft size={16} />
        </button>
        <span className="dpc-month-label">{MONTH_NAMES[view.month]} {view.year}</span>
        <button type="button" className="dpc-nav" onClick={nextMonth} aria-label="Tháng sau">
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="dpc-day-names">
        {DAY_NAMES.map(d => <span key={d}>{d}</span>)}
      </div>

      <div className="dpc-grid">
        {grid.map((cell, i) => {
          if (!cell) return <span key={`e${i}`} className="dpc-cell dpc-cell--empty" />
          const isSelected = cell.dateStr === value
          return (
            <button
              key={cell.dateStr}
              type="button"
              disabled={!cell.allowed}
              className={[
                'dpc-cell',
                cell.allowed ? 'dpc-cell--allowed' : 'dpc-cell--disabled',
                isSelected ? 'dpc-cell--selected' : '',
              ].join(' ')}
              onClick={() => cell.allowed && selectDate(cell.dateStr)}
              title={cell.allowed ? cell.dateStr : 'Không có lịch khởi hành'}
            >
              {cell.day}
            </button>
          )
        })}
      </div>
    </div>,
    document.body
  )

  return (
    <div className="dpc-wrap">
      <button
        ref={triggerRef}
        type="button"
        className={`dpc-trigger ${hasError ? 'bm-input-error' : ''}`}
        onClick={openPopup}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span className={value ? 'dpc-value' : 'dpc-placeholder'}>
          {value || 'dd/MM/yyyy'}
        </span>
        <svg className="dpc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      </button>

      {popup}
    </div>
  )
}

export default DatePickerCalendar
