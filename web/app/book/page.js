"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import RequireAuth from "@/components/RequireAuth";
import { apiFetch, errorMessage } from "@/lib/api";
import { useI18n } from "@/lib/I18nContext";
import {
  Button,
  Card,
  ErrorState,
  Field,
  Loading,
  selectClass,
} from "@/components/UI";

function todayStr() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function BookForm() {
  const { t } = useI18n();
  const TYPE_LABEL = {
    consultation: t("book.typeConsultation"),
    analysis: t("book.typeAnalysis"),
  };

  const [clinics, setClinics] = useState([]);
  const [clinicsState, setClinicsState] = useState("loading"); // loading | ready | error

  const [clinicId, setClinicId] = useState("");
  const [departments, setDepartments] = useState([]);
  const [departmentsState, setDepartmentsState] = useState("idle");

  const [departmentId, setDepartmentId] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [doctorsState, setDoctorsState] = useState("idle");

  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState(todayStr());

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [result, setResult] = useState(null);

  async function loadClinics() {
    setClinicsState("loading");
    try {
      const data = await apiFetch("/clinics");
      setClinics(data || []);
      setClinicsState("ready");
    } catch (err) {
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

  useEffect(() => {
    if (!departmentId) {
      setDoctors([]);
      setDoctorId("");
      setDoctorsState("idle");
      return;
    }
    let cancelled = false;
    setDoctorsState("loading");
    apiFetch(`/departments/${departmentId}/doctors`)
      .then((data) => {
        if (cancelled) return;
        setDoctors(data || []);
        setDoctorsState("ready");
      })
      .catch(() => {
        if (!cancelled) setDoctorsState("error");
      });
    return () => {
      cancelled = true;
    };
  }, [departmentId]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    if (!clinicId || !departmentId || !date) {
      setSubmitError(t("book.validationError"));
      return;
    }
    setSubmitting(true);
    try {
      const body = { clinicId, departmentId, date };
      if (doctorId) body.doctorId = doctorId;
      const data = await apiFetch("/appointments", {
        method: "POST",
        body,
      });
      setResult(data);
    } catch (err) {
      setSubmitError(errorMessage(err, t, "book.submitError"));
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setResult(null);
    setSubmitError("");
    setClinicId("");
    setDepartmentId("");
    setDoctorId("");
    setDate(todayStr());
  }

  if (result) {
    return (
      <Card className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-2xl text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
          ✓
        </div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          {t("book.successTitle")}
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {t("book.queueNumberLabel")}
        </p>
        <p className="my-3 text-5xl font-extrabold text-brand-600 dark:text-brand-400">
          {result.queueNumber ?? "—"}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t("book.statusLabel")}{" "}
          <span className="font-medium text-slate-700 dark:text-slate-200">
            {result.status || "pending"}
          </span>
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link href="/appointments">
            <Button className="w-full sm:w-auto">{t("book.viewAppointments")}</Button>
          </Link>
          <Button variant="secondary" onClick={resetForm} className="w-full sm:w-auto">
            {t("book.bookAgain")}
          </Button>
        </div>
      </Card>
    );
  }

  if (clinicsState === "loading") {
    return <Loading text={t("book.clinicsLoading")} />;
  }

  if (clinicsState === "error") {
    return <ErrorState message={t("book.clinicsLoadError")} onRetry={loadClinics} />;
  }

  if (clinicsState === "ready" && clinics.length === 0) {
    return <ErrorState message={t("book.clinicsEmpty")} />;
  }

  return (
    <Card className="mx-auto max-w-md">
      <h1 className="mb-1 text-lg font-bold text-slate-800 dark:text-slate-100">
        {t("book.title")}
      </h1>
      <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">{t("book.subtitle")}</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label={t("book.clinicLabel")}>
          <select
            className={selectClass}
            value={clinicId}
            onChange={(e) => {
              setClinicId(e.target.value);
              setDepartmentId("");
              setDoctorId("");
            }}
          >
            <option value="">{t("book.clinicPlaceholder")}</option>
            {clinics.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
                {c.address ? ` — ${c.address}` : ""}
              </option>
            ))}
          </select>
        </Field>

        {clinicId && (
          <Field label={t("book.departmentLabel")}>
            {departmentsState === "loading" && (
              <p className="text-sm text-slate-400 dark:text-slate-500">{t("book.loading")}</p>
            )}
            {departmentsState === "error" && (
              <p className="text-sm text-red-500 dark:text-red-400">
                {t("book.departmentsLoadError")}
              </p>
            )}
            {departmentsState === "ready" && departments.length === 0 && (
              <p className="text-sm text-slate-400 dark:text-slate-500">
                {t("book.departmentsEmpty")}
              </p>
            )}
            {departmentsState === "ready" && departments.length > 0 && (
              <select
                className={selectClass}
                value={departmentId}
                onChange={(e) => {
                  setDepartmentId(e.target.value);
                  setDoctorId("");
                }}
              >
                <option value="">{t("book.departmentPlaceholder")}</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name} ({TYPE_LABEL[d.type] || d.type})
                  </option>
                ))}
              </select>
            )}
          </Field>
        )}

        {departmentId && doctorsState === "ready" && doctors.length > 0 && (
          <Field label={t("book.doctorLabel")}>
            <select
              className={selectClass}
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
            >
              <option value="">{t("book.doctorAny")}</option>
              {doctors.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.name}
                </option>
              ))}
            </select>
          </Field>
        )}

        {departmentId && (
          <Field label={t("book.dateLabel")}>
            <input
              type="date"
              className={selectClass}
              min={todayStr()}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Field>
        )}

        {submitError && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-300">
            {submitError}
          </p>
        )}

        <Button
          type="submit"
          disabled={submitting || !clinicId || !departmentId || !date}
          className="w-full"
        >
          {submitting ? t("book.submitting") : t("book.submit")}
        </Button>
      </form>
    </Card>
  );
}

export default function BookPage() {
  return (
    <RequireAuth role="patient">
      <BookForm />
    </RequireAuth>
  );
}
