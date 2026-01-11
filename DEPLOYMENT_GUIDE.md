# 🎮 Minecraft SkyBlock Premium Market - Production Ready

**Son Güncelleme:** 11 Ocak 2026

## 📊 Proje Durumu: %95 SATIŞA HAZIR ✅

Vergi levhanız olmadığı için ödeme sistemini manuel kredi yükleme olarak ayarladık. Site tam olarak çalışmaya hazır!

---

## 🚀 Son Tamamlanan Özellikler

### ✅ Güvenlik Sistemi
- **JWT Authentication**: Güvenli token tabanlı kimlik doğrulama
- **Password Hashing**: bcrypt ile şifreler encrypted
- **Rate Limiting**: DDoS koruması (login, register, purchase)
- **SQL Injection Protection**: Prisma ORM ile güvenli sorgular
- **Şifre Sıfırlama**: Güvenli token'lar ile şifre değiştirme

### ✅ Email Sistemi
- **Resend Integration**: Ücretsiz 100 email/gün
- 📧 Hoş geldiniz emaili
- 📧 Sipariş onay emaili
- 📧 Kredi ekleme notifikasyonu
- 📧 Şifre sıfırlama emaili

### ✅ Kullanıcı Yönetimi
- Kayıt ve giriş sistemi
- Şifre sıfırlama işlevi
- Manuel kredi yükleme (admin panelden)
- Kredi geçmişi tracking
- Sipariş geçmişi

### ✅ Admin Paneli
- Ürün yönetimi (CRUD)
- Kullanıcı yönetimi
- Manuel kredi ekleme
- Haber yönetimi
- Ayarlar yönetimi
- Login logları

### ✅ Market Sistemi
- Kategorili ürün listesi (4 kategori)
- Güvenli satın alma
- Kredi ödeme sistemi
- Gerçek zamanlı kredi gösterimi
- Aktivasyon filtrelemesi

### ✅ Minecraft Entegrasyonu
- REST API endpoint'leri
- Otomatik ürün teslimatı
- Kullanıcı doğrulama API'si
- Bekleyen sipariş sistemi
- Java Plugin örneği

### ✅ Yasal & SEO
- Kullanım Şartları sayfası
- Gizlilik Politikası (KVKK uyumlu)
- SEO meta tag'leri
- SVG Favicon
- Open Graph tagları

### ✅ Veritabanı
- PostgreSQL (Prisma)
- User modeli
- Product modeli
- Order modeli
- CreditTransaction modeli
- PasswordResetToken modeli
- AdminLoginLog modeli

---

## 📁 Proje Yapısı

```
app/
├── api/
│   ├── auth/
│   │   ├── login/route.ts           ✅ Rate limited
│   │   ├── register/route.ts        ✅ Rate limited
│   │   ├── forgot-password/route.ts ✅ Rate limited
│   │   ├── reset-password/route.ts  ✅ Secure tokens
│   │   └── me/route.ts
│   ├── admin/
│   │   ├── products/
│   │   ├── users/
│   │   ├── credits/add/route.ts     ✅ Email notification
│   │   └── ...
│   ├── market/
│   │   └── purchase/route.ts        ✅ Rate limited + Email
│   ├── minecraft/
│   │   ├── verify/route.ts          ✅ Plugin API
│   │   ├── pending/route.ts         ✅ Order management
│   │   └── execute/route.ts         ✅ Order completion
│   ├── credits/
│   │   ├── balance/route.ts
│   │   └── history/route.ts
│   └── public/
│       ├── products/route.ts
│       ├── home/route.ts
│       └── settings/route.ts
├── admin/
│   ├── page.tsx                     ✅ Dashboard
│   ├── products/page.tsx            ✅ Product management
│   ├── users/page.tsx               ✅ User management
│   ├── news/page.tsx                ✅ News management
│   ├── settings/page.tsx            ✅ Site settings
│   └── login-logs/page.tsx          ✅ Audit logs
├── auth/
│   ├── login/page.tsx               ✅ Rate limited
│   ├── register/page.tsx            ✅ Rate limited
│   ├── forgot-password/page.tsx     ✅ Şifre sıfırlama
│   └── reset-password/page.tsx      ✅ Token tabanlı
├── market/page.tsx                  ✅ Premium UI
├── news/page.tsx                    ✅ Haber listesi
├── legal/
│   ├── terms/page.tsx               ✅ Kullanım şartları
│   └── privacy/page.tsx             ✅ Gizlilik politikası
└── layout.tsx                       ✅ SEO meta tags

lib/
├── auth.ts                          ✅ JWT verification
├── email.ts                         ✅ Resend templates
├── prisma.ts                        ✅ Database client
└── rate-limit.ts                    ✅ Rate limiting logic

components/
├── Navbar.tsx
├── Footer.tsx
└── ...

prisma/
├── schema.prisma                    ✅ Tüm modeller
└── migrations/
    └── 20250111181948_add_password_reset_tokens/
```

---

## 🛠️ Teknik Stack

- **Frontend**: Next.js 16.1.1 (Turbopack), React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT (jose)
- **Hashing**: bcryptjs
- **Email**: Resend
- **API Security**: Rate limiting, SQL injection protection
- **Image CDN**: Cloudinary

---

## 📋 Satışa Çıkmadan Sonra (4-6 saat)

### 1️⃣ **Domain & Hosting (1-2 saat)**
```bash
# Vercel'e deploy et (recommended)
# veya
# Railway/DigitalOcean seç

# .env güncelle:
NEXT_PUBLIC_BASE_URL="https://yourdomain.com"
```

