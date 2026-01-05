'use client'

import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { TrendingUp } from 'lucide-react'

export function BookingTrendChart() {
  const chartData = [
    { month: 'Jan', bookings: 245, revenue: 18750 },
    { month: 'Feb', bookings: 298, revenue: 22350 },
    { month: 'Mar', bookings: 312, revenue: 23850 },
    { month: 'Apr', bookings: 287, revenue: 21200 },
    { month: 'May', bookings: 342, revenue: 26100 },
    { month: 'Jun', bookings: 389, revenue: 29850 },
    { month: 'Jul', bookings: 421, revenue: 32400 }
  ]

  const maxBookings = Math.max(...chartData.map(d => d.bookings))
  const maxRevenue = Math.max(...chartData.map(d => d.revenue))

  return (
    <Card className="bg-white/70 backdrop-blur-lg border border-white/20 shadow-lg overflow-hidden h-full">
      <div className="p-6 border-b border-slate-200/50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Booking Trends</h2>
            <p className="text-sm text-slate-600 mt-1">Monthly bookings and revenue overview</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs">
              Month
            </Button>
            <Button variant="ghost" size="sm" className="text-xs">
              Year
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Chart Legend */}
        <div className="flex items-center gap-6 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"></div>
            <span className="text-sm font-medium text-slate-700">Bookings</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600"></div>
            <span className="text-sm font-medium text-slate-700">Revenue</span>
          </div>
          <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">+23.5% Growth</span>
          </div>
        </div>

        {/* Simple Bar Chart */}
        <div className="space-y-4">
          {chartData.map((data, index) => (
            <div key={data.month} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700 w-12">{data.month}</span>
                <div className="flex-1 mx-4 flex gap-2">
                  {/* Bookings Bar */}
                  <div className="relative flex-1 h-8 bg-slate-100 rounded-lg overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg transition-all duration-500 flex items-center justify-end pr-2"
                      style={{ width: `${(data.bookings / maxBookings) * 100}%` }}
                    >
                      {(data.bookings / maxBookings) * 100 > 30 && (
                        <span className="text-xs font-semibold text-white">{data.bookings}</span>
                      )}
                    </div>
                    {(data.bookings / maxBookings) * 100 <= 30 && (
                      <span className="absolute inset-y-0 right-2 flex items-center text-xs font-semibold text-slate-600">
                        {data.bookings}
                      </span>
                    )}
                  </div>

                  {/* Revenue Bar */}
                  <div className="relative flex-1 h-8 bg-slate-100 rounded-lg overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg transition-all duration-500 flex items-center justify-end pr-2"
                      style={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
                    >
                      {(data.revenue / maxRevenue) * 100 > 30 && (
                        <span className="text-xs font-semibold text-white">
                          ${(data.revenue / 1000).toFixed(1)}k
                        </span>
                      )}
                    </div>
                    {(data.revenue / maxRevenue) * 100 <= 30 && (
                      <span className="absolute inset-y-0 right-2 flex items-center text-xs font-semibold text-slate-600">
                        ${(data.revenue / 1000).toFixed(1)}k
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart Footer Stats */}
        <div className="mt-6 pt-6 border-t border-slate-200/50 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-slate-600">Avg. Bookings</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">328</p>
          </div>
          <div className="text-center border-x border-slate-200/50">
            <p className="text-sm text-slate-600">Avg. Revenue</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">$24.9k</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-slate-600">Peak Month</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">July</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
