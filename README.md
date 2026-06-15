# 📚 Yo'riqnoma — Adminlar uchun qo'llanma dashboardi

Adminlar uchun **yo'riqnoma va qo'llanma** dashboardi. Adminlar matn va
videolarni kiritadi; foydalanuvchilar bo'limlarni o'qiydi, testlardan o'tadi,
to-do ro'yxatini belgilaydi va career roadmap'ni ko'radi.

## Imkoniyatlar

- **Admin panel** — matn (Markdown) va videolarni (YouTube/Vimeo havola yoki
  fayl yuklash) qo'shish/tahrirlash/o'chirish.
- **Bo'limlar daraxti** — ichma-ich bo'limlar (masalan: Yo'riqnoma → Holly Hop,
  ERP, Bitrix).
- **O'z-o'zini baholash** — testlar (baho: 70 o'rtacha, 80 yaxshi, 100 zo'r).
- **To-do list** — har bir foydalanuvchi o'zi uchun belgilaydi.
- **Career roadmap** — administrativ jamoa va sotuv uchun lavozim o'sishi.
- **Kirish modeli** — barcha kontent **hammaga ochiq, loginsiz** ko'riladi.
  Faqat **admin** login (email/parol) bilan kirib CRUD qiladi. To-do
  belgilashlar foydalanuvchi brauzerida (localStorage) saqlanadi.

## Texnologiyalar

Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · Supabase (Postgres, Auth,
Storage).

---

## 1. Supabase loyihasini tayyorlash

1. [supabase.com](https://supabase.com) da bepul loyiha yarating.
2. **SQL Editor** ga kiring va `supabase/schema.sql` faylini to'liq nusxalab
   ishga tushiring (jadvallar, RLS, storage bucket yaratiladi).
3. So'ng `supabase/seed.sql` ni ishga tushiring (boshlang'ich bo'limlar va
   namuna kontent qo'shiladi). _Bu ixtiyoriy._

## 2. Muhit o'zgaruvchilari

`.env.local.example` ni `.env.local` deb nusxalang va to'ldiring
(**Project Settings → API** dan oling):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

## 3. Admin foydalanuvchi yaratish

1. Supabase'da **Authentication → Users → Add user** orqali email/parol bilan
   foydalanuvchi qo'shing.
2. Foydalanuvchini **admin** qilish uchun SQL Editor'da:

   ```sql
   update public.profiles set role = 'admin'
   where email = 'sizning@email.com';
   ```

   > Yangi foydalanuvchi yaratilganda `profiles` jadvalida yozuv avtomatik
   > ochiladi (trigger orqali). Standart rol — `viewer`.

## 4. Ishga tushirish

```bash
npm install
npm run dev
```

Brauzerda [http://localhost:3000](http://localhost:3000) ni oching.

- `/login` — kirish
- `/dashboard` — bosh sahifa
- `/admin` — admin panel (faqat adminlar)

## 5. Vercel'ga deploy

1. Loyihani GitHub'ga yuklang.
2. [vercel.com](https://vercel.com) da import qiling.
3. Environment Variables bo'limiga `.env.local` dagi o'zgaruvchilarni qo'shing.
4. Deploy.

---

## Loyiha tuzilmasi

```
src/
  app/
    login/                 # kirish sahifasi
    auth/actions.ts        # signIn / signOut
    (dashboard)/           # foydalanuvchi qismi (sidebar layout)
      dashboard/           # bosh sahifa
      s/[slug]/            # bo'lim kontenti (matn + video)
      tests/               # o'z-o'zini baholash
      todo/                # to-do list
      roadmap/             # career roadmap
    admin/                 # admin panel (CRUD)
  components/              # UI komponentlar
  lib/
    supabase/              # client / server / proxy clientlar
    data.ts                # ma'lumot olish funksiyalari
    types.ts               # tiplar
supabase/
  schema.sql               # baza sxemasi + RLS + storage
  seed.sql                 # boshlang'ich kontent
```

## Matn formati (Markdown)

Admin matn yozishda Markdown ishlatishi mumkin:

```
# Katta sarlavha
## Kichik sarlavha
**qalin matn**, *kursiv*
- ro'yxat elementi
> iqtibos
`kod`
```
