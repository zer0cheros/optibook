import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ classId: string; resourceId: string }> }
) {
    const user = await getCurrentUser();
    if (!user.user) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { classId, resourceId } = await params;

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
    const { title, description, url, fileUrl } = body;

    const resource = await prisma.classResource.update({
        where: { id: resourceId },
        data: {
            ...(title && { title }),
            ...(description !== undefined && { description }),
            ...(url !== undefined && { url }),
            ...(fileUrl !== undefined && { fileUrl }),
        }
    });

    return Response.json({ resource });
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ classId: string; resourceId: string }> }
) {
    const user = await getCurrentUser();
    if (!user.user) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { classId, resourceId } = await params;

    const classData = await prisma.class.findUnique({
        where: { id: classId }
    });

    if (!classData) {
        return new Response("Class not found", { status: 404 });
    }

    if (classData.teacherId !== user.user.id && user.user.role !== "ADMIN") {
        return new Response("Forbidden", { status: 403 });
    }

    await prisma.classResource.delete({
        where: { id: resourceId }
    });

    return Response.json({ success: true });
}
