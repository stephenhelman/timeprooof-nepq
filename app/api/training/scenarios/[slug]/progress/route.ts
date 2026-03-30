import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const { score } = await req.json();

  if (typeof score !== "number") {
    return NextResponse.json({ error: "score required" }, { status: 400 });
  }

  try {
    const preset = await prisma.presetScenario.findUnique({ where: { slug } });
    if (!preset) {
      return NextResponse.json({ error: "Scenario not found" }, { status: 404 });
    }

    const existing = await prisma.scenarioProgress.findUnique({
      where: { userId_scenarioId: { userId: session.user.id, scenarioId: preset.id } },
    });

    const prevScores = existing?.lastThreeScores ?? [];
    const newScores = [...prevScores, score].slice(-3);
    const rollingAverage = newScores.reduce((a, b) => a + b, 0) / newScores.length;
    const nowMastered = rollingAverage >= 80;
    const alreadyMastered = existing?.mastered ?? false;

    const updated = await prisma.scenarioProgress.upsert({
      where: { userId_scenarioId: { userId: session.user.id, scenarioId: preset.id } },
      update: {
        attempts: { increment: 1 },
        lastThreeScores: newScores,
        rollingAverage,
        mastered: nowMastered || alreadyMastered,
        masteredAt:
          nowMastered && !alreadyMastered ? new Date() : existing?.masteredAt ?? undefined,
      },
      create: {
        userId: session.user.id,
        scenarioId: preset.id,
        attempts: 1,
        lastThreeScores: newScores,
        rollingAverage,
        mastered: nowMastered,
        masteredAt: nowMastered ? new Date() : undefined,
      },
    });

    const unlocks = { tier2: false, tier3: false };

    if (nowMastered && !alreadyMastered) {
      // Re-fetch all progress including the just-updated record
      const allProgress = await prisma.scenarioProgress.findMany({
        where: { userId: session.user.id },
        select: { scenarioId: true, mastered: true },
      });
      const masteredIds = new Set(
        allProgress.filter((p) => p.mastered).map((p) => p.scenarioId)
      );

      const [tier1Presets, tier2Presets, user] = await Promise.all([
        prisma.presetScenario.findMany({ where: { tier: 1, active: true }, select: { id: true } }),
        prisma.presetScenario.findMany({ where: { tier: 2, active: true }, select: { id: true } }),
        prisma.user.findUnique({
          where: { id: session.user.id },
          select: { tier2Unlocked: true, tier3Unlocked: true },
        }),
      ]);

      const tier1AllMastered = tier1Presets.every((p) => masteredIds.has(p.id));
      const tier2AllMastered = tier2Presets.every((p) => masteredIds.has(p.id));

      const updates: Record<string, boolean> = {};
      if (tier1AllMastered && !user?.tier2Unlocked) {
        updates.tier2Unlocked = true;
        unlocks.tier2 = true;
      }
      if (tier2AllMastered && !user?.tier3Unlocked) {
        updates.tier3Unlocked = true;
        unlocks.tier3 = true;
      }
      if (Object.keys(updates).length > 0) {
        await prisma.user.update({ where: { id: session.user.id }, data: updates });
      }
    }

    return NextResponse.json({ progress: updated, unlocks });
  } catch (err) {
    console.error("Progress update error:", err);
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 });
  }
}
