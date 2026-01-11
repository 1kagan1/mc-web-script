import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('admin-token')?.value;

    if (!adminToken) {
      return NextResponse.json({ isAdmin: false });
    }

    try {
      await jwtVerify(adminToken, new TextEncoder().encode(JWT_SECRET));
      return NextResponse.json({ isAdmin: true });
    } catch {
      return NextResponse.json({ isAdmin: false });
    }
  } catch (error) {
    console.error('Admin check error:', error);
    return NextResponse.json({ isAdmin: false });
  }
}
