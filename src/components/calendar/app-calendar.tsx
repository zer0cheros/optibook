'use client'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import { useEffect, useState } from 'react';
import { GetApi } from '@/lib/http-api';
import { CalendarEvent } from '@prisma/client';
import type { Calendar as C } from "@prisma/client"


interface c2 extends C {
  events: CalendarEvent[];
}

type CalendarEventProps = {
  calender: c2;
}

export default function Calendar() {
    const [calendarEvents, setCalendarData] = useState<CalendarEvent[]>([]);
      useEffect(() => {
        async function fetchCalendar() {
          try { 
            const data = await GetApi<CalendarEventProps>("/calendar");
            setCalendarData(data.calender.events);
          } catch (error) {
            console.error("Failed to fetch calendar data:", error);
          }
        }
        fetchCalendar();
      }, []);
      const handleClick = (info: any) => {
        
        alert('Event: ' + info.event.title);
      };
  return (
    <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        firstDay={1}
        locale="sv"
        height="auto"
        fixedWeekCount={false}
        dayMaxEvents={3}
        eventDisplay="block"
        eventTimeFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
        eventClick={handleClick}
        events={calendarEvents.map(event => ({
            title: event.title ?? "",
            start: event.startAt,
            end: event.endAt,
            allDay: event.allDay,
            backgroundColor: "#333",
            borderColor: "transparent",
            textColor: "#fff",
        }))}
    />
  )
}
