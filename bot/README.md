# MedQueue Tashkent — Telegram bot

Node.js + Telegraf. Backend REST API orqali ishlaydi (to'g'ridan-to'g'ri MongoDB'ga ulanmaydi) — shu bilan web va bot doim bir xil holatni ko'radi.

## Ishga tushirish
```bash
npm install
cp .env.example .env   # BOT_TOKEN va BACKEND_URL to'ldiring
npm start
```

## Nima qiladi
- `/start` — botni boshlash, hisob holatini ko'rsatish
- **Ro'yxatdan o'tish** — bot ichida to'g'ridan-to'g'ri yangi bemor hisobi yaratish (ism, telefon, parol) va shu zahoti Telegram bilan bog'lash
- **Mavjud hisobni bog'lash** — web'da ro'yxatdan o'tgan bo'lsangiz, shu yerda telefon+parol bilan bog'lang
- **📅 Yangi navbat** — klinika → bo'lim/tahlil turi → sana (bugun/ertaga) tanlab navbat olish
- **📋 Mening navbatlarim** — faol navbatlar ro'yxati + bekor qilish

## Bildirishnomalar
Navbat holati o'zgarganda (tasdiqlandi/chaqirildi) yoki navbat yaqinlashganda (≤3 kishi qoldi) — bu xabarlarni aslida **backend** to'g'ridan-to'g'ri Telegram Bot API orqali yuboradi (`backend/src/utils/telegramNotify.js`), bot process ishlab turishi shart emas. Bot faqat foydalanuvchi bilan interaktiv suhbat (buyruq berish) uchun kerak.

## Muhim
- Bitta BOT_TOKEN bilan faqat **bitta** long-polling instance ishga tushirilishi kerak — parallel ikkita `npm start` 409 xatoga va crash'ga olib keladi.
- Sessiyalar (`telegramId -> token`) `sessions.json` faylida saqlanadi (bot qayta ishga tushsa ham foydalanuvchilar qayta bog'lashi shart emas). Bu fayl `.gitignore`'da.
