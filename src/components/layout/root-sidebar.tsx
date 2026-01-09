import { Calendar, Home, Inbox, Search, Settings, StampIcon, User2 } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Role, User } from "../../../generated/prisma/client"

type SidebarItem = {
  title: string
  url: string
  icon: any
  role: Role[]
}

const items: SidebarItem[] = [
  { title: "Hem", url: "/", icon: Home, role: ["USER", "TEACHER", "ADMIN"] },
  { title: "Mina samtal", url: "/dashboard", icon: Inbox, role: ["USER", "TEACHER", "ADMIN"] },
  { title: "Kalender", url: "/calendar", icon: Calendar, role: ["USER", "TEACHER", "ADMIN"] },
  { title: "Användare", url: "/users", icon: User2, role: ["ADMIN"] },
  { title: "Min Klass", url: "/class", icon: StampIcon, role: ["TEACHER", "ADMIN"] },
] as const;

export function AppSidebar({user}: {user:User}) {
  const filteredItems = items.filter(i => i.role.includes(user.role));
  return (
    <Sidebar variant="floating">
      <SidebarContent>
        <SidebarGroup >
          <SidebarGroupLabel>OptiBook</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}