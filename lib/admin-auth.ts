import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { prisma } from './prisma';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key-change-in-production');

export async function verifyAdminAuth() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin-token')?.value;

    if (!token) {
      console.warn('Admin auth failed: no token');
      return { authenticated: false, adminId: null, error: 'No authentication token' };
    }

    const verified = await jwtVerify(token, JWT_SECRET);
    const adminId = verified.payload.adminId as string;

    if (!adminId) {
      console.warn('Admin auth failed: no adminId in token');
      return { authenticated: false, adminId: null, error: 'Invalid token payload' };
    }

    // Verify admin exists in database
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      console.warn(`Admin auth failed: admin ${adminId} not found in database`);
      return { authenticated: false, adminId: null, error: 'Admin not found' };
    }

    console.log(`Admin auth successful: ${adminId}`);
    return { authenticated: true, adminId, admin, error: null };
  } catch (error) {
    console.error('Admin auth error:', error);
    return { authenticated: false, adminId: null, error: 'Authentication failed' };
  }
}

export function unauthorizedResponse() {
  return NextResponse.json(
    { error: 'Unauthorized - Admin access required' },
    { status: 401 }
  );
}
