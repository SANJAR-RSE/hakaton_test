"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import RequireAuth from "@/components/RequireAuth";
import Select from "@/components/Select";
import { apiFetch, errorMessage } from "@/lib/api";
import { useI18n } from "@/lib/I18nContext";
import {
  Button,
  Card,
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

const DEPT_TYPE_STYLES = {
  consultation:
    "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-900/40 dark:text-sky-300 dark:border-sky-700/60",
  analysis:
    "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/40 dark:text-violet-300 dark:border-violet-700/60",
};

function DepartmentTypeBadge({ type, label }) {
  const className = DEPT_TYPE_STYLES[type] || DEPT_TYPE_STYLES.consultation;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
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
        <p className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          {t("book.statusLabel")}
          <StatusBadge status={result.status || "pending"} />
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

  const clinicOptions = clinics.map((c) => ({
    value: c._id,
    label: c.address ? `${c.name} — ${c.address}` : c.name,
  }));

  const doctorOptions = [
    { value: "", label: t("book.doctorAny") },
    ...doctors.map((doc) => ({ value: doc._id, label: doc.name })),
  ];

  return (
    <Card className="mx-auto max-w-xl">
      <h1 className="mb-1.5 text-xl font-bold text-slate-800 dark:text-slate-100">
        {t("book.title")}
      </h1>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">{t("book.subtitle")}</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Field label={t("book.clinicLabel")}>
          <Select
            value={clinicId}
            onChange={(val) => {
              setClinicId(val);
              setDepartmentId("");
              setDoctorId("");
            }}
            options={clinicOptions}
            placeholder={t("book.clinicPlaceholder")}
          />
        </Field>

        {clinicId && (
          <div className="flex animate-fade-in flex-col gap-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {t("book.departmentSectionTitle")}
            </span>
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
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {departments.map((d) => {
                  const active = departmentId === d._id;
                  return (
                    <button
                      key={d._id}
                      type="button"
                      onClick={() => {
                        setDepartmentId(d._id);
                        setDoctorId("");
                      }}
                      className={`flex flex-col gap-2 rounded-xl2 border p-4 text-left transition ${
                        active
                          ? "border-brand-500 bg-brand-50 dark:border-brand-500 dark:bg-brand-900/30"
                          : "border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50/40 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-brand-700 dark:hover:bg-brand-900/10"
                      }`}
                    >
                      <span className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {d.name}
                      </span>
                      <DepartmentTypeBadge
                        type={d.type}
                        label={TYPE_LABEL[d.type] || d.type}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {departmentId && doctorsState === "ready" && doctors.length > 0 && (
          <div className="animate-fade-in">
            <Field label={t("book.doctorLabel")}>
              <Select
                value={doctorId}
                onChange={setDoctorId}
                options={doctorOptions}
                placeholder={t("book.doctorAny")}
              />
            </Field>
          </div>
        )}

        {departmentId && (
          <div className="animate-fade-in">
            <Field label={t("book.dateLabel")}>
              <input
                type="date"
                className={selectClass}
                min={todayStr()}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Field>
          </div>
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
