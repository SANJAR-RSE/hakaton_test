require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const api = require('./api');
const sessions = require('./sessions');

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) {
  console.error('[bot] BOT_TOKEN topilmadi (.env)');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

// chatId -> { action, step, data } — qisqa muddatli, ko'p qadamli suhbat holati
const pending = new Map();

const mainMenu = Markup.keyboard([
  ['📅 Yangi navbat', '📋 Mening navbatlarim'],
  ['ℹ️ Yordam'],
]).resize();

const authMenu = Markup.inlineKeyboard([
  [Markup.button.callback('🆕 Ro\'yxatdan o\'tish', 'menu:register')],
  [Markup.button.callback('🔑 Mavjud hisobni bog\'lash', 'menu:link')],
]);

function today() {
  return new Date().toISOString().slice(0, 10);
}
function tomorrow() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function getSession(ctx) {
  return sessions.get(ctx.from.id);
}

async function requireAuth(ctx) {
  const s = getSession(ctx);
  if (!s || !s.token) {
    await ctx.reply(
      'Avval hisobingizni bog\'lashingiz kerak 🙏',
      authMenu
    );
    return null;
  }
  return s;
}

// ---------- /start ----------
bot.start(async (ctx) => {
  const s = getSession(ctx);
  if (s) {
    await ctx.reply(
      `Salom, ${s.name}! 👋\nMedQueue Tashkent botiga xush kelibsiz.`,
      mainMenu
    );
  } else {
    await ctx.reply(
      'Salom! 👋 Men — MedQueue Tashkent boti.\n\n' +
        'Shifoxona/klinika navbatini onlayn olish, navbat yaqinlashganda xabar olish va tibbiy tarixingizni ko\'rish uchun avval hisobingizni bog\'lang.',
      authMenu
    );
  }
});

bot.hears('ℹ️ Yordam', (ctx) =>
  ctx.reply(
    'MedQueue Tashkent bot buyruqlari:\n' +
      '📅 Yangi navbat — klinika/bo\'lim tanlab navbat olish\n' +
      '📋 Mening navbatlarim — joriy navbatlaringiz va tibbiy tarix\n' +
      '/start — botni qayta boshlash'
  )
);

// ---------- Ro'yxatdan o'tish / bog'lash ----------
bot.action('menu:register', async (ctx) => {
  await ctx.answerCbQuery();
  pending.set(ctx.from.id, { action: 'register', step: 'name', data: {} });
  await ctx.reply('Ismingizni kiriting:');
});

bot.action('menu:link', async (ctx) => {
  await ctx.answerCbQuery();
  pending.set(ctx.from.id, { action: 'link', step: 'phone', data: {} });
  await ctx.reply('Ro\'yxatdan o\'tgan telefon raqamingizni kiriting (masalan +998901234567):');
});

// ---------- Yangi navbat ----------
bot.hears('📅 Yangi navbat', async (ctx) => {
  const s = await requireAuth(ctx);
  if (!s) return;
  await startBooking(ctx);
});

async function startBooking(ctx) {
  try {
    const clinics = await api.getClinics();
    if (!clinics.length) return ctx.reply('Hozircha klinikalar mavjud emas.');
    const buttons = clinics.map((c) => [Markup.button.callback(c.name, `clinic:${c._id}`)]);
    pending.set(ctx.from.id, { action: 'book', step: 'clinic', data: {} });
    await ctx.reply('Klinikani tanlang:', Markup.inlineKeyboard(buttons));
  } catch (err) {
    await ctx.reply(`Xatolik: ${err.message}`);
  }
}

bot.action(/^clinic:(.+)$/, async (ctx) => {
  await ctx.answerCbQuery();
  const clinicId = ctx.match[1];
  try {
    const depts = await api.getDepartments(clinicId);
    if (!depts.length) return ctx.reply('Bu klinikada bo\'lim topilmadi.');
    const buttons = depts.map((d) => [
      Markup.button.callback(`${d.name}${d.type === 'analysis' ? ' (tahlil)' : ''}`, `dept:${d._id}`),
    ]);
    const st = pending.get(ctx.from.id) || { action: 'book', data: {} };
    st.data.clinicId = clinicId;
    st.step = 'department';
    pending.set(ctx.from.id, st);
    await ctx.reply('Bo\'lim yoki tahlil turini tanlang:', Markup.inlineKeyboard(buttons));
  } catch (err) {
    await ctx.reply(`Xatolik: ${err.message}`);
  }
});

bot.action(/^dept:(.+)$/, async (ctx) => {
  await ctx.answerCbQuery();
  const departmentId = ctx.match[1];
  const st = pending.get(ctx.from.id) || { action: 'book', data: {} };
  st.data.departmentId = departmentId;
  st.step = 'date';
  pending.set(ctx.from.id, st);
  await ctx.reply(
    'Qaysi sanaga navbat olasiz?',
    Markup.inlineKeyboard([
      [Markup.button.callback(`Bugun (${today()})`, 'date:today')],
      [Markup.button.callback(`Ertaga (${tomorrow()})`, 'date:tomorrow')],
    ])
  );
});

bot.action(/^date:(today|tomorrow)$/, async (ctx) => {
  await ctx.answerCbQuery();
  const date = ctx.match[1] === 'today' ? today() : tomorrow();
  await finishBooking(ctx, date);
});

async function finishBooking(ctx, date) {
  const s = getSession(ctx);
  if (!s) return ctx.reply('Avval hisobingizni bog\'lang.', authMenu);
  const st = pending.get(ctx.from.id);
  if (!st || !st.data.clinicId || !st.data.departmentId) {
    return ctx.reply('Iltimos, "📅 Yangi navbat" tugmasidan qaytadan boshlang.');
  }
  try {
    const appt = await api.createAppointment(s.token, {
      clinicId: st.data.clinicId,
      departmentId: st.data.departmentId,
      date,
    });
    pending.delete(ctx.from.id);
    await ctx.reply(
      `✅ Navbat olindi!\nNavbat raqamingiz: ${appt.queueNumber}\nSana: ${appt.date}\n\nNavbatingiz yaqinlashganda sizga shu yerda xabar beramiz.`,
      mainMenu
    );
  } catch (err) {
    await ctx.reply(`Xatolik: ${err.message}`);
  }
}

// ---------- Mening navbatlarim ----------
bot.hears('📋 Mening navbatlarim', async (ctx) => {
  const s = await requireAuth(ctx);
  if (!s) return;
  try {
    const appts = await api.myAppointments(s.token);
    const active = appts.filter((a) => !['done', 'cancelled'].includes(a.status));
    if (!active.length) {
      return ctx.reply('Hozircha faol navbatingiz yo\'q. "📅 Yangi navbat" orqali navbat oling.', mainMenu);
    }
    const statusText = {
      pending: 'Kutilmoqda',
      confirmed: 'Tasdiqlangan',
      called: 'Chaqirildi',
    };
    for (const a of active) {
      const deptName = a.departmentId?.name || '';
      const clinicName = a.clinicId?.name || '';
      await ctx.reply(
        `🏥 ${clinicName}\n📋 ${deptName}\n🔢 Navbat: ${a.queueNumber}\n📅 Sana: ${a.date}\n⏳ Holat: ${statusText[a.status] || a.status}`,
        Markup.inlineKeyboard([[Markup.button.callback('❌ Bekor qilish', `cancel:${a._id}`)]])
      );
    }
  } catch (err) {
    await ctx.reply(`Xatolik: ${err.message}`);
  }
});

bot.action(/^cancel:(.+)$/, async (ctx) => {
  await ctx.answerCbQuery();
  const s = getSession(ctx);
  if (!s) return ctx.reply('Avval hisobingizni bog\'lang.', authMenu);
  try {
    await api.cancelAppointment(s.token, ctx.match[1]);
    await ctx.editMessageText('❌ Navbat bekor qilindi.');
  } catch (err) {
    await ctx.reply(`Xatolik: ${err.message}`);
  }
});

// ---------- Matn (ko'p qadamli forma) ----------
bot.on('text', async (ctx, next) => {
  const st = pending.get(ctx.from.id);
  if (!st) return next ? next() : undefined;

  const text = ctx.message.text.trim();

  if (st.action === 'register') {
    if (st.step === 'name') {
      st.data.name = text;
      st.step = 'phone';
      return ctx.reply('Telefon raqamingizni kiriting (masalan +998901234567):');
    }
    if (st.step === 'phone') {
      st.data.phone = text;
      st.step = 'password';
      return ctx.reply('Parol o\'ylab toping (kamida 4 belgi):');
    }
    if (st.step === 'password') {
      st.data.password = text;
      try {
        const resp = await api.telegramRegister(st.data.name, st.data.phone, st.data.password, ctx.from.id);
        sessions.set(ctx.from.id, { token: resp.token, name: resp.user.name, userId: resp.user.id });
        pending.delete(ctx.from.id);
        return ctx.reply(`Xush kelibsiz, ${resp.user.name}! Hisobingiz yaratildi va bog'landi. ✅`, mainMenu);
      } catch (err) {
        pending.delete(ctx.from.id);
        return ctx.reply(`Xatolik: ${err.message}\nQaytadan urinib ko'ring: /start`);
      }
    }
  }

  if (st.action === 'link') {
    if (st.step === 'phone') {
      st.data.phone = text;
      st.step = 'password';
      return ctx.reply('Parolingizni kiriting:');
    }
    if (st.step === 'password') {
      st.data.password = text;
      try {
        const resp = await api.telegramLink(st.data.phone, st.data.password, ctx.from.id);
        sessions.set(ctx.from.id, { token: resp.token, name: resp.user.name, userId: resp.user.id });
        pending.delete(ctx.from.id);
        return ctx.reply(`Xush kelibsiz, ${resp.user.name}! Hisobingiz bog'landi. ✅`, mainMenu);
      } catch (err) {
        pending.delete(ctx.from.id);
        return ctx.reply(`Xatolik: ${err.message}\nQaytadan urinib ko'ring: /start`);
      }
    }
  }

  return next ? next() : undefined;
});

bot.catch((err, ctx) => {
  console.error('[bot] xato:', err);
  try {
    ctx.reply('Kutilmagan xatolik yuz berdi. Iltimos, /start bilan qayta boshlang.');
  } catch {
    /* ignore */
  }
});

// Eslatma: bot.launch() natijasidagi promise faqat bot to'xtaganda resolve bo'ladi
// (Telegraf'ning normal ishlash tartibi) — shuning uchun keyingi log darhol chiqadi.
bot.launch().catch((err) => {
  console.error('[bot] ishga tushmadi:', err.message);
  process.exit(1);
});
console.log('[bot] MedQueue bot ishga tushmoqda (long polling)...');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
