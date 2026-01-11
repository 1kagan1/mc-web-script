# 🚀 Production Checklist - Satışa Çıkış Öncesi

## ✅ TAMAMLANAN İŞLER

### 1. ✅ Güvenlik Ayarları
- [x] JWT_SECRET değiştirildi (production-ready)
- [x] Rate limiting eklendi (login, register, purchase)
- [x] Password hashing (bcrypt) aktif
- [x] Şifre sıfırlama sistemi ile güvenli token'lar

### 2. ✅ Email Sistemi
- [x] Resend entegrasyonu (mock mod da çalışıyor)
- [x] Hoş geldiniz emaili
- [x] Sipariş onay emaili
- [x] Kredi ekleme bildirimi
- [x] Şifre sıfırlama emaili

### 3. ✅ Şifre Yönetimi
- [x] Şifre sıfırlama request endpoint'i
- [x] Şifre sıfırlama token'ları (database)
- [x] Token expiration (1 saat)
- [x] Şifre sıfırlama sayfası
- [x] Güvenli token oluşturma

### 4. ✅ Yasal Sayfalar
- [x] Kullanım Şartları sayfası
- [x] Gizlilik Politikası sayfası (KVKK uyumlu)
- [x] Footer'da yasal sayfalar linki

### 5. ✅ SEO ve Meta
- [x] Site başlığı güncellendu
- [x] Meta description eklendi
- [x] Keywords eklendi
- [x] Open Graph tagları
- [x] Favicon SVG

### 6. ✅ Rate Limiting
- [x] Login: 5 deneme/dakika
- [x] Register: 5 deneme/dakika
- [x] Forgot Password: 3 deneme/dakika
- [x] Purchase: 10 işlem/dakika---

## ⚠️ KALAN İŞLER - YAPILMASI ÖNEMLİ

### 1. Ödeme Sistemi YOK (İYZİCO OLMADAN MANUEL KREDİ KULLANILIYOR)
- Manual kredi yükleme: Admin panelinden manuel olarak krediler ekleniyor ✅
- Kullanıcılar krediler ile ürün satın alıyor ✅
- Minecraft sunucusunda otomatik teslimat yapılıyor ✅

### 2. Domain ve Hosting
- [ ] Domain satın al (Cloudflare, GoDaddy)
- [ ] Vercel/Railway/DigitalOcean'a deploy et
- [ ] `.env` production değerlerini hosting platformuna ekle
- [ ] `NEXT_PUBLIC_BASE_URL` domain'e göre güncelle:
  ```env
  NEXT_PUBLIC_BASE_URL="https://yoursite.com"
  ```
- [ ] SSL sertifikası aktif mi kontrol et
- [ ] Production database URL'i ayarla (Neon/Supabase)

### 3. Database Migration (Production)
- [ ] Production database'i oluştur
- [ ] `npx prisma migrate deploy` komutuyla migration'ları çalıştır
- [ ] İlk admin kullanıcısını oluştur
- [ ] Backups konfigürasyonu

### 4. Email Servisini Aktifleştir
- [ ] Resend API key'ini al ve `.env`'e ekle
- [ ] Test emaili gönderip başarıyla teslim olduğunu doğrula
- [ ] Sender email adresini özelleştir

