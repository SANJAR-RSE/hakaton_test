const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const { auth } = require('../middleware/auth');

function sign(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
}

router.post('/register', async (req, res) => {
  try {
    const { name, phone, password } = req.body;
    if (!name || !phone || !password) {
      return res.status(400).json({ error: 'name, phone, password shart' });
    }
    const exists = await User.findOne({ phone });
    if (exists) return res.status(400).json({ error: 'Bu telefon raqam ro\'yxatdan o\'tgan' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, phone, passwordHash, role: 'patient' });
    const token = sign(user);
    res.json({ token, user: { id: user._id, name: user.name, phone: user.phone, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });
    if (!user) return res.status(400).json({ error: 'Telefon yoki parol xato' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ error: 'Telefon yoki parol xato' });

    const token = sign(user);
    const resp = { id: user._id, name: user.name, phone: user.phone, role: user.role };
    if (user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: user._id });
      if (doctor) resp.doctorId = doctor._id;
    }
    res.json({ token, user: resp });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/me', auth, async (req, res) => {
  const u = req.user;
  const resp = { id: u._id, name: u.name, phone: u.phone, role: u.role };
  if (req.doctor) resp.doctorId = req.doctor._id;
  res.json({ user: resp });
});

module.exports = router;
