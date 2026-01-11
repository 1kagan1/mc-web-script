import MarketClient from './MarketClient';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  tag: string;
  category: string;
  active: boolean;
};

function resolveBaseUrl() {
  const envUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.SITE_URL || process.env.VERCEL_URL;
  if (envUrl) {
    const hasProtocol = envUrl.startsWith('http://') || envUrl.startsWith('https://');
    return hasProtocol ? envUrl : `https://${envUrl}`;
  }
  return 'http://localhost:3000';
}

async function getProducts(): Promise<Product[]> {
  try {
    const baseUrl = resolveBaseUrl();
    const res = await fetch(`${baseUrl}/api/public/products`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.filter((p: Product) => p.active) : [];
  } catch {
    return [];
  }
}

export default async function MarketPage() {
  const products = await getProducts();
  return <MarketClient products={products} />;
}
