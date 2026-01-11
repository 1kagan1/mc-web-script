import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [settings, products, news] = await Promise.all([
      prisma.settings.findMany(),
      prisma.product.findMany({
        where: { active: true },
        orderBy: { createdAt: 'desc' },
        take: 6
      }),
      prisma.news.findMany({
        orderBy: { createdAt: 'desc' },
        take: 3
      })
    ]);

    const settingsObj = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json({
      settings: settingsObj,
      products,
      news
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
