import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { getCurrentUser } from "@/lib/session";

export async function MenubarDemo() {
  const { user } = await getCurrentUser();
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
      <MenubarItem>Logga Ut</MenubarItem>
    </MenubarContent>
  </MenubarMenu>}
</Menubar>
  )
}
