import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { DatePicker } from "./app-date-picker"
import { User } from "../../../../generated/prisma/browser"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"

export default function EventCreateModal({children, user}: {children: React.ReactElement, user?:User}) {
    return (
    <Drawer direction="right">
  <DrawerTrigger asChild>{children}</DrawerTrigger>
  <DrawerContent className="mx-auto w-full h-full">
    <DrawerHeader>
      <DrawerTitle>Välj datum och tid för mötet</DrawerTitle>
      <Separator className="my-3"></Separator>
      <DatePicker></DatePicker>
      <FieldGroup className="mt-4">
       <Field>
        <FieldLabel htmlFor="email">Epost</FieldLabel>
            <Input
                  id="email"
                  type="email"
                  value={user?.email}
                  required
            />
            </Field>
            <Field>
                <FieldLabel htmlFor="disciption">Ärende</FieldLabel>
                <Input
                  id="disciption"
                  type="text"
                  placeholder="Vad gäller mötet?"
                  required
                />
              </Field>
      </FieldGroup> 
    </DrawerHeader>
    <DrawerFooter>
      <Button>Boka</Button>
      <DrawerClose asChild>
        <Button variant="outline">Avbryt</Button>
      </DrawerClose >
    </DrawerFooter>
  </DrawerContent>
</Drawer>
  )
}
