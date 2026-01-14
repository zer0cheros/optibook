'use client'

import { useEffect, useState } from 'react'
import { Card } from '../ui/card'
import { Calendar, Clock, User as UserIcon, BookOpen } from 'lucide-react'
import { Badge } from '../ui/badge'
import Link from 'next/link'

type Booking = {
  id: string
  title: string | null
  description: string | null
  startTime: string
  endTime: string
  classId: string | null
  className?: string
  teacherName?: string
  user?: {
    id: string
    name: string
  }
}

type CalendarEvent = {
  id: string
  title: string | null
  startAt: string
  endAt: string
  allDay: boolean
  teacherName?: string
  className?: string
  classId?: string
}

export function UpcomingBookings({ userId }: { userId: string }) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [teacherEvents, setTeacherEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch('/api/calendar/all')
      const data = await response.json()

      // Get user's bookings
      const userBookings = (data.userBookings || []).filter((booking: Booking) => {
        return new Date(booking.startTime) >= new Date()
      })

      // Get upcoming teacher events
      const upcomingTeacherEvents = (data.teacherCalendarEvents || []).filter(
        (event: CalendarEvent) => {
          return new Date(event.startAt) >= new Date()
        }
      )

      setBookings(userBookings.slice(0, 5))
      setTeacherEvents(upcomingTeacherEvents.slice(0, 3))
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return {
      date: date.toLocaleDateString('sv-SE', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      }),
      time: date.toLocaleTimeString('sv-SE', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }
  }

  if (loading) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Kommande bokningar</h3>
        <div>Laddar...</div>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* User's Bookings */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Mina kommande bokningar
          </h3>
          <Link
            href="/calendar"
            className="text-sm text-blue-600 hover:underline"
          >
            Visa alla
          </Link>
        </div>

        {bookings.length === 0 ? (
          <p className="text-slate-500 text-sm">Inga kommande bokningar</p>
        ) : (
          <div className="flex flex-col gap-3">
            {bookings.map((booking) => {
              const start = formatDateTime(booking.startTime)
              const end = formatDateTime(booking.endTime)
              return (
                <Link
                  key={booking.id}
                  href={booking.classId ? `/classes/${booking.classId}` : '#'}
                  className="block"
                >
                  <Card className="p-4 hover:shadow-md transition-shadow border-l-4 border-l-green-500">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-slate-900">
                            {booking.title || 'Bokning'}
                          </h4>
                          <Badge variant="default">Min bokning</Badge>
                        </div>
                        {booking.description && (
                          <p className="text-sm text-slate-600 mb-2">
                            {booking.description}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{start.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              {start.time} - {end.time}
                            </span>
                          </div>
                          {booking.className && (
                            <div className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              <span>{booking.className}</span>
                            </div>
                          )}
                          {booking.teacherName && (
                            <div className="flex items-center gap-1">
                              <UserIcon className="w-4 h-4" />
                              <span>{booking.teacherName}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </Card>

      {/* Teacher Calendar Events */}
      {teacherEvents.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Lärarens kommande händelser
            </h3>
            <Link
              href="/calendar"
              className="text-sm text-blue-600 hover:underline"
            >
              Visa alla
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {teacherEvents.map((event) => {
              const start = formatDateTime(event.startAt)
              const end = formatDateTime(event.endAt)
              return (
                <Link
                  key={event.id}
                  href={event.classId ? `/classes/${event.classId}` : '#'}
                  className="block"
                >
                  <Card className="p-4 hover:shadow-md transition-shadow border-l-4 border-l-blue-500 bg-blue-50">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-slate-900">
                            {event.title || 'Händelse'}
                          </h4>
                          <Badge variant="outline" className="border-blue-400 text-blue-700">
                            Lärarens kalender
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{start.date}</span>
                          </div>
                          {!event.allDay && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>
                                {start.time} - {end.time}
                              </span>
                            </div>
                          )}
                          {event.allDay && <span>Heldag</span>}
                          {event.className && (
                            <div className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              <span>{event.className}</span>
                            </div>
                          )}
                          {event.teacherName && (
                            <div className="flex items-center gap-1">
                              <UserIcon className="w-4 h-4" />
                              <span>{event.teacherName}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        </Card>
      )}
    </div>
  )
}
