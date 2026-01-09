'use client'

import { Card } from '../../ui/card'
import { Plus, Calendar, Users, Settings, FileText, CreditCard } from 'lucide-react'

export function QuickActions() {
  const actions = [
    {
      title: 'New Booking',
      description: 'Create a new reservation',
      icon: Plus,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700'
    },
    {
      title: 'View Calendar',
      description: 'Check availability',
      icon: Calendar,
      color: 'from-emerald-500 to-emerald-600',
      hoverColor: 'hover:from-emerald-600 hover:to-emerald-700'
    },
    {
      title: 'Manage Customers',
      description: 'Customer database',
      icon: Users,
      color: 'from-orange-500 to-orange-600',
      hoverColor: 'hover:from-orange-600 hover:to-orange-700'
    },
    {
      title: 'Reports',
      description: 'Analytics & insights',
      icon: FileText,
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700'
    },
    {
      title: 'Payments',
      description: 'Transaction history',
      icon: CreditCard,
      color: 'from-pink-500 to-pink-600',
      hoverColor: 'hover:from-pink-600 hover:to-pink-700'
    },
    {
      title: 'Settings',
      description: 'Configure system',
      icon: Settings,
      color: 'from-slate-500 to-slate-600',
      hoverColor: 'hover:from-slate-600 hover:to-slate-700'
    }
  ]

  return (
    <Card className="bg-white/70 backdrop-blur-lg border border-white/20 shadow-lg overflow-hidden">
      <div className="p-6 border-b border-slate-200/50">
        <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
        <p className="text-sm text-slate-600 mt-1">Frequently used features at your fingertips</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {actions.map((action, index) => (
            <button
              key={index}
              className="group relative flex flex-col items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-200/50 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} ${action.hoverColor} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-900">{action.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{action.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </Card>
  )
}
