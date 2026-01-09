'use client'

import { Card } from '../../ui/card'
import { Button } from '../../ui/button'
import { Clock, MapPin, User } from 'lucide-react'

export function UpcomingAppointments() {
  const appointments = [
    {
      id: 1,
      customer: 'Emma Thompson',
      service: 'Spa Treatment',
      time: '9:00 AM',
      duration: '60 min',
      location: 'Room A',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 2,
      customer: 'Lucas Brown',
      service: 'Hair Styling',
      time: '10:30 AM',
      duration: '45 min',
      location: 'Station 3',
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      id: 3,
      customer: 'Sophia Garcia',
      service: 'Massage',
      time: '12:00 PM',
      duration: '90 min',
      location: 'Room B',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 4,
      customer: 'Noah Anderson',
      service: 'Facial',
      time: '2:00 PM',
      duration: '60 min',
      location: 'Room C',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 5,
      customer: 'Ava Martinez',
      service: 'Manicure',
      time: '3:30 PM',
      duration: '45 min',
      location: 'Station 1',
      color: 'from-pink-500 to-pink-600'
    }
  ]

  return (
    <Card className="bg-white/70 backdrop-blur-lg border border-white/20 shadow-lg overflow-hidden h-full flex flex-col">
      <div className="p-6 border-b border-slate-200/50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Today's Schedule</h2>
            <p className="text-sm text-slate-600 mt-1">Upcoming appointments</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {appointments.map((appointment, index) => (
          <div
            key={appointment.id}
            className="group relative bg-gradient-to-br from-slate-50 to-white border border-slate-200/50 rounded-xl p-4 hover:shadow-md transition-all duration-300 cursor-pointer"
          >
            {/* Time Badge */}
            <div className="absolute -left-2 top-4 px-3 py-1 bg-white border border-slate-200 rounded-r-lg shadow-sm">
              <span className="text-xs font-bold text-slate-700">{appointment.time}</span>
            </div>

            <div className="pl-16">
              {/* Customer Info */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-lg bg-gradient-to-br ${appointment.color} flex items-center justify-center text-white text-xs font-bold shadow`}
                  >
                    {appointment.customer.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{appointment.customer}</p>
                    <p className="text-xs text-slate-600">{appointment.service}</p>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="flex items-center gap-4 mt-3 text-xs text-slate-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{appointment.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{appointment.location}</span>
                </div>
              </div>
            </div>

            {/* Hover Actions */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                  View
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-200/50">
        <Button variant="outline" className="w-full" size="sm">
          View Full Calendar
        </Button>
      </div>
    </Card>
  )
}
