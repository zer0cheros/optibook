import { Suspense } from 'react'
import JoinClassWithInvite from '@/components/classes/app-join-class-invite'
import { getCurrentUser } from '@/lib/session'
import { redirect } from 'next/navigation'

export default async function Page({
  params,
}: {
  params: Promise<{ inviteToken: string }>
}) {
  const { user } = await getCurrentUser()
  const { inviteToken } = await params

  if (!user) {
    redirect('/api/auth/signin')
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JoinClassWithInvite inviteToken={inviteToken} user={user} />
    </Suspense>
  )
}
