# MedQueue Tashkent

Toshkent shifoxonalari, poliklinikalari va xususiy klinikalarida bemorlar jonli navbatda soatlab kutadi, navbati qachon kelishini bilmaydi, va o'tgan ko'riklar/tahlil natijalari tarqoq holda yo'qoladi.

**MedQueue** — bemorlarga shifokor qabuliga va tahlilga onlayn navbat olish, navbat yaqinlashganda Telegram orqali xabardor bo'lish, va o'z tibbiy tarixini (ko'riklar + tahlil natijalari) bir joyda ko'rish imkonini beruvchi platforma.

## Live linklar
| Qism | Manzil | Holat |
|---|---|---|
| Web (asosiy ilova) | https://web-rho-ruby-41.vercel.app | ✅ live |
| Landing | https://landing-sand-eight-21.vercel.app | ✅ live |
| Backend API | https://medqueue-backend-e8o3.onrender.com | ✅ live (`/health`) |
| Telegram bot | https://t.me/hakatontest_bot | ✅ live |
| Taqdimot (auto-play, ovozli) | https://presentation-henna-eight.vercel.app | ✅ live |

> Eslatma: backend Render'ning bepul tarifida — ~15 daqiqa harakatsizlikdan keyin "uxlab qoladi", birinchi so'rov 30-60s cho'zilishi mumkin. Demo oldidan bir marta `/health`'ga so'rov yuborib "isitib qo'ying".

## Loyiha tuzilishi (monorepo)
```
repo/
├── web/       — bemor/shifokor uchun asosiy ilova (Next.js)
├── landing/   — tanishtiruv sayti (Vite + React)
├── backend/   — REST API (Express + Mongoose + JWT)
└── bot/       — Telegram bot (Telegraf), backend API orqali ishlaydi
```
Har bir qism — mustaqil `package.json`, mustaqil deploy. To'liq API kontrakti: [`API_CONTRACT.md`](./API_CONTRACT.md).

## Nima qilingan
- **Bemor**: ro'yxatdan o'tish/kirish (web yoki bot), klinika+bo'lim/tahlil tanlab onlayn navbat olish, navbat holatini kuzatish, navbat yaqinlashganda avtomatik bildirishnoma, o'z tibbiy tarixini (barcha ko'rik/tahlil natijalari) ko'rish
- **Shifokor**: bo'lim+sana bo'yicha navbat ro'yxati, bemorni chaqirish/tasdiqlash/yakunlash, ko'rik/tahlil natijasini bemor profiliga yozish
- **Telegram bot**: web bilan bir xil backend'ga ulangan — bot orqali ham ro'yxatdan o'tish, navbat olish, navbatlarni ko'rish/bekor qilish mumkin; status o'zgarganda backend to'g'ridan-to'g'ri xabar yuboradi
- **Landing**: muammo/yechim, qanday ishlashi, web ilova va botga link

## Tezkor ishga tushirish (lokal)
Har bir papkada alohida `.env.example` bor.

```bash
# 1) Backend
cd backend && npm install && cp .env.example .env   # MONGO_URI/JWT_SECRET/BOT_TOKEN to'ldiring
npm run seed && npm run dev                          # http://localhost:4000

# 2) Bot (backend ishlab turgan bo'lishi kerak)
cd bot && npm install && cp .env.example .env         # BOT_TOKEN, BACKEND_URL
npm start

# 3) Web
cd web && npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:4000/api" > .env.local
npm run dev                                           # http://localhost:3000

# 4) Landing
cd landing && npm install && npm run dev               # http://localhost:5173
```

## Tech stack
JavaScript/Node.js, MongoDB (Atlas), Express, Mongoose, JWT, Next.js, Vite+React, Tailwind CSS, Telegraf. Backend+bot — Render, Web+Landing — Vercel.

## Demo hisoblar (seed)
Shifokorlar — parol: `doctor123`
- `+998900000001` — Dr. Alisher Karimov (LOR)
- `+998900000002` — Dr. Nodira Yusupova (Kardiolog)
- `+998900000003` — Dr. Bekzod Toshev (Terapevt)

Bemor hisobi — web yoki bot orqali istalgan telefon/parol bilan ro'yxatdan o'tiladi.
