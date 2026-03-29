import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { validatePassword } from "@/lib/validatePassword";

const RegisterSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  email: z
    .string()
    .email("Invalid email address.")
    .refine(
      (v) => v.toLowerCase().endsWith("@timeproofusa.com"),
      "Must be a @timeproofusa.com work email."
    ),
  inviteCode: z.string().min(1, "Invite code is required."),
  password: z.string().refine((v) => validatePassword(v) === null, {
    message: "Password does not meet requirements.",
  }),
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

    const { firstName, lastName, email, inviteCode, password } = result.data;

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
        firstName,
        lastName,
        email,
        passwordHash,
        role: "REP",
        profileComplete: true,
        isActive: true,
        mustChangePassword: false,
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Registration failed." }, { status: 500 });
  }
}
