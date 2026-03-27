import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const type = url.searchParams.get("type") ?? "all";
    const mode = url.searchParams.get("mode") ?? "all";
    const period = url.searchParams.get("period") ?? "all";

    // Build date filter
    let dateFilter: Date | undefined;
    if (period === "week") {
      dateFilter = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === "month") {
      dateFilter = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    // Build where clause
    const where: Record<string, unknown> = { status: "COMPLETED" };
    if (type !== "all") where.drillType = type.toUpperCase();
    if (mode !== "all") where.trainingMode = mode.toUpperCase();
    if (dateFilter) where.completedAt = { gte: dateFilter };

    // Get all completed sessions with user info
    const sessions = await prisma.drillSession.findMany({
      where: where as Parameters<typeof prisma.drillSession.findMany>[0]["where"],
      select: {
        userId: true,
        overallScore: true,
        completedAt: true,
        user: { select: { name: true, branch: true } },
      },
    });

    // Aggregate by user
    const userMap = new Map<
      string,
      {
        userId: string;
        name: string | null;
        branch: string | null;
        scores: number[];
        lastDrillAt: Date;
      }
    >();

    for (const s of sessions) {
      if (s.overallScore == null) continue;
      const existing = userMap.get(s.userId);
      if (existing) {
        existing.scores.push(s.overallScore);
        if (s.completedAt && s.completedAt > existing.lastDrillAt) {
          existing.lastDrillAt = s.completedAt;
        }
      } else {
        userMap.set(s.userId, {
          userId: s.userId,
          name: s.user.name,
          branch: s.user.branch,
          scores: [s.overallScore],
          lastDrillAt: s.completedAt ?? new Date(),
        });
      }
    }

    // Filter to users with >= 3 drills and compute stats
    const leaderboard = Array.from(userMap.values())
      .filter((u) => u.scores.length >= 3)
      .map((u) => ({
        userId: u.userId,
        name: u.name ?? "Unknown",
        branch: u.branch,
        drillCount: u.scores.length,
        avgScore: Math.round(u.scores.reduce((a, b) => a + b, 0) / u.scores.length),
        bestScore: Math.max(...u.scores),
        lastDrillAt: u.lastDrillAt,
      }))
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 20);

    return NextResponse.json(leaderboard);
  } catch (err) {
    console.error("Leaderboard error:", err);
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}
