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

    if (!title) {
        return new Response("Title is required", { status: 400 });
    }

    const resource = await prisma.classResource.create({
        data: {
            classId,
            title,
            description,
            url,
            fileUrl,
        }
    });

    return Response.json({ resource });
}
