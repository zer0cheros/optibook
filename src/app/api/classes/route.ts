import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const user = await getCurrentUser();
    if (!user.user) {
        return new Response("Unauthorized", { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const includeAll = searchParams.get("includeAll");

    if (includeAll === "true") {
        // Return all classes for students to request enrollment
        const classes = await prisma.class.findMany({
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
            },
            orderBy: {
                name: "asc"
            }
        });
        return Response.json({ classes });
    }

    // Return classes based on user role
    if (user.user.role === "TEACHER" || user.user.role === "ADMIN") {
        const classes = await prisma.class.findMany({
            where: { teacherId: user.user.id },
            include: {
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
                    },
                    orderBy: {
                        createdAt: "desc"
                    }
                },
                resources: {
                    orderBy: {
                        createdAt: "desc"
                    }
                },
                _count: {
                    select: {
                        enrollments: true,
                        resources: true
                    }
                }
            },
        });
        return Response.json({ classes });
    } else {
        // For students, return their enrolled classes
        const enrollments = await prisma.classEnrollment.findMany({
            where: {
                studentId: user.user.id,
                status: "APPROVED"
            },
            include: {
                class: {
                    include: {
                        teacher: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            }
                        },
                        resources: {
                            orderBy: {
                                createdAt: "desc"
                            }
                        }
                    }
                }
            }
        });
        return Response.json({ classes: enrollments.map(e => e.class) });
    }
}

export async function POST(request: NextRequest) {
    const user = await getCurrentUser();
    if (!user.user) {
        return new Response("Unauthorized", { status: 401 });
    }

    if (user.user.role !== "TEACHER" && user.user.role !== "ADMIN") {
        return new Response("Forbidden", { status: 403 });
    }

    const body = await request.json();
    const { name, description } = body;

    if (!name) {
        return new Response("Name is required", { status: 400 });
    }

    const newClass = await prisma.class.create({
        data: {
            name,
            description,
            teacherId: user.user.id,
        },
    });

    return Response.json({ class: newClass });
}
