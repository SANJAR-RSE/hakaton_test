import { WEB_URL, BOT_URL } from '../config'

function MockupCard() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-brand-100 via-brand-50 to-white blur-2xl" />

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Sizning navbatingiz</p>
            <p className="text-sm font-semibold text-slate-900">10-son Poliklinika · Terapevt</p>
          </div>
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">Faol</span>
        </div>

        <div className="flex items-center justify-center gap-6 py-8">
          <div className="text-center">
            <p className="text-5xl font-extrabold text-brand-700">14</p>
            <p className="mt-1 text-xs text-slate-500">navbat raqami</p>
          </div>
          <div className="h-14 w-px bg-slate-100" />
          <div className="text-center">
            <p className="text-5xl font-extrabold text-slate-900">~18</p>
            <p className="mt-1 text-xs text-slate-500">daqiqa qoldi</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="text-sm">
            <p className="font-medium text-slate-900">Telegram bildirishnoma</p>
            <p className="text-slate-500">"Navbatingizga 15 daqiqa qoldi"</p>
          </div>
        </div>
      </div>

      <div className="absolute -right-4 -top-4 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-card sm:-right-8">
        <p className="text-xs text-slate-400">Tibbiy tarix</p>
        <p className="text-sm font-semibold text-slate-900">12 ta natija</p>
      </div>
    </div>
  )
}

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-gradient-to-b from-brand-50/60 via-white to-white pt-16 sm:pt-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 sm:px-8 lg:grid-cols-2 lg:gap-8 lg:pb-28">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-4 py-1.5 text-xs font-semibold text-brand-700">
            Toshkent shifoxonalari uchun
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem]">
            Navbatda soatlab kutmang — <span className="text-brand-600">navbatingizni onlayn oling</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
            MedQueue Tashkent shifoxona va klinikalarga onlayn elektron navbat, Telegram orqali real vaqtdagi
            bildirishnoma va bemorning butun tibbiy tarixini bitta joyda taqdim etadi.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={WEB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-7 py-3.5 text-base font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-lg"
            >
              Navbat olish
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href={BOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-3.5 text-base font-semibold text-slate-800 transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Telegram bot
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand-500" /> Ro'yxatdan o'tish bepul
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand-500" /> Jismonan navbatda turish shart emas
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand-500" /> Natijalar doim qo'lingizda
            </div>
          </div>
        </div>

        <MockupCard />
      </div>
    </section>
  )
}
