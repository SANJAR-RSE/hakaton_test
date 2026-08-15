"use client";

import { useState } from "react";
import { Button, Field, inputClass } from "@/components/UI";
import { useI18n } from "@/lib/I18nContext";
import { errorMessage } from "@/lib/api";

export default function RecordModal({ appointment, onClose, onSubmit }) {
  const { t } = useI18n();
  const [notes, setNotes] = useState("");
  const [resultText, setResultText] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!notes.trim()) {
      setError(t("recordModal.notesRequired"));
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({ notes: notes.trim(), resultText: resultText.trim() || undefined });
    } catch (err) {
      setError(errorMessage(err, t, "recordModal.saveError"));
      setSubmitting(false);
    }
  }

  const patientLabel =
    appointment?.patientId?.name || appointment?.patientName || t("common.patient");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-md rounded-xl2 bg-white p-5 shadow-card dark:bg-slate-900">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
          {t("recordModal.title")}
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {t("recordModal.subtitle", { name: patientLabel })}
        </p>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <Field label={t("recordModal.notesLabel")}>
            <textarea
              className={`${inputClass} min-h-[80px] resize-none`}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("recordModal.notesPlaceholder")}
            />
          </Field>

          <Field label={t("recordModal.resultLabel")}>
            <textarea
              className={`${inputClass} min-h-[60px] resize-none`}
              value={resultText}
              onChange={(e) => setResultText(e.target.value)}
              placeholder={t("recordModal.resultPlaceholder")}
            />
          </Field>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
              {t("recordModal.cancel")}
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? t("recordModal.saving") : t("recordModal.save")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
