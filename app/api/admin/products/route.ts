import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminAuth, unauthorizedResponse } from '@/lib/admin-auth';

export async function GET() {
  const auth = await verifyAdminAuth();
  if (!auth.authenticated) {
    return unauthorizedResponse();
  }

  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await verifyAdminAuth();
  if (!auth.authenticated) {
    return unauthorizedResponse();
  }

  try {
    const body = await request.json();

    const priceInt = Number.parseInt(body.price, 10);
    if (!Number.isFinite(priceInt) || priceInt < 0) {
      return NextResponse.json({ error: 'Fiyat geçersiz (tam sayı girin)' }, { status: 400 });
    }

    if (!body.name || !body.description) {
      return NextResponse.json({ error: 'İsim ve açıklama zorunlu' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name: String(body.name),
        description: String(body.description),
        price: priceInt,
        tag: body.tag || 'POPÜLER',
        category: body.category || 'Credit',
        active: body.active ?? true,
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Product create error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
