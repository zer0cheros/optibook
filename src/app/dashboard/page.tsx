import { Suspense } from 'react'
import DashBoard from '@/components/dashboard/app-dashboard'
import Loading from './loading'

export default function page() {
  return (
    <Suspense fallback={<Loading />}>
        <DashBoard/>
    </Suspense>
  )
}
