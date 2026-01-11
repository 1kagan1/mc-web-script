import { prisma } from '@/lib/prisma';
import SettingsForm from './SettingsForm';

async function getSettings() {
  const settings = await prisma.settings.findMany({
    orderBy: { key: 'asc' }
  });
  
  return settings.reduce((acc, setting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {} as Record<string, string>);
}

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Site Ayarları</h1>
        <p className="text-zinc-400">Tüm site yapılandırmasını buradan yönetin</p>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  );
}
