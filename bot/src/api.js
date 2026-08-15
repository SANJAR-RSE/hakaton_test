const axios = require('axios');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000/api';

const client = axios.create({ baseURL: BACKEND_URL, timeout: 10000 });

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function unwrap(promise) {
  return promise
    .then((res) => res.data)
    .catch((err) => {
      const message = err.response?.data?.error || 'Serverga ulanib bo\'lmadi. Birozdan so\'ng qayta urinib ko\'ring.';
      const e = new Error(message);
      e.status = err.response?.status;
      throw e;
    });
}

module.exports = {
  // Telegram link/register
  telegramLink: (phone, password, telegramId) =>
    unwrap(client.post('/telegram/link', { phone, password, telegramId })),
  telegramRegister: (name, phone, password, telegramId) =>
    unwrap(client.post('/telegram/register', { name, phone, password, telegramId })),
  telegramStatus: (telegramId) =>
    unwrap(client.get('/telegram/status', { params: { telegramId } })),

  // Clinics / departments
  getClinics: () => unwrap(client.get('/clinics')),
  getDepartments: (clinicId) => unwrap(client.get(`/clinics/${clinicId}/departments`)),

  // Appointments
  createAppointment: (token, body) =>
    unwrap(client.post('/appointments', body, { headers: authHeaders(token) })),
  myAppointments: (token) =>
    unwrap(client.get('/appointments/me', { headers: authHeaders(token) })),
  cancelAppointment: (token, id) =>
    unwrap(client.delete(`/appointments/${id}`, { headers: authHeaders(token) })),
};
