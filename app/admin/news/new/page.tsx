import NewsForm from '../NewsForm';

export default function NewNewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Yeni Haber Ekle</h1>
        <p className="text-zinc-400">Site için yeni haber veya duyuru oluşturun</p>
      </div>

      <NewsForm />
    </div>
  );
}
