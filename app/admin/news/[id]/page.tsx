import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import NewsForm from '../NewsForm';

interface PageProps {
  params: Promise<{ id?: string | string[] }>;
}

async function getNews(id: string) {
  const news = await prisma.news.findUnique({ where: { id } });
  if (!news) redirect('/admin/news');
  return news;
}

export default async function NewsEditPage({ params }: PageProps) {
  const p = await params;
  const id = Array.isArray(p.id) ? p.id[0] : p.id;
  if (!id) redirect('/admin/news');
  const news = await getNews(id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Haberi Düzenle</h1>
        <p className="text-zinc-400">{news.title}</p>
      </div>

      <NewsForm news={news} />
    </div>
  );
}
