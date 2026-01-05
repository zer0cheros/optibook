"use client"

import * as React from "react"
import { type DateRange } from "react-day-picker"

import { Calendar } from "@/components/ui/calendar"
import { Button } from "../ui/button"

export function Calendar05() {
  const [showCalender, setShowCalender] = React.useState(false)
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(Date.now()),
    to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  })
  const handleC = async ()=>{
    setShowCalender(!showCalender)
  }
  return (
    <>
    <Button onClick={handleC}>Show</Button>
   {showCalender &&  <Calendar
      mode="range"
      defaultMonth={dateRange?.from}
      selected={dateRange}
      onSelect={setDateRange}
      numberOfMonths={2}
      className="rounded-lg border shadow-sm"
    />
   }
   </>
  )
}
