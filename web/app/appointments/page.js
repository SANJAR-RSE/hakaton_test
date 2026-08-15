"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import RequireAuth from "@/components/RequireAuth";
import { apiFetch } from "@/lib/api";
import { fieldName, formatDate } from "@/lib/format";
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  Loading,
  StatusBadge,
} from "@/components/UI";

function AppointmentsList() {
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
    if (!confirm("Ushbu navbatni bekor qilmoqchimisiz?")) return;
    setCancellingId(id);
    try {
      await apiFetch(`/appointments/${id}`, { method: "DELETE" });
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: "cancelled" } : a))
      );
    } catch (err) {
      alert(err.message || "Bekor qilib bo'lmadi.");
    } finally {
      setCancellingId(null);
    }
  }

  if (state === "loading") return <Loading text="Navbatlar yuklanmoqda..." />;
  if (state === "error")
    return <ErrorState message="Navbatlarni yuklab bo'lmadi." onRetry={load} />;

  if (appointments.length === 0) {
    return (
      <EmptyState
        icon="📅"
        title="Hozircha navbatlaringiz yo'q"
        subtitle="Yangi navbat olish uchun quyidagi tugmani bosing."
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
                <span className="text-sm font-semibold text-slate-800">
                  {fieldName(a.clinicId, "Klinika")}
                </span>
                <StatusBadge status={a.status} />
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {fieldName(a.departmentId, "Bo'lim")}
                {a.doctorId ? ` · ${fieldName(a.doctorId, "Shifokor")}` : ""}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Sana: {formatDate(a.date)} · Navbat raqami:{" "}
                <span className="font-semibold text-brand-600">
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
                {cancellingId === a._id ? "Bekor qilinmoqda..." : "Bekor qilish"}
              </Button>
            )}
          </Card>
        );
      })}
    </div>
  );
}

function MedicalHistory() {
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

  if (state === "loading") return <Loading text="Tibbiy tarix yuklanmoqda..." />;
  if (state === "error")
    return <ErrorState message="Tibbiy tarixni yuklab bo'lmadi." onRetry={load} />;

  if (records.length === 0) {
    return (
      <EmptyState
        icon="🩺"
        title="Tibbiy tarix mavjud emas"
        subtitle="Qabuldan so'ng shifokor natijalari shu yerda ko'rinadi."
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {records.map((r) => (
        <Card key={r._id}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-semibold text-slate-800">
              {r.departmentName || fieldName(r.clinicId, "Bo'lim")}
            </span>
            <span className="text-xs text-slate-400">
              {formatDate(r.date || r.createdAt)}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Shifokor: {fieldName(r.doctorId, "Noma'lum")}
          </p>
          {r.resultText && (
            <p className="mt-2 text-sm text-slate-700">
              <span className="font-medium">Natija:</span> {r.resultText}
            </p>
          )}
          {r.notes && (
            <p className="mt-1 text-sm text-slate-600">
              <span className="font-medium">Izoh:</span> {r.notes}
            </p>
          )}
        </Card>
      ))}
    </div>
  );
}

function AppointmentsPageContent() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-slate-800">Navbatlarim</h1>
          <p className="text-sm text-slate-500">Joriy va o'tgan navbatlaringiz</p>
        </div>
        <Link href="/book">
          <Button>+ Navbat olish</Button>
        </Link>
      </div>

      <AppointmentsList />

      <div>
        <h2 className="mb-3 text-base font-bold text-slate-800">Tibbiy tarix</h2>
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
