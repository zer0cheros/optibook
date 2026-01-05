import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";


export async function GET() {
    const user = await getCurrentUser();
    if (!user.user) {
        return new Response("Unauthorized", { status: 401 });
    }
    const calender = await prisma.calendar.findFirst({
        where: { userId: user.user.id },
        include: { events: true },
    });
    return Response.json({calender});
}