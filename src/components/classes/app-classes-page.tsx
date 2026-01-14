'use client'

import { useEffect, useState } from 'react'
import { User } from '../../../generated/prisma/browser'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Plus, Users, BookOpen, Check, X, Clock } from 'lucide-react'
import { CreateClassModal } from './create-class-modal'
import { ClassCard } from './class-card'
import { JoinClassModal } from './join-class-modal'

type EnrollmentStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

type Student = {
  id: string
  name: string
  email: string
  image: string | null
}

type Enrollment = {
  id: string
  status: EnrollmentStatus
  createdAt: string
  student: Student
}

type Resource = {
  id: string
  title: string
  description: string | null
  url: string | null
  fileUrl: string | null
  createdAt: string
}

type Class = {
  id: string
  name: string
  description: string | null
  teacherId: string
  createdAt: string
  enrollments: Enrollment[]
  resources: Resource[]
  _count?: {
    enrollments: number
    resources: number
  }
  teacher?: {
    id: string
    name: string
    email: string
  }
}

export default function ClassesPage({ user }: { user: User }) {
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [joinModalOpen, setJoinModalOpen] = useState(false)

  const isTeacher = user.role === 'TEACHER' || user.role === 'ADMIN'

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      const res = await fetch('/api/classes')
      const data = await res.json()
      setClasses(data.classes || [])
    } catch (error) {
      console.error('Failed to fetch classes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateClass = async (name: string, description: string) => {
    try {
      const res = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      })
      if (res.ok) {
        await fetchClasses()
        setCreateModalOpen(false)
      }
    } catch (error) {
      console.error('Failed to create class:', error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-slate-900 to-slate-700">
            {isTeacher ? 'Mina Klasser' : 'Mina Klasser'}
          </h1>
          <p className="text-slate-600 mt-1">
            {isTeacher
              ? 'Hantera dina klasser, elever och resurser'
              : 'Se dina klasser och tillgängliga resurser'}
          </p>
        </div>
        <div className="flex gap-3">
          {isTeacher ? (
            <Button onClick={() => setCreateModalOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Skapa Klass
            </Button>
          ) : (
            <Button onClick={() => setJoinModalOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Gå med i Klass
            </Button>
          )}
        </div>
      </div>

      {classes.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <Users className="w-16 h-16 text-slate-300" />
            <div>
              <h3 className="text-lg font-semibold text-slate-700">
                {isTeacher ? 'Inga klasser ännu' : 'Du är inte med i någon klass'}
              </h3>
              <p className="text-slate-500 mt-1">
                {isTeacher
                  ? 'Skapa din första klass för att börja hantera elever och resurser'
                  : 'Gå med i en klass för att få tillgång till resurser och material'}
              </p>
            </div>
            {isTeacher ? (
              <Button onClick={() => setCreateModalOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Skapa Klass
              </Button>
            ) : (
              <Button onClick={() => setJoinModalOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Gå med i Klass
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem) => (
            <ClassCard
              key={classItem.id}
              classData={classItem}
              isTeacher={isTeacher}
              onUpdate={fetchClasses}
            />
          ))}
        </div>
      )}

      <CreateClassModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSubmit={handleCreateClass}
      />

      <JoinClassModal
        open={joinModalOpen}
        onOpenChange={setJoinModalOpen}
        onJoin={fetchClasses}
      />
    </div>
  )
}
