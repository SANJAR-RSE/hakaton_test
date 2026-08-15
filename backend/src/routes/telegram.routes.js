const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function sign(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
}

// Bot orqali: bemor telefon+parol bilan "kiradi" va shu bilan telegramId profiliga bog'lanadi.
// Login bilan bir xil, farqi — telegramId'ni ham profilga yozib qo'yadi va bot navbat
// olish/ko'rish uchun ishlata oladigan JWT token qaytaradi.
router.post('/link', async (req, res) => {
  try {
    const { phone, password, telegramId } = req.body;
    if (!phone || !password || !telegramId) {
      return res.status(400).json({ error: 'phone, password, telegramId shart' });
    }
    const user = await User.findOne({ phone });
    if (!user) return res.status(400).json({ error: 'Telefon yoki parol xato' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ error: 'Telefon yoki parol xato' });

    user.telegramId = String(telegramId);
    await user.save();
    const token = sign(user);
    res.json({ ok: true, token, user: { id: user._id, name: user.name, phone: user.phone, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Bot orqali: yangi bemor ro'yxatdan o'tishi va shu zahoti telegramId bilan bog'lanishi.
router.post('/register', async (req, res) => {
  try {
    const { name, phone, password, telegramId } = req.body;
    if (!name || !phone || !password || !telegramId) {
      return res.status(400).json({ error: 'name, phone, password, telegramId shart' });
    }
    const exists = await User.findOne({ phone });
    if (exists) return res.status(400).json({ error: 'Bu telefon raqam ro\'yxatdan o\'tgan' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      phone,
      passwordHash,
      role: 'patient',
      telegramId: String(telegramId),
    });
    const token = sign(user);
    res.json({ ok: true, token, user: { id: user._id, name: user.name, phone: user.phone, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/status', async (req, res) => {
  const { telegramId } = req.query;
  if (!telegramId) return res.status(400).json({ error: 'telegramId shart' });
  const user = await User.findOne({ telegramId: String(telegramId) });
  if (!user) return res.json({ linked: false });
  res.json({ linked: true, user: { name: user.name, phone: user.phone, id: user._id } });
});

module.exports = router;
