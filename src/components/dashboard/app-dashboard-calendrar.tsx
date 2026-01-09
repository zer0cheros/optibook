"use client"
import * as React from "react"
import { formatDateRange } from "little-date"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { GetApi } from "@/lib/http-api"
import { useEffect, useState } from "react"
import { CalendarEvent } from "../../../generated/prisma/client"
import type { Calendar as C, User } from "../../../generated/prisma/client"
import EventCreateModal from "./event/app-event-create-modal"


interface c2 extends C {
  events: CalendarEvent[];
}

type CalendarEventProps = {
  calender: c2;
}

const TZ = "Europe/Helsinki";

function dayKey(d: Date) {
  // en-CA => YYYY-MM-DD
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

function isSameDayHelsinki(a: Date, b: Date) {
  return dayKey(a) === dayKey(b);
}

export function Calendar31({user}:{user:User}) {

  const [date, setDate] = useState(new Date());
  const [calendarEvents, setCalendarData] = useState<CalendarEvent[]>([]);
  useEffect(() => {
    async function fetchCalendar() {
      try { 
        const data = await GetApi<CalendarEventProps>("/calendar");
        setCalendarData(data.calender.events || []);
      } catch (error) {
        console.error("Failed to fetch calendar data:", error);
      }
    }
    fetchCalendar();
  }, []);
const selected = dayKey(date);

const matches = calendarEvents.filter(
  (e) => dayKey(new Date(e.startAt as any)) === selected
);

const handleEvent = () => {
  const title = prompt("Event title");
}
  return (
    <Card className="w-fit py-4 text-center">
      <h2 className="text-xl font-bold">{user.name} Kalender</h2>
      <CardContent className="px-4 flex justify-center">
        
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          showWeekNumber={true}
          weekStartsOn={1}
          className="bg-transparent p-0 w-full min-w-md"
          required
        />
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-3 border-t px-4">
        <div className="flex w-full items-center justify-between px-1">
          <div className="text-sm font-medium">
            {date?.toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
          <EventCreateModal user={user}>
            <Button size="icon" variant="outline">
              < PlusIcon />
            </Button>
            </EventCreateModal>
          
        </div>
        <div className="flex w-full flex-col gap-2">
  {calendarEvents
    .filter((event) => isSameDayHelsinki(new Date(event.startAt), date))
    .map((event) => (
      <div
        key={event.id ?? event.title}
        className="bg-muted after:bg-primary/70 relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full"
      >
        <div className="font-medium">{event.title}</div>
        <div className="text-muted-foreground text-xs">
          {new Date(event.startAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    ))}
</div>
      </CardFooter>
    </Card>
  )
}
