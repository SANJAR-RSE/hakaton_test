# MedQueue Tashkent — Landing

Toshkent shifoxonalari, poliklinikalari va xususiy klinikalari uchun **MedQueue** xizmatini
tanishtiruvchi statik marketing sahifasi. Backend'ga ulanmaydi — faqat "Navbat olish" va
"Telegram bot" tugmalari orqali tashqi manzillarga (web ilova, Telegram bot) yo'naltiradi.

## Stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- Mustaqil `package.json` — boshqa papkalarga (`web`, `backend`, `bot`) bog'liq emas

## Ishga tushirish

```bash
npm install
npm run dev       # http://localhost:5173
```

## Build

```bash
npm run build      # dist/ papkasiga statik fayllar chiqadi
npm run preview    # build natijasini lokal tekshirish
```

## Muhit o'zgaruvchilari

`.env.example` faylidan nusxa olib `.env` yarating:

```bash
cp .env.example .env
```

| O'zgaruvchi     | Tavsif                                             | Default                 |
| ---------------- | --------------------------------------------------- | ------------------------ |
| `VITE_WEB_URL`   | "Navbat olish" tugmalari yo'naltiradigan web ilova manzili | `http://localhost:3000` |
| `VITE_BOT_URL`   | Telegram bot manzili                                | `https://t.me/`         |

## Sahifa tarkibi

1. **Header** — logo, navigatsiya, "Navbat olish" tugmasi
2. **Hero** — asosiy sarlavha, CTA'lar, illustrativ mockup karta
3. **Muammo** — uzoq navbat, noaniqlik, tarqoq tibbiy tarix
4. **Yechim/xususiyatlar** — onlayn navbat, Telegram bildirishnoma, tibbiy tarix, shifokor paneli
5. **Qanday ishlaydi** — 4 qadamli jarayon
6. **CTA** — yakuniy chaqiruv
7. **Footer** — loyiha nomi va Telegram bot linki

## Deploy (Vercel)

Vercel'da yangi loyiha yarating va **Root Directory**'ni `landing` qilib belgilang.
`VITE_WEB_URL` va `VITE_BOT_URL` environment variable'larini Vercel dashboard'da qo'shing.
Build buyrug'i avtomatik aniqlanadi (`npm run build`, output — `dist`).
