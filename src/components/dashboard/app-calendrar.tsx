"use client"

import * as React from "react"
import { type DateRange } from "react-day-picker"

import { Calendar } from "@/components/ui/calendar"

export function Calendar05() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(Date.now()),
    to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  })

  return (
    <Calendar
      mode="range"
      defaultMonth={dateRange?.from}
      selected={dateRange}
      onSelect={setDateRange}
      numberOfMonths={2}
      className="rounded-lg border shadow-sm"
    />
  )
}
