import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"

export function MenubarDemo() {
  return (
   <Menubar className="w-auto justify-end">
    <MenubarMenu>
    <MenubarTrigger>Services</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>
        Calendars <MenubarShortcut>⌘T</MenubarShortcut>
      </MenubarItem>
      <MenubarItem>Booking-systems</MenubarItem>
      <MenubarSeparator />
      <MenubarItem>Meetings</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
  <MenubarMenu>
    <MenubarTrigger>Contact</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>
        Location <MenubarShortcut>⌘T</MenubarShortcut>
      </MenubarItem>
      <MenubarItem>Persons</MenubarItem>
      <MenubarSeparator />
      <MenubarItem>Share</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
  <MenubarMenu>
    <MenubarTrigger>About</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>
        About us<MenubarShortcut>⌘T</MenubarShortcut>
      </MenubarItem>
      <MenubarItem>Our policies</MenubarItem>
      <MenubarSeparator />
      <MenubarItem>Where to find us</MenubarItem>

    </MenubarContent>
  </MenubarMenu>
</Menubar>
  )
}
