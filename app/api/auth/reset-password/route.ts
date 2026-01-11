import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: 'Token ve yeni şifre gerekli' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Şifre en az 6 karakter olmalı' }, { status: 400 });
    }

    // Token'ı bul ve kontrol et
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!resetToken) {
      return NextResponse.json({ error: 'Geçersiz veya süresi dolmuş token' }, { status: 400 });
    }

    if (resetToken.used) {
      return NextResponse.json({ error: 'Bu token zaten kullanılmış' }, { status: 400 });
    }

    if (resetToken.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Token süresi dolmuş' }, { status: 400 });
    }

    // Şifreyi hashle ve güncelle
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await Promise.all([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword }
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true }
      })
    ]);

    return NextResponse.json({ 
      success: true, 
      message: 'Şifreniz başarıyla sıfırlandı. Şimdi giriş yapabilirsiniz.' 
    });

  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
