import { prisma } from '@/lib/prisma';

export default async function AdminLoginLogsPage() {
  const logs = await prisma.adminLoginLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Giriş Logları</h1>
        <p className="text-sm text-zinc-400">Son 50 deneme (başarılı/başarısız).</p>
      </div>
      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
        <table className="min-w-full text-sm text-left text-white/80">
          <thead className="bg-white/10 text-xs uppercase tracking-wide text-white/70">
            <tr>
              <th className="px-4 py-3">Zaman</th>
              <th className="px-4 py-3">E-posta</th>
              <th className="px-4 py-3">IP</th>
              <th className="px-4 py-3">Durum</th>
              <th className="px-4 py-3">Sebep</th>
              <th className="px-4 py-3">User-Agent</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-t border-white/5">
                <td className="px-4 py-3 text-white/70">{new Date(log.createdAt).toLocaleString('tr-TR')}</td>
                <td className="px-4 py-3">{log.emailAttempted}</td>
                <td className="px-4 py-3 text-white/60">{log.ip || '-'}</td>
                <td className={`px-4 py-3 font-semibold ${log.success ? 'text-emerald-400' : 'text-red-400'}`}>
                  {log.success ? 'Başarılı' : 'Başarısız'}
                </td>
                <td className="px-4 py-3 text-white/70">{log.reason || '-'}</td>
                <td className="px-4 py-3 text-white/50 truncate max-w-[240px]">{log.userAgent || '-'}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-white/60" colSpan={6}>
                  Kayıt yok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
