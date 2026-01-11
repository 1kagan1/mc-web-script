'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginForm({ note }: { note?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || (res.status === 403 ? 'Önce kullanıcı oturumunu kapatın.' : 'Giriş başarısız'));
        return;
      }

      router.refresh();
    } catch (err) {
      console.error(err);
      setError('Sunucu hatası');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full rounded-2xl border border-white/20 bg-white/5 p-8 shadow-2xl shadow-black/50">
      <h1 className="text-2xl font-bold text-white">Admin Girişi</h1>
      <p className="mt-2 text-sm text-white/70">Admin bilgilerini girerek devam edin.</p>
      <p className="mt-1 text-xs text-white/60">Kullanıcı oturumu açıksa önce çıkış yapmanız gerekir.</p>
      {note && <p className="mt-2 text-xs text-white/60">{note}</p>}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-white/70">Admin E-posta</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40"
            placeholder="admin@domain.com"
            type="email"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-white/70">Şifre</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40"
            placeholder="••••••••"
            type="password"
            required
          />
        </div>
        {error && <p className="text-sm text-white/60">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-white/90 disabled:opacity-60"
        >
          {loading ? 'Giriş yapılıyor…' : 'Giriş Yap'}
        </button>
      </form>
    </div>
  );
}