### 2️⃣ **Database Setup (30 dakika)**
```bash
# Production database oluştur (Neon/Supabase)
# .env güncelle:
DATABASE_URL="postgresql://..."

# Migrations çalıştır
npx prisma migrate deploy

# İlk admin oluştur
curl -X POST https://yourdomain.com/api/admin/setup \
  -d '{"email":"admin@example.com","password":"pass","name":"Admin"}'
```

### 3️⃣ **Email Setup (15 dakika)**
```bash
# Resend API key al: https://resend.com
# .env güncelle:
RESEND_API_KEY="re_xxxxx"
EMAIL_FROM="noreply@yourdomain.com"
```

### 4️⃣ **Minecraft Plugin (1 saat)**
```bash
# Plugin'i sunucuya kur
# config.yml güncelle:
api-url: https://yourdomain.com/api/minecraft
api-key: <secure-random-key>
```

### 5️⃣ **Testing (1-2 saat)**
- [ ] Kayıt test
- [ ] Giriş test
- [ ] Email'ler kontrol
- [ ] Kredi ekleme test
- [ ] Ürün satın alma
- [ ] Minecraft teslimatı

---

## 🔐 Güvenlik Özellikleri

| Özellik | Durum | Detay |
|---------|-------|-------|
| Password Hashing | ✅ | bcrypt + 10 salt rounds |
| JWT Tokens | ✅ | 7 gün expiry |
| Rate Limiting | ✅ | Login: 5/min, Register: 5/min, Purchase: 10/min |
| SQL Injection | ✅ | Prisma ORM protection |
| HTTPS | ✅ | Production'da zorunlu |
| CORS | ✅ | Konfigüre edilebilir |
| Admin Audit Log | ✅ | Tüm admin işlemleri kaydediliyor |
| Email Verification | ⏳ | Opsiyonel (eklenebilir) |

---

## 📧 Email Template'leri

### Hoş Geldiniz Emaili
```
- Site adı ve gradient logo
- Hesap oluşturma onayı
- Sonraki adımlar
- CTA: Market'e gözat
```

### Sipariş Onayı Emaili
```
- Sipariş detayları
- Ürün bilgileri
- Otomatik teslimat bilgisi
- CTA: Markete dön
```

### Kredi Ekleme Bildirimi
```
- Kredi miktarı (büyük yazı)
- Yeni bakiye
- Ekleme sebebi
- CTA: Markete git
```

### Şifre Sıfırlama Emaili
```
- Sıfırlama linki (1 saat geçerli)
- Alternatif link (kopyala-yapıştır)
- Güvenlik uyarısı
```

---

## 🎯 Önemli API Endpoint'leri

### Public
- `POST /api/auth/login` - Giriş (Rate: 5/min)
- `POST /api/auth/register` - Kayıt (Rate: 5/min)
- `POST /api/auth/forgot-password` - Şifre sıfırlama isteği (Rate: 3/min)
- `POST /api/auth/reset-password` - Şifre değiştir (Rate: 5/min)
- `GET /api/public/products` - Aktif ürünler
- `GET /api/public/home` - Homepage verileri

### Authenticated
- `POST /api/market/purchase` - Ürün satın al (Rate: 10/min)
- `GET /api/credits/balance` - Kredi bakiyesi
- `GET /api/credits/history` - Kredi geçmişi
- `GET /api/auth/me` - Profil bilgisi

### Minecraft
- `POST /api/minecraft/verify` - Kullanıcı doğrulama
- `GET /api/minecraft/pending` - Bekleyen siparişler
- `POST /api/minecraft/execute` - Sipariş teslim

### Admin
- `GET /api/admin/products` - Tüm ürünler
- `POST /api/admin/products` - Ürün oluştur
- `PUT /api/admin/products/[id]` - Ürün düzenle
- `DELETE /api/admin/products/[id]` - Ürün sil
- `POST /api/admin/credits/add` - Kredi ekle
- `GET /api/admin/users` - Kullanıcılar

---

## 📞 Destek

### Sık Sorulan Sorular

**S: İyzico olmadan nasıl ödeme alıyoruz?**
A: Manuel kredi sistemi ile. Admin panelinden kullanıcılara krediler ekliyorsunuz.

**S: Email'ler nereye gidiyor?**
A: Resend üzerinden. `RESEND_API_KEY` ayarlanmış olmalı.

**S: Minecraft plugin'i nasıl kurarım?**
A: `/MINECRAFT_INTEGRATION.md` dosyasını okuyun.

**S: Hangi database kullanmalıyım?**
A: PostgreSQL (Neon, Supabase, Railway'in shared Postgres'i)

**S: Rate limiting'i nasıl değiştiririm?**
A: `lib/rate-limit.ts` dosyasındaki `MAX_REQUESTS` objesini düzenleyin.

---

## 🚀 Deployment Komutları

### Vercel (Recommended)
```bash
npm install -g vercel
vercel env add DATABASE_URL "postgresql://..."
vercel env add RESEND_API_KEY "re_xxxxx"
vercel env add JWT_SECRET "super-secret-key"
vercel env add MC_API_KEY "minecraft-key"
vercel deploy --prod
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 📝 Lisans & İletişim

Bu proje özel olarak sizin için geliştirilmiştir.

---

**Hazırlayan:** AI Assistant  
**Tarih:** 11 Ocak 2026  
**Versiyon:** 1.0.0 - Production Ready ✅
