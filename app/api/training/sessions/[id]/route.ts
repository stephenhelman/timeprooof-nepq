import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const drill = await prisma.drillSession.findFirst({
      where: { id: params.id, userId: session.user.id },
      include: { transcript: { orderBy: { createdAt: "asc" } } },
    });

    if (!drill) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json(drill);
  } catch (err) {
    console.error("Get session error:", err);
    return NextResponse.json({ error: "Failed to fetch session" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Verify ownership
    const existing = await prisma.drillSession.findFirst({
      where: { id: params.id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const body = await req.json();
    const { message, debrief, status } = body;

    // Save a single message
    if (message) {
      await prisma.message.create({
        data: {
          sessionId: params.id,
          role: message.role,
          content: message.content,
          hint: message.hint,
          phase: message.phase,
        },
      });
    }

    // Complete session with debrief
    if (debrief || status) {
      await prisma.drillSession.update({
        where: { id: params.id },
        data: {
          ...(status === "COMPLETED" && {
            status: "COMPLETED",
            completedAt: new Date(),
          }),
          ...(status === "ABANDONED" && { status: "ABANDONED" }),
          ...(debrief && {
            overallScore: debrief.overallScore,
            criteriaJson: debrief.criteria,
            bestMoment: debrief.bestMoment,
            fixThis: debrief.fixThis,
            oneLiner: debrief.oneLiner,
          }),
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Patch session error:", err);
    return NextResponse.json({ error: "Failed to update session" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.drillSession.updateMany({
      where: { id: params.id, userId: session.user.id },
      data: { status: "ABANDONED" },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Delete session error:", err);
    return NextResponse.json({ error: "Failed to abandon session" }, { status: 500 });
  }
}
