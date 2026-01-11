import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import { sendOrderConfirmation } from '@/lib/email';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    // Rate limiting kontrolü
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const rateLimit = checkRateLimit(ip, '/api/market/purchase');
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Çok fazla satın alma denemesi. Lütfen biraz sonra tekrar deneyin.',
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
        }, 
        { status: 429 }
      );
    }

    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ error: 'Giriş yapmanız gerekiyor' }, { status: 401 });
    }

    const body = await req.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ error: 'Ürün ID zorunlu' }, { status: 400 });
    }

    // Get product
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product || !product.active) {
      return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 });
    }

    // Get user with credits
    const userRecord = await prisma.user.findUnique({
      where: { id: user.id }
    });

    if (!userRecord) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
    }

    // Check if user has enough credits
    if (userRecord.credits < product.price) {
      return NextResponse.json({ 
        error: 'Yetersiz kredi', 
        currentCredits: userRecord.credits,
        neededCredits: product.price,
        shortfall: product.price - userRecord.credits
      }, { status: 400 });
    }

    // Deduct credits and create transaction
    const newBalance = userRecord.credits - product.price;
    
    const [_, __, order] = await Promise.all([
      prisma.user.update({
        where: { id: user.id },
        data: { credits: newBalance }
      }),
      prisma.creditTransaction.create({
        data: {
          userId: user.id,
          amount: product.price,
          type: 'purchase',
          reason: `Ürün satın alımı: ${product.name}`,
          reference: productId,
          balance: newBalance
        }
      }),
      prisma.order.create({
        data: {
          userId: user.id,
          productId: productId,
          amount: product.price,
          paymentMethod: 'credits',
          status: 'pending' // Minecraft'ta teslim edilene kadar pending
        }
      })
    ]);

    // Sipariş onay emaili gönder (async, hata durumunda devam et)
    sendOrderConfirmation(
      userRecord.email,
      userRecord.username,
      product.name,
      1,
      order.id
    ).catch(err => console.error('Order email failed:', err));

    return NextResponse.json({
      success: true,
      message: 'Satın alma başarılı! Ürün Minecraft sunucusunda size teslim edilecektir.',
      newBalance: newBalance,
      product: product.name,
      orderId: order.id
    });
  } catch (error) {
    console.error('Purchase error:', error);
    return NextResponse.json({ error: 'Satın alma işlemi başarısız' }, { status: 500 });
  }
}
