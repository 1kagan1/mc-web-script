import ProductForm from '../ProductForm';

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Yeni Ürün Ekle</h1>
        <p className="text-zinc-400">Market için yeni ürün oluşturun</p>
      </div>

      <ProductForm />
    </div>
  );
}
