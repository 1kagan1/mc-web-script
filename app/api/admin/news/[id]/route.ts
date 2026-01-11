import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminAuth, unauthorizedResponse } from '@/lib/admin-auth';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyAdminAuth();
  if (!auth.authenticated) return unauthorizedResponse();
  const { id } = await params;
  const news = await prisma.news.findUnique({ where: { id } });
  if (!news) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(news);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyAdminAuth();
  if (!auth.authenticated) return unauthorizedResponse();
  const { id } = await params;
  try {
    const body = await request.json();
    const news = await prisma.news.update({
      where: { id },
      data: {
        title: body.title,
        excerpt: body.excerpt,
        content: body.content,
        tag: body.tag,
        imageUrl: body.imageUrl ?? null,
      },
    });
    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update news' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyAdminAuth();
  if (!auth.authenticated) return unauthorizedResponse();
  const { id } = await params;
  try {
    await prisma.news.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete news' }, { status: 500 });
  }
}
