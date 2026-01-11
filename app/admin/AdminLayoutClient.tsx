'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  const menuItems = useMemo(
    () => [
      { label: 'Dashboard', href: '/admin', icon: '📊', hint: 'Genel bakış' },
      { label: 'Ayarlar', href: '/admin/settings', icon: '⚙️', hint: 'Yapılandırma' },
      { label: 'Ürünler', href: '/admin/products', icon: '🛍️', hint: 'Market yönetimi' },
      { label: 'Haberler', href: '/admin/news', icon: '📰', hint: 'Duyurular' },
      { label: 'Siparişler', href: '/admin/orders', icon: '📦', hint: 'Satış akışı' },
      { label: 'Kullanıcılar', href: '/admin/users', icon: '👥', hint: 'Topluluk' },
      { label: 'Giriş Logları', href: '/admin/login-logs', icon: '🛡️', hint: 'Güvenlik' },
    ],
    []
  );

  const isActive = (href: string) => pathname?.startsWith(href);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#07080d] via-[#0a0c16] to-[#0d111f] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.12),transparent_35%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.06),transparent_30%)]" />
      </div>

      <div className="relative grid min-h-screen lg:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-[280px] transform border-r border-white/10 bg-black/70 backdrop-blur-xl transition-transform lg:relative lg:translate-x-0 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 text-lg font-bold text-black shadow-lg shadow-orange-500/30">
                Σ
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">Sofoglu | Admin</p>
                <h2 className="text-lg font-semibold text-white">Kontrol Merkezi</h2>
              </div>
            </div>

            {/* Menu */}
            <nav className="flex-1 space-y-1 px-4 py-4">
              {menuItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition ${
                      active
                        ? 'border border-orange-500/40 bg-orange-500/10 text-white shadow-[0_10px_30px_rgba(249,115,22,0.08)]'
                        : 'border border-transparent text-zinc-300 hover:border-white/10 hover:bg-white/5 hover:text-white'
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </span>
                    <span className="text-[11px] uppercase tracking-wide text-zinc-500 group-hover:text-zinc-300">
                      {item.hint}
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className="space-y-3 border-t border-white/10 p-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-zinc-300">
                <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.12em] text-zinc-400">
                  <span>Durum</span>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">Canlı</span>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span>API</span>
                    <span className="text-emerald-300">99.9%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>İşlem Süresi</span>
                    <span className="text-amber-300">120ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Güvenlik</span>
                    <span className="text-sky-300">2FA açık</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile overlay */}
        {menuOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/70 lg:hidden"
            onClick={() => setMenuOpen(false)}
          />
        )}

        {/* Main content */}
        <div className="relative flex min-h-screen flex-col">
          <header className="sticky top-0 z-30 border-b border-white/5 bg-black/60 backdrop-blur-xl">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="rounded-lg border border-white/10 p-2 text-white transition hover:border-white/30 lg:hidden"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-zinc-300 lg:flex">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Operasyon Paneli
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/10"
                >
                  Siteyi Aç
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-lg border border-orange-500/60 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-50 transition hover:border-orange-400 hover:bg-orange-500/20"
                >
                  Oturumu Kapat
                </button>
              </div>
            </div>
          </header>

          <main className="px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl space-y-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
