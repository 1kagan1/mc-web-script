import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function normalizeCategory(category: string) {
  const c = (category || '').toLowerCase();
  if (c === 'vip' || c === 'vip üyelikler' || c === 'vip uyelikler') return 'VIP Üyelikler';
  if (c === 'crate' || c === 'crates' || c === 'kutular' || c === 'kutu') return 'Kutular';
  if (c === 'kozmetik' || c === 'kozmetikler' || c === 'cosmetic') return 'Kozmetikler';
  // default credit-like categories
  if (c === 'currency' || c === 'credit' || c === 'credits') return 'Credit';
  return category || 'Credit';
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' }
    });

    const normalized = products.map((p) => ({
      ...p,
      category: normalizeCategory(p.category || ''),
      tag: p.tag || 'POPÜLER',
    }));

    return NextResponse.json(normalized);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
