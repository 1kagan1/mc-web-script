'use client';

import { useState, DragEvent } from 'react';
import { useRouter } from 'next/navigation';

interface NewsFormProps {
  news?: {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    tag: string;
    imageUrl?: string | null;
  };
}

export default function NewsForm({ news }: NewsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: news?.title || '',
    excerpt: news?.excerpt || '',
    content: news?.content || '',
    tag: news?.tag || 'DUYURU',
    imageUrl: news?.imageUrl || '',
  });
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = news 
        ? `/api/admin/news/${news.id}`
        : '/api/admin/news';
      
      const method = news ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('İşlem başarısız');

      router.push('/admin/news');
      router.refresh();
    } catch (error) {
      alert('Hata: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Lütfen bir resim dosyası seçin');
      return;
    }
    try {
      setUploading(true);
      const data = new FormData();
      data.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: data });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Yükleme başarısız');
      setFormData(prev => ({ ...prev, imageUrl: json.url }));
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const onDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-6">
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-white">Kapak Görseli</label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={onDrop}
              className={`flex items-center justify-center rounded-lg border px-4 py-8 text-sm transition ${dragActive ? 'border-orange-500 bg-orange-500/10' : 'border-white/10 bg-white/5'}`}
            >
              <div className="text-center">
                <p className="text-zinc-300">Görseli buraya sürükleyin veya</p>
                <div className="mt-2">
                  <label className="inline-block cursor-pointer rounded-lg border border-white/10 px-3 py-1 text-white transition hover:bg-white/5">
                    Dosya seç
                    <input type="file" accept="image/*" className="hidden" onChange={onFileInput} />
                  </label>
                </div>
                {uploading && <p className="mt-2 text-xs text-zinc-400">Yükleniyor...</p>}
              </div>
            </div>

            <div className="mt-3">
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://.../image.jpg"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
              />
            </div>

            {formData.imageUrl && (
              <div className="mt-3 overflow-hidden rounded-lg border border-white/10">
                <img src={formData.imageUrl} alt="Önizleme" className="h-40 w-full object-cover" />
              </div>
            )}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Başlık
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Yeni Güncelleme Yayınlandı!"
              required
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Özet (Kısa Açıklama)
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Kısa bir özet..."
              rows={2}
              required
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              İçerik
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Tam haber içeriği..."
              rows={10}
              required
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
            />
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
              <option value="DUYURU">DUYURU</option>
              <option value="GÜNCELLEME">GÜNCELLEME</option>
              <option value="ETKİNLİK">ETKİNLİK</option>
              <option value="YAMA">YAMA</option>
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
          {loading ? 'Kaydediliyor...' : news ? 'Güncelle' : 'Yayınla'}
        </button>
      </div>
    </form>
  );
}
