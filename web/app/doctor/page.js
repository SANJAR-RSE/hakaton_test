"use client";

import { useEffect, useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import RecordModal from "@/components/RecordModal";
import { apiFetch } from "@/lib/api";
import { fieldName } from "@/lib/format";
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

function patientName(a) {
  if (a.patientId && typeof a.patientId === "object") {
    return a.patientId.name || a.patientId.phone || "Bemor";
  }
  return a.patientName || "Bemor";
}

function patientPhone(a) {
  if (a.patientId && typeof a.patientId === "object") {
    return a.patientId.phone || "";
  }
  return a.patientPhone || "";
}

const NEXT_ACTION = {
  pending: { label: "Tasdiqlash", status: "confirmed" },
  confirmed: { label: "Chaqirish", status: "called" },
  called: { label: "Tugallandi", status: "done" },
};

function DoctorQueue() {
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
      alert(err.message || "Holatni yangilab bo'lmadi.");
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
    if (!confirm("Ushbu navbatni bekor qilmoqchimisiz?")) return;
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

  if (clinicsState === "loading") return <Loading text="Klinikalar yuklanmoqda..." />;
  if (clinicsState === "error")
    return <ErrorState message="Klinikalarni yuklab bo'lmadi." onRetry={loadClinics} />;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <h1 className="mb-1 text-lg font-bold text-slate-800">Navbatlar</h1>
        <p className="mb-4 text-sm text-slate-500">
          Bo'lim va sanani tanlab, navbatdagi bemorlarni ko'ring.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Klinika">
            <select
              className={selectClass}
              value={clinicId}
              onChange={(e) => {
                setClinicId(e.target.value);
                setDepartmentId("");
              }}
            >
              <option value="">Tanlang</option>
              {clinics.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Bo'lim">
            <select
              className={selectClass}
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              disabled={!clinicId || departmentsState === "loading"}
            >
              <option value="">
                {departmentsState === "loading" ? "Yuklanmoqda..." : "Tanlang"}
              </option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Sana">
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
          title="Bo'limni tanlang"
          subtitle="Navbat ro'yxatini ko'rish uchun klinika va bo'limni tanlang."
        />
      )}

      {departmentId && queueState === "loading" && <Loading text="Navbatlar yuklanmoqda..." />}

      {departmentId && queueState === "error" && (
        <ErrorState message="Navbatlarni yuklab bo'lmadi." onRetry={loadQueue} />
      )}

      {departmentId && queueState === "ready" && queue.length === 0 && (
        <EmptyState
          icon="✅"
          title="Bu sanada navbat yo'q"
          subtitle="Tanlangan bo'lim va sana uchun bemorlar hali yozilmagan."
        />
      )}

      {departmentId && queueState === "ready" && queue.length > 0 && (
        <div className="flex flex-col gap-3">
          {queue.map((a) => {
            const action = NEXT_ACTION[a.status];
            const busy = actingId === a._id;
            const canCancel = a.status === "pending" || a.status === "confirmed" || a.status === "called";
            return (
              <Card key={a._id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-700">
                    {a.queueNumber ?? "—"}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-slate-800">
                        {patientName(a)}
                      </span>
                      <StatusBadge status={a.status} />
                    </div>
                    <p className="text-xs text-slate-400">
                      {patientPhone(a)}
                      {a.doctorId ? ` · ${fieldName(a.doctorId, "")}` : ""}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2 self-start sm:self-center">
                  {action && (
                    <Button disabled={busy} onClick={() => handleAction(a)}>
                      {busy ? "..." : action.label}
                    </Button>
                  )}
                  {canCancel && (
                    <Button variant="danger" disabled={busy} onClick={() => handleCancel(a)}>
                      Bekor qilish
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
