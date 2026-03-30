import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TIMEPROOF_PHASES } from "@/lib/constants";

const PASS_THRESHOLD = 80;
const CONSECUTIVE_REQUIRED = 3;

// The 4 available TimeProof phases that must all be mastered for Path B scenario mastery
const REQUIRED_TP_PHASE_IDS = TIMEPROOF_PHASES.filter((p) => p.available).map((p) => p.id);

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const { score, phaseId, trainingMode = "timeproof" } = await req.json();

  if (typeof score !== "number") {
    return NextResponse.json({ error: "score required" }, { status: 400 });
  }

  const userId = session.user.id;
  const passed = score >= PASS_THRESHOLD;

  try {
    const preset = await prisma.presetScenario.findUnique({ where: { slug } });
    if (!preset) {
      return NextResponse.json({ error: "Scenario not found" }, { status: 404 });
    }

    const scenarioId = preset.id;
    let becameNewlyMastered = false;

    if (phaseId) {
      // ── Path B: Phase drill ───────────────────────────────────────────────
      const existing = await prisma.phaseProgress.findUnique({
        where: { userId_scenarioId_phaseId_trainingMode: { userId, scenarioId, phaseId, trainingMode } },
      });

      const prevConsecutive = existing?.consecutivePassCount ?? 0;
      const newConsecutive = passed ? prevConsecutive + 1 : 0;
      const prevScores = existing?.lastThreeScores ?? [];
      const newScores = [...prevScores, score].slice(-3);
      const alreadyMastered = existing?.mastered ?? false;
      const nowMastered = !alreadyMastered && newConsecutive >= CONSECUTIVE_REQUIRED;

      await prisma.phaseProgress.upsert({
        where: { userId_scenarioId_phaseId_trainingMode: { userId, scenarioId, phaseId, trainingMode } },
        update: {
          attempts: { increment: 1 },
          lastThreeScores: newScores,
          consecutivePassCount: newConsecutive,
          mastered: nowMastered || alreadyMastered,
          masteredAt: nowMastered ? new Date() : existing?.masteredAt ?? undefined,
        },
        create: {
          userId,
          scenarioId,
          phaseId,
          trainingMode,
          attempts: 1,
          lastThreeScores: newScores,
          consecutivePassCount: newConsecutive,
          mastered: nowMastered,
          masteredAt: nowMastered ? new Date() : undefined,
        },
      });

      // Check if all required phases are now mastered → scenario mastered via Path B
      if (nowMastered && trainingMode === "timeproof") {
        const masteredPhases = await prisma.phaseProgress.findMany({
          where: { userId, scenarioId, trainingMode: "timeproof", mastered: true },
          select: { phaseId: true },
        });
        const masteredPhaseIds = new Set(masteredPhases.map((p) => p.phaseId));
        const allPhasesMastered = REQUIRED_TP_PHASE_IDS.every((id) => masteredPhaseIds.has(id));

        if (allPhasesMastered) {
          const existingScenario = await prisma.scenarioProgress.findUnique({
            where: { userId_scenarioId: { userId, scenarioId } },
          });
          if (!existingScenario?.mastered) {
            await prisma.scenarioProgress.upsert({
              where: { userId_scenarioId: { userId, scenarioId } },
              update: { mastered: true, masteredAt: new Date() },
              create: {
                userId,
                scenarioId,
                attempts: 0,
                lastThreeScores: [],
                mastered: true,
                masteredAt: new Date(),
              },
            });
            becameNewlyMastered = true;
          }
        }
      }
    } else {
      // ── Path A: Full walkthrough ──────────────────────────────────────────
      const existing = await prisma.scenarioProgress.findUnique({
        where: { userId_scenarioId: { userId, scenarioId } },
      });

      const prevConsecutive = existing?.consecutivePassCount ?? 0;
      const newConsecutive = passed ? prevConsecutive + 1 : 0;
      const prevScores = existing?.lastThreeScores ?? [];
      const newScores = [...prevScores, score].slice(-3);
      const rollingAverage = newScores.reduce((a, b) => a + b, 0) / newScores.length;
      const alreadyMastered = existing?.mastered ?? false;
      const nowMastered = !alreadyMastered && newConsecutive >= CONSECUTIVE_REQUIRED;

      await prisma.scenarioProgress.upsert({
        where: { userId_scenarioId: { userId, scenarioId } },
        update: {
          attempts: { increment: 1 },
          lastThreeScores: newScores,
          rollingAverage,
          consecutivePassCount: newConsecutive,
          mastered: nowMastered || alreadyMastered,
          masteredAt: nowMastered ? new Date() : existing?.masteredAt ?? undefined,
        },
        create: {
          userId,
          scenarioId,
          attempts: 1,
          lastThreeScores: newScores,
          rollingAverage,
          consecutivePassCount: newConsecutive,
          mastered: nowMastered,
          masteredAt: nowMastered ? new Date() : undefined,
        },
      });

      if (nowMastered) becameNewlyMastered = true;
    }

    // ── Check tier unlocks and NEPQ unlock ────────────────────────────────
    const unlocks = { tier2: false, tier3: false, nepq: false };

    if (becameNewlyMastered) {
      const allProgress = await prisma.scenarioProgress.findMany({
        where: { userId },
        select: { scenarioId: true, mastered: true },
      });
      const masteredIds = new Set(allProgress.filter((p) => p.mastered).map((p) => p.scenarioId));

      const [tier1Presets, tier2Presets, allTpPresets, user] = await Promise.all([
        prisma.presetScenario.findMany({ where: { tier: 1, active: true }, select: { id: true } }),
        prisma.presetScenario.findMany({ where: { tier: 2, active: true }, select: { id: true } }),
        prisma.presetScenario.findMany({ where: { active: true }, select: { id: true } }),
        prisma.user.findUnique({
          where: { id: userId },
          select: { tier2Unlocked: true, tier3Unlocked: true, nepqUnlocked: true },
        }),
      ]);

      const tier1AllMastered = tier1Presets.every((p) => masteredIds.has(p.id));
      const tier2AllMastered = tier2Presets.every((p) => masteredIds.has(p.id));
      const allTpMastered = allTpPresets.every((p) => masteredIds.has(p.id));

      const updates: Record<string, boolean> = {};
      if (tier1AllMastered && !user?.tier2Unlocked) {
        updates.tier2Unlocked = true;
        unlocks.tier2 = true;
      }
      if (tier2AllMastered && !user?.tier3Unlocked) {
        updates.tier3Unlocked = true;
        unlocks.tier3 = true;
      }
      if (allTpMastered && !user?.nepqUnlocked) {
        updates.nepqUnlocked = true;
        unlocks.nepq = true;
      }
      if (Object.keys(updates).length > 0) {
        await prisma.user.update({ where: { id: userId }, data: updates });
      }
    }

    return NextResponse.json({ unlocks });
  } catch (err) {
    console.error("Progress update error:", err);
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 });
  }
}
