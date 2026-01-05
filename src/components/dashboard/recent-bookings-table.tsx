'use client'

import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { MoreVertical, CheckCircle, Clock, XCircle } from 'lucide-react'

export function RecentBookingsTable() {
  const bookings = [
    {
      id: 'BK-2847',
      customer: 'Sarah Johnson',
      service: 'Spa Treatment',
      date: '2026-01-15',
      time: '10:00 AM',
      status: 'confirmed',
      amount: '$150'
    },
    {
      id: 'BK-2846',
      customer: 'Michael Chen',
      service: 'Hair Styling',
      date: '2026-01-15',
      time: '2:30 PM',
      status: 'pending',
      amount: '$85'
    },
    {
      id: 'BK-2845',
      customer: 'Emily Davis',
      service: 'Massage Therapy',
      date: '2026-01-16',
      time: '11:00 AM',
      status: 'confirmed',
      amount: '$120'
    },
    {
      id: 'BK-2844',
      customer: 'James Wilson',
      service: 'Facial Treatment',
      date: '2026-01-16',
      time: '3:00 PM',
      status: 'cancelled',
      amount: '$95'
    },
    {
      id: 'BK-2843',
      customer: 'Olivia Martinez',
      service: 'Manicure & Pedicure',
      date: '2026-01-17',
      time: '1:00 PM',
      status: 'confirmed',
      amount: '$65'
    }
  ]

  const getStatusBadge = (status: string) => {
    const styles = {
      confirmed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      pending: 'bg-orange-100 text-orange-700 border-orange-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200'
    }

    const icons = {
      confirmed: CheckCircle,
      pending: Clock,
      cancelled: XCircle
    }

    const Icon = icons[status as keyof typeof icons]

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
          styles[status as keyof typeof styles]
        }`}
      >
        <Icon className="w-3.5 h-3.5" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  return (
    <Card className="bg-white/70 backdrop-blur-lg border border-white/20 shadow-lg overflow-hidden">
      <div className="p-6 border-b border-slate-200/50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Recent Bookings</h2>
            <p className="text-sm text-slate-600 mt-1">Latest booking requests and confirmations</p>
          </div>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Booking ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Service
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/50">
            {bookings.map((booking) => (
              <tr
                key={booking.id}
                className="hover:bg-slate-50/50 transition-colors duration-150 cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-slate-900">{booking.id}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                      {booking.customer.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-sm font-medium text-slate-900">{booking.customer}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-slate-700">{booking.service}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-900">{booking.date}</span>
                    <span className="text-xs text-slate-500">{booking.time}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-slate-900">{booking.amount}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(booking.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
