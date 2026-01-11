import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { sendCreditAdded } from '@/lib/email';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Admin giriş gerekli' }, { status: 401 });
    }

    try {
      await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    } catch {
      return NextResponse.json({ error: 'Geçersiz admin token' }, { status: 401 });
    }

    const { userId, amount, reason } = await request.json();

    if (!userId || !amount) {
      return NextResponse.json({ error: 'userId ve amount gerekli' }, { status: 400 });
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'amount 0\'dan büyük bir sayı olmalı' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
    }

    const newBalance = user.credits + amount;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { credits: newBalance }
    });

    // Log transaction
    await prisma.creditTransaction.create({
      data: {
        userId,
        amount,
        type: 'add',
        reason: reason || 'Admin tarafından eklendi',
        balance: newBalance,
        reference: `admin-add-${Date.now()}`
      }
    });

    // Kredi ekleme emaili gönder (async, hata durumunda devam et)
    sendCreditAdded(
      user.email,
      user.username,
      amount,
      newBalance,
      reason || 'Admin tarafından eklendi'
    ).catch(err => console.error('Credit email failed:', err));

    return NextResponse.json({
      success: true,
      userId,
      newBalance,
      message: `${amount} kredi eklendi`
    });
  } catch (error) {
    console.error('Admin add credit error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
