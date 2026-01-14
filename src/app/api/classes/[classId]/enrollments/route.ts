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

    // Check if already enrolled
    const existingEnrollment = await prisma.classEnrollment.findUnique({
        where: {
            classId_studentId: {
                classId,
                studentId: user.user.id
            }
        }
    });

    if (existingEnrollment) {
        return new Response("Already enrolled or pending", { status: 400 });
    }

    const enrollment = await prisma.classEnrollment.create({
        data: {
            classId,
            studentId: user.user.id,
            status: "PENDING"
        },
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

    return Response.json({ enrollment });
}
