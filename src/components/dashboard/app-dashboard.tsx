'use client'
import { Calendar05 } from './app-calendrar'
import { useState } from 'react'
import { Button } from '../ui/button'

export default function DashBoard() {
  const [showCalendar, setShowCalendar] = useState(false)
  return (
    <div>
      <Button onClick={()=> setShowCalendar(!showCalendar)}>Show Calender</Button>
      {showCalendar && < Calendar05 />}
    </div>
  )
}
