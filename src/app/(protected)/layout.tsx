import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { FirstTimeClassPrompt } from "@/components/classes/first-time-class-prompt";
import { User } from "../../../generated/prisma/client";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers()
  }) as { user: User } | null;
  if (!session)
    return redirect("/login");
  return (
    <>
        {children}
        <FirstTimeClassPrompt user={session.user} />
    </>
  );
}