import { Suspense } from 'react'
import DashBoard from '@/components/dashboard/app-admin-dashboard'
import Loading from './loading'

export default function page() {
  return (
    <Suspense fallback={<Loading />}>
        <DashBoard/>
    </Suspense>
  )
}
