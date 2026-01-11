import { SignJWT } from 'jose';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const secretBuffer = new TextEncoder().encode(JWT_SECRET);

function ensureSecret() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Admin setup endpoint must never run in production');
  }
  if (JWT_SECRET === 'your-secret-key-change-in-production') {
    console.warn('[dev-only] Using default JWT_SECRET; set a strong secret for real usage.');
  }
}

// ONLY AVAILABLE IN DEVELOPMENT
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'This endpoint is only available in development' },
      { status: 403 }
    );
  }

  try {
    ensureSecret();
    // Find the admin user (created by seed)
    const admin = await prisma.admin.findFirst();

    if (!admin) {
      return NextResponse.json(
        { error: 'No admin found. Run: npx prisma db seed' },
        { status: 404 }
      );
    }

    // Create a token
    const token = await new SignJWT({ adminId: admin.id, email: admin.email, type: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('30d')
      .sign(secretBuffer);

    // Create response and set cookie
    const response = NextResponse.json({
      success: true,
      message: 'Admin token generated',
      admin: { id: admin.id, email: admin.email, name: admin.name },
    });

    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: false, // Allow in dev
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error generating admin token:', error);
    return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 });
  }
}
