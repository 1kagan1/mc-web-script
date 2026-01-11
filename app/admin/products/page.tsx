import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import DeleteButton from './DeleteButton';

// Always fetch fresh data (no static cache) so newly added products show up immediately
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getProducts() {
  return await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export default async function ProductsPage() {
  const products = await getProducts();

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

        {products.length === 0 && (
          <div className="py-12 text-center text-zinc-500">
            Henüz ürün eklenmemiş
          </div>
        )}
      </div>
    </div>
  );
}
