import { jwtVerify } from 'jose';
import { NextRequest } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key-change-in-production');

export type VerifiedUser = {
  id: string;
  email?: string;
  username?: string;
};

// Basic user auth verifier for API routes that rely on the `user-token` cookie.
export async function verifyAuth(req: NextRequest): Promise<VerifiedUser | null> {
  try {
    const token = req.cookies.get('user-token')?.value;
    if (!token) return null;

    const verified = await jwtVerify(token, JWT_SECRET);
    const payload = verified.payload as Record<string, unknown>;
    const id = (payload.id || payload.userId) as string | undefined;

    if (!id) return null;

    return {
      id,
      email: payload.email as string | undefined,
      username: payload.username as string | undefined,
    };
  } catch (error) {
    console.error('User auth verify failed:', error);
    return null;
  }
}
