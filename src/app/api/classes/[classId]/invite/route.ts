import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { randomBytes } from "crypto";

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

    // Generate a unique invite token
    const inviteToken = randomBytes(16).toString('hex');

    const updatedClass = await prisma.class.update({
        where: { id: classId },
        data: { inviteToken }
    });

    return Response.json({
        inviteToken: updatedClass.inviteToken,
        inviteUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/classes/join/${updatedClass.inviteToken}`
    });
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

    // Remove the invite token
    await prisma.class.update({
        where: { id: classId },
        data: { inviteToken: null }
    });

    return Response.json({ success: true });
}
