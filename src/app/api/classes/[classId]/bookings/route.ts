import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ classId: string }> }
) {
    const user = await getCurrentUser();
    if (!user.user) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { classId } = await params;

    // Verify user is enrolled in the class
    const enrollment = await prisma.classEnrollment.findUnique({
        where: {
            classId_studentId: {
                classId,
                studentId: user.user.id
            }
        },
        include: {
            class: true
        }
    });

    if (!enrollment || enrollment.status !== "APPROVED") {
        return new Response("You must be an approved member of this class", { status: 403 });
    }

    const body = await request.json();
    const { title, description, startTime, endTime, resourceId } = body;

    if (!title || !startTime || !endTime) {
        return new Response("Title, start time, and end time are required", { status: 400 });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
        return new Response("End time must be after start time", { status: 400 });
    }

    // Check if there's a resource to book
    let resource;
    if (resourceId) {
        resource = await prisma.resource.findUnique({
            where: { id: resourceId }
        });
        if (!resource) {
            return new Response("Resource not found", { status: 404 });
        }
    } else {
        // Create a default resource for teacher bookings if none exists
        resource = await prisma.resource.findFirst({
            where: { name: "Teacher Meeting" }
        });

        if (!resource) {
            resource = await prisma.resource.create({
                data: {
                    id: "teacher-meeting-default",
                    name: "Teacher Meeting"
                }
            });
        }
    }

    // Create the booking
    const booking = await prisma.booking.create({
        data: {
            id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            userId: user.user.id,
            resourceId: resource.id,
            classId,
            teacherId: enrollment.class.teacherId,
            title,
            description,
            startTime: start,
            endTime: end,
            date: start,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                }
            },
            class: true
        }
    });

    return Response.json({ booking });
}

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

    const isTeacher = classData.teacherId === user.user.id || user.user.role === "ADMIN";
    const isEnrolledStudent = classData.enrollments.length > 0;

    if (!isTeacher && !isEnrolledStudent) {
        return new Response("Forbidden", { status: 403 });
    }

    // Get bookings for this class
    const bookings = await prisma.booking.findMany({
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

    return Response.json({ bookings });
}
