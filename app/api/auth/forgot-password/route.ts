import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPasswordReset } from '@/lib/email';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email gerekli' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    // Güvenlik: Her zaman başarılı mesajı göster (email'in sistemde olup olmadığını gizle)
    if (!user) {
      return NextResponse.json({ 
        success: true, 
        message: 'Eğer bu email kayıtlıysa, şifre sıfırlama linki gönderildi.' 
      });
    }

    // Rastgele token oluştur
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 saat

    // Token'ı kaydet
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt
      }
    });

    // Email gönder
    await sendPasswordReset(user.email, user.username, token);

    return NextResponse.json({ 
      success: true, 
      message: 'Şifre sıfırlama linki email adresinize gönderildi.' 
    });

  } catch (error) {
    console.error('Password reset request error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
