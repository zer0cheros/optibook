import { Suspense } from 'react'
import ClassDetailPage from '@/components/classes/app-class-detail-page'
import { getCurrentUser } from '@/lib/session'
import { redirect } from 'next/navigation'

export default async function Page({
  params,
}: {
  params: Promise<{ classId: string }>
}) {
  const { user } = await getCurrentUser()
  const { classId } = await params

  if (!user) {
    redirect('/api/auth/signin')
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClassDetailPage classId={classId} user={user} />
    </Suspense>
  )
}
