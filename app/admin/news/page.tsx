import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import DeleteButton from './DeleteButton';

async function getNews() {
  return await prisma.news.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export default async function NewsPage() {
  const news = await getNews();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Haberler</h1>
          <p className="text-zinc-400">Site haberlerini ve duyurularını yönetin</p>
        </div>
        <Link
          href="/admin/news/new"
          className="rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-2 font-medium text-white transition hover:from-orange-600 hover:to-orange-700"
        >
          + Yeni Haber
        </Link>
      </div>

      <div className="grid gap-4">
        {news.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-6 transition hover:border-orange-500/30"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs font-medium text-orange-300">
                    {item.tag}
                  </span>
                  <span className="text-sm text-zinc-500">
                    {new Date(item.createdAt).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">{item.title}</h3>
                <p className="mb-3 text-zinc-400">{item.excerpt}</p>
                <p className="text-sm text-zinc-500">{item.content.substring(0, 150)}...</p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/admin/news/${item.id}`}
                  className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/5"
                >
                  Düzenle
                </Link>
                <DeleteButton id={item.id} />
              </div>
            </div>
          </div>
        ))}

        {news.length === 0 && (
          <div className="rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent py-12 text-center text-zinc-500">
            Henüz haber eklenmemiş
          </div>
        )}
      </div>
    </div>
  );
}
