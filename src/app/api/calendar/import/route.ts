import { NextResponse } from "next/server";
import ical from "node-ical";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function GET() {
    return NextResponse.json({ message: "Calendar import endpoint" });  
}

export async function POST(req: Request) {
  const { user } = await getCurrentUser();
  console.log("Importing calendar for user:", user?.id);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  const calendarName = (form.get("calendarName") as string) || "Imported";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "File too large" }, { status: 400 });
  }
  if (!file.name.toLowerCase().endsWith(".ics")) {
    return NextResponse.json({ error: "Please upload a .ics file" }, { status: 400 });
  }

  const text = await file.text();

  let parsed: Record<string, any>;
  try {
    parsed = ical.parseICS(text);
  } catch {
    return NextResponse.json({ error: "Invalid iCalendar file" }, { status: 400 });
  }

  // ensure a calendar exists for this import
  const calendar = await prisma.calendar.create({
    data: {
      userId: user.id,
      name: calendarName,
    },
  });

  const eventsToUpsert: Array<{
    uid: string;
    title: string | null;
    description: string | null;
    location: string | null;
    startAt: Date;
    endAt: Date;
    allDay: boolean;
    timezone: string | null;
    sequence: number | null;
    dtstamp: Date | null;
    lastModified: Date | null;
  }> = [];

  for (const key of Object.keys(parsed)) {
    const item = parsed[key];
    if (!item || item.type !== "VEVENT") continue;

    // Handle CANCELLED by skipping (or you can delete existing)
    if (String(item.status || "").toUpperCase() === "CANCELLED") continue;

    const startAt: Date | undefined = item.start;
    const endAt: Date | undefined = item.end;
    if (!startAt || !endAt) continue;

    const uid = String(item.uid ?? key);

    const allDay =
      startAt.getHours() === 0 &&
      startAt.getMinutes() === 0 &&
      endAt.getHours() === 0 &&
      endAt.getMinutes() === 0 &&
      (endAt.getTime() - startAt.getTime()) % (24 * 60 * 60 * 1000) === 0;

    eventsToUpsert.push({
      uid,
      title: item.summary ?? null,
      description: item.description ?? null,
      location: item.location ?? null,
      startAt,
      endAt,
      allDay,
      timezone: item.start?.tz ?? item.tz ?? null,
      sequence: typeof item.sequence === "number" ? item.sequence : null,
      dtstamp: item.dtstamp instanceof Date ? item.dtstamp : null,
      lastModified: item["last-modified"] instanceof Date ? item["last-modified"] : null,
    });
  }

  if (eventsToUpsert.length === 0) {
    return NextResponse.json({ error: "No events found in file" }, { status: 400 });
  }

  // upsert per (calendarId, uid, startAt)
  function chunk<T>(arr: T[], size: number) {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

const BATCH_SIZE = 50; // try 25/50/100 depending on DB latency

let imported = 0;

for (const batch of chunk(eventsToUpsert, BATCH_SIZE)) {
  const res = await prisma.$transaction(
    batch.map((ev) =>
      prisma.calendarEvent.upsert({
        where: {
          calendar_uid_startAt: {
            calendarId: calendar.id,
            uid: ev.uid,
            startAt: ev.startAt,
          },
        },
        create: { calendarId: calendar.id, ...ev },
        update: {
          title: ev.title,
          description: ev.description,
          location: ev.location,
          endAt: ev.endAt,
          allDay: ev.allDay,
          timezone: ev.timezone,
          sequence: ev.sequence,
          dtstamp: ev.dtstamp,
          lastModified: ev.lastModified,
        },
      })
    )
  );

  imported += res.length;
}

return NextResponse.json({ calendarId: calendar.id, imported });
}
