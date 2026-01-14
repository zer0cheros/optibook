import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ classId: string; enrollmentId: string }> }
) {
    const user = await getCurrentUser();
    if (!user.user) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { classId, enrollmentId } = await params;

    const classData = await prisma.class.findUnique({
        where: { id: classId }
    });

    if (!classData) {
        return new Response("Class not found", { status: 404 });
    }

    if (classData.teacherId !== user.user.id && user.user.role !== "ADMIN") {
        return new Response("Forbidden", { status: 403 });
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !["PENDING", "APPROVED", "REJECTED"].includes(status)) {
        return new Response("Invalid status", { status: 400 });
    }

    const updatedEnrollment = await prisma.classEnrollment.update({
        where: { id: enrollmentId },
        data: { status },
        include: {
            student: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                }
            }
        }
    });

    return Response.json({ enrollment: updatedEnrollment });
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ classId: string; enrollmentId: string }> }
) {
    const user = await getCurrentUser();
    if (!user.user) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { classId, enrollmentId } = await params;

    const enrollment = await prisma.classEnrollment.findUnique({
        where: { id: enrollmentId },
        include: { class: true }
    });

    if (!enrollment) {
        return new Response("Enrollment not found", { status: 404 });
    }

    // Teachers can remove any student, students can only remove themselves
    if (
        enrollment.class.teacherId !== user.user.id &&
        enrollment.studentId !== user.user.id &&
        user.user.role !== "ADMIN"
    ) {
        return new Response("Forbidden", { status: 403 });
    }

    await prisma.classEnrollment.delete({
        where: { id: enrollmentId }
    });

    return Response.json({ success: true });
}
