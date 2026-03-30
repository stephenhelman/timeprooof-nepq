import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TIMEPROOF_PHASES } from "@/lib/constants";

const REQUIRED_TP_PHASE_IDS = TIMEPROOF_PHASES.filter((p) => p.available).map((p) => p.id);

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const [presets, progress, phaseProgress, user] = await Promise.all([
      prisma.presetScenario.findMany({
        where: { active: true },
        orderBy: [{ tier: "asc" }, { orderInTier: "asc" }],
      }),
      prisma.scenarioProgress.findMany({ where: { userId } }),
      prisma.phaseProgress.findMany({ where: { userId, trainingMode: "timeproof" } }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { tier2Unlocked: true, tier3Unlocked: true, nepqUnlocked: true },
      }),
    ]);

    const progressByScenarioId = Object.fromEntries(progress.map((p) => [p.scenarioId, p]));

    // Group phase progress by scenarioId
    const phaseProgressByScenarioId: Record<string, typeof phaseProgress> = {};
    for (const pp of phaseProgress) {
      if (!phaseProgressByScenarioId[pp.scenarioId]) {
        phaseProgressByScenarioId[pp.scenarioId] = [];
      }
      phaseProgressByScenarioId[pp.scenarioId].push(pp);
    }

    // Determine unlock state
    const tier1Scenarios = presets.filter((p) => p.tier === 1);
    const tier2Scenarios = presets.filter((p) => p.tier === 2);

    const tier1AllMastered = tier1Scenarios.every((p) => progressByScenarioId[p.id]?.mastered === true);
    const tier2AllMastered = tier2Scenarios.every((p) => progressByScenarioId[p.id]?.mastered === true);

    const tier2Unlocked = user?.tier2Unlocked || tier1AllMastered;
    const tier3Unlocked = user?.tier3Unlocked || tier2AllMastered;
    const nepqUnlocked = user?.nepqUnlocked ?? false;

    const result = presets.map((preset) => {
      const prog = progressByScenarioId[preset.id] ?? null;
      const phaseProg = phaseProgressByScenarioId[preset.id] ?? [];
      const unlocked =
        preset.tier === 1 ||
        (preset.tier === 2 && tier2Unlocked) ||
        (preset.tier === 3 && tier3Unlocked);

      // Per-phase mastery for this scenario
      const masteredPhaseIds = phaseProg.filter((pp) => pp.mastered).map((pp) => pp.phaseId);

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
              consecutivePassCount: prog.consecutivePassCount,
              mastered: prog.mastered,
              masteredAt: prog.masteredAt,
            }
          : null,
        phaseProgress: REQUIRED_TP_PHASE_IDS.map((phaseId) => {
          const pp = phaseProg.find((p) => p.phaseId === phaseId);
          return {
            phaseId,
            attempts: pp?.attempts ?? 0,
            consecutivePassCount: pp?.consecutivePassCount ?? 0,
            mastered: pp?.mastered ?? false,
          };
        }),
        masteredPhaseIds,
      };
    });

    return NextResponse.json({ scenarios: result, tier2Unlocked, tier3Unlocked, nepqUnlocked });
  } catch (err) {
    console.error("Scenarios fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch scenarios" }, { status: 500 });
  }
}
