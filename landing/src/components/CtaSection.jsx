import { WEB_URL, BOT_URL } from '../config'

export default function CtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28">
      <div className="relative overflow-hidden rounded-3xl bg-brand-700 px-6 py-16 text-center shadow-soft sm:px-16 sm:py-20">
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-brand-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-brand-400/20 blur-3xl" />

        <h2 className="relative text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Endi navbatda soatlab kutish shart emas
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-lg text-brand-50">
          MedQueue Tashkent bilan navbatingizni hoziroq oling va tibbiy tarixingizni doim yoningizda saqlang.
        </p>

        <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={WEB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-semibold text-brand-700 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-brand-50"
          >
            Navbat olish
          </a>
          <a
            href={BOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-8 py-3.5 text-base font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-white/20"
          >
            Telegram botga o'tish
          </a>
        </div>
      </div>
    </section>
  )
}
