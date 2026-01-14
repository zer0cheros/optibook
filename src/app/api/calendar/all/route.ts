import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";

export async function GET() {
    const user = await getCurrentUser();
    if (!user.user) {
        return new Response("Unauthorized", { status: 401 });
    }

    // Get user's own calendar
    const userCalendar = await prisma.calendar.findFirst({
        where: { userId: user.user.id },
        include: {
            events: {
                orderBy: {
                    startAt: 'asc'
                }
            }
        }
    });

    // Get user's bookings
    const userBookings = await prisma.booking.findMany({
        where: { userId: user.user.id },
        include: {
            resource: true,
            class: {
                include: {
                    teacher: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        }
                    }
                }
            }
        },
        orderBy: {
            startTime: 'asc'
        }
    });

    // If student, get enrolled classes and their teacher's calendars
    let teacherCalendarEvents: any[] = [];
    let classBookings: any[] = [];

    if (user.user.role === 'USER') {
        const enrolledClasses = await prisma.classEnrollment.findMany({
            where: {
                studentId: user.user.id,
                status: 'APPROVED'
            },
            include: {
                class: {
                    include: {
                        teacher: true
                    }
                }
            }
        });

        // Get teacher calendars for all enrolled classes
        for (const enrollment of enrolledClasses) {
            const teacherCalendar = await prisma.calendar.findFirst({
                where: { userId: enrollment.class.teacherId },
                include: {
                    events: true
                }
            });

            if (teacherCalendar) {
                teacherCalendarEvents.push(...teacherCalendar.events.map(event => ({
                    ...event,
                    teacherName: enrollment.class.teacher.name,
                    className: enrollment.class.name,
                    classId: enrollment.class.id
                })));
            }

            // Get all bookings for this class
            const bookings = await prisma.booking.findMany({
                where: { classId: enrollment.class.id },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true,
                        }
                    },
                    resource: true
                }
            });

            classBookings.push(...bookings.map(booking => ({
                ...booking,
                className: enrollment.class.name,
                teacherName: enrollment.class.teacher.name
            })));
        }
    }

    // If teacher, get all bookings for their classes
    if (user.user.role === 'TEACHER' || user.user.role === 'ADMIN') {
        const teacherClasses = await prisma.class.findMany({
            where: { teacherId: user.user.id },
            include: {
                bookings: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                image: true,
                            }
                        },
                        resource: true
                    }
                }
            }
        });

        for (const classData of teacherClasses) {
            classBookings.push(...classData.bookings.map(booking => ({
                ...booking,
                className: classData.name
            })));
        }
    }

    return Response.json({
        userCalendar,
        userBookings,
        teacherCalendarEvents,
        classBookings
    });
}
