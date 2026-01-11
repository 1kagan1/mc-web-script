# Admin Panel Setup Rehberi

## Admin Paneline Erişim

Admin paneline giriş `/admin` sayfasındaki form ile yapılır. Production’da yalnızca veritabanında kayıtlı admin kullanıcıları geçerli olur. Geliştirme için opsiyonel bir setup endpoint’i mevcuttur.

### Development Ortamında Admin Token'ı Oluşturma (Opsiyonel)

1. **Veritabanını seed et:**
   ```bash
   npx prisma db seed
   ```
   Bu komut otomatik olarak bir admin hesabı oluşturur:
   - **Email:** `admin@skyblock.com`
   - **Şifre:** `admin123`

2. **Admin token'ı al (isteğe bağlı):**
   - Browser'da şu URL'ye git: `http://localhost:3000/api/admin/setup`
   - Bu endpoint otomatik olarak admin-token cookie'si ayarlayacak

3. **Admin Paneline Erişim (form ile):**
   - `http://localhost:3000/admin` adresine git, admin e-posta/şifre ile giriş yap
   - Kullanıcı oturumu açıksa önce çıkış yapman gerekir

### Üretim Ortamında (Production)

Üretim ortamında `/api/admin/setup` endpoint'i çalışmaz (403 döner). Admin panele erişim yalnızca veritabanındaki admin kullanıcılarının e-posta/şifre doğrulamasıyla sağlanır.

**Güvenlik Notu:** Admin hesabını production'da oluşturmak için:
- Veritabanına doğrudan bağlanarak admin ekle
- Veya geliştirme ortamında token oluştur ve saklı tut

## Admin Kredileri

```
Email: admin@skyblock.com
Şifre: admin123
```

**ÖNEMLİ:** Production'da bu default kredileri değiştir ve güçlü bir `JWT_SECRET` tanımla!

## Security Notes

- Admin giriş formu `/admin` üzerindedir; e-posta/şifre DB’de olmalı
- Admin token'ı sadece development'ta `/api/admin/setup` üzerinden otomatik alınabilir (opsiyonel)
- Production'da `/api/admin/setup` çalışmaz
- Tüm admin işlemleri JWT token üzerinden doğrulanır; `JWT_SECRET` production’da güçlü olmalıdır
- Admin giriş denemeleri loglanır ve 5/10 dk rate-limit + 5 dk kilit uygulanır

## Hızlı Test Kontrol Listesi

- Kullanıcı-token varken `/api/admin/login` → 403 ve “Önce kullanıcı oturumunu kapatın” mesajı
- Token yokken `/admin` → giriş formu görünür
- Yanlış şifre 5 deneme içinde → 401; 5+ denemede 429 (kilitlenme)
- Doğru admin bilgiler → dashboard açılır, login loglarına kayıt düşer
- Admin çıkış / kullanıcı giriş → admin-token silinir
- Prod’da `/api/admin/setup` → 403
