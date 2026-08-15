require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth.routes');
const clinicRoutes = require('./routes/clinic.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const recordRoutes = require('./routes/record.routes');
const telegramRoutes = require('./routes/telegram.routes');

const app = express();

const corsOrigins = (process.env.CORS_ORIGIN || '*')
  .split(',')
  .map((s) => s.trim());
app.use(cors({ origin: corsOrigins.includes('*') ? true : corsOrigins }));
app.use(express.json());

app.get('/health', (req, res) => res.json({ ok: true, service: 'medqueue-backend' }));

app.use('/api/auth', authRoutes);
app.use('/api', clinicRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api', recordRoutes);
app.use('/api/telegram', telegramRoutes);

// Global error handler — crash bo'lmasin
app.use((err, req, res, next) => {
  console.error('[error]', err);
  res.status(500).json({ error: 'Server xatosi' });
});

app.use((req, res) => res.status(404).json({ error: 'Topilmadi' }));

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`[server] MedQueue backend ${PORT}-portda ishga tushdi`));
  })
  .catch((err) => {
    console.error('[server] DB ulanmadi:', err.message);
    process.exit(1);
  });
