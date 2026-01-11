import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@skyblock.com' },
    update: {},
    create: {
      email: 'admin@skyblock.com',
      password: hashedPassword,
      name: 'Admin',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create site settings
  const settings = [
    { key: 'site_name', value: 'SkyBlock', description: 'Site başlığı' },
    { key: 'site_subtitle', value: 'KALİTELİ SUNUCU', description: 'Alt başlık' },
    { key: 'hero_title', value: 'Eğlence Dünyasına Hoş Geldin!', description: 'Hero başlık' },
    { key: 'hero_description', value: 'VIP, Market ve daha fazlası - Güvenli ödeme, anında teslimat', description: 'Hero açıklama' },
    { key: 'server_ip', value: 'play.sunucu.com', description: 'Sunucu IP adresi' },
    { key: 'online_players', value: '428', description: 'Online oyuncu sayısı' },
    { key: 'server_status', value: 'AKTİF', description: 'Sunucu durumu' },
    { key: 'primary_color', value: '#f97316', description: 'Ana renk (orange-500)' },
  ];

  for (const setting of settings) {
    await prisma.settings.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log('✅ Settings created');

  // Create products
  const products = [
    {
      name: 'VIP+ Rank',
      description: 'Uçma, renkli prefix, haftalık kasa',
      price: 229,
      tag: 'Popüler',
      category: 'vip',
      order: 1,
    },
    {
      name: 'Sky Crate x5',
      description: '5 anahtar, %10 kozmetik drop, Legendary şansı',
      price: 119,
      tag: 'Yeni',
      category: 'crate',
      order: 2,
    },
    {
      name: 'Coin 2000',
      description: 'Anında bakiye, takaslanabilir, pazar uyumlu',
      price: 179,
      tag: 'Hızlı Teslim',
      category: 'currency',
      order: 3,
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }
  console.log('✅ Products created');

  // Create news
  const news = [
    {
      title: 'Kış Etkinliği Başlıyor',
      excerpt: 'Çifte drop, özel boss ve sınırlı süreli kozmetikler.',
      content: 'Kış etkinliği 11 Ocak tarihinde başlıyor! Çifte drop, özel boss ve sınırlı süreli kozmetikler sizi bekliyor.',
      tag: 'Etkinlik',
    },
    {
      title: 'Yeni SkyBlock Sezonu',
      excerpt: 'Ekonomik denge, yeni görevler ve market revizyonu.',
      content: 'Yeni sezon ile birlikte ekonomik denge, yeni görevler ve market revizyonu geliyor. Hazır olun!',
      tag: 'Güncelleme',
    },
  ];

  for (const newsItem of news) {
    await prisma.news.create({ data: newsItem });
  }
  console.log('✅ News created');

  console.log('✨ Seeding completed!');
  console.log('\n📝 Admin credentials:');
  console.log('   Email: admin@skyblock.com');
  console.log('   Password: admin123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
