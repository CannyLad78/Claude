"use client";

import { useState } from "react";

const WORKOUT_TYPES = ["strength", "cardio", "yoga", "hiit", "other"];

export default function WorkoutForm({ onSaved }: { onSaved: () => void }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    type: "strength",
    duration: "",
    intensity: "3",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/entries/workout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setForm((f) => ({ ...f, duration: "", notes: "" }));
    onSaved();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Date">
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className={inputCls}
            required
          />
        </Field>
        <Field label="Type">
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className={inputCls}
          >
            {WORKOUT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Duration (min)">
          <input
            type="number"
            min={1}
            max={300}
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            className={inputCls}
            required
          />
        </Field>
        <Field label="Intensity (1-5)">
          <input
            type="range"
            min={1}
            max={5}
            value={form.intensity}
            onChange={(e) => setForm({ ...form, intensity: e.target.value })}
            className="w-full mt-2"
          />
          <span className="text-sm text-gray-500">{form.intensity}/5</span>
        </Field>
      </div>
      <Field label="Notes (optional)">
        <input
          type="text"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          placeholder="e.g. felt strong, new PR"
          className={inputCls}
        />
      </Field>
      <button type="submit" disabled={saving} className={btnCls}>
        {saving ? "Saving…" : "Log Workout"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-500">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400";
const btnCls =
  "w-full rounded-lg bg-indigo-600 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50";
