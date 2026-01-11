'use client';

import { useState } from 'react';

interface SettingsFormProps {
  initialSettings: Record<string, string>;
}

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (!response.ok) throw new Error('Güncelleme başarısız');

      setMessage('Ayarlar başarıyla güncellendi!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Hata: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const settingsConfig = [
    { key: 'site_name', label: 'Site Adı', type: 'text', placeholder: 'SkyBlock' },
    { key: 'logo_url', label: 'Logo URL', type: 'text', placeholder: '/logo.png' },
    { key: 'hero_title', label: 'Ana Başlık', type: 'text', placeholder: 'EN İYİ SKYBLOCK SUNUCUSU' },
    { key: 'hero_subtitle', label: 'Alt Başlık', type: 'textarea', placeholder: 'Türkiye\'nin en gelişmiş...' },
    { key: 'server_ip', label: 'Sunucu IP', type: 'text', placeholder: 'play.skyblock.com.tr' },
    { key: 'online_players', label: 'Online Oyuncu', type: 'number', placeholder: '847' },
    { key: 'about_text', label: 'Hakkımızda Metni', type: 'textarea', placeholder: 'Sunucumuz 2021 yılında...' },
    { key: 'discord_url', label: 'Discord URL', type: 'text', placeholder: 'https://discord.gg/...' },
    { key: 'store_url', label: 'Store URL', type: 'text', placeholder: 'https://store.skyblock.com.tr' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div className={`rounded-lg border p-4 ${
          message.includes('başarı') 
            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
            : 'border-red-500/30 bg-red-500/10 text-red-300'
        }`}>
          {message}
        </div>
      )}

      <div className="rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-6">
        <div className="grid gap-6 md:grid-cols-2">
          {settingsConfig.map(({ key, label, type, placeholder }) => (
            <div key={key} className={type === 'textarea' ? 'md:col-span-2' : ''}>
              <label className="mb-2 block text-sm font-medium text-white">
                {label}
              </label>
              {type === 'textarea' ? (
                <textarea
                  value={settings[key] || ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder={placeholder}
                  rows={3}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
                />
              ) : (
                <input
                  type={type}
                  value={settings[key] || ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder={placeholder}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => setSettings(initialSettings)}
          className="rounded-lg border border-white/10 px-6 py-2 font-medium text-white transition hover:bg-white/5"
        >
          Sıfırla
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-2 font-medium text-white transition hover:from-orange-600 hover:to-orange-700 disabled:opacity-50"
        >
          {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </button>
      </div>
    </form>
  );
}
