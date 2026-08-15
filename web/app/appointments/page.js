"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import RequireAuth from "@/components/RequireAuth";
import { apiFetch, errorMessage } from "@/lib/api";
import { fieldName, formatDate } from "@/lib/format";
import { useI18n } from "@/lib/I18nContext";
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  Loading,
  StatusBadge,
} from "@/components/UI";

function AppointmentsList() {
  const { t } = useI18n();
  const [appointments, setAppointments] = useState([]);
  const [state, setState] = useState("loading"); // loading | ready | error
  const [cancellingId, setCancellingId] = useState(null);

  async function load() {
    setState("loading");
    try {
      const data = await apiFetch("/appointments/me");
      setAppointments(Array.isArray(data) ? data : []);
      setState("ready");
    } catch (err) {
      setState("error");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCancel(id) {
    if (!confirm(t("appointments.cancelConfirm"))) return;
    setCancellingId(id);
    try {
      await apiFetch(`/appointments/${id}`, { method: "DELETE" });
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: "cancelled" } : a))
      );
    } catch (err) {
      alert(errorMessage(err, t, "appointments.cancelError"));
    } finally {
      setCancellingId(null);
    }
  }

  if (state === "loading") return <Loading text={t("appointments.loading")} />;
  if (state === "error")
    return <ErrorState message={t("appointments.loadError")} onRetry={load} />;

  if (appointments.length === 0) {
    return (
      <EmptyState
        icon="📅"
        title={t("appointments.emptyTitle")}
        subtitle={t("appointments.emptySubtitle")}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {appointments.map((a) => {
        const canCancel = a.status === "pending" || a.status === "confirmed";
        return (
          <Card key={a._id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {fieldName(a.clinicId, t("appointments.clinicFallback"))}
                </span>
                <StatusBadge status={a.status} />
              </div>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {fieldName(a.departmentId, t("appointments.departmentFallback"))}
                {a.doctorId
                  ? ` · ${fieldName(a.doctorId, t("appointments.doctorFallback"))}`
                  : ""}
              </p>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                {t("appointments.dateLabel")} {formatDate(a.date)} ·{" "}
                {t("appointments.queueNumberLabel")}{" "}
                <span className="font-semibold text-brand-600 dark:text-brand-400">
                  {a.queueNumber ?? "—"}
                </span>
              </p>
            </div>
            {canCancel && (
              <Button
                variant="danger"
                disabled={cancellingId === a._id}
                onClick={() => handleCancel(a._id)}
                className="self-start sm:self-center"
              >
                {cancellingId === a._id ? t("appointments.cancelling") : t("appointments.cancel")}
              </Button>
            )}
          </Card>
        );
      })}
    </div>
  );
}

function MedicalHistory() {
  const { t } = useI18n();
  const [records, setRecords] = useState([]);
  const [state, setState] = useState("loading");

  async function load() {
    setState("loading");
    try {
      const data = await apiFetch("/medical-records/me");
      setRecords(Array.isArray(data) ? data : []);
      setState("ready");
    } catch (err) {
      setState("error");
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (state === "loading") return <Loading text={t("appointments.historyLoading")} />;
  if (state === "error")
    return <ErrorState message={t("appointments.historyLoadError")} onRetry={load} />;

  if (records.length === 0) {
    return (
      <EmptyState
        icon="🩺"
        title={t("appointments.historyEmptyTitle")}
        subtitle={t("appointments.historyEmptySubtitle")}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {records.map((r) => (
        <Card key={r._id}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              {r.departmentName || fieldName(r.clinicId, t("appointments.departmentFallback"))}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {formatDate(r.date || r.createdAt)}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {t("appointments.doctorFallback")}:{" "}
            {fieldName(r.doctorId, t("appointments.unknownDoctor"))}
          </p>
          {r.resultText && (
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
              <span className="font-medium">{t("appointments.resultLabel")}</span> {r.resultText}
            </p>
          )}
          {r.notes && (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              <span className="font-medium">{t("appointments.notesLabel")}</span> {r.notes}
            </p>
          )}
        </Card>
      ))}
    </div>
  );
}

function AppointmentsPageContent() {
  const { t } = useI18n();
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            {t("appointments.title")}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t("appointments.subtitle")}
          </p>
        </div>
        <Link href="/book">
          <Button>{t("appointments.bookButton")}</Button>
        </Link>
      </div>

      <AppointmentsList />

      <div>
        <h2 className="mb-3 text-base font-bold text-slate-800 dark:text-slate-100">
          {t("appointments.historyTitle")}
        </h2>
        <MedicalHistory />
      </div>
    </div>
  );
}

export default function AppointmentsPage() {
  return (
    <RequireAuth role="patient">
      <AppointmentsPageContent />
    </RequireAuth>
  );
}
