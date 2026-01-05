"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ImportIcalModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport?: (payload: { calendarName: string; file: File }) => Promise<void> | void;
};

export function ImportIcalModal({ open, onOpenChange, onImport }: ImportIcalModalProps) {
  const [calendarName, setCalendarName] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Close on Escape
  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setIsSubmitting(true);
    try {
      await onImport?.({ calendarName: calendarName.trim() || "Imported", file });
      onOpenChange(false);
      setCalendarName("");
      setFile(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop (blur + dim) */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <Card
          className="w-full max-w-sm shadow-2xl border border-stone-200/50 bg-white/95 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="Import iCalendar"
          onClick={(e) => e.stopPropagation()}
        >
          <CardHeader>
            <CardTitle>Import iCalendar (.ics)</CardTitle>
            <CardDescription>
              Upload an <span className="font-medium">.ics</span> file and add events to your calendar.
            </CardDescription>

            <CardAction className="flex gap-2">
              <Button variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
            </CardAction>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="calendarName">Calendar name</Label>
                  <Input
                    id="calendarName"
                    placeholder="e.g. School schedule"
                    value={calendarName}
                    onChange={(e) => setCalendarName(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="icsFile">iCal file (.ics)</Label>
                  <Input
                    id="icsFile"
                    type="file"
                    accept=".ics,text/calendar"
                    required
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Tip: Most calendar apps let you export to <code>.ics</code>.
                  </p>
                </div>
              </div>

              <CardFooter className="px-0 pt-6 flex-col gap-2">
                <Button type="submit" className="w-full" disabled={!file || isSubmitting}>
                  {isSubmitting ? "Importing..." : "Import"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Close
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
