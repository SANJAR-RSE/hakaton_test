const features = [
  {
    title: 'Onlayn navbat olish',
    desc: "Klinika va bo'limni tanlab, bir necha bosishda navbat oling — uyingizdan chiqmasdan turib.",
    icon: (
      <path d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    title: 'Telegram bildirishnoma',
    desc: "Navbatingiz yaqinlashganda Telegram orqali darhol xabar olasiz — vaqtida yetib kelasiz.",
    icon: (
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    title: 'Tibbiy tarix bitta joyda',
    desc: "Barcha ko'rik va tahlil natijalari xavfsiz saqlanadi, istalgan vaqtda telefoningizdan ko'rasiz.",
    icon: (
      <path d="M9 12h6m-6 4h6m1 5H8a2 2 0 01-2-2V5a2 2 0 012-2h5l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    title: 'Shifokor uchun panel',
    desc: "Shifokor va klinika xodimlari navbatlarni real vaqtda boshqaradi, bemor tarixini tez ko'radi.",
    icon: (
      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
]

export default function Features() {
  return (
    <section className="bg-slate-50/70 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Bitta yechim — to'rtta aniq foyda
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            MedQueue navbat va tibbiy tarixni raqamlashtirib, bemor va shifokor uchun jarayonni soddalashtiradi.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-slate-100 bg-white p-7 shadow-card transition-all hover:-translate-y-1 hover:border-brand-100 hover:shadow-soft"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  {f.icon}
                </svg>
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
