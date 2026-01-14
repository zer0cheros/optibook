'use client'

import { useEffect, useState } from 'react'
import { User } from '../../../generated/prisma/browser'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Users, BookOpen, ArrowLeft, Plus, Check, X, Clock, ExternalLink, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Badge } from '../ui/badge'
import { AddResourceModal } from './add-resource-modal'
import { ClassInviteLink } from './class-invite-link'
import { ClassCalendarView } from './class-calendar-view'

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
  inviteToken: string | null
  teacherId: string
  teacher: {
    id: string
    name: string
    email: string
  }
  enrollments: Enrollment[]
  resources: Resource[]
}

export default function ClassDetailPage({
  classId,
  user,
}: {
  classId: string
  user: User
}) {
  const router = useRouter()
  const [classData, setClassData] = useState<ClassData | null>(null)
  const [loading, setLoading] = useState(true)
  const [addResourceModalOpen, setAddResourceModalOpen] = useState(false)

  const isTeacher = user.role === 'TEACHER' || user.role === 'ADMIN'
  const isClassTeacher = classData?.teacherId === user.id || user.role === 'ADMIN'

  useEffect(() => {
    fetchClassData()
  }, [classId])

  const fetchClassData = async () => {
    try {
      const res = await fetch(`/api/classes/${classId}`)
      const data = await res.json()
      setClassData(data.class)
    } catch (error) {
      console.error('Failed to fetch class:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveEnrollment = async (enrollmentId: string) => {
    try {
      const res = await fetch(
        `/api/classes/${classId}/enrollments/${enrollmentId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'APPROVED' }),
        }
      )
      if (res.ok) {
        await fetchClassData()
      }
    } catch (error) {
      console.error('Failed to approve enrollment:', error)
    }
  }

  const handleRejectEnrollment = async (enrollmentId: string) => {
    try {
      const res = await fetch(
        `/api/classes/${classId}/enrollments/${enrollmentId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'REJECTED' }),
        }
      )
      if (res.ok) {
        await fetchClassData()
      }
    } catch (error) {
      console.error('Failed to reject enrollment:', error)
    }
  }

  const handleRemoveStudent = async (enrollmentId: string) => {
    if (!confirm('Är du säker på att du vill ta bort denna elev?')) {
      return
    }
    try {
      const res = await fetch(
        `/api/classes/${classId}/enrollments/${enrollmentId}`,
        {
          method: 'DELETE',
        }
      )
      if (res.ok) {
        await fetchClassData()
      }
    } catch (error) {
      console.error('Failed to remove student:', error)
    }
  }

  const handleAddResource = async (
    title: string,
    description: string,
    url: string,
    fileUrl: string
  ) => {
    try {
      const res = await fetch(`/api/classes/${classId}/resources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, url, fileUrl }),
      })
      if (res.ok) {
        await fetchClassData()
        setAddResourceModalOpen(false)
      }
    } catch (error) {
      console.error('Failed to add resource:', error)
    }
  }

  const handleDeleteResource = async (resourceId: string) => {
    if (!confirm('Är du säker på att du vill ta bort denna resurs?')) {
      return
    }
    try {
      const res = await fetch(
        `/api/classes/${classId}/resources/${resourceId}`,
        {
          method: 'DELETE',
        }
      )
      if (res.ok) {
        await fetchClassData()
      }
    } catch (error) {
      console.error('Failed to delete resource:', error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!classData) {
    return <div>Klass hittades inte</div>
  }

  const pendingEnrollments = classData.enrollments.filter(
    (e) => e.status === 'PENDING'
  )
  const approvedEnrollments = classData.enrollments.filter(
    (e) => e.status === 'APPROVED'
  )

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push('/classes')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-slate-900 to-slate-700">
              {classData.name}
            </h1>
            {classData.description && (
              <p className="text-slate-600 mt-1">{classData.description}</p>
            )}
            <p className="text-sm text-slate-500 mt-2">
              Lärare: {classData.teacher.name}
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="calendar" className="w-full">
        <TabsList>
          <TabsTrigger value="calendar" className="gap-2">
            <Calendar className="w-4 h-4" />
            Kalender & Bokningar
          </TabsTrigger>
          <TabsTrigger value="resources" className="gap-2">
            <BookOpen className="w-4 h-4" />
            Resurser ({classData.resources.length})
          </TabsTrigger>
          {isClassTeacher && (
            <TabsTrigger value="students" className="gap-2">
              <Users className="w-4 h-4" />
              Elever ({approvedEnrollments.length})
              {pendingEnrollments.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {pendingEnrollments.length}
                </Badge>
              )}
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="calendar" className="mt-6">
          <ClassCalendarView
            classId={classId}
            currentUserId={user.id}
            isStudent={!isClassTeacher}
          />
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          {isClassTeacher && (
            <div className="mb-6">
              <Button onClick={() => setAddResourceModalOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Lägg till resurs
              </Button>
            </div>
          )}

          {classData.resources.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <BookOpen className="w-16 h-16 text-slate-300" />
                <div>
                  <h3 className="text-lg font-semibold text-slate-700">
                    Inga resurser ännu
                  </h3>
                  <p className="text-slate-500 mt-1">
                    {isClassTeacher
                      ? 'Lägg till den första resursen för klassen'
                      : 'Inga resurser har delats ännu'}
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {classData.resources.map((resource) => (
                <Card key={resource.id} className="p-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">
                          {resource.title}
                        </h4>
                        {resource.description && (
                          <p className="text-sm text-slate-600 mt-1">
                            {resource.description}
                          </p>
                        )}
                      </div>
                      {isClassTeacher && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteResource(resource.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      {resource.url && (
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Öppna länk
                        </a>
                      )}
                      {resource.fileUrl && (
                        <a
                          href={resource.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Ladda ner fil
                        </a>
                      )}
                    </div>
                    <span className="text-xs text-slate-500">
                      Tillagd{' '}
                      {new Date(resource.createdAt).toLocaleDateString('sv-SE')}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {isClassTeacher && (
          <TabsContent value="students" className="mt-6">
            <div className="mb-8">
              <ClassInviteLink
                classId={classId}
                inviteToken={classData.inviteToken}
                onUpdate={fetchClassData}
              />
            </div>

            {pendingEnrollments.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Väntande ansökningar ({pendingEnrollments.length})
                </h3>
                <div className="flex flex-col gap-3">
                  {pendingEnrollments.map((enrollment) => (
                    <Card key={enrollment.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{enrollment.student.name}</p>
                          <p className="text-sm text-slate-600">
                            {enrollment.student.email}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            Ansökte{' '}
                            {new Date(enrollment.createdAt).toLocaleDateString(
                              'sv-SE'
                            )}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectEnrollment(enrollment.id)}
                            className="gap-1"
                          >
                            <X className="w-4 h-4" />
                            Neka
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApproveEnrollment(enrollment.id)}
                            className="gap-1"
                          >
                            <Check className="w-4 h-4" />
                            Godkänn
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Godkända elever ({approvedEnrollments.length})
              </h3>
              {approvedEnrollments.length === 0 ? (
                <Card className="p-12 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <Users className="w-16 h-16 text-slate-300" />
                    <div>
                      <h3 className="text-lg font-semibold text-slate-700">
                        Inga godkända elever ännu
                      </h3>
                      <p className="text-slate-500 mt-1">
                        Elever som ansöker om att gå med kommer att visas här
                      </p>
                    </div>
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {approvedEnrollments.map((enrollment) => (
                    <Card key={enrollment.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{enrollment.student.name}</p>
                          <p className="text-sm text-slate-600">
                            {enrollment.student.email}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            Gick med{' '}
                            {new Date(enrollment.createdAt).toLocaleDateString(
                              'sv-SE'
                            )}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveStudent(enrollment.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        )}
      </Tabs>

      <AddResourceModal
        open={addResourceModalOpen}
        onOpenChange={setAddResourceModalOpen}
        onSubmit={handleAddResource}
      />
    </div>
  )
}
