import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import AdminLoginForm from '@/components/AdminLoginForm';

async function getAdminData() {
  const [products, news, orders, users] = await Promise.all([
    prisma.product.count(),
    prisma.news.count(),
    prisma.order.count(),
    prisma.user.count(),
  ]);

  const recentProducts = await prisma.product.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' }
  });

  const recentNews = await prisma.news.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' }
  });

  return {
    stats: {
      products,
      news,
      orders,
      users
    },
    recentProducts,
    recentNews
  };
}

export default async function AdminPage() {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get('admin-token')?.value;
  const userToken = cookieStore.get('user-token')?.value;

  let isAdmin = false;

  if (adminToken) {
    try {
      await jwtVerify(adminToken, new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key-change-in-production'));
      isAdmin = true;
    } catch {
      isAdmin = false;
    }
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 text-center">
          <AdminLoginForm note={userToken ? 'Kullanıcı olarak giriş yaptınız. Admin yetkisi için admin bilgileriyle giriş yapın.' : undefined} />
        </div>
      </div>
    );
  }

  const data = await getAdminData();

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-white/5 via-orange-500/5 to-white/5 p-6 shadow-2xl shadow-orange-500/10">
        <div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_30%_30%,rgba(249,115,22,0.15),transparent_45%)]" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Kontrol Merkezi</p>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="max-w-2xl text-sm text-zinc-300">
              Operasyonların nabzını canlı izle, kritik bileşenleri kontrol altında tut ve tek yerden aksiyon al.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-zinc-300">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Canlı ortam
              </div>
              <p className="mt-1 text-[11px] text-zinc-400">Son kontrol: {new Date().toLocaleTimeString('tr-TR')}</p>
            </div>
            <a
              href="/admin/settings"
              className="rounded-xl border border-orange-500/40 bg-orange-500/10 px-4 py-3 text-sm font-semibold text-orange-50 transition hover:border-orange-300 hover:bg-orange-500/20"
            >
              Yapılandırmayı Aç
            </a>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl">
          <div className="absolute right-0 top-0 h-20 w-20 bg-orange-500/20 blur-3xl" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-zinc-400">Ürün Stoğu</p>
              <p className="text-3xl font-bold text-white">{data.stats.products}</p>
              <p className="text-xs text-emerald-300">Aktif market ürünleri</p>
            </div>
            <span className="rounded-full bg-orange-500/15 px-3 py-1 text-xs font-semibold text-orange-200">Stabil</span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl">
          <div className="absolute right-0 top-0 h-20 w-20 bg-sky-500/15 blur-3xl" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-zinc-400">Haber Yayını</p>
              <p className="text-3xl font-bold text-white">{data.stats.news}</p>
              <p className="text-xs text-sky-300">Güncel duyurular</p>
            </div>
            <span className="rounded-full bg-sky-500/15 px-3 py-1 text-xs font-semibold text-sky-100">Dinç</span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl">
          <div className="absolute right-0 top-0 h-20 w-20 bg-amber-500/15 blur-3xl" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-zinc-400">Siparişler</p>
              <p className="text-3xl font-bold text-white">{data.stats.orders}</p>
              <p className="text-xs text-amber-200">Tamamlanan toplam</p>
            </div>
            <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-100">Akışta</span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl">
          <div className="absolute right-0 top-0 h-20 w-20 bg-emerald-500/15 blur-3xl" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-zinc-400">Kullanıcılar</p>
              <p className="text-3xl font-bold text-white">{data.stats.users}</p>
              <p className="text-xs text-emerald-200">Topluluk büyüklüğü</p>
            </div>
            <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-100">Sağlam</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        {/* Recent Products */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-zinc-400">Ürün Akışı</p>
              <h2 className="text-xl font-semibold text-white">Son Eklenen Ürünler</h2>
            </div>
            <a href="/admin/products" className="text-sm font-semibold text-orange-300 transition hover:text-orange-200">
              Tümünü gör →
            </a>
          </div>
          <div className="space-y-3">
            {data.recentProducts.length > 0 ? (
              data.recentProducts.map((product) => (
                <div
                  key={product.id}
                  className="group flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-3 transition hover:border-orange-400/40 hover:bg-orange-500/5"
                >
                  <div>
                    <p className="font-semibold text-white">{product.name}</p>
                    <p className="text-xs text-zinc-400">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-orange-400">₺{product.price}</p>
                    <p className="text-xs text-zinc-500">{product.active ? 'Aktif' : 'Pasif'}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-zinc-500">Henüz ürün yok</p>
            )}
          </div>
        </div>

        {/* Recent News */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-zinc-400">Duyuru Kanalı</p>
              <h2 className="text-xl font-semibold text-white">Son Haberler</h2>
            </div>
            <a href="/admin/news" className="text-sm font-semibold text-orange-300 transition hover:text-orange-200">
              Tümünü gör →
            </a>
          </div>
          <div className="space-y-3">
            {data.recentNews.length > 0 ? (
              data.recentNews.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-white/10 bg-black/30 p-4 transition hover:border-orange-400/40 hover:bg-orange-500/5"
                >
                  <div className="mb-2 flex items-center gap-2 text-xs text-zinc-400">
                    <span className="rounded-full bg-orange-500/20 px-2 py-0.5 text-[11px] font-semibold text-orange-200">
                      {item.tag}
                    </span>
                    <span>{new Date(item.createdAt).toLocaleDateString('tr-TR')}</span>
                  </div>
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="text-sm text-zinc-400">{item.excerpt.substring(0, 90)}...</p>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-zinc-500">Henüz haber yok</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Hızlı İşlemler</h3>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-zinc-300">Kısa yol</span>
          </div>
          <div className="mt-4 grid gap-3">
            <a
              href="/admin/products"
              className="group flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-3 transition hover:border-orange-400/40 hover:bg-orange-500/5"
            >
              <div>
                <p className="text-sm font-semibold text-white">Ürün Ekle</p>
                <p className="text-xs text-zinc-400">Yeni market ürünü</p>
              </div>
              <span className="text-xl group-hover:scale-110 group-hover:text-orange-300">🛍️</span>
            </a>
            <a
              href="/admin/news"
              className="group flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-3 transition hover:border-orange-400/40 hover:bg-orange-500/5"
            >
              <div>
                <p className="text-sm font-semibold text-white">Haber Yayınla</p>
                <p className="text-xs text-zinc-400">Duyuru oluştur</p>
              </div>
              <span className="text-xl group-hover:scale-110 group-hover:text-orange-300">📰</span>
            </a>
            <a
              href="/admin/settings"
              className="group flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-3 transition hover:border-orange-400/40 hover:bg-orange-500/5"
            >
              <div>
                <p className="text-sm font-semibold text-white">Site Ayarları</p>
                <p className="text-xs text-zinc-400">Genel yapılandırma</p>
              </div>
              <span className="text-xl group-hover:scale-110 group-hover:text-orange-300">⚙️</span>
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Operasyon Sağlığı</h3>
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
          </div>
          <div className="mt-4 space-y-3 text-sm text-zinc-300">
            <div className="flex items-center justify-between">
              <span>Auth & Oturum</span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-semibold text-emerald-200">Stabil</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Ödeme & Kredi</span>
              <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[11px] font-semibold text-amber-100">İzleniyor</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Veritabanı</span>
              <span className="rounded-full bg-sky-500/20 px-2 py-0.5 text-[11px] font-semibold text-sky-100">Sağlıklı</span>
            </div>
            <p className="text-xs text-zinc-500">Durum göstergeleri hızlı sağlık kontrolü içindir.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Hareket Özeti</h3>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-zinc-300">Canlı</span>
          </div>
          <div className="mt-4 space-y-3 text-sm text-zinc-300">
            <div className="flex items-center justify-between">
              <span>Son ürün ekleme</span>
              <span className="text-zinc-200">{data.recentProducts[0]?.name ?? 'Bekleniyor'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Son haber</span>
              <span className="text-zinc-200">{data.recentNews[0]?.title ?? 'Bekleniyor'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Aktif kullanıcı sayısı</span>
              <span className="text-emerald-200">{data.stats.users}</span>
            </div>
            <p className="text-xs text-zinc-500">Kritik değişiklikleri yakından izlemek için hızlı özet.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
