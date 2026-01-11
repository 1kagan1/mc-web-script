'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  tag: string;
  category: string;
  active: boolean;
};

interface UserCredits {
  credits: number;
}

const CATEGORIES: { key: string; title: string; hint: string; icon: string }[] = [
  { key: 'Credit', title: 'Credit', hint: 'Kredi paketleri ve yükleme', icon: '💰' },
  { key: 'VIP Üyelikler', title: 'VIP Üyelikler', hint: 'Özel ayrıcalık ve rütbeler', icon: '👑' },
  { key: 'Kozmetikler', title: 'Kozmetikler', hint: 'Görsel stiller ve efektler', icon: '✨' },
  { key: 'Kutular', title: 'Kutular', hint: 'Şans kutuları ve sandıklar', icon: '🎁' },
];

export default function MarketClient({ products }: { products: Product[] }) {
  const [user, setUser] = useState<{ id: string; username: string } | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [category, setCategory] = useState<string>('all');
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
          
          // Fetch credits
          const creditsRes = await fetch('/api/credits/balance');
          if (creditsRes.ok) {
            const creditsData: UserCredits = await creditsRes.json();
            setCredits(creditsData.credits);
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  const handlePurchase = async (productId: string, productName: string, price: number) => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (credits < price) {
      setMessage({
        type: 'error',
        text: `Yetersiz kredi! Fiyat: ₺${price}, Sahip olduğunuz: ₺${credits}`
      });
      setTimeout(() => setMessage(null), 5000);
      return;
    }

    try {
      setPurchasingId(productId);
      const res = await fetch('/api/market/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({
          type: 'error',
          text: data.error || 'Satın alma başarısız'
        });
      } else {
        setCredits(data.newBalance);
        setMessage({
          type: 'success',
          text: `${productName} başarıyla satın alındı! Yeni bakiye: ₺${data.newBalance}`
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'İşlem sırasında hata oluştu'
      });
    } finally {
      setPurchasingId(null);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const filteredProducts = useMemo(() => {
    if (category === 'all') return products;
    return products.filter((p) => p.category === category);
  }, [category, products]);

  const renderCard = (p: Product) => {
    const perks = p.description.split(/[,•\n]/).map((s) => s.trim()).filter(Boolean).slice(0, 4);
    const canAfford = user && credits >= p.price;
    return (
      <div
        key={p.id}
        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-transparent p-6 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-orange-400/40 hover:shadow-[0_20px_60px_rgba(249,115,22,0.15)]"
      >
        <div className="absolute right-0 top-0 h-32 w-32 bg-orange-500/10 blur-3xl transition-opacity group-hover:opacity-100 opacity-0" />
        <div className="relative space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-orange-500/20 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-orange-200">
                  {p.tag || 'Popüler'}
                </span>
                {canAfford && (
                  <span className="rounded-lg bg-emerald-500/20 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-200">
                    Uygun
                  </span>
                )}
              </div>
              <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-zinc-400">{p.category}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-bold text-white">{p.name}</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-orange-400">₺{p.price}</span>
              <span className="text-sm text-zinc-500">kredi</span>
            </div>
          </div>

          {perks.length > 0 && (
            <ul className="space-y-2 border-t border-white/10 pt-4">
              {perks.map((perk, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-orange-400" />
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="flex items-center gap-3 border-t border-white/10 pt-4">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Anında teslimat
            </div>
            <button
              onClick={() => handlePurchase(p.id, p.name, p.price)}
              disabled={purchasingId === p.id || !user}
              className={`ml-auto rounded-xl px-6 py-2.5 text-sm font-semibold shadow-lg transition-all ${
                purchasingId === p.id
                  ? 'bg-zinc-700 text-zinc-300 shadow-zinc-900/50'
                  : canAfford
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-black shadow-orange-500/30 hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-500/50'
                  : 'cursor-not-allowed bg-red-900/30 text-red-300 shadow-red-900/20'
              }`}
            >
              {purchasingId === p.id ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  İşleniyor
                </span>
              ) : canAfford ? (
                'Satın Al'
              ) : (
                'Yetersiz Kredi'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-line" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.12),transparent_30%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.05),transparent_25%)]" />

      <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-12 lg:px-10">
        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-zinc-500">
              <span className="h-1 w-1 rounded-full bg-orange-400" />
              Premium Market
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white lg:text-5xl">
                VIP, Kutu, Credit & Daha Fazlası
              </h1>
              <p className="mt-3 max-w-2xl text-base text-zinc-400">
                Oyun içi avantajlarınızı genişletin. Tüm satın alımlar anında hesabınıza otomatik teslim edilir.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-orange-500/20 p-3 text-2xl">💳</div>
                <div>
                  <p className="text-sm text-zinc-400">Ödeme</p>
                  <p className="font-semibold text-white">Kredi Sistemi</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-emerald-500/20 p-3 text-2xl">⚡</div>
                <div>
                  <p className="text-sm text-zinc-400">Teslimat</p>
                  <p className="font-semibold text-white">Anında Otomatik</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-sky-500/20 p-3 text-2xl">🛡️</div>
                <div>
                  <p className="text-sm text-zinc-400">Güvenlik</p>
                  <p className="font-semibold text-white">SSL Korumalı</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-purple-500/20 p-3 text-2xl">📦</div>
                <div>
                  <p className="text-sm text-zinc-400">Ürünler</p>
                  <p className="font-semibold text-white">{products.length} Paket</p>
                </div>
              </div>
            </div>
          </div>
          
          {user && (
            <div className="relative overflow-hidden rounded-2xl border border-orange-500/30 bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-transparent p-6 shadow-xl shadow-orange-500/10">
              <div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_30%_30%,rgba(249,115,22,0.15),transparent_50%)]" />
              <div className="relative flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/20 text-2xl">👤</div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-zinc-400">Hoş geldin</p>
                    <p className="text-lg font-bold text-white">{user.username}</p>
                  </div>
                </div>
                <div className="flex items-baseline gap-2 rounded-xl border border-orange-400/30 bg-orange-500/10 px-5 py-3">
                  <span className="text-3xl font-bold text-orange-400">₺{credits}</span>
                  <span className="text-sm text-zinc-300">kredi</span>
                </div>
              </div>
            </div>
          )}

          {message && (
            <div className={`rounded-xl border px-4 py-3 text-sm font-medium ${
              message.type === 'success'
                ? 'border-green-500/30 bg-green-500/10 text-green-300'
                : 'border-red-500/30 bg-red-500/10 text-red-300'
            }`}>
              {message.text}
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={() => setCategory('all')}
            className={`group flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition-all ${
              category === 'all'
                ? 'border-orange-400/60 bg-orange-500/15 text-orange-50 shadow-lg shadow-orange-500/20'
                : 'border-white/10 bg-white/5 text-zinc-300 hover:border-white/20 hover:bg-white/10'
            }`}
          >
            <span className="text-base">🏪</span>
            <span>Tüm Kategoriler</span>
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={`group flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition-all ${
                category === cat.key
                  ? 'border-orange-400/60 bg-orange-500/15 text-orange-50 shadow-lg shadow-orange-500/20'
                  : 'border-white/10 bg-white/5 text-zinc-300 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              <span className="text-base">{cat.icon}</span>
              <span>{cat.title}</span>
            </button>
          ))}
        </div>

        {category === 'all' ? (
          <div className="mt-8 space-y-8">
            {CATEGORIES.map((cat) => {
              const catProducts = products.filter((p) => p.category === cat.key);
              if (catProducts.length === 0) return null;
              return (
                <section key={cat.key} className="space-y-5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{cat.icon}</span>
                      <div>
                        <h2 className="text-2xl font-bold text-white">{cat.title}</h2>
                        <p className="text-sm text-zinc-400">{cat.hint}</p>
                      </div>
                    </div>
                    <span className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-300">
                      {catProducts.length} paket
                    </span>
                  </div>
                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {catProducts.map((p) => renderCard(p))}
                  </div>
                </section>
              );
            })}
            {products.length === 0 && (
              <div className="glass-panel rounded-2xl border border-white/5 p-5 text-center text-sm text-zinc-400">
                Henüz ürün bulunmuyor
              </div>
            )}
          </div>
        ) : (
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Filtre</p>
                <h2 className="text-xl font-semibold text-white">{category}</h2>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-zinc-300">
                {filteredProducts.length} ürün
              </span>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((p) => renderCard(p))}
              {filteredProducts.length === 0 && (
                <div className="glass-panel rounded-2xl border border-white/5 p-5 text-center text-sm text-zinc-400">
                  Bu kategoride ürün yok
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
