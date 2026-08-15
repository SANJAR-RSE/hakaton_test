const router = require('express').Router();
const Appointment = require('../models/Appointment');
const { auth, requireRole } = require('../middleware/auth');
const { sendTelegramMessage } = require('../utils/telegramNotify');

// Bemor — yangi navbat olish
router.post('/', auth, requireRole('patient'), async (req, res) => {
  try {
    const { clinicId, departmentId, doctorId, date } = req.body;
    if (!clinicId || !departmentId || !date) {
      return res.status(400).json({ error: 'clinicId, departmentId, date shart' });
    }

    const last = await Appointment.findOne({ departmentId, date })
      .sort({ queueNumber: -1 })
      .limit(1);
    const queueNumber = last ? last.queueNumber + 1 : 1;

    const appointment = await Appointment.create({
      patientId: req.user._id,
      clinicId,
      departmentId,
      doctorId: doctorId || null,
      date,
      queueNumber,
      status: 'pending',
    });

    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Bemor — o'z navbatlari
router.get('/me', auth, requireRole('patient'), async (req, res) => {
  const appointments = await Appointment.find({ patientId: req.user._id })
    .populate('clinicId', 'name')
    .populate('departmentId', 'name type')
    .populate('doctorId', 'name')
    .sort({ createdAt: -1 });
  res.json(appointments);
});

// Bemor — navbatni bekor qilish
router.delete('/:id', auth, requireRole('patient'), async (req, res) => {
  const appointment = await Appointment.findOne({ _id: req.params.id, patientId: req.user._id });
  if (!appointment) return res.status(404).json({ error: 'Navbat topilmadi' });
  appointment.status = 'cancelled';
  await appointment.save();
  await recomputeQueuePositions(appointment.departmentId, appointment.date);
  res.json({ ok: true });
});

// Shifokor — bo'lim+sana bo'yicha navbat ro'yxati
router.get('/queue', auth, requireRole('doctor', 'admin'), async (req, res) => {
  const { departmentId, date } = req.query;
  if (!departmentId || !date) {
    return res.status(400).json({ error: 'departmentId, date shart' });
  }
  const appointments = await Appointment.find({ departmentId, date, status: { $ne: 'cancelled' } })
    .populate('patientId', 'name phone')
    .sort({ queueNumber: 1 });
  res.json(appointments);
});

// Shifokor — status o'zgartirish (confirmed/called/done/cancelled)
router.patch('/:id/status', auth, requireRole('doctor', 'admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'confirmed', 'called', 'done', 'cancelled'];
    if (!allowed.includes(status)) return res.status(400).json({ error: 'status noto\'g\'ri' });

    const appointment = await Appointment.findById(req.params.id).populate('patientId', 'telegramId');
    if (!appointment) return res.status(404).json({ error: 'Navbat topilmadi' });

    appointment.status = status;
    await appointment.save();

    const patientTelegramId = appointment.patientId?.telegramId;
    if (status === 'confirmed' && patientTelegramId) {
      sendTelegramMessage(
        patientTelegramId,
        `Navbatingiz tasdiqlandi. Navbat raqamingiz: ${appointment.queueNumber}`
      );
    }
    if (status === 'called' && patientTelegramId) {
      sendTelegramMessage(patientTelegramId, 'Navbatingiz keldi! Iltimos, qabulxonaga kiring.');
    }

    if (status === 'done' || status === 'cancelled') {
      await recomputeQueuePositions(appointment.departmentId, appointment.date);
    }

    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Navbatdagi qolgan (pending/confirmed) bemorlarning oldida nechta kishi qolganini
// qayta hisoblaydi; agar <=3 bo'lsa va telegram ulangan bo'lsa — ogohlantiradi.
async function recomputeQueuePositions(departmentId, date) {
  const active = await Appointment.find({
    departmentId,
    date,
    status: { $in: ['pending', 'confirmed'] },
  })
    .populate('patientId', 'telegramId')
    .sort({ queueNumber: 1 });

  for (let i = 0; i < active.length; i++) {
    const position = i + 1; // oldinda shuncha kishi (o'zi bilan)
    const telegramId = active[i].patientId?.telegramId;
    if (position <= 3 && telegramId) {
      const remaining = position - 1;
      sendTelegramMessage(
        telegramId,
        remaining === 0
          ? 'Navbat sizga yetdi, tayyor turing!'
          : `Navbatingizga ${remaining} kishi qoldi.`
      );
    }
  }
}

module.exports = router;
