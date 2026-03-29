import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const CreateUserSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  email: z.string().email("Invalid email address."),
  role: z.enum(["REP", "MANAGER", "ADMIN"]).default("REP"),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const result = CreateUserSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid fields", fields: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, role } = result.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const defaultPassword = process.env.ADMIN_CREATED_PASSWORD ?? "TP@Welcome1";
    const passwordHash = await bcrypt.hash(defaultPassword, 12);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        role,
        passwordHash,
        profileComplete: true,
        isActive: true,
        mustChangePassword: true,
      },
    });

    return NextResponse.json(
      {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        branch: user.branch,
        role: user.role as string,
        isActive: user.isActive,
        mustChangePassword: user.mustChangePassword,
        profileComplete: user.profileComplete,
        createdAt: user.createdAt.toISOString(),
        drillCount: 0,
        avgScore: null,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Create user error:", err);
    return NextResponse.json({ error: "Failed to create user." }, { status: 500 });
  }
}
