const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

async function auth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Token topilmadi' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ error: 'Foydalanuvchi topilmadi' });

    req.user = user;
    if (user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: user._id });
      req.doctor = doctor;
    }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token yaroqsiz' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Ruxsat yo\'q' });
    }
    next();
  };
}

module.exports = { auth, requireRole };
