import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ inviteToken: string }> }
) {
    const { inviteToken } = await params;

    const classData = await prisma.class.findUnique({
        where: { inviteToken },
        include: {
            teacher: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            },
            _count: {
                select: {
                    enrollments: {
                        where: { status: "APPROVED" }
                    }
                }
            }
        }
    });

    if (!classData) {
        return new Response("Invalid or expired invite link", { status: 404 });
    }

    return Response.json({ class: classData });
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ inviteToken: string }> }
) {
    const user = await getCurrentUser();
    if (!user.user) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { inviteToken } = await params;

    const classData = await prisma.class.findUnique({
        where: { inviteToken }
    });

    if (!classData) {
        return new Response("Invalid or expired invite link", { status: 404 });
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.classEnrollment.findUnique({
        where: {
            classId_studentId: {
                classId: classData.id,
                studentId: user.user.id
            }
        }
    });

    if (existingEnrollment) {
        if (existingEnrollment.status === "APPROVED") {
            return Response.json({
                enrollment: existingEnrollment,
                message: "Already enrolled in this class"
            });
        }
        return Response.json({
            enrollment: existingEnrollment,
            message: "Enrollment request already pending"
        });
    }

    // Auto-approve enrollment when using invite link
    const enrollment = await prisma.classEnrollment.create({
        data: {
            classId: classData.id,
            studentId: user.user.id,
            status: "APPROVED"
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

    return Response.json({ enrollment, message: "Successfully joined class" });
}
