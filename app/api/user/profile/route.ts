import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const ProfileSchema = z.object({
  name: z.string().min(2),
  branch: z.string().min(2),
  phone: z.string().optional(),
});

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const result = ProfileSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid fields", fields: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, branch, phone } = result.data;

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        branch,
        phone: phone || null,
        profileComplete: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Profile update error:", err);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
