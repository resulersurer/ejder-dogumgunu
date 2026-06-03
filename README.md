# Birthday Mail Automation

Next.js App Router, Prisma, Neon PostgreSQL ve Resend kullanılarak geliştirilmiş, şirket çalışanlarına otomatik doğum günü tebrik e-postası gönderen sistem. Vercel Cron Jobs ile günlük olarak çalışır.

## Özellikler

- **Admin Paneli:** Personel yönetimi (Ekle/Düzenle/Sil/Aktif-Pasif).
- **Dashboard:** Günlük doğum günlerini ve gönderim istatistiklerini takip edebilme.
- **Ayarlar:** E-posta şablonunu (HTML) ve gönderici bilgilerini dinamik olarak yönetebilme.
- **Gönderim Geçmişi:** Başarılı/Başarısız mail loglarını tutma.
- **Cron Job:** Her gün düzenli olarak çalışıp, aynı yıl içinde aynı kişiye mükerrer gönderim yapılmasını (idempotency) engelleme.
- **Resend Entegrasyonu:** Güvenilir ve hızlı e-posta gönderim altyapısı.

## Kurulum Adımları

### 1. Paket Kurulumu

Projeyi bilgisayarınıza indirdikten sonra kök dizinde gerekli paketleri yükleyin:

```bash
npm install
```

### 2. Environment Variables Ayarları

Proje kök dizininde `.env` adında bir dosya oluşturun ve içerisine aşağıdaki değişkenleri ekleyin:

```env
# Neon veya herhangi bir PostgreSQL bağlantı dizesi
DATABASE_URL="postgresql://kullanici:sifre@ep-ornek-123.eu-central-1.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://kullanici:sifre@ep-ornek-123.eu-central-1.aws.neon.tech/neondb?sslmode=require"

# Resend API Key (Resend.com adresinden alınacak)
RESEND_API_KEY="re_123456789"

# Vercel Cron Job güvenliği için rastgele bir secret key
CRON_SECRET="rastgele_bir_sifre_buraya"

# Admin paneli giriş bilgileri
ADMIN_EMAIL="admin@sirket.com"
ADMIN_PASSWORD="super_gizli_sifre"

# Projenizin adresi (Vercel'e yükledikten sonra güncelleyin)
APP_URL="http://localhost:3000"
```

### 3. Neon Database Bağlantısı ve 4. Prisma Migration

Prisma şemasını veritabanına uygulamak ve Prisma Client'i oluşturmak için:

```bash
npx prisma generate
npx prisma db push
# Veya Production için: npx prisma migrate deploy
```

### 5. Resend API Key ve Domain Ayarları

1. [Resend.com](https://resend.com) adresinde hesap oluşturun.
2. Yeni bir API Key oluşturup `.env` dosyasındaki `RESEND_API_KEY` kısmına yapıştırın.
3. Resend üzerinden gönderim yapmak için gönderici e-posta adresinizin alan adını (domain) Resend üzerinde doğrulamanız (verify) gerekmektedir (DNS kayıtları ile). Doğrulanmamış hesaplar sadece Resend hesabına kayıtlı e-posta adresine mail gönderebilir.

### 6. Lokal Geliştirme

Lokal geliştirme sunucusunu başlatın:

```bash
npm run dev
```

Tarayıcınızda `http://localhost:3000` adresine gidin. Sizi otomatik olarak `/admin/login` sayfasına yönlendirecektir. Belirlediğiniz `ADMIN_EMAIL` ve `ADMIN_PASSWORD` ile giriş yapabilirsiniz.

### 7. Vercel Deploy

Projeyi GitHub'a yükledikten sonra Vercel üzerinden yeni proje oluşturup repoyu bağlayın.
Vercel projenizin **Settings > Environment Variables** kısmından `.env` dosyasındaki tüm değişkenleri ekleyin.
Deploy işlemi bittikten sonra proje yayında olacaktır. Cron yapılandırması `vercel.json` dosyasından otomatik olarak algılanacaktır.

### 8. Cron Test Etme

Vercel üzerinde otomatik olarak günde 1 kez çalışır. Ancak lokalde veya Vercel'deyken manuel test etmek isterseniz Postman veya cURL gibi bir araçla endpoint'i çağırabilirsiniz:

```bash
curl -X GET "http://localhost:3000/api/cron/birthday" \
  -H "Authorization: Bearer SIZIN_CRON_SECRET_DEGERINIZ"
```

Eğer birinin doğum günüyse ve o yıl daha önce gönderim yapılmamışsa mail gönderilecek ve loglara eklenecektir.

## Teknolojiler
- Next.js App Router
- Prisma ORM
- Neon PostgreSQL
- Resend
- Tailwind CSS
- Lucide React (İkonlar)
- date-fns & date-fns-tz (Saat dilimi ve tarih işlemleri)
