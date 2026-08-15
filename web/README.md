# MedQueue Tashkent — Web (frontend)

Toshkent shifoxonalarida onlayn navbat + tibbiy tarix — bemor va shifokor uchun veb-ilova.

Stack: **Next.js 14 (App Router, JavaScript)** + **Tailwind CSS**. Alohida `package.json` bilan mustaqil loyiha (`web/`).

## Nima qilingan

- **Auth**: `/login`, `/register` — telefon + parol. Token va foydalanuvchi `localStorage`'da saqlanadi, har bir so'rovga `Authorization: Bearer` header avtomatik qo'shiladi (`lib/api.js`, `lib/AuthContext.js`).
- **`/`** — token/role holatiga qarab `/login`, `/appointments` (patient) yoki `/doctor` (doctor) ga redirect.
- **`/book`** — bemor uchun: klinika → bo'lim/tahlil turi → (ixtiyoriy) shifokor → sana → "Navbat olish". Muvaffaqiyatli bo'lsa navbat raqami katta qilib ko'rsatiladi.
- **`/appointments`** — bemorning joriy navbatlari (status bilan) + bekor qilish tugmasi, pastda "Tibbiy tarix" bo'limi (`GET /medical-records/me`).
- **`/doctor`** — faqat `role=doctor`: klinika/bo'lim/sana tanlab navbat ro'yxatini ko'rish (`GET /appointments/queue`), har qatorda holatga mos amal tugmasi (Tasdiqlash → Chaqirish → Tugallandi) va "Bekor qilish". "Tugallandi" bosilganda modal orqali izoh/natija kiritilib, `status=done` + `POST /appointments/:id/record` yuboriladi.
- Har bir sahifada **loading / empty / error** holatlari, `try/catch` bilan fetch xatolarini ushlash, responsive (mobil) dizayn, minimal SaaS uslub (oq fon, medik-yashil aksent, yumshoq soyalar, rounded card'lar).

## Ishga tushirish

```bash
cd web
npm install
cp .env.local.example .env.local   # kerak bo'lsa API URL'ni o'zgartiring
npm run dev
```

`http://localhost:3000` da ochiladi.

## Kerakli environment

`.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

Berilmasa, kod ichida shu manzilga fallback qilinadi (`http://localhost:4000/api`).

## Build

```bash
npm run build
```

Build muvaffaqiyatli tekshirilgan (`next build` xatosiz o'tadi, barcha sahifalar statik generatsiya qilinadi).

## API contract bo'yicha qabul qilingan taxminlar

Backend hali alohida qurilayotgani uchun quyidagi noaniq joylarda `API_CONTRACT.md`ga zid bo'lmagan holda oqilona taxmin qilindi:

- `appointments/me`, `appointments/queue` javobidagi `clinicId`/`departmentId`/`doctorId` maydonlari **populyatsiya qilingan object** (`{ _id, name, ... }`) yoki oddiy id-string bo'lishi mumkin deb hisoblab, ikkala holatni ham xavfsiz ko'rsatadigan `fieldName()` helper yozildi (`lib/format.js`) — object bo'lsa `.name`, bo'lmasa fallback matn ko'rsatiladi.
- `appointments/queue` javobidagi bemor ma'lumoti uchun `patientId: { name, phone }` shaklini kutdim (kontraktda aniq maydon nomi yo'q), shuningdek `patientName`/`patientPhone` kabi flat variantlarni ham fallback sifatida qo'llab-quvvatladim.
- "Tugallandi" tugmasi bosilganda ikkita so'rov ketma-ket yuboriladi: avval `PATCH /appointments/:id/status {status:"done"}`, keyin `POST /appointments/:id/record`. Kontraktda "record faqat done qilinayotganda" deyilgan, lekin status o'zgarishi avtomatik yon-effekt sifatida sodir bo'ladimi yoki alohida chaqirilishi kerakmi aniq emas — shu sabab ikkalasi ham aniq chaqiriladi (agar backend record yaratishda avtomatik `done` qilib qo'ysa, ortiqcha PATCH zararsiz bo'ladi).
- Shifokor sahifasida "mening bo'limim" kabi endpoint yo'q, shuning uchun shifokor ham bemor kabi klinika → bo'lim tanlab, keyin shu bo'lim+sana bo'yicha navbatni yuklaydi.
- Doctor sahifasida "Bekor qilish" tugmasi ham qo'shildi (`status: "cancelled"`) — kontraktdagi status enum'iga kiradi, demo uchun foydali deb topildi.

## Papka tuzilishi

```
web/
├── app/            # App Router sahifalari (login, register, book, appointments, doctor)
├── components/     # Qayta ishlatiladigan UI (Navbar, RequireAuth, RecordModal, UI.js)
├── lib/            # api.js (fetch wrapper + token), AuthContext.js, format.js
└── .env.local.example
```
