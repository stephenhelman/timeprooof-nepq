import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import AdminUsersClient from "./AdminUsersClient";

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/training");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { drills: { where: { status: "COMPLETED" } } } },
      drills: {
        where: { status: "COMPLETED", overallScore: { not: null } },
        select: { overallScore: true },
      },
    },
  });

  const serialized = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    branch: u.branch,
    role: u.role as string,
    profileComplete: u.profileComplete,
    createdAt: u.createdAt.toISOString(),
    drillCount: u._count.drills,
    avgScore:
      u.drills.length > 0
        ? Math.round(
            u.drills.reduce((sum, d) => sum + (d.overallScore ?? 0), 0) /
              u.drills.length
          )
        : null,
  }));

  return (
    <AdminUsersClient
      users={serialized}
      currentUserId={session.user.id}
    />
  );
}
