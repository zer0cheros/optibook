import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getCurrentUser() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) {
        return {user: null};
    }
    return {user: session?.user};
}