### 5. Minecraft Plugin Kurulumu
- [ ] Java plugin'i derle veya jar dosyasını indir
- [ ] Sunucu `plugins` klasörüne at
- [ ] `config.yml` düzenle (production API key'i)
- [ ] Test siparişi ver ve otomatik teslim olduğunu doğrula

### 6. Monitoring ve Analytics
- [ ] Google Analytics ekle (opsiyonel)
- [ ] Sentry hata takibi (opsiyonel)
- [ ] Uptime monitoring kur

---

## 📊 Hızlı Özet - Neler Hazır

✅ **Güvenlik:**
- JWT Secret (production-ready)
- Rate limiting (DDoS koruması)
- Password hashing ve sıfırlama
- SQL injection protection (Prisma)

✅ **Email:**
- Kayıt emaili
- Sipariş onay emaili
- Şifre sıfırlama emaili
- Kredi bildirimi emaili

✅ **Kullanıcı Sistemi:**
- Kayıt ve giriş
- Şifre sıfırlama
- Profil yönetimi
- Kredi sistemi

✅ **Admin Paneli:**
- Ürün yönetimi
- Kullanıcı yönetimi
- Manuel kredi ekleme
- Sipariş takibi
- Haber yönetimi

✅ **Market:**
- Kategorili ürün listesi
- Güvenli satın alma
- Kredi ödeme sistemi
- Otomatik Minecraft teslimatı

✅ **Minecraft Entegrasyonu:**
- API endpoint'leri hazır
- Plugin örnek kodu
- Otomatik ürün teslimatı

✅ **Yasal:**
- Kullanım Şartları
- Gizlilik Politikası
- KVKK uyumlu

---

## 🎯 Satışa Çıkmadan Önce Yapılması Gerekenler

1. **Domain ve Hosting (1-2 saat)**
   - Domain satın al
   - Vercel/Railway'e deploy et
   - SSL ayarla

2. **Production Database (30 dakika)**
   - Neon/Supabase account aç
   - Database oluştur
   - Migrations çalıştır

3. **Email Setup (15 dakika)**
   - Resend API key al
   - `.env`'e ekle
   - Test emaili gönder

4. **Admin Kurulumu (15 dakika)**
   - İlk admin hesabı oluştur
   - Ürünleri ekle
   - Test et

5. **Minecraft Plugin (1 saat)**
   - Plugin'i indir/derle
   - Sunucuya kur
   - Test siparişi ver

6. **Final Testing (1-2 saat)**
   - Kayıt test et
   - Giriş test et
   - Satın alma test et
   - Email'lerin gittiğini doğrula
   - Mobil uyumluluğu kontrol et

**TOPLAM: ~4-6 saat**
- [ ] Vercel Edge Config veya Upstash Redis kullan

### 12. Backup
- [ ] Otomatik database backup kur
- [ ] Cloudflare Images kullanarak image backup

### 13. Discord Bot (Opsiyonel)
- [ ] Discord webhook ekle (yeni sipariş bildirimi)
- [ ] Sipariş durum sorgulaması için Discord bot

### 14. Multi-language (Opsiyonel)
- [ ] İngilizce dil desteği ekle
- [ ] `next-intl` paketi kullan

---

## ✅ Satışa Hazır Kontrol Listesi

Aşağıdaki tüm maddeler ✅ olduğunda site satışa hazır:

- [ ] ✅ Ödeme sistemi çalışıyor (test ödemesi yapıldı)
- [ ] ✅ Email sistemi çalışıyor (test emaili gönderildi)
- [ ] ✅ Production database bağlı
- [ ] ✅ JWT_SECRET güçlü ve değiştirildi
- [ ] ✅ Domain bağlı ve SSL aktif
- [ ] ✅ İlk admin kullanıcısı oluşturuldu
- [ ] ✅ Minecraft plugin kuruldu ve test edildi
- [ ] ✅ Monitoring kuruldu
- [ ] ✅ Yasal sayfalar eklendi
- [ ] ✅ Mobil ve desktop'ta tam test edildi

---

## 📞 Destek ve Sorun Giderme

### Sık Karşılaşılan Sorunlar

**1. Database bağlantı hatası**
```bash
# Migration'ları tekrar çalıştır
npx prisma migrate reset
npx prisma migrate deploy
```

**2. JWT token hatası**
- JWT_SECRET değiştirildiğinde mevcut token'lar geçersiz olur
- Kullanıcılar yeniden giriş yapmalı

**3. Minecraft plugin bağlanamıyor**
- API anahtarının doğru olduğunu kontrol et
- Firewall ayarlarını kontrol et
- Plugin loglarını kontrol et: `logs/latest.log`

**4. Email gitmiyor**
- Email servis API anahtarını kontrol et
- Spam klasörünü kontrol et
- Domain'in SPF/DKIM kayıtlarını ayarla

---

## 🎯 İlk Gün Yapılacaklar

1. **Sosyal Medya Duyurusu**
   - Discord sunucusunda duyuru
   - Instagram/Twitter paylaşımı
   - Influencer iş birliği

2. **İlk Müşteri Kampanyası**
   - İlk 100 kayıt olana %20 bonus kredi
   - İlk alışverişe özel indirim kodu

3. **Monitoring**
   - İlk günün hatalarını takip et
   - Kullanıcı geri bildirimlerini topla
   - Performance sorunlarını hemen çöz

---

**Son Güncelleme:** 11 Ocak 2026
