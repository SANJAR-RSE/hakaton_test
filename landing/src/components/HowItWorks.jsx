const steps = [
  {
    n: '01',
    title: "Ro'yxatdan o'ting",
    desc: 'Ism va telefon raqamingiz bilan bir necha soniyada hisob yarating.',
  },
  {
    n: '02',
    title: "Klinika va bo'limni tanlang",
    desc: 'Sizga qulay shifoxona, poliklinika yoki bo\'limni ro\'yxatdan tanlang.',
  },
  {
    n: '03',
    title: 'Navbat oling',
    desc: 'Bo\'sh vaqt oralig\'ini tanlab, bir bosishda elektron navbatga yoziling.',
  },
  {
    n: '04',
    title: 'Bildirishnoma oling',
    desc: 'Navbatingiz yaqinlashganda Telegram botdan xabar keladi — vaqtida keling.',
  },
]

export default function HowItWorks() {
  return (
    <section id="qanday-ishlaydi" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Qanday ishlaydi</h2>
        <p className="mt-4 text-lg text-slate-600">To'rtta oddiy qadamda navbatsiz tibbiy xizmatdan foydalaning.</p>
      </div>

      <div className="relative mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        <div className="pointer-events-none absolute top-8 left-0 hidden h-px w-full bg-gradient-to-r from-transparent via-brand-200 to-transparent lg:block" />

        {steps.map((s) => (
          <div key={s.n} className="relative flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-xl font-extrabold text-brand-600 shadow-soft ring-4 ring-white">
              {s.n}
            </div>
            <h3 className="mt-5 text-lg font-bold text-slate-900">{s.title}</h3>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-600">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
