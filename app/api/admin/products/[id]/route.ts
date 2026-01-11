import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminAuth, unauthorizedResponse } from '@/lib/admin-auth';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyAdminAuth();
  if (!auth.authenticated) return unauthorizedResponse();
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyAdminAuth();
  if (!auth.authenticated) return unauthorizedResponse();
  try {
    const { id } = await params;
    const body = await request.json();
    const priceInt = Number.parseInt(body.price, 10);
    if (!Number.isFinite(priceInt) || priceInt < 0) {
      return NextResponse.json({ error: 'Fiyat geçersiz (tam sayı girin)' }, { status: 400 });
    }
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: String(body.name),
        description: String(body.description),
        price: priceInt,
        tag: body.tag || 'POPÜLER',
        category: body.category || 'Credit',
        active: body.active ?? true,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.error('Product update error:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyAdminAuth();
  if (!auth.authenticated) return unauthorizedResponse();
  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
