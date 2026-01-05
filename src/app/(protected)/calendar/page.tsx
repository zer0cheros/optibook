import Calendar from "@/components/calendar/app-calendar"
import { Suspense } from "react"
export default function page() {
  return (
    <Suspense fallback={<div>Loading calendar...</div>}>
        <Calendar/>
    </Suspense>
  )
}
