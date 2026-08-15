const problems = [
  {
    title: 'Soatlab jonli navbat',
    desc: "Bemorlar shifoxona yo'lagida stul yoki oyoqda soatlab kutadi, ish yoki kundalik ishlarga vaqt qolmaydi.",
    icon: (
      <path d="M12 6v6l4 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    title: 'Navbat qachonligi noaniq',
    desc: "Qancha odam qolgani, o'z navbati qachon kelishi noma'lum — bemor doim tashvish va noaniqlikda.",
    icon: (
      <path d="M12 17h.01M12 8v5M12 3a9 9 0 100 18 9 9 0 000-18z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    title: "Tarqoq tibbiy tarix",
    desc: "Tahlil va ko'rik natijalari qog'ozlarda, turli papkalarda yo'qolib qoladi — kerak paytda topib bo'lmaydi.",
    icon: (
      <path d="M9 12h6m-6 4h6m1 5H8a2 2 0 01-2-2V5a2 2 0 012-2h5l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
]

export default function Problem() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Toshkent tibbiyotida tanish muammo
        </h2>
        <p className="mt-4 text-lg text-slate-600">
          Har kuni minglab bemorlar shifoxona va poliklinikalarda shu uchta qiyinchilikka duch keladi.
        </p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {problems.map((p) => (
          <div
            key={p.title}
            className="group rounded-2xl border border-slate-100 bg-white p-7 shadow-card transition-all hover:-translate-y-1 hover:shadow-soft"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-500 transition-colors group-hover:bg-rose-100">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                {p.icon}
              </svg>
            </div>
            <h3 className="mt-5 text-lg font-bold text-slate-900">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
