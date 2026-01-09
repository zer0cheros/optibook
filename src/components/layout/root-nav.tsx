'use client'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { User } from "../../../generated/prisma/client";
import { authClient } from "@/lib/auth-client";

export function MenubarDemo({user}: {user:User}) {
  console.log("Menubar user:", user);
  return (
   <Menubar className="w-auto justify-end">
  <MenubarMenu>
    <MenubarTrigger>Kontakta</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>
        Var du hittar oss <MenubarShortcut>⌘T</MenubarShortcut>
      </MenubarItem>
      <MenubarItem>Personer</MenubarItem>
      <MenubarSeparator />
    </MenubarContent>
  </MenubarMenu>
  <MenubarMenu>
    <MenubarTrigger>Om oss</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>
        Vem är vi?<MenubarShortcut>⌘T</MenubarShortcut>
      </MenubarItem>
      <MenubarItem>Vår polices</MenubarItem>
      <MenubarSeparator />
      <MenubarItem>Integritet och säkerhet</MenubarItem>

    </MenubarContent>
  </MenubarMenu>
  {user &&  
    <MenubarMenu>
    <MenubarTrigger>User</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>
        Inställningar<MenubarShortcut>⌘T</MenubarShortcut>
      </MenubarItem>
      <MenubarItem>Profil</MenubarItem>
      <MenubarSeparator />
      <MenubarItem onClick={()=> authClient.signOut()}>Logga Ut</MenubarItem>
    </MenubarContent>
  </MenubarMenu>}
</Menubar>
  )
}
