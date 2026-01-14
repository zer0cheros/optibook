'use client'

import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Users, BookOpen, ChevronRight, Clock, Check, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Badge } from '../ui/badge'

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

type ClassData = {
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

export function ClassCard({
  classData,
  isTeacher,
  onUpdate,
}: {
  classData: ClassData
  isTeacher: boolean
  onUpdate: () => void
}) {
  const router = useRouter()

  const approvedCount = classData.enrollments.filter(
    (e) => e.status === 'APPROVED'
  ).length
  const pendingCount = classData.enrollments.filter(
    (e) => e.status === 'PENDING'
  ).length

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push(`/classes/${classData.id}`)}>
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">{classData.name}</h3>
          {classData.description && (
            <p className="text-sm text-slate-600 mt-1 line-clamp-2">
              {classData.description}
            </p>
          )}
          {!isTeacher && classData.teacher && (
            <p className="text-sm text-slate-500 mt-1">
              Lärare: {classData.teacher.name}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{approvedCount} elever</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{classData.resources.length} resurser</span>
          </div>
        </div>

        {isTeacher && pendingCount > 0 && (
          <Badge variant="secondary" className="w-fit gap-1">
            <Clock className="w-3 h-3" />
            {pendingCount} väntande
          </Badge>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-xs text-slate-500">
            Skapad {new Date(classData.createdAt).toLocaleDateString('sv-SE')}
          </span>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>
      </div>
    </Card>
  )
}
