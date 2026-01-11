import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  tag: string;
  createdAt: string;
};

function resolveBaseUrl() {
  const envUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.SITE_URL || process.env.VERCEL_URL;
  if (envUrl) {
    const hasProtocol = envUrl.startsWith('http://') || envUrl.startsWith('https://');
    return hasProtocol ? envUrl : `https://${envUrl}`;
  }
  return 'http://localhost:3000';
}

async function getNews(): Promise<NewsItem[]> {
  try {
    const baseUrl = resolveBaseUrl();
    const res = await fetch(`${baseUrl}/api/public/news`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default async function NewsPage() {
  const posts = await getNews();
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-line" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.12),transparent_30%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.05),transparent_25%)]" />

      <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-12 lg:px-8">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-zinc-400">Haberler</p>
          <h1 className="text-3xl font-semibold text-white">Güncellemeler ve duyurular</h1>
          <p className="text-sm text-zinc-400">Etkinlikler, yamalar ve önemli duyurular burada.</p>
        </div>

        <div className="mt-8 space-y-4">
          {posts.map((post) => (
            <article key={post.id} className="glass-panel overflow-hidden rounded-2xl border border-white/5">
              {post.imageUrl && (
                <div className="aspect-[16/6] w-full overflow-hidden">
                  <img src={post.imageUrl} alt={post.title} className="h-full w-full object-cover" />
                </div>
              )}
              <div className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400">
                <span className="pill bg-white/5 px-3 py-1">
                  {format(new Date(post.createdAt), 'dd.MM.yyyy', { locale: tr })}
                </span>
                <span className="pill bg-orange-500/10 px-3 py-1 text-orange-100">{post.tag}</span>
              </div>
              <h2 className="mt-3 text-xl font-semibold text-white">{post.title}</h2>
              <p className="text-sm text-zinc-400">{post.excerpt}</p>
              <div className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-orange-300 hover:text-orange-200">
                Devamı yakında
              </div>
              </div>
            </article>
          ))}

          {posts.length === 0 && (
            <div className="glass-panel rounded-2xl border border-white/5 p-5 text-center text-sm text-zinc-400">
              Henüz haber bulunmuyor
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
