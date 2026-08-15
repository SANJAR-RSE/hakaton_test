// Oddiy fayl-asosli sessiya saqlash: telegramId -> { token, name, userId }
// Bot qayta ishga tushganda ham bog'langan foydalanuvchilar tokeni saqlanib qolsin deb
// (in-memory bo'lsa restart'da hamma qayta bog'lanishga majbur bo'lardi).
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'sessions.json');

function loadAll() {
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf8'));
  } catch {
    return {};
  }
}

function saveAll(data) {
  try {
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('[sessions] saqlab bo\'lmadi:', err.message);
  }
}

function get(telegramId) {
  const all = loadAll();
  return all[String(telegramId)] || null;
}

function set(telegramId, session) {
  const all = loadAll();
  all[String(telegramId)] = session;
  saveAll(all);
}

function clear(telegramId) {
  const all = loadAll();
  delete all[String(telegramId)];
  saveAll(all);
}

module.exports = { get, set, clear };
