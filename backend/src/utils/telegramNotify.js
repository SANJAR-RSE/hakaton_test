const axios = require('axios');

// Backend to'g'ridan-to'g'ri Telegram Bot API'ga xabar yuboradi (bot process ishlab
// turmasa ham bildirishnomalar ketaveradi). Xato bo'lsa jim log qiladi — notification
// asosiy oqimni to'xtatmasligi kerak.
async function sendTelegramMessage(telegramId, text) {
  const token = process.env.BOT_TOKEN;
  if (!token || !telegramId) return;
  try {
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: telegramId,
      text,
    });
  } catch (err) {
    console.error('[telegram] xabar yuborilmadi:', err.response?.data || err.message);
  }
}

module.exports = { sendTelegramMessage };
