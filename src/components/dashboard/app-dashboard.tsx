import { Upload, Filter } from "lucide-react"
import { Button } from "../ui/button"
import { Calendar05 } from "./app-calendrar"

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-slate-900 to-slate-700">
            Dashboard
          </h1>
          <p className="text-slate-600 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button variant="outline" className="gap-2">
            <Upload className="w-4 h-4" />
            Importera .ical fil
          </Button>
        </div>
      </div>
      <Calendar05/>
    </div>
  )
}
