import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

type HomeData = {
  settings: Record<string, string>;
  products: {
    id: string;
    name: string;
    description: string;
    price: number;
    tag: string;
    category: string;
    active: boolean;
  }[];
  news: {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    tag: string;
    createdAt: string;
    imageUrl?: string | null;
  }[];
};

function resolveBaseUrl() {
  const envUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.SITE_URL || process.env.VERCEL_URL;
  if (envUrl) {
    const hasProtocol = envUrl.startsWith('http://') || envUrl.startsWith('https://');
    return hasProtocol ? envUrl : `https://${envUrl}`;
  }
  return 'http://localhost:3000';
}

async function getHomeData(): Promise<HomeData> {
  try {
    const baseUrl = resolveBaseUrl();
    const res = await fetch(`${baseUrl}/api/public/home`, { cache: 'no-store' });

    if (!res.ok) {
      return { settings: {}, products: [], news: [] };
    }

    return res.json();
  } catch (error) {
    console.error('Failed to load home data', error);
    return { settings: {}, products: [], news: [] };
  }
}

export default async function Home() {
  const data = await getHomeData();
  const s = data.settings || {};

  const serverIp = s.server_ip || 'play.sunucu.com';
  const onlinePlayers = s.online_players || '0';
  const serverStatus = s.server_status || 'AKTİF';
  const heroTitle = s.hero_title || 'Eğlence Dünyasına Hoş Geldin!';
  const heroDescription = s.hero_description || 'VIP, Market ve daha fazlası - Güvenli ödeme, anında teslimat';
  const logoUrl = s.logo_url || '/logo.png';
  const siteName = s.site_name || 'SkyBlock';
  const siteSubtitle = s.site_subtitle || 'KALİTELİ SUNUCU';

  const purchaseSteps = [
    { step: 1, title: 'Kayıt Ol', description: 'Hesabını oluştur veya giriş yap' },
    { step: 2, title: 'Ürün Seç', description: "Market'ten VIP ya da item seçin" },
    { step: 3, title: 'Ödeme Yap', description: 'iyzico ile güvenli ödeme' },
    { step: 4, title: 'Anında Teslim', description: 'Otomatik komut, bekleme yok' },
  ];

  return (
    <div className="relative overflow-hidden bg-black">
      <div className="pointer-events-none absolute inset-0 grid-line" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.12),transparent_30%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.05),transparent_25%)]" />

      <section className="relative flex min-h-screen flex-col items-center justify-center px-4 pt-20">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-6 flex justify-center">
            <img
              src={logoUrl}
              alt="Logo"
              className="h-48 w-48 sm:h-56 sm:w-56 lg:h-64 lg:w-64"
            />
          </div>

          <h1 className="mb-2 text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl lg:text-6xl">
            {heroTitle}
          </h1>
          <p className="mb-1 text-lg font-semibold text-orange-400 sm:text-xl">{siteName}</p>
          <p className="mb-6 text-sm uppercase tracking-[0.2em] text-orange-400">{siteSubtitle}</p>

          <p className="mb-8 text-lg text-zinc-300 sm:text-xl">{heroDescription}</p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="/market"
              className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-4 text-lg font-bold uppercase text-black shadow-xl shadow-orange-500/30 transition-all hover:shadow-orange-500/50"
            >
              <span className="relative z-10">Markete Git</span>
              <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </a>
            <a
              href="/auth/login"
              className="rounded-xl border-2 border-white/20 px-8 py-4 text-lg font-bold uppercase text-white transition-all hover:border-orange-500 hover:bg-orange-500/10"
            >
              Giriş Yap
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 backdrop-blur-sm">
              <p className="text-xs text-zinc-400">SUNUCU IP</p>
              <p className="font-bold text-white">{serverIp}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 backdrop-blur-sm">
              <p className="text-xs text-zinc-400">ONLİNE OYUNCU</p>
              <p className="font-bold text-orange-400">{onlinePlayers}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 backdrop-blur-sm">
              <p className="text-xs text-zinc-400">SUNUCU DURUMU</p>
              <p className="font-bold text-green-400">{serverStatus}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-20 lg:px-6">
        <div className="mb-20">
          <div className="mb-8">
            <h2 className="text-3xl font-bold uppercase text-white">Son Haberler</h2>
            <div className="mt-2 h-1 w-20 bg-gradient-to-r from-orange-500 to-orange-600" />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.news.map((post) => (
              <article
                key={post.id}
                className="group overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent transition-all hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10"
              >
                <div className="aspect-video w-full overflow-hidden">
                  {post.imageUrl ? (
                    <img src={post.imageUrl} alt={post.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-orange-500/20 to-purple-500/20" />
                  )}
                </div>
                <div className="p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs font-semibold uppercase text-orange-300">
                      {post.tag}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {format(new Date(post.createdAt), 'dd.MM.yyyy', { locale: tr })}
                    </span>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-white group-hover:text-orange-400">{post.title}</h3>
                  <p className="mb-4 text-sm text-zinc-400">{post.excerpt}</p>
                  <a
                    href="/news"
                    className="inline-flex items-center text-sm font-semibold text-orange-400 transition hover:text-orange-300"
                  >
                    Devamını oku →
                  </a>
                </div>
              </article>
            ))}

            {data.news.length === 0 && (
              <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center text-sm text-zinc-400">
                Henüz haber yok
              </div>
            )}
          </div>
        </div>

        <div className="mb-20">
          <div className="mb-8">
            <h2 className="text-3xl font-bold uppercase text-white">Popüler Ürünler</h2>
            <div className="mt-2 h-1 w-20 bg-gradient-to-r from-orange-500 to-orange-600" />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {data.products.map((product) => (
              <div
                key={product.id}
                className="group overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-6 transition-all hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10"
              >
                <div className="mb-4 flex items-start justify-between">
                  <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs font-semibold uppercase text-orange-300">
                    {product.tag || 'POPÜLER'}
                  </span>
                  <span className="text-xs text-zinc-500">iyzico</span>
                </div>

                <h3 className="mb-2 text-2xl font-bold text-white">{product.name}</h3>

                <p className="mb-4 text-sm text-zinc-400">{product.description}</p>

                <div className="mb-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-orange-400">₺{product.price}</span>
                </div>

                <button className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 py-3 font-bold uppercase text-black transition hover:from-orange-600 hover:to-orange-700">
                  Satın Al
                </button>
              </div>
            ))}

            {data.products.length === 0 && (
              <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center text-sm text-zinc-400">
                Henüz ürün yok
              </div>
            )}
          </div>

          <div className="mt-8 text-center">
            <a
              href="/market"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 font-semibold text-white transition hover:border-orange-500 hover:bg-orange-500/10"
            >
              Tüm Ürünleri Gör →
            </a>
          </div>
        </div>

        <div className="mb-20">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-8 lg:p-12">
            <h2 className="mb-4 text-3xl font-bold uppercase text-white">Sunucumuz Hakkında</h2>
            <div className="mb-6 h-1 w-20 bg-gradient-to-r from-orange-500 to-orange-600" />
            <p className="mb-6 text-lg leading-relaxed text-zinc-300">
              2026'da oyuncularla buluşan sunucumuz, blok tabanlı bir sandbox evreninde rekabet, strateji ve yaratıcılığı buluşturan çevrim içi çok oyunculu bir deneyim sunar.
              Farklı oyun modlarıyla ister bireysel becerilerini sınayabilir, ister takım arkadaşlarınla birlikte arenalara hükmedebilirsin.
            </p>
            <p className="text-lg leading-relaxed text-zinc-300">
              Sürekli güncellenen yapımız ve aktif topluluğumuzla, her seviyeden oyuncuya dinamik ve sürükleyici bir deneyim sunuyoruz.
            </p>
            <div className="mt-8">
              <a
                href="/market"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 font-bold uppercase text-black transition hover:from-orange-600 hover:to-orange-700"
              >
                Hemen Başla
              </a>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-8">
            <h2 className="text-3xl font-bold uppercase text-white">Nasıl Çalışır?</h2>
            <div className="mt-2 h-1 w-20 bg-gradient-to-r from-orange-500 to-orange-600" />
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            {purchaseSteps.map((item) => (
              <div
                key={item.step}
                className="rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-6 text-center"
              >
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-2xl font-bold text-black">
                    {item.step}
                  </div>
                </div>
                <h3 className="mb-2 font-bold uppercase text-white">{item.title}</h3>
                <p className="text-sm text-zinc-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
