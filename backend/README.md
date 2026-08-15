# MedQueue Tashkent — Backend API

Express + Mongoose + JWT. To'liq API tavsifi: `../API_CONTRACT.md`.

## Ishga tushirish
```bash
npm install
cp .env.example .env   # MONGO_URI, JWT_SECRET, BOT_TOKEN to'ldiring
npm run seed            # demo klinika/bo'lim/shifokorlarni yaratadi
npm run dev              # yoki npm start
```
Server: `http://localhost:4000`, health-check: `GET /health`.

## Seed bilan yaratiladigan demo hisoblar
Shifokorlar (parol barchasida bir xil: `doctor123`):
- `+998900000001` — Dr. Alisher Karimov (LOR)
- `+998900000002` — Dr. Nodira Yusupova (Kardiolog)
- `+998900000003` — Dr. Bekzod Toshev (Terapevt)

## Arxitektura qisqacha
- **Modellar**: User, Clinic, Department, Doctor, Appointment (navbat), MedicalRecord
- **Navbat mantiqi**: har bir (bo'lim+sana) juftligi uchun mustaqil ketma-ket `queueNumber`; status: `pending → confirmed → called → done` (yoki istalgan vaqtda `cancelled`)
- **Bildirishnomalar**: backend Telegram Bot API'ga to'g'ridan-to'g'ri (`src/utils/telegramNotify.js`) xabar yuboradi — bot process ishlab turishi shart emas. Status `confirmed`/`called`'ga o'zgarganda va navbat ≤3 kishiga yetganda yuboriladi.
- **Bot integratsiyasi**: `/api/telegram/register` va `/api/telegram/link` orqali bot foydalanuvchi nomidan JWT token oladi va odatdagi `/api/appointments*` endpoint'laridan foydalanadi — web va bot bir xil ma'lumotlarga ishlaydi.

## Deploy (Render)
Root Directory = `backend`, Build = `npm install`, Start = `npm start`. Env: `MONGO_URI`, `JWT_SECRET`, `BOT_TOKEN`, `CORS_ORIGIN`. `PORT`ni Render o'zi beradi.
