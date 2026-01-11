import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { sendWelcomeEmail } from '@/lib/email';
import { checkRateLimit } from '@/lib/rate-limit';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

function setUserCookie(response: NextResponse, token: string) {
  response.cookies.set('user-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting kontrolü
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimit = checkRateLimit(ip, '/api/auth/register');
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Çok fazla kayıt denemesi. Lütfen daha sonra tekrar deneyin.',
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
        }, 
        { status: 429 }
      );
    }

    const { email, password, username } = await request.json();

    if (!email || !password || !username) {
      return NextResponse.json({ error: 'E-posta, kullanıcı adı ve şifre gerekli' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Şifre en az 6 karakter olmalı' }, { status: 400 });
    }

    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existing) {
      return NextResponse.json({ error: 'Bu e-posta veya kullanıcı adı zaten kullanılıyor' }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashed,
      },
    });

    const token = await new SignJWT({ id: user.id, email: user.email, username: user.username, type: 'user' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(new TextEncoder().encode(JWT_SECRET));

    // Hoş geldiniz emaili gönder (async, hata durumunda devam et)
    sendWelcomeEmail(user.email, user.username).catch(err => 
      console.error('Welcome email failed:', err)
    );

    const response = NextResponse.json({ success: true, user: { id: user.id, email: user.email, username: user.username } });
    setUserCookie(response, token);
    return response;
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
