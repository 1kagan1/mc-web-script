## MC Vitrin & Admin

Next.js 14 (App Router) + Tailwind tabanlı tema/vitrin mağazası ve profesyonel admin paneli. Stil: Craftrise/LeaderOS esintisi, renk: turuncu (#f97316), siyah, beyaz. Ödeme: iyzico ana, Stripe/PayTR yedek.

### Komutlar
- `npm run dev` – geliştirme sunucusu (http://localhost:3000)
- `npm run lint` – ESLint kontrolü

### Yapı
- `app/page.tsx`: Tema mağazası landing (Craftrise/LeaderOS vibe), paketler, tema galerisi, süreç, SSS
- `app/admin/page.tsx`: Profesyonel admin dashboard (ödemeler, ürün yönetimi, içerik blokları, aksiyonlar)
- `app/globals.css`: Turuncu/siyah/beyaz tema, cam efektleri, grid arka plan
- `app/layout.tsx`: Font ve metadata ayarları

### Özellikler
- Landing: hero, ödeme rozetleri (iyzico/Stripe/PayTR), tema paketleri, tema galerisi, süreç akışı, SSS, demo CTA
- Mağaza vitrini: paket kartları, rozetler, satın al CTA; LeaderOS uyumlu akış vurgusu
- Admin: KPI kartları, ödeme listesi (iyzico/Stripe/PayTR), hızlı aksiyonlar, ürün tablo, içerik blok yönetimi, ödeme sağlayıcı kutusu

### Notlar
- Tüm veriler mock; gerçek ortam için API, RCON ve iyzico/Stripe/PayTR webhook entegrasyonu eklenmeli.
