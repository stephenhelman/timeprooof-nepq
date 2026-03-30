import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      drillType,
      trainingMode,
      objectionCore,
      objectionVariation,
      intensity,
      scenarioJson,
      phaseId,
      experienceLevel,
      scenarioHash,
    } = body;

    const drill = await prisma.drillSession.create({
      data: {
        userId: session.user.id,
        drillType: drillType === "objection" ? "OBJECTION" : "WALKTHROUGH",
        trainingMode: trainingMode === "nepq" ? "NEPQ" : "TIMEPROOF",
        objectionCore,
        objectionVariation,
        intensity,
        scenarioJson: scenarioJson ?? undefined,
        phaseId: phaseId ?? null,
        experienceLevel: experienceLevel ?? null,
        scenarioHash: scenarioHash ?? null,
      },
    });

    return NextResponse.json({ sessionId: drill.id });
  } catch (err) {
    console.error("Create session error:", err);
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") ?? "50");

    const sessions = await prisma.drillSession.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        drillType: true,
        trainingMode: true,
        status: true,
        objectionCore: true,
        objectionVariation: true,
        intensity: true,
        overallScore: true,
        oneLiner: true,
        phaseId: true,
        experienceLevel: true,
        scenarioHash: true,
        startedAt: true,
        completedAt: true,
      },
      orderBy: { startedAt: "desc" },
      take: limit,
    });

    return NextResponse.json(sessions);
  } catch (err) {
    console.error("List sessions error:", err);
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
  }
}
