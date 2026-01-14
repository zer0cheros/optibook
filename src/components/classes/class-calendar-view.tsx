'use client'

import { useEffect, useState } from 'react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Calendar, Clock, User as UserIcon, Plus } from 'lucide-react'
import { Badge } from '../ui/badge'
import { CreateBookingModal } from './create-booking-modal'

type User = {
  id: string
  name: string
  email: string
  image: string | null
}

type Booking = {
  id: string
  title: string | null
  description: string | null
  startTime: string
  endTime: string
  user: User
}

type CalendarEvent = {
  id: string
  title: string | null
  description: string | null
  startAt: string
  endAt: string
  allDay: boolean
  location: string | null
}

type CalendarData = {
  id: string
  name: string
  events: CalendarEvent[]
}

export function ClassCalendarView({
  classId,
  currentUserId,
  isStudent,
}: {
  classId: string
  currentUserId: string
  isStudent: boolean
}) {
  const [loading, setLoading] = useState(true)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([])
  const [createBookingModalOpen, setCreateBookingModalOpen] = useState(false)

  useEffect(() => {
    fetchData()
  }, [classId])

  const fetchData = async () => {
    try {
      // Fetch calendar and bookings
      const calRes = await fetch(`/api/classes/${classId}/calendar`)
      const calData = await calRes.json()

      if (calData.calendar) {
        setCalendarEvents(calData.calendar.events || [])
      }
      setBookings(calData.bookings || [])
    } catch (error) {
      console.error('Failed to fetch calendar data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBooking = async (
    title: string,
    description: string,
    startTime: string,
    endTime: string
  ) => {
    try {
      const res = await fetch(`/api/classes/${classId}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, startTime, endTime }),
      })
      if (res.ok) {
        await fetchData()
        setCreateBookingModalOpen(false)
      } else {
        const error = await res.text()
        alert(error || 'Failed to create booking')
      }
    } catch (error) {
      console.error('Failed to create booking:', error)
      alert('Failed to create booking')
    }
  }

  const groupByDate = (items: (Booking | CalendarEvent)[]) => {
    const grouped: Record<string, (Booking | CalendarEvent)[]> = {}
    items.forEach((item) => {
      const date = 'startTime' in item
        ? new Date(item.startTime).toLocaleDateString('sv-SE')
        : new Date(item.startAt).toLocaleDateString('sv-SE')
      if (!grouped[date]) {
        grouped[date] = []
      }
      grouped[date].push(item)
    })
    return grouped
  }

  const isBooking = (item: Booking | CalendarEvent): item is Booking => {
    return 'user' in item
  }

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('sv-SE', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const upcomingItems = [...bookings, ...calendarEvents]
    .filter((item) => {
      const date = 'startTime' in item ? item.startTime : item.startAt
      return new Date(date) >= new Date()
    })
    .sort((a, b) => {
      const aDate = 'startTime' in a ? a.startTime : a.startAt
      const bDate = 'startTime' in b ? b.startTime : b.startAt
      return new Date(aDate).getTime() - new Date(bDate).getTime()
    })

  const grouped = groupByDate(upcomingItems)

  if (loading) {
    return <div>Laddar kalender...</div>
  }

  return (
    <div className="flex flex-col gap-6">
      {isStudent && (
        <div>
          <Button onClick={() => setCreateBookingModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Boka tid med lärare
          </Button>
        </div>
      )}

      {upcomingItems.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <Calendar className="w-16 h-16 text-slate-300" />
            <div>
              <h3 className="text-lg font-semibold text-slate-700">
                Inga kommande händelser
              </h3>
              <p className="text-slate-500 mt-1">
                {isStudent
                  ? 'Boka tid med din lärare för att komma igång'
                  : 'Inga bokningar eller kalenderhändelser än'}
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          {Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {new Date(date).toLocaleDateString('sv-SE', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </h3>
              <div className="flex flex-col gap-3">
                {items.map((item) => {
                  if (isBooking(item)) {
                    const isOwnBooking = item.user.id === currentUserId
                    return (
                      <Card key={item.id} className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-slate-900">
                                {item.title || 'Bokning'}
                              </h4>
                              <Badge variant={isOwnBooking ? 'default' : 'secondary'}>
                                Bokning
                              </Badge>
                            </div>
                            {item.description && (
                              <p className="text-sm text-slate-600 mb-2">
                                {item.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>
                                  {formatTime(item.startTime)} - {formatTime(item.endTime)}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <UserIcon className="w-4 h-4" />
                                <span>{item.user.name}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    )
                  } else {
                    return (
                      <Card key={item.id} className="p-4 bg-blue-50 border-blue-200">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-slate-900">
                                {item.title || 'Kalenderhändelse'}
                              </h4>
                              <Badge variant="outline" className="border-blue-400 text-blue-700">
                                Lärares kalender
                              </Badge>
                            </div>
                            {item.description && (
                              <p className="text-sm text-slate-600 mb-2">
                                {item.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                              {item.allDay ? (
                                <span>Heldag</span>
                              ) : (
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  <span>
                                    {formatTime(item.startAt)} - {formatTime(item.endAt)}
                                  </span>
                                </div>
                              )}
                              {item.location && (
                                <span>📍 {item.location}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    )
                  }
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateBookingModal
        open={createBookingModalOpen}
        onOpenChange={setCreateBookingModalOpen}
        onSubmit={handleCreateBooking}
      />
    </div>
  )
}
