import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ classId: string }> }
) {
    const user = await getCurrentUser();
    if (!user.user) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { classId } = await params;

    // Verify user is part of the class
    const classData = await prisma.class.findUnique({
        where: { id: classId },
        include: {
            enrollments: {
                where: {
                    studentId: user.user.id,
                    status: "APPROVED"
                }
            }
        }
    });

    if (!classData) {
        return new Response("Class not found", { status: 404 });
    }

    // Check if user is teacher or enrolled student
    const isTeacher = classData.teacherId === user.user.id || user.user.role === "ADMIN";
    const isEnrolledStudent = classData.enrollments.length > 0;

    if (!isTeacher && !isEnrolledStudent) {
        return new Response("Forbidden", { status: 403 });
    }

    // Get teacher's calendar
    const teacherCalendar = await prisma.calendar.findFirst({
        where: { userId: classData.teacherId },
        include: {
            events: {
                orderBy: {
                    startAt: 'asc'
                }
            }
        }
    });

    // Get class bookings
    const classBookings = await prisma.booking.findMany({
        where: { classId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                }
            }
        },
        orderBy: {
            startTime: 'asc'
        }
    });

    return Response.json({
        calendar: teacherCalendar,
        bookings: classBookings
    });
}
