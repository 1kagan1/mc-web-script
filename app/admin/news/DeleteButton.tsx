"use client";

import { useRouter } from 'next/navigation';

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    const ok = confirm('Silinsin mi?');
    if (!ok) return;
    const res = await fetch(`/api/admin/news/${id}`, { method: 'DELETE' });
    if (res.ok) {
      router.refresh();
    } else {
      alert('Silme başarısız');
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="rounded-lg border border-red-500/30 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
    >
      Sil
    </button>
  );
}