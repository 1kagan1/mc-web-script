"use client";

import { useRouter } from 'next/navigation';

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    const ok = confirm('Silinsin mi?');
    if (!ok) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      router.refresh();
    } else {
      alert('Silme başarısız');
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-sm text-red-400 hover:text-red-300"
    >
      Sil
    </button>
  );
}