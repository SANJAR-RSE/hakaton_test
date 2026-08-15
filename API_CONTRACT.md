# MedQueue Tashkent — API Contract (backend)

Base URL (dev): `http://localhost:4000/api`
Base URL (prod): `<RENDER_URL>/api` — exposed to frontend via `NEXT_PUBLIC_API_URL`.

Auth: JWT Bearer token in `Authorization: Bearer <token>` header. Token returned on register/login.

## Roles
- `patient` — default role on register
- `doctor` — created by seed/admin, logs in with phone+password like a patient

## Auth
### POST /api/auth/register
body: `{ name, phone, password }` → role always `patient`
resp: `{ token, user: { id, name, phone, role } }`

### POST /api/auth/login
body: `{ phone, password }`
resp: `{ token, user: { id, name, phone, role, doctorId? } }` (doctorId present if role=doctor)

### GET /api/auth/me
header: Bearer token
resp: `{ user }`

## Clinics / Departments
### GET /api/clinics
resp: `[{ _id, name, address }]`

### GET /api/clinics/:clinicId/departments
resp: `[{ _id, name, type: "consultation"|"analysis", clinicId }]`

### GET /api/departments/:departmentId/doctors
resp: `[{ _id, name, departmentId }]`

## Appointments (queue)
### POST /api/appointments  (patient, auth required)
body: `{ clinicId, departmentId, doctorId?, date }`  (date: "YYYY-MM-DD")
Creates appointment, assigns next `queueNumber` for that department+date.
resp: `{ _id, queueNumber, status: "pending", ... }`

### GET /api/appointments/me  (patient, auth required)
resp: `[{ _id, clinicId, departmentId, doctorId, date, queueNumber, status, createdAt }]` (populated with clinic/department names)

### DELETE /api/appointments/:id  (patient, auth required — cancel own)
resp: `{ ok: true }`

### GET /api/appointments/queue?departmentId=&date=  (doctor, auth required)
resp: list of appointments for that department/date ordered by queueNumber, with patient info populated, status != cancelled/done first.

### PATCH /api/appointments/:id/status  (doctor, auth required)
body: `{ status: "confirmed"|"called"|"done"|"cancelled" }`
Side effect: recomputes queue positions for remaining `pending` appointments in same department+date; if a patient's remaining-position <= 3, sends Telegram notification (if patient has telegramId linked). Also notifies on `called`.
resp: updated appointment

### POST /api/appointments/:id/record  (doctor, auth required — only when marking done)
body: `{ notes, resultText? }`
Creates a MedicalRecord linked to appointment+patient.
resp: created record

## Medical history
### GET /api/medical-records/me  (patient, auth required)
resp: `[{ _id, appointmentId, doctorId, clinicId, departmentName, notes, resultText, date, createdAt }]`

## Telegram linking (used by bot)
### POST /api/telegram/link
body: `{ phone, password, telegramId }`  (patient logs in from bot with existing web credentials to link)
resp: `{ ok: true, token, user: { id, name, phone, role } }` — token is a normal JWT, bot uses it for /api/appointments calls.

### POST /api/telegram/register
body: `{ name, phone, password, telegramId }`  (bot-only signup, no web account needed)
resp: `{ ok: true, token, user: { id, name, phone, role } }`

### GET /api/telegram/status?telegramId=...
resp: `{ linked: boolean, user? }`

## Status flow
`pending` → `confirmed` → `called` → `done`  (or → `cancelled` at any point before `done`)

## Notification triggers (backend sends via Telegram Bot API directly, no need for bot process to be up)
- status → `confirmed`: "Navbatingiz tasdiqlandi. Navbat raqamingiz: N"
- queue position recalculated and patient is now <=3rd in line: "Navbatingizga N kishi qoldi"
- status → `called`: "Navbatingiz keldi! Iltimos, qabulxonaga kiring."

## Error shape
`{ error: "message" }` with appropriate HTTP status (400/401/403/404/500)
