const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

const TOKEN_KEY = "mq_token";
const USER_KEY = "mq_user";

export function getToken() {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  if (typeof window === "undefined") return;
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

export function getUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setUser(user) {
  if (typeof window === "undefined") return;
  try {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  } catch {
    /* ignore */
  }
}

export function clearSession() {
  setToken(null);
  setUser(null);
}

/**
 * Generic API call helper.
 * Throws an Error with a human-readable (Uzbek-friendly) message on failure.
 */
export async function apiFetch(path, options = {}) {
  const { method = "GET", body, headers = {}, auth = true } = options;

  const finalHeaders = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (auth) {
    const token = getToken();
    if (token) {
      finalHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    // Bu yerda `useI18n()` chaqirib bo'lmaydi (oddiy modul, komponent emas) —
    // shuning uchun tarjima kalitini belgilab qo'yamiz, chaqiruvchi tomon
    // `err.i18nKey` bo'lsa shuni t() bilan ko'rsatadi, aks holda `err.message`ga tushadi.
    const error = new Error(
      "Serverga ulanib bo'lmadi. Internet aloqasini yoki server holatini tekshiring."
    );
    error.i18nKey = "common.networkError";
    throw error;
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    // Backend'dan kelgan xabar (data.error) hozircha faqat o'zbekcha — bu backend
    // localizatsiyasini talab qiladi, shuning uchun aynan shu holatda i18nKey
    // qo'yilmaydi va xabar backend tilida ko'rsatiladi.
    const serverMessage = data && (data.error || data.message);
    const error = new Error(serverMessage || `Xatolik yuz berdi (${res.status})`);
    error.status = res.status;
    if (!serverMessage) error.i18nKey = "common.error";
    throw error;
  }

  return data;
}

/**
 * apiFetch'dan tushgan xatoni joriy tilga mos qilib matnga aylantiradi.
 * `err.i18nKey` bo'lsa (tarmoq xatosi yoki backend'dan xabarsiz status xatosi)
 * shuni tarjima qiladi; aks holda backend'ning o'z xabarini (`err.message`,
 * hozircha faqat o'zbekcha) yoki berilgan zaxira kalitni ko'rsatadi.
 */
export function errorMessage(err, t, fallbackKey) {
  if (err && err.i18nKey) return t(err.i18nKey);
  return (err && err.message) || t(fallbackKey);
}

export { API_URL };
