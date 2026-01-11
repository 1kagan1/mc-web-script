'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProductFormProps {
  product?: {
    id: string;
    name: string;
    description: string;
    price: number;
    tag: string;
    category: string;
    active: boolean;
  };
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    tag: product?.tag || 'POPÜLER',
    category: product?.category || 'Credit',
    active: product?.active ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = product 
        ? `/api/admin/products/${product.id}`
        : '/api/admin/products';
      
      const method = product ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('İşlem başarısız');

      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      alert('Hata: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-white">
              Ürün Adı
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="VIP+ Rank"
              required
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-white">
              Açıklama
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Ürün açıklaması..."
              rows={4}
              required
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Fiyat (₺)
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              placeholder="229"
              required
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Kategori
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
            >
              <option value="Credit">💰 Credit</option>
              <option value="VIP Üyelikler">👑 VIP Üyelikler</option>
              <option value="Kozmetikler">✨ Kozmetikler</option>
              <option value="Kutular">🎁 Kutular</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Tag
            </label>
            <select
              value={formData.tag}
              onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
            >
              <option value="POPÜLER">POPÜLER</option>
              <option value="YENİ">YENİ</option>
              <option value="İNDİRİM">İNDİRİM</option>
              <option value="LİMİTLİ">LİMİTLİ</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Durum
            </label>
            <select
              value={formData.active ? 'true' : 'false'}
              onChange={(e) => setFormData({ ...formData, active: e.target.value === 'true' })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
            >
              <option value="true">Aktif</option>
              <option value="false">Pasif</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-white/10 px-6 py-2 font-medium text-white transition hover:bg-white/5"
        >
          İptal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-2 font-medium text-white transition hover:from-orange-600 hover:to-orange-700 disabled:opacity-50"
        >
          {loading ? 'Kaydediliyor...' : product ? 'Güncelle' : 'Oluştur'}
        </button>
      </div>
    </form>
  );
}
