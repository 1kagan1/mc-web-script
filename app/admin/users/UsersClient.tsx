'use client';

import { useState } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  credits: number;
  createdAt: Date;
}

export default function UsersClient({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [creditsAmount, setCreditsAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAddCredits = async () => {
    if (!selectedUser) return;

    const amount = parseInt(creditsAmount, 10);
    if (Number.isNaN(amount) || amount <= 0) {
      alert('Lütfen 0’dan büyük geçerli bir sayı girin');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/admin/credits/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser.id,
          amount,
          reason: 'Admin tarafından kredi eklendi'
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Kredi eklenemedi');
      
      const newBalance = selectedUser.credits + amount;
      const updatedUsers = users.map(u => 
        u.id === selectedUser.id 
          ? { ...u, credits: newBalance }
          : u
      );
      
      setUsers(updatedUsers);
      setSelectedUser({ ...selectedUser, credits: newBalance });
      setCreditsAmount('');
      alert('✅ Kredi başarıyla eklendi!');
    } catch (err) {
      alert('❌ ' + (err instanceof Error ? err.message : 'Hata oluştu'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Kullanıcı Yönetimi</h1>
        <p className="text-white/60">Tüm kullanıcıları yönetin ve kredilerini ayarlayın</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Users List */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-6 py-3 text-left text-white/60">Kullanıcı Adı</th>
                    <th className="px-6 py-3 text-left text-white/60">E-posta</th>
                    <th className="px-6 py-3 text-left text-white/60">Kredi</th>
                    <th className="px-6 py-3 text-left text-white/60">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-white/60">
                        Henüz kullanıcı yok
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="hover:bg-white/5 transition">
                        <td className="px-6 py-4 text-white font-medium">{user.username}</td>
                        <td className="px-6 py-4 text-white/60 text-xs">{user.email}</td>
                        <td className="px-6 py-4 text-white font-semibold">{user.credits}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="rounded px-3 py-1 text-xs font-medium bg-white/10 text-white hover:bg-white/20 transition"
                          >
                            Yönet
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Edit Panel */}
        {selectedUser && (
          <div className="rounded-lg border border-white/10 bg-white/5 p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Kullanıcı Detayı</h3>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-white/60 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <div className="border-t border-white/10 pt-4 space-y-4">
                <div>
                  <p className="text-xs text-white/60 uppercase tracking-wide">Kullanıcı Adı</p>
                  <p className="text-white font-semibold mt-1">{selectedUser.username}</p>
                </div>

                <div>
                  <p className="text-xs text-white/60 uppercase tracking-wide">E-posta</p>
                  <p className="text-white font-semibold text-sm mt-1">{selectedUser.email}</p>
                </div>

                <div>
                  <p className="text-xs text-white/60 uppercase tracking-wide">Kayıt Tarihi</p>
                  <p className="text-white text-sm mt-1">
                    {new Date(selectedUser.createdAt).toLocaleDateString('tr-TR')}
                  </p>
                </div>

                <div className="rounded-lg bg-white/10 p-3">
                  <p className="text-xs text-white/60 uppercase tracking-wide">Mevcut Kredi</p>
                  <p className="text-3xl font-bold text-white mt-1">💰 {selectedUser.credits}</p>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <label className="text-xs text-white/60 uppercase tracking-wide block mb-2">Kredi Ekle</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={creditsAmount}
                      onChange={(e) => setCreditsAmount(e.target.value)}
                      placeholder="Miktar girin"
                      className="flex-1 rounded border border-white/20 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 text-sm"
                      min="1"
                    />
                    <button
                      onClick={handleAddCredits}
                      disabled={!creditsAmount || submitting}
                      className="rounded bg-white px-4 py-2 text-black font-semibold text-sm hover:bg-white/90 disabled:opacity-50 transition"
                    >
                      {submitting ? '⏳' : '➕'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
