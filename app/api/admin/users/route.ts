import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "");

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("admin-token")?.value;

    if (!adminToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Verify admin token
    const verified = await jwtVerify(adminToken, JWT_SECRET);
    const adminId = verified.payload.adminId as string;

    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    // Fetch all users with essential fields
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        credits: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Fetch users error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
