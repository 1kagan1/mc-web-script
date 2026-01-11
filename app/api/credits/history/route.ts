import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('user-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 });
    }

    const verified = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    const userId = (verified.payload as any).id || (verified.payload as any).userId;

    if (!userId) {
      return NextResponse.json({ error: 'Geçersiz token' }, { status: 401 });
    }

    const transactions = await prisma.creditTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        amount: true,
        type: true,
        reason: true,
        balance: true,
        createdAt: true
      }
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Credit history error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
