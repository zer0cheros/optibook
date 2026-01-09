import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { User } from "../../generated/prisma/client";

export async function getCurrentUser() {
    const session = await auth.api.getSession({
        headers: await headers(),
    }) as { user: User } | null;
    if (!session) {
        return {user: '' as any};
    }
    return {user: session?.user};
}