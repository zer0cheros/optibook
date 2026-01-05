import React from 'react'
import { AppSidebar } from './root-sidebar'
import { SidebarProvider, SidebarTrigger } from '../ui/sidebar'
import {MenubarDemo} from './root-nav'

export async function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <SidebarProvider className="bg-linear-to-br from-slate-50 via-stone-100 to-slate-100">
            <AppSidebar  />
            <SidebarTrigger className="bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-200 shadow-sm border border-stone-200/50 rounded-md m-2" />
            <main className="w-full min-h-screen p-4">
                <div className='flex flex-col gap-3 w-full h-full'>
                  <div className="bg-white/90 backdrop-blur-md shadow-sm border border-stone-200/50 rounded-xl">
                    <MenubarDemo />
                  </div>
                  <div className='bg-white/95 backdrop-blur-md w-full h-full rounded-xl shadow-lg border border-stone-200/50 p-6 transition-all duration-300 hover:shadow-xl'>
                    {children}
                  </div>
                </div>
            </main>
        </SidebarProvider>
  )
}
