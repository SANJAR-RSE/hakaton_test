const router = require('express').Router();
const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');
const { auth, requireRole } = require('../middleware/auth');

// Shifokor — qabul/tahlil natijasini yozib qo'yadi (odatda status=done bilan birga)
router.post('/appointments/:id/record', auth, requireRole('doctor', 'admin'), async (req, res) => {
  try {
    const { notes, resultText } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Navbat topilmadi' });

    const record = await MedicalRecord.create({
      appointmentId: appointment._id,
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      clinicId: appointment.clinicId,
      departmentId: appointment.departmentId,
      notes: notes || '',
      resultText: resultText || '',
      date: appointment.date,
    });

    if (appointment.status !== 'done') {
      appointment.status = 'done';
      await appointment.save();
    }

    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Bemor — o'z tibbiy tarixi
router.get('/medical-records/me', auth, requireRole('patient'), async (req, res) => {
  const records = await MedicalRecord.find({ patientId: req.user._id })
    .populate('clinicId', 'name')
    .populate('departmentId', 'name type')
    .populate('doctorId', 'name')
    .sort({ createdAt: -1 });
  res.json(records);
});

module.exports = router;
