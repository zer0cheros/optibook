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
import Link from "next/link";

export function MenubarDemo({user}: {user:User}) {
  return (
   <Menubar className="w-auto justify-end">
  <MenubarMenu>
    <MenubarTrigger>Kontakta</MenubarTrigger>
    <MenubarContent>
      <Link href={'/contact/us'}><MenubarItem>
        Var du hittar oss <MenubarShortcut>⌘T</MenubarShortcut>
      </MenubarItem></Link>
      <Link href={'/contact/persons'}><MenubarItem>Personer</MenubarItem></Link>
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
    <MenubarTrigger>{user.name}</MenubarTrigger>
    <MenubarContent>
      <Link href={'/dashboard'}><MenubarItem>
        Dashboard<MenubarShortcut>⌘D</MenubarShortcut>
      </MenubarItem></Link>
      <Link href={'/classes'}><MenubarItem>
        Klasser<MenubarShortcut>⌘K</MenubarShortcut>
      </MenubarItem></Link>
      <MenubarSeparator />
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
