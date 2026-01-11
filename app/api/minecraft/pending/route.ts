import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const MC_API_KEY = process.env.MC_API_KEY || 'change-this-secure-key';

function verifyMCRequest(req: NextRequest): boolean {
  const apiKey = req.headers.get('x-api-key');
  return apiKey === MC_API_KEY;
}

// Bekleyen siparişleri getir (Minecraft'ta henüz teslim edilmemiş)
export async function GET(req: NextRequest) {
  if (!verifyMCRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const username = req.nextUrl.searchParams.get('username');

    const where: any = {
      status: 'pending'
    };

    if (username) {
      const user = await prisma.user.findFirst({
        where: { username: { equals: username, mode: 'insensitive' } }
      });
      if (user) {
        where.userId = user.id;
      }
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: { select: { username: true } },
        product: { select: { name: true, description: true, category: true } }
      },
      orderBy: { createdAt: 'asc' },
      take: 100
    });

    return NextResponse.json({
      success: true,
      count: orders.length,
      orders: orders.map(o => ({
        id: o.id,
        username: o.user.username,
        productName: o.product?.name || 'Unknown',
        productCategory: o.product?.category || 'Unknown',
        productDescription: o.product?.description || '',
        amount: o.amount,
        createdAt: o.createdAt
      }))
    });
  } catch (error) {
    console.error('MC pending error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
