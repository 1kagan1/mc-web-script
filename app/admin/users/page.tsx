import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "");

interface User {
  id: string;
  username: string;
  email: string;
  credits: number;
  createdAt: Date;
}

async function fetchUsers(): Promise<User[]> {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("admin-token")?.value;

    if (!adminToken) {
      throw new Error("Not authenticated");
    }

    const verified = await jwtVerify(adminToken, JWT_SECRET);
    const adminId = verified.payload.adminId as string;

    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      throw new Error("Admin not found");
    }

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

    return users;
  } catch (error) {
    console.error("Fetch users error:", error);
    throw error;
  }
}

import UsersClient from './UsersClient';

export default async function UsersPage() {
  let users: User[] = [];
  let error: string | null = null;

  try {
    users = await fetchUsers();
  } catch (err) {
    error = err instanceof Error ? err.message : "Unknown error";
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">Kullanıcı Yönetimi</h1>
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-300">
          Hata: {error}
        </div>
      </div>
    );
  }

  return <UsersClient initialUsers={users} />
}
