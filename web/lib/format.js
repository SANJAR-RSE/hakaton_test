/**
 * Appointment/record fields referencing clinics/departments/doctors may come
 * back either as a populated object ({ _id, name, ... }) or a raw id string,
 * depending on backend population. This helper renders whichever shows up.
 */
export function fieldName(value, fallback = "—") {
  if (!value) return fallback;
  if (typeof value === "object") return value.name || fallback;
  return fallback;
}

export function formatDate(value) {
  if (!value) return "—";
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString("uz-UZ", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return String(value);
  }
}
