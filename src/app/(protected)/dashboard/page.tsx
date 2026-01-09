import Dashboard from "@/components/dashboard/app-dashboard"
import { getCurrentUser } from "@/lib/session"
import { redirect } from "next/navigation";

export default async function page() {
  const {user} = await getCurrentUser();
  if(!user) {
    redirect('login')
  }
  return (
    <Dashboard user={user}/>
  )
}
