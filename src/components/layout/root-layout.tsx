import React from 'react'
import { AppSidebar } from './root-sidebar'
import { SidebarProvider, SidebarTrigger } from '../ui/sidebar'
import {MenubarDemo} from './root-nav'

export function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <SidebarProvider className="bg-stone-300">
            <AppSidebar  />
            <SidebarTrigger className="bg-stone-300" />
            <main className="bg-stone-300 w-full min-h-screen p-2"> 
                <div className='bg-stone-300 flex flex-col gap-2.5 w-full h-full rounded-lg'>
                  <MenubarDemo /> 
                  <div className='bg-white w-full h-full rounded-lg p-2'>
                    {children} 
                  </div>
                </div>
            </main>
        </SidebarProvider>
  )
}
