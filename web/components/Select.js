"use client";

import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";

function ChevronIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CheckIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/**
 * Headless UI Listbox asosidagi custom dropdown.
 * Props: value, onChange, options ([{value, label}]), placeholder, disabled?, id?
 */
export default function Select({
  value,
  onChange,
  options = [],
  placeholder,
  disabled = false,
  id,
  className = "",
}) {
  const selected = options.find((o) => o.value === value) || null;

  return (
    <Listbox value={value ?? ""} onChange={onChange} disabled={disabled}>
      <div className={`relative ${className}`}>
        <Listbox.Button
          id={id}
          className={`flex w-full items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-left text-sm text-slate-800 outline-none transition hover:border-brand-300 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 disabled:hover:border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-brand-700 dark:focus:border-brand-500 dark:focus:ring-brand-900/40 dark:disabled:bg-slate-800 dark:disabled:text-slate-500`}
        >
          <span
            className={`truncate ${
              selected ? "" : "text-slate-400 dark:text-slate-500"
            }`}
            title={selected ? selected.label : undefined}
          >
            {selected ? selected.label : placeholder}
          </span>
          <ChevronIcon className="shrink-0 text-slate-400 dark:text-slate-500" />
        </Listbox.Button>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
          enter="transition ease-out duration-100"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
        >
          <Listbox.Options className="absolute z-30 mt-1.5 max-h-60 w-full overflow-auto rounded-xl2 border border-slate-100 bg-white p-1.5 text-sm shadow-card focus:outline-none dark:border-slate-800 dark:bg-slate-900">
            {options.length === 0 ? (
              <div className="px-3 py-2 text-slate-400 dark:text-slate-500">
                {placeholder}
              </div>
            ) : (
              options.map((opt) => (
                <Listbox.Option
                  key={opt.value}
                  value={opt.value}
                  className={({ active }) =>
                    `flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 transition ${
                      active ? "bg-brand-50 dark:bg-brand-900/30" : ""
                    }`
                  }
                >
                  {({ selected: isSelected }) => (
                    <>
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center text-brand-600 dark:text-brand-300">
                        {isSelected && <CheckIcon />}
                      </span>
                      <span
                        className={`truncate ${
                          isSelected
                            ? "font-semibold text-brand-700 dark:text-brand-300"
                            : "text-slate-700 dark:text-slate-200"
                        }`}
                        title={opt.label}
                      >
                        {opt.label}
                      </span>
                    </>
                  )}
                </Listbox.Option>
              ))
            )}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
