import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

// Simple in-memory rate limit with lockout per IP
type AttemptWindow = { attempts: number; first: number; blockedUntil?: number };
const attempts = new Map<string, AttemptWindow>();
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 5;
const BLOCK_MS = 5 * 60 * 1000; // 5 minutes

function getClientId(req: Request) {
  const xf = req.headers.get('x-forwarded-for');
  if (xf) return xf.split(',')[0].trim();
  return (req as any).ip || 'unknown';
}

function checkRateLimit(ip: string) {
  const now = Date.now();
  const entry = attempts.get(ip);

  if (entry?.blockedUntil && entry.blockedUntil > now) {
    return { blocked: true, retryAfter: entry.blockedUntil - now };
  }

  if (entry && now - entry.first > WINDOW_MS) {
    attempts.set(ip, { attempts: 0, first: now });
    return { blocked: false };
  }

  return { blocked: false };
}

function registerFailure(ip: string) {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry) {
    attempts.set(ip, { attempts: 1, first: now });
    return;
  }

  const withinWindow = now - entry.first <= WINDOW_MS;
  const attemptsCount = withinWindow ? entry.attempts + 1 : 1;
  const firstTs = withinWindow ? entry.first : now;

  const blockedUntil = attemptsCount >= MAX_ATTEMPTS ? now + BLOCK_MS : entry.blockedUntil;
  attempts.set(ip, { attempts: attemptsCount, first: firstTs, blockedUntil });
}

function resetAttempts(ip: string) {
  attempts.delete(ip);
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const secretBuffer = new TextEncoder().encode(JWT_SECRET);

function ensureSecret() {
  if (process.env.NODE_ENV === 'production' && JWT_SECRET === 'your-secret-key-change-in-production') {
    throw new Error('JWT_SECRET must be set securely in production');
  }
}

export async function POST(request: Request) {
  try {
    ensureSecret();

    const cookieStore = await cookies();
    const userToken = cookieStore.get('user-token');

    const ip = getClientId(request);
    const userAgent = request.headers.get('user-agent') || undefined;

    const rateStatus = checkRateLimit(ip);
    if (rateStatus.blocked) {
      return NextResponse.json({ error: 'Çok fazla deneme. Lütfen biraz bekleyin.' }, { status: 429 });
    }

    // Block admin login if a user session is active
    if (userToken) {
      await prisma.adminLoginLog.create({
        data: {
          emailAttempted: 'blocked-while-user-logged',
          success: false,
          ip,
          userAgent,
          reason: 'user-session-active',
        },
      });
      return NextResponse.json(
        { error: 'Önce kullanıcı oturumunu kapatın (çıkış yapın).' },
        { status: 403 }
      );
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      registerFailure(ip);
      await prisma.adminLoginLog.create({
        data: { emailAttempted: email || 'empty-email', success: false, ip, userAgent, reason: 'missing_credentials' },
      });
      return NextResponse.json({ error: 'Email ve şifre zorunlu' }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin) {
      registerFailure(ip);
      await prisma.adminLoginLog.create({ data: { emailAttempted: email, success: false, ip, userAgent, reason: 'not_found' } });
      return NextResponse.json({ error: 'Geçersiz kimlik bilgileri' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, admin.password);

    if (!isValid) {
      registerFailure(ip);
      await prisma.adminLoginLog.create({ data: { emailAttempted: email, success: false, ip, userAgent, reason: 'invalid_password' } });
      return NextResponse.json({ error: 'Geçersiz kimlik bilgileri' }, { status: 401 });
    }

    resetAttempts(ip);

    const token = await new SignJWT({ adminId: admin.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('30d')
      .sign(secretBuffer);

    const response = NextResponse.json({ success: true });
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    await prisma.adminLoginLog.create({
      data: { emailAttempted: email, success: true, ip, userAgent, reason: 'success' },
    });

    return response;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('❌ Admin login error:', errorMsg);
    console.error('Stack:', error instanceof Error ? error.stack : 'no stack');
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
