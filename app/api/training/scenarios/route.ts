import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [presets, progress, user] = await Promise.all([
      prisma.presetScenario.findMany({
        where: { active: true },
        orderBy: [{ tier: "asc" }, { orderInTier: "asc" }],
      }),
      prisma.scenarioProgress.findMany({
        where: { userId: session.user.id },
      }),
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { tier2Unlocked: true, tier3Unlocked: true },
      }),
    ]);

    const progressByScenarioId = Object.fromEntries(
      progress.map((p) => [p.scenarioId, p])
    );

    // Determine unlock state
    const tier1Scenarios = presets.filter((p) => p.tier === 1);
    const tier2Scenarios = presets.filter((p) => p.tier === 2);

    const tier1AllMastered = tier1Scenarios.every((p) => {
      const prog = progressByScenarioId[p.id];
      return prog?.mastered === true;
    });
    const tier2AllMastered = tier2Scenarios.every((p) => {
      const prog = progressByScenarioId[p.id];
      return prog?.mastered === true;
    });

    const tier2Unlocked = user?.tier2Unlocked || tier1AllMastered;
    const tier3Unlocked = user?.tier3Unlocked || tier2AllMastered;

    const result = presets.map((preset) => {
      const prog = progressByScenarioId[preset.id] ?? null;
      const unlocked =
        preset.tier === 1 ||
        (preset.tier === 2 && tier2Unlocked) ||
        (preset.tier === 3 && tier3Unlocked);

      return {
        id: preset.id,
        slug: preset.slug,
        tier: preset.tier,
        orderInTier: preset.orderInTier,
        title: preset.title,
        subtitle: preset.subtitle,
        description: preset.description,
        challenge: preset.challenge,
        scenarioJson: preset.scenarioJson,
        unlocked,
        progress: prog
          ? {
              attempts: prog.attempts,
              lastThreeScores: prog.lastThreeScores,
              rollingAverage: prog.rollingAverage,
              mastered: prog.mastered,
              masteredAt: prog.masteredAt,
            }
          : null,
      };
    });

    return NextResponse.json({ scenarios: result, tier2Unlocked, tier3Unlocked });
  } catch (err) {
    console.error("Scenarios fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch scenarios" }, { status: 500 });
  }
}
