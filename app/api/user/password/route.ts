import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";
import bcrypt from "bcryptjs";

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(6).max(100),
});

export async function PUT(req: NextRequest) {
    try {
          const user = await getCurrentUser();
          if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
          const body = await req.json();
          const { currentPassword, newPassword } = changePasswordSchema.parse(body);
          const dbUser = await db.user.findUnique({ where: { id: user.id } });
          if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });
          const isValid = await bcrypt.compare(currentPassword, dbUser.password);
          if (!isValid) return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
          const hashedPassword = await bcrypt.hash(newPassword, 12);
          await db.user.update({ where: { id: user.id }, data: { password: hashedPassword } });
          return NextResponse.json({ message: "Password changed successfully" });
    } catch (error) {
          if (error instanceof z.ZodError) {
                  return NextResponse.json({ error: error.errors }, { status: 400 });
          }
          return NextResponse.json({ error: "Failed to change password" }, { status: 500 });
    }
}
