import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminAuth, unauthorizedResponse } from '@/lib/admin-auth';

export async function GET() {
  const auth = await verifyAdminAuth();
  if (!auth.authenticated) {
    return unauthorizedResponse();
  }

  try {
    const news = await prisma.news.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await verifyAdminAuth();
  if (!auth.authenticated) {
    return unauthorizedResponse();
  }

  try {
    const body = await request.json();
    
    const news = await prisma.news.create({
      data: {
        title: body.title,
        excerpt: body.excerpt,
        content: body.content,
        tag: body.tag,
        imageUrl: body.imageUrl ?? null,
      }
    });

    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create news' }, { status: 500 });
  }
}
