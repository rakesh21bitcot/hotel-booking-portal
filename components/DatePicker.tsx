"use client"

import { useState } from "react"

interface DatePickerProps {
  onDateSelect?: (date: string) => void
  onRangeSelect?: (startDate: string, endDate: string) => void
  mode?: "single" | "range"
}

export default function DatePicker({ onDateSelect, onRangeSelect, mode = "single" }: DatePickerProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [startDate, setStartDate] = useState<string | null>(null)
  const [endDate, setEndDate] = useState<string | null>(null)

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const days = Array.from({ length: getDaysInMonth(currentDate) }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: getFirstDayOfMonth(currentDate) }, () => null)
  const allDays = [...emptyDays, ...days]

  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })

  const handleDateClick = (day: number | null) => {
    if (!day) return
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`

    if (mode === "single") {
      setSelectedDate(dateStr)
      onDateSelect?.(dateStr)
    } else {
      if (!startDate || (startDate && endDate)) {
        setStartDate(dateStr)
        setEndDate(null)
      } else {
        setEndDate(dateStr)
        onRangeSelect?.(startDate, dateStr)
      }
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 w-full max-w-sm">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
          className="p-2 hover:bg-secondary rounded transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="font-semibold text-foreground">{monthName}</h3>
        <button
          onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
          className="p-2 hover:bg-secondary rounded transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day Labels */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-xs text-muted-foreground font-semibold text-center">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {allDays.map((day, i) => (
          <button
            key={i}
            onClick={() => handleDateClick(day)}
            disabled={!day}
            className={`h-10 rounded text-sm font-medium transition ${
              !day
                ? "invisible"
                : selectedDate ===
                    `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary"
            }`}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  )
}
