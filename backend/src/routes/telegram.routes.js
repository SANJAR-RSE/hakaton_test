const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Bot orqali: bemor telefon+parol bilan "kiradi" va shu bilan telegramId profiliga bog'lanadi.
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
    res.json({ ok: true, user: { name: user.name, phone: user.phone } });
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
