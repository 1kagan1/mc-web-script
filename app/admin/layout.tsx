import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import AdminLayoutClient from './AdminLayoutClient';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin-token')?.value;
  
  let isAuthenticated = false;
  let adminId: string | null = null;

  if (token) {
    try {
      const verified = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
      isAuthenticated = true;
      adminId = verified.payload.adminId as string;
    } catch (error) {
      console.error('Admin layout JWT verification failed:', error);
      isAuthenticated = false;
    }
  }

  // If not authenticated, let the page render (login form lives in /admin)
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  // If authenticated, show full admin layout
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
