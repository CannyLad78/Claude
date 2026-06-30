"use client";

import type { CardConfigField } from "@/lib/cards/types";

type Props = {
  fields: CardConfigField[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  secretFieldsSet?: string[];
};

export default function CardConfigForm({ fields, values, onChange, secretFieldsSet = [] }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {fields.map((field) => (
        <div key={field.key}>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            {field.label}
            {field.required && <span className="text-red-400"> *</span>}
          </label>
          {field.type === "select" ? (
            <select
              value={values[field.key] ?? ""}
              onChange={(e) => onChange(field.key, e.target.value)}
              className={inputCls}
            >
              <option value="">Select…</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type === "secret" ? "password" : field.type === "number" ? "number" : "text"}
              value={values[field.key] ?? ""}
              onChange={(e) => onChange(field.key, e.target.value)}
              placeholder={
                field.type === "secret" && secretFieldsSet.includes(field.key)
                  ? "•••••••• (leave blank to keep)"
                  : field.placeholder
              }
              className={inputCls}
            />
          )}
          {field.helpText && <p className="mt-1 text-xs text-gray-400">{field.helpText}</p>}
        </div>
      ))}
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400";
