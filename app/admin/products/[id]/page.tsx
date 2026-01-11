import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import ProductForm from '../ProductForm';

interface PageProps {
  params: Promise<{ id?: string | string[] }>;
}

async function getProduct(id: string) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) redirect('/admin/products');
  return product;
}

export default async function ProductEditPage({ params }: PageProps) {
  const p = await params;
  const id = Array.isArray(p.id) ? p.id[0] : p.id;
  if (!id) redirect('/admin/products');
  const product = await getProduct(id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Ürünü Düzenle</h1>
        <p className="text-zinc-400">{product.name}</p>
      </div>

      <ProductForm product={product} />
    </div>
  );
}
