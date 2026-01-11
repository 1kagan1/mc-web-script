import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const MC_API_KEY = process.env.MC_API_KEY || 'change-this-secure-key';

function verifyMCRequest(req: NextRequest): boolean {
  const apiKey = req.headers.get('x-api-key');
  return apiKey === MC_API_KEY;
}

// Satın alınan ürünleri Minecraft'ta teslim et
export async function POST(req: NextRequest) {
  if (!verifyMCRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { orderId, executed } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }

    // Siparişi bul
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: { select: { username: true } },
        product: { select: { name: true, description: true } }
      }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Sipariş durumunu güncelle
    if (executed !== undefined) {
      await prisma.order.update({
        where: { id: orderId },
        data: { 
          status: executed ? 'completed' : 'failed',
        }
      });
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        username: order.user.username,
        productName: order.product?.name || 'Unknown',
        amount: order.amount,
        status: order.status
      }
    });
  } catch (error) {
    console.error('MC execute error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
