'use client'
import { Upload, Filter } from "lucide-react"
import { Button } from "../ui/button"
import { Calendar31} from "./app-dashboard-calendrar"
import { useState } from "react"
import { ImportIcalModal } from "./import/import-ical"
import { Suspense } from "react"
import { User } from "../../../generated/prisma/browser"


export default function Dashboard({user}: {user:User}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-slate-900 to-slate-700">
            Mina Bokingar
          </h1>
          <p className="text-slate-600 mt-1">Här kan du se alla dina bokningar och göra nya</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button onClick={()=>setOpen(!open)} variant="outline" className="gap-2">
            <Upload  className="w-4 h-4" />
            Importera .ical fil
          </Button>
        </div>
      </div>
      <Suspense fallback={<div>Loading calendar...</div>}>
        <Calendar31 user={user}/>
      </Suspense>
      
        <ImportIcalModal
        open={open}
        onOpenChange={setOpen}
        onImport={async ({ calendarName, file }) => {
          const fd = new FormData();
          fd.append("calendarName", calendarName);
          fd.append("file", file);

          const res = await fetch("/api/calendar/import", { method: "POST", body: fd });
          if (!res.ok) throw new Error("Import failed");
        }}
      />
    </div>
  )
}
