'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Users, Loader2 } from 'lucide-react'

type Teacher = {
  id: string
  name: string
  email: string
}

type ClassOption = {
  id: string
  name: string
  description: string | null
  teacher: Teacher
  _count: {
    enrollments: number
  }
}

export function JoinClassModal({
  open,
  onOpenChange,
  onJoin,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onJoin: () => void
}) {
  const [classes, setClasses] = useState<ClassOption[]>([])
  const [loading, setLoading] = useState(false)
  const [joining, setJoining] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      fetchAvailableClasses()
    }
  }, [open])

  const fetchAvailableClasses = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/classes?includeAll=true')
      const data = await res.json()
      setClasses(data.classes || [])
    } catch (error) {
      console.error('Failed to fetch classes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleJoinClass = async (classId: string) => {
    setJoining(classId)
    try {
      const res = await fetch(`/api/classes/${classId}/enrollments`, {
        method: 'POST',
      })
      if (res.ok) {
        onJoin()
        onOpenChange(false)
      } else {
        const data = await res.text()
        alert(data || 'Failed to join class')
      }
    } catch (error) {
      console.error('Failed to join class:', error)
      alert('Failed to join class')
    } finally {
      setJoining(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gå med i en klass</DialogTitle>
          <DialogDescription>
            Välj en klass att ansöka om medlemskap i. Läraren måste godkänna din
            ansökan.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : classes.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            Inga tillgängliga klasser hittades
          </div>
        ) : (
          <div className="flex flex-col gap-3 py-4">
            {classes.map((classItem) => (
              <Card key={classItem.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">
                      {classItem.name}
                    </h4>
                    {classItem.description && (
                      <p className="text-sm text-slate-600 mt-1">
                        {classItem.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                      <span>Lärare: {classItem.teacher.name}</span>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{classItem._count.enrollments} elever</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleJoinClass(classItem.id)}
                    disabled={joining === classItem.id}
                    size="sm"
                  >
                    {joining === classItem.id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Ansöker...
                      </>
                    ) : (
                      'Ansök'
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
