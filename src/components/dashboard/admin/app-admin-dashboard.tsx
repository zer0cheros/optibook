'use client'

import { Calendar, Clock, DollarSign, Users, CalendarCheck, Plus, Filter, Download } from 'lucide-react'
import { Card } from '../../ui/card'
import { Button } from '../../ui/button'
import { BookingTrendChart } from './booking-trend-chart'
import { RecentBookingsTable } from './recent-bookings-table'
import { UpcomingAppointments } from './upcoming-appointments'
import { QuickActions } from './quick-actions'

export default function AdminDashBoard() {
  const stats = [
    {
      title: 'Total Bookings',
      value: '2,847',
      change: '+12.5%',
      trend: 'up',
      icon: Calendar,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Active Reservations',
      value: '184',
      change: '+8.2%',
      trend: 'up',
      icon: CalendarCheck,
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      title: 'Revenue',
      value: '$54,239',
      change: '+23.1%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Pending Requests',
      value: '23',
      change: '-5.4%',
      trend: 'down',
      icon: Clock,
      color: 'from-purple-500 to-purple-600'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-slate-900 to-slate-700">
            Dashboard
          </h1>
          <p className="text-slate-600 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="group relative overflow-hidden bg-white/70 backdrop-blur-lg border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <span
                      className={`text-sm font-semibold ${
                        stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-xs text-slate-500">vs last month</span>
                  </div>
                </div>
                <div
                  className={`w-14 h-14 rounded-2xl bg-linear-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r ${stat.color}`}></div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Charts and Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Trend Chart - Takes 2 columns */}
        <div className="lg:col-span-2">
          <BookingTrendChart />
        </div>

        {/* Upcoming Appointments - Takes 1 column */}
        <div className="lg:col-span-1">
          <UpcomingAppointments />
        </div>
      </div>

      {/* Recent Bookings Table */}
      <RecentBookingsTable />
    </div>
  )
}
