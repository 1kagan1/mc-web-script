import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-4xl px-4 py-16">
        <Link href="/" className="inline-flex items-center text-orange-500 hover:text-orange-400 mb-8">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Ana Sayfaya Dön
        </Link>

        <h1 className="text-4xl font-bold mb-4">Gizlilik Politikası</h1>
        <p className="text-zinc-400 mb-8">Son Güncelleme: 11 Ocak 2026</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Toplanan Bilgiler</h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              Hizmetlerimizi kullanırken aşağıdaki bilgileri topluyoruz:
            </p>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li><strong>Hesap Bilgileri:</strong> Email adresi, kullanıcı adı, şifre (hashlenmiş)</li>
              <li><strong>Satın Alma Bilgileri:</strong> Sipariş geçmişi, kredi hareketleri</li>
              <li><strong>Minecraft Bilgileri:</strong> Oyun içi kullanıcı adı</li>
              <li><strong>Teknik Bilgiler:</strong> IP adresi, tarayıcı bilgisi (sadece güvenlik için)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Bilgilerin Kullanımı</h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              Topladığımız bilgileri şu amaçlarla kullanırız:
            </p>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>Hesabınızı oluşturma ve yönetme</li>
              <li>Satın alımlarınızı işleme alma ve teslimat</li>
              <li>Size email bildirimleri gönderme (sipariş onayı, şifre sıfırlama)</li>
              <li>Minecraft sunucusunda ürün teslimatı</li>
              <li>Güvenlik ve dolandırıcılık önleme</li>
              <li>Hizmetlerimizi geliştirme</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Bilgi Paylaşımı</h2>
            <p className="text-zinc-300 leading-relaxed">
              Kişisel bilgilerinizi <strong>asla</strong> üçüncü şahıslarla satmaz veya kiralamayz.
              Bilgileriniz sadece şu durumlarda paylaşılabilir:
            </p>
            <ul className="list-disc list-inside text-zinc-300 space-y-2 mt-4">
              <li>Yasal zorunluluklar (mahkeme kararı, yasal süreç)</li>
              <li>Hizmet sağlayıcılar (email servisi, hosting - gizlilik sözleşmesi ile)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Veri Güvenliği</h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              Bilgilerinizin güvenliği için şu önlemleri alıyoruz:
            </p>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>Şifreler bcrypt ile hashlenmiş olarak saklanır</li>
              <li>HTTPS ile şifreli bağlantı</li>
              <li>JWT token tabanlı kimlik doğrulama</li>
              <li>Düzenli güvenlik güncellemeleri</li>
              <li>Admin erişim logları</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Çerezler (Cookies)</h2>
            <p className="text-zinc-300 leading-relaxed">
              Sitemiz kimlik doğrulama için çerezler kullanır. Tarayıcınızdan çerezleri devre dışı bırakabilirsiniz,
              ancak bu durumda bazı özellikler çalışmayabilir.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. KVKK Uyumluluğu</h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında haklarınız:
            </p>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>İşlenmişse bilgi talep etme</li>
              <li>İşlenme amacını öğrenme</li>
              <li>Yurt içi veya yurt dışında aktarılıp aktarılmadığını öğrenme</li>
              <li>Düzeltme veya silme talep etme</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed mt-4">
              Bu haklarınızı kullanmak için bizimle iletişime geçebilirsiniz.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Veri Saklama Süresi</h2>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li><strong>Hesap Bilgileri:</strong> Hesap silinene kadar</li>
              <li><strong>Sipariş Geçmişi:</strong> 5 yıl (muhasebe zorunluluğu)</li>
              <li><strong>Login Logları:</strong> 90 gün</li>
              <li><strong>Email İletişimi:</strong> 1 yıl</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Hesap Silme</h2>
            <p className="text-zinc-300 leading-relaxed">
              Hesabınızı silmek isterseniz bizimle iletişime geçin. Hesabınız ve kişisel bilgileriniz
              30 gün içinde silinecektir. Sipariş geçmişi muhasebe zorunluluğu nedeniyle anonim olarak saklanacaktır.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">9. Çocukların Gizliliği</h2>
            <p className="text-zinc-300 leading-relaxed">
              Hizmetlerimiz 13 yaş ve üzeri kullanıcılara yöneliktir. 13 yaşından küçük çocuklardan
              bilerek kişisel bilgi toplamıyoruz.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">10. Politika Değişiklikleri</h2>
            <p className="text-zinc-300 leading-relaxed">
              Bu gizlilik politikası zaman zaman güncellenebilir. Önemli değişiklikler email ile bildirilecektir.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">11. İletişim</h2>
            <p className="text-zinc-300 leading-relaxed">
              Gizlilik politikası hakkında sorularınız için bizimle iletişime geçebilirsiniz:
            </p>
            <div className="mt-4 p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
              <p className="text-zinc-300">Discord: [Sunucu Linki]</p>
              <p className="text-zinc-300">Email: privacy@yourdomain.com</p>
            </div>
          </section>
        </div>

        <div className="mt-12 p-6 bg-orange-500/10 border border-orange-500/50 rounded-lg">
          <p className="text-sm text-orange-200">
            <strong>Not:</strong> Bu gizlilik politikası şablon olarak hazırlanmıştır. Production'da
            hukuk danışmanı ile gözden geçirilmesi önerilir.
          </p>
        </div>
      </div>
    </div>
  );
}
