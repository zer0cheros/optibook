import { Suspense } from 'react'
import ClassesPage from '@/components/classes/app-classes-page'
import { getCurrentUser } from '@/lib/session'
import { redirect } from 'next/navigation'

export default async function Page() {
  const { user } = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClassesPage user={user} />
    </Suspense>
  )
}
