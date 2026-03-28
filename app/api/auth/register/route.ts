import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  branch: z.string().min(2),
  phone: z.string().optional(),
  inviteCode: z.string().min(1),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = RegisterSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid fields", fields: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, branch, phone, inviteCode, password } = result.data;

    if (inviteCode !== process.env.INVITE_CODE) {
      return NextResponse.json(
        { error: "Registration failed. Check your invite code and try again." },
        { status: 401 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        name,
        email,
        branch,
        phone: phone || null,
        passwordHash,
        role: "REP",
        profileComplete: true,
      },
    });

    return NextResponse.json(
      { success: true, message: "Account created. You can now log in." },
      { status: 201 }
    );
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
