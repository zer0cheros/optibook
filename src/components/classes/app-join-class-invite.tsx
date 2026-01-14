'use client'

import { useEffect, useState } from 'react'
import { User } from '../../../generated/prisma/browser'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Users, CheckCircle, Loader2, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Teacher = {
  id: string
  name: string
  email: string
}

type ClassData = {
  id: string
  name: string
  description: string | null
  teacher: Teacher
  _count: {
    enrollments: number
  }
}

export default function JoinClassWithInvite({
  inviteToken,
  user,
}: {
  inviteToken: string
  user: User
}) {
  const router = useRouter()
  const [classData, setClassData] = useState<ClassData | null>(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchClassInfo()
  }, [inviteToken])

  const fetchClassInfo = async () => {
    try {
      const res = await fetch(`/api/classes/join/${inviteToken}`)
      if (!res.ok) {
        setError('Ogiltig eller utgången inbjudningslänk')
        return
      }
      const data = await res.json()
      setClassData(data.class)
    } catch (error) {
      console.error('Failed to fetch class:', error)
      setError('Det gick inte att hämta klassinfo')
    } finally {
      setLoading(false)
    }
  }

  const handleJoinClass = async () => {
    setJoining(true)
    try {
      const res = await fetch(`/api/classes/join/${inviteToken}`, {
        method: 'POST',
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push(`/classes/${classData?.id}`)
        }, 2000)
      } else {
        setError(data.message || 'Det gick inte att gå med i klassen')
      }
    } catch (error) {
      console.error('Failed to join class:', error)
      setError('Det gick inte att gå med i klassen')
    } finally {
      setJoining(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    )
  }

  if (error && !classData) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Card className="p-12 text-center max-w-md">
          <div className="flex flex-col items-center gap-4">
            <XCircle className="w-16 h-16 text-red-400" />
            <div>
              <h3 className="text-lg font-semibold text-slate-700">
                Ogiltig inbjudningslänk
              </h3>
              <p className="text-slate-500 mt-1">{error}</p>
            </div>
            <Button onClick={() => router.push('/classes')}>
              Gå till Mina Klasser
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Card className="p-12 text-center max-w-md">
          <div className="flex flex-col items-center gap-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
            <div>
              <h3 className="text-lg font-semibold text-slate-700">
                Välkommen till klassen!
              </h3>
              <p className="text-slate-500 mt-1">
                Du har nu gått med i {classData?.name}
              </p>
            </div>
            <p className="text-sm text-slate-400">Omdirigerar...</p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Card className="p-12 text-center max-w-2xl">
        <div className="flex flex-col items-center gap-6">
          <Users className="w-16 h-16 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Gå med i {classData?.name}
            </h1>
            {classData?.description && (
              <p className="text-slate-600 mt-2">{classData.description}</p>
            )}
          </div>

          <div className="flex flex-col gap-2 text-sm text-slate-600 bg-slate-50 p-4 rounded-lg w-full">
            <div className="flex justify-between">
              <span className="font-medium">Lärare:</span>
              <span>{classData?.teacher.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Antal elever:</span>
              <span>{classData?._count.enrollments} elever</span>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg w-full">
              {error}
            </div>
          )}

          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              onClick={() => router.push('/classes')}
              className="flex-1"
              disabled={joining}
            >
              Avbryt
            </Button>
            <Button
              onClick={handleJoinClass}
              className="flex-1"
              disabled={joining}
            >
              {joining ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Går med...
                </>
              ) : (
                'Gå med i klassen'
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
