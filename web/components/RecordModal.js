"use client";

import { useState } from "react";
import { Button, Field, inputClass } from "@/components/UI";

export default function RecordModal({ appointment, onClose, onSubmit }) {
  const [notes, setNotes] = useState("");
  const [resultText, setResultText] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!notes.trim()) {
      setError("Izoh (notes) kiritilishi shart.");
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({ notes: notes.trim(), resultText: resultText.trim() || undefined });
    } catch (err) {
      setError(err.message || "Saqlashda xatolik yuz berdi.");
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-md rounded-xl2 bg-white p-5 shadow-card">
        <h3 className="text-base font-bold text-slate-800">Qabulni yakunlash</h3>
        <p className="mt-1 text-sm text-slate-500">
          {appointment?.patientId?.name || appointment?.patientName || "Bemor"} uchun
          natija va izoh kiriting.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <Field label="Izoh (notes)">
            <textarea
              className={`${inputClass} min-h-[80px] resize-none`}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ko'rik davomida qayd etilgan izohlar..."
            />
          </Field>

          <Field label="Natija matni (ixtiyoriy)">
            <textarea
              className={`${inputClass} min-h-[60px] resize-none`}
              value={resultText}
              onChange={(e) => setResultText(e.target.value)}
              placeholder="Tashxis / tavsiya / tahlil natijasi..."
            />
          </Field>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
              Bekor qilish
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saqlanmoqda..." : "Saqlash va yakunlash"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
