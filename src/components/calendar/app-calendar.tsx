'use client'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import { useEffect, useState } from 'react';

type CalendarEvent = {
  id: string
  title: string | null
  startAt: string
  endAt: string
  allDay: boolean
  teacherName?: string
  className?: string
}

type Booking = {
  id: string
  title: string | null
  startTime: string
  endTime: string
  user: {
    name: string
  }
  className?: string
  teacherName?: string
}

export default function Calendar() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      async function fetchCalendar() {
        try {
          const response = await fetch("/api/calendar/all");
          const data = await response.json();

          const allEvents: any[] = [];

          // Add user's own calendar events
          if (data.userCalendar?.events) {
            allEvents.push(...data.userCalendar.events.map((event: CalendarEvent) => ({
              title: event.title || "Min händelse",
              start: event.startAt,
              end: event.endAt,
              allDay: event.allDay,
              backgroundColor: "#1e293b",
              borderColor: "transparent",
              textColor: "#fff",
              extendedProps: {
                type: 'own'
              }
            })));
          }

          // Add user's bookings
          if (data.userBookings) {
            allEvents.push(...data.userBookings.map((booking: Booking) => ({
              title: `📅 ${booking.title || 'Min bokning'}${booking.className ? ` (${booking.className})` : ''}`,
              start: booking.startTime,
              end: booking.endTime,
              backgroundColor: "#10b981",
              borderColor: "transparent",
              textColor: "#fff",
              extendedProps: {
                type: 'myBooking',
                className: booking.className,
                teacherName: booking.teacherName
              }
            })));
          }

          // Add teacher calendar events (for students)
          if (data.teacherCalendarEvents) {
            allEvents.push(...data.teacherCalendarEvents.map((event: CalendarEvent) => ({
              title: `👨‍🏫 ${event.title || 'Lärares händelse'}`,
              start: event.startAt,
              end: event.endAt,
              allDay: event.allDay,
              backgroundColor: "#3b82f6",
              borderColor: "transparent",
              textColor: "#fff",
              extendedProps: {
                type: 'teacher',
                teacherName: event.teacherName,
                className: event.className
              }
            })));
          }

          // Add class bookings
          if (data.classBookings) {
            allEvents.push(...data.classBookings.map((booking: Booking) => ({
              title: `🔖 ${booking.user.name}: ${booking.title || 'Bokning'}`,
              start: booking.startTime,
              end: booking.endTime,
              backgroundColor: "#8b5cf6",
              borderColor: "transparent",
              textColor: "#fff",
              extendedProps: {
                type: 'classBooking',
                studentName: booking.user.name,
                className: booking.className,
                teacherName: booking.teacherName
              }
            })));
          }

          setEvents(allEvents);
        } catch (error) {
          console.error("Failed to fetch calendar data:", error);
        } finally {
          setLoading(false);
        }
      }
      fetchCalendar();
    }, []);

    const handleClick = (info: any) => {
      const props = info.event.extendedProps;
      let message = `📅 ${info.event.title}\n\n`;
      message += `⏰ ${info.event.start.toLocaleString('sv-SE')}\n`;
      if (info.event.end) {
        message += `   till ${info.event.end.toLocaleString('sv-SE')}\n`;
      }

      if (props.className) {
        message += `\n📚 Klass: ${props.className}`;
      }
      if (props.teacherName) {
        message += `\n👨‍🏫 Lärare: ${props.teacherName}`;
      }
      if (props.studentName) {
        message += `\n👤 Elev: ${props.studentName}`;
      }

      alert(message);
    };

    if (loading) {
      return <div>Laddar kalender...</div>;
    }

    return (
      <div>
        <div className="mb-4 p-4 bg-slate-50 rounded-lg">
          <h3 className="font-semibold mb-2">Färgkod:</h3>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-slate-800 rounded"></div>
              <span>Mina händelser</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Mina bokningar</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>Lärarens kalender</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 rounded"></div>
              <span>Klassbokningar</span>
            </div>
          </div>
        </div>

        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          firstDay={1}
          locale="sv"
          height="auto"
          fixedWeekCount={false}
          dayMaxEvents={3}
          eventDisplay="block"
          eventTimeFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
          eventClick={handleClick}
          events={events}
        />
      </div>
    )
}
