"use client";

import { useEffect, useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import RecordModal from "@/components/RecordModal";
import Select from "@/components/Select";
import { apiFetch, errorMessage } from "@/lib/api";
import { fieldName } from "@/lib/format";
import { useI18n } from "@/lib/I18nContext";
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  Field,
  Loading,
  StatusBadge,
  selectClass,
} from "@/components/UI";

function todayStr() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function patientName(a, t) {
  if (a.patientId && typeof a.patientId === "object") {
    return a.patientId.name || a.patientId.phone || t("doctor.patientFallback");
  }
  return a.patientName || t("doctor.patientFallback");
}

function patientPhone(a) {
  if (a.patientId && typeof a.patientId === "object") {
    return a.patientId.phone || "";
  }
  return a.patientPhone || "";
}

function DoctorQueue() {
  const { t } = useI18n();
  const NEXT_ACTION = {
    pending: { label: t("doctor.actionConfirm"), status: "confirmed" },
    confirmed: { label: t("doctor.actionCall"), status: "called" },
    called: { label: t("doctor.actionFinish"), status: "done" },
  };

  const [clinics, setClinics] = useState([]);
  const [clinicsState, setClinicsState] = useState("loading");
  const [clinicId, setClinicId] = useState("");

  const [departments, setDepartments] = useState([]);
  const [departmentsState, setDepartmentsState] = useState("idle");
  const [departmentId, setDepartmentId] = useState("");

  const [date, setDate] = useState(todayStr());

  const [queue, setQueue] = useState([]);
  const [queueState, setQueueState] = useState("idle"); // idle | loading | ready | error
  const [actingId, setActingId] = useState(null);
  const [modalAppointment, setModalAppointment] = useState(null);

  async function loadClinics() {
    setClinicsState("loading");
    try {
      const data = await apiFetch("/clinics");
      setClinics(data || []);
      setClinicsState("ready");
    } catch {
      setClinicsState("error");
    }
  }

  useEffect(() => {
    loadClinics();
  }, []);

  useEffect(() => {
    if (!clinicId) {
      setDepartments([]);
      setDepartmentId("");
      setDepartmentsState("idle");
      return;
    }
    let cancelled = false;
    setDepartmentsState("loading");
    apiFetch(`/clinics/${clinicId}/departments`)
      .then((data) => {
        if (cancelled) return;
        setDepartments(data || []);
        setDepartmentsState("ready");
      })
      .catch(() => {
        if (!cancelled) setDepartmentsState("error");
      });
    return () => {
      cancelled = true;
    };
  }, [clinicId]);

  async function loadQueue() {
    if (!departmentId || !date) return;
    setQueueState("loading");
    try {
      const data = await apiFetch(
        `/appointments/queue?departmentId=${encodeURIComponent(
          departmentId
        )}&date=${encodeURIComponent(date)}`
      );
      setQueue(Array.isArray(data) ? data : []);
      setQueueState("ready");
    } catch (err) {
      setQueueState("error");
    }
  }

  useEffect(() => {
    if (departmentId && date) {
      loadQueue();
    } else {
      setQueue([]);
      setQueueState("idle");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departmentId, date]);

  async function updateStatus(appointment, status) {
    setActingId(appointment._id);
    try {
      await apiFetch(`/appointments/${appointment._id}/status`, {
        method: "PATCH",
        body: { status },
      });
      await loadQueue();
    } catch (err) {
      alert(errorMessage(err, t, "doctor.statusUpdateError"));
    } finally {
      setActingId(null);
    }
  }

  async function handleAction(appointment) {
    const action = NEXT_ACTION[appointment.status];
    if (!action) return;
    if (action.status === "done") {
      setModalAppointment(appointment);
      return;
    }
    await updateStatus(appointment, action.status);
  }

  async function handleCancel(appointment) {
    if (!confirm(t("doctor.cancelConfirm"))) return;
    await updateStatus(appointment, "cancelled");
  }

  async function handleRecordSubmit({ notes, resultText }) {
    const appointment = modalAppointment;
    setActingId(appointment._id);
    try {
      await apiFetch(`/appointments/${appointment._id}/status`, {
        method: "PATCH",
        body: { status: "done" },
      });
      await apiFetch(`/appointments/${appointment._id}/record`, {
        method: "POST",
        body: { notes, resultText },
      });
      setModalAppointment(null);
      await loadQueue();
    } finally {
      setActingId(null);
    }
  }

  if (clinicsState === "loading") return <Loading text={t("doctor.loading")} />;
  if (clinicsState === "error")
    return <ErrorState message={t("doctor.clinicsLoadError")} onRetry={loadClinics} />;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <h1 className="mb-1.5 text-xl font-bold text-slate-800 dark:text-slate-100">
          {t("doctor.title")}
        </h1>
        <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
          {t("doctor.subtitle")}
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label={t("doctor.clinicLabel")}>
            <Select
              value={clinicId}
              onChange={(val) => {
                setClinicId(val);
                setDepartmentId("");
              }}
              options={clinics.map((c) => ({ value: c._id, label: c.name }))}
              placeholder={t("doctor.select")}
            />
          </Field>

          <Field label={t("doctor.departmentLabel")}>
            <Select
              value={departmentId}
              onChange={setDepartmentId}
              options={departments.map((d) => ({ value: d._id, label: d.name }))}
              placeholder={departmentsState === "loading" ? t("doctor.loading") : t("doctor.select")}
              disabled={!clinicId || departmentsState === "loading"}
            />
          </Field>

          <Field label={t("doctor.dateLabel")}>
            <input
              type="date"
              className={selectClass}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Field>
        </div>
      </Card>

      {!departmentId && (
        <EmptyState
          icon="🏥"
          title={t("doctor.selectDepartmentTitle")}
          subtitle={t("doctor.selectDepartmentSubtitle")}
        />
      )}

      {departmentId && queueState === "loading" && <Loading text={t("doctor.queueLoading")} />}

      {departmentId && queueState === "error" && (
        <ErrorState message={t("doctor.queueLoadError")} onRetry={loadQueue} />
      )}

      {departmentId && queueState === "ready" && queue.length === 0 && (
        <EmptyState icon="✅" title={t("doctor.emptyTitle")} subtitle={t("doctor.emptySubtitle")} />
      )}

      {departmentId && queueState === "ready" && queue.length > 0 && (
        <div className="flex flex-col gap-3">
          {queue.map((a) => {
            const action = NEXT_ACTION[a.status];
            const busy = actingId === a._id;
            const canCancel = a.status === "pending" || a.status === "confirmed" || a.status === "called";
            return (
              <Card key={a._id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                    {a.queueNumber ?? "—"}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {patientName(a, t)}
                      </span>
                      <StatusBadge status={a.status} />
                    </div>
                    <p className="truncate text-xs text-slate-400 dark:text-slate-500">
                      {patientPhone(a)}
                      {a.doctorId ? ` · ${fieldName(a.doctorId, "")}` : ""}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2 self-start sm:self-center">
                  {action && (
                    <Button disabled={busy} onClick={() => handleAction(a)}>
                      {busy ? "..." : action.label}
                    </Button>
                  )}
                  {canCancel && (
                    <Button variant="danger" disabled={busy} onClick={() => handleCancel(a)}>
                      {t("doctor.cancel")}
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {modalAppointment && (
        <RecordModal
          appointment={modalAppointment}
          onClose={() => setModalAppointment(null)}
          onSubmit={handleRecordSubmit}
        />
      )}
    </div>
  );
}

export default function DoctorPage() {
  return (
    <RequireAuth role="doctor">
      <DoctorQueue />
    </RequireAuth>
  );
}
