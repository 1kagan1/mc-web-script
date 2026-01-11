import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-4xl px-4 py-16">
        <Link href="/" className="inline-flex items-center text-orange-500 hover:text-orange-400 mb-8">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Ana Sayfaya Dön
        </Link>

        <h1 className="text-4xl font-bold mb-4">Kullanım Şartları</h1>
        <p className="text-zinc-400 mb-8">Son Güncelleme: 11 Ocak 2026</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Genel Koşullar</h2>
            <p className="text-zinc-300 leading-relaxed">
              Bu web sitesini kullanarak aşağıdaki şartları kabul etmiş sayılırsınız. Şartları kabul etmiyorsanız,
              lütfen siteyi kullanmayınız.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Hesap Oluşturma</h2>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>Hesap oluştururken doğru ve güncel bilgiler sağlamalısınız</li>
              <li>Hesap güvenliğinden siz sorumlusunuz</li>
              <li>Hesabınızı başkalarıyla paylaşamazsınız</li>
              <li>Şüpheli aktivite tespit edilirse hesabınız askıya alınabilir</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Satın Alma ve Ödeme</h2>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>Tüm satın alımlar kredi sistemi üzerinden yapılır</li>
              <li>Krediler admin onayı ile yüklenir</li>
              <li>Satın alınan dijital ürünler iade edilemez</li>
              <li>Minecraft sunucusunda teslimat 5 dakika içinde otomatik yapılır</li>
              <li>Teknik sorunlar durumunda destek ekibimizle iletişime geçebilirsiniz</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. İade ve Cayma Hakkı</h2>
            <p className="text-zinc-300 leading-relaxed">
              Dijital ürünlerin özelliği gereği, satın alınan ürünlerde cayma hakkı bulunmamaktadır.
              Teknik bir sorun yaşanması durumunda destek ekibimizle iletişime geçebilirsiniz.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Minecraft Sunucu Kuralları</h2>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>Hile, bug kullanımı ve exploit kesinlikle yasaktır</li>
              <li>Saygılı bir dil kullanılmalıdır</li>
              <li>Spam ve reklam yasaktır</li>
              <li>Kurallara uymayan oyuncular banlanabilir</li>
              <li>Ban durumunda satın alınan ürünler iade edilmez</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Gizlilik</h2>
            <p className="text-zinc-300 leading-relaxed">
              Kişisel verilerinizin işlenmesi hakkında detaylı bilgi için{' '}
              <Link href="/legal/privacy" className="text-orange-500 hover:text-orange-400">
                Gizlilik Politikası
              </Link>{' '}
              sayfasını inceleyebilirsiniz.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Sorumluluk Reddi</h2>
            <p className="text-zinc-300 leading-relaxed">
              Minecraft sunucusunun çalışma süresi, performansı ve içeriği garantilenmez.
              Sunucu bakım, güncelleme veya teknik sorunlar nedeniyle geçici olarak kapatılabilir.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Değişiklikler</h2>
            <p className="text-zinc-300 leading-relaxed">
              Bu şartlar önceden haber verilmeksizin güncellenebilir. Değişiklikler bu sayfada yayınlanacaktır.
              Siteyi kullanmaya devam ederek güncel şartları kabul etmiş sayılırsınız.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">9. İletişim</h2>
            <p className="text-zinc-300 leading-relaxed">
              Sorularınız için bizimle Discord sunucumuz üzerinden iletişime geçebilirsiniz.
            </p>
          </section>
        </div>

        <div className="mt-12 p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
          <p className="text-sm text-zinc-400">
            Bu kullanım şartlarını kabul ederek, yukarıdaki tüm maddeleri okuduğunuzu ve kabul ettiğinizi beyan edersiniz.
          </p>
        </div>
      </div>
    </div>
  );
}
