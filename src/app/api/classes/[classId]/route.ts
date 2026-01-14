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

    const classData = await prisma.class.findUnique({
        where: { id: classId },
        include: {
            teacher: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            },
            enrollments: {
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
            },
            resources: {
                orderBy: {
                    createdAt: "desc"
                }
            }
        }
    });

    if (!classData) {
        return new Response("Class not found", { status: 404 });
    }

    return Response.json({ class: classData });
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ classId: string }> }
) {
    const user = await getCurrentUser();
    if (!user.user) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { classId } = await params;

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
    const { name, description } = body;

    const updatedClass = await prisma.class.update({
        where: { id: classId },
        data: {
            ...(name && { name }),
            ...(description !== undefined && { description }),
        }
    });

    return Response.json({ class: updatedClass });
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ classId: string }> }
) {
    const user = await getCurrentUser();
    if (!user.user) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { classId } = await params;

    const classData = await prisma.class.findUnique({
        where: { id: classId }
    });

    if (!classData) {
        return new Response("Class not found", { status: 404 });
    }

    if (classData.teacherId !== user.user.id && user.user.role !== "ADMIN") {
        return new Response("Forbidden", { status: 403 });
    }

    await prisma.class.delete({
        where: { id: classId }
    });

    return Response.json({ success: true });
}
