'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DeleteButton from './DeleteButton';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  tag: string;
  category: string;
  active: boolean;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/admin/products', { cache: 'no-store' });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Ürünler yüklenemedi');
        }
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Ürünler</h1>
          <p className="text-zinc-400">Market ürünlerini yönetin</p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-2 font-medium text-white transition hover:from-orange-600 hover:to-orange-700"
        >
          + Yeni Ürün
        </Link>
      </div>

      <div className="rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent overflow-hidden">
        {loading && (
          <div className="py-12 text-center text-zinc-500">Yükleniyor...</div>
        )}

        {error && !loading && (
          <div className="py-12 text-center text-red-400">Hata: {error}</div>
        )}

        {!loading && !error && (
          <table className="w-full">
            <thead className="border-b border-white/10">
              <tr className="text-left text-sm text-zinc-400">
                <th className="px-6 py-4 font-medium">Ürün</th>
                <th className="px-6 py-4 font-medium">Kategori</th>
                <th className="px-6 py-4 font-medium">Fiyat</th>
                <th className="px-6 py-4 font-medium">Tag</th>
                <th className="px-6 py-4 font-medium">Durum</th>
                <th className="px-6 py-4 font-medium">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-white/5 transition hover:bg-white/5">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-white">{product.name}</p>
                      <p className="text-xs text-zinc-500">{product.description.substring(0, 50)}...</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-300">{product.category}</td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-orange-400">₺{product.price}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-orange-500/20 px-2 py-1 text-xs text-orange-300">
                      {product.tag}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2 py-1 text-xs ${
                      product.active
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-zinc-500/20 text-zinc-400'
                    }`}>
                      {product.active ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="text-sm text-blue-400 hover:text-blue-300"
                      >
                        Düzenle
                      </Link>
                      <DeleteButton id={product.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="py-12 text-center text-zinc-500">
            Henüz ürün eklenmemiş
          </div>
        )}
      </div>
    </div>
  );
}
