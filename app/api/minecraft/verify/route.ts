import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key-change-in-production');
const MC_API_KEY = process.env.MC_API_KEY || 'change-this-secure-key';

// Minecraft sunucusundan gelen istekleri doğrula
function verifyMCRequest(req: NextRequest): boolean {
  const apiKey = req.headers.get('x-api-key');
  return apiKey === MC_API_KEY;
}

// Kullanıcı adından kredi bakiyesini getir
export async function POST(req: NextRequest) {
  if (!verifyMCRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { username } = await req.json();

    if (!username) {
      return NextResponse.json({ error: 'Username required' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { username: { equals: username, mode: 'insensitive' } },
      select: { id: true, username: true, credits: true, email: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        credits: user.credits,
        email: user.email
      }
    });
  } catch (error) {
    console.error('MC verify error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
