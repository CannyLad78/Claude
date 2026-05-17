"use client";

import { useState } from "react";

export default function SleepForm({ onSaved }: { onSaved: () => void }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    hours: "",
    quality: "3",
  });
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/entries/sleep", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setForm((f) => ({ ...f, hours: "" }));
    onSaved();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Date</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className={inputCls}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Hours slept</label>
          <input
            type="number"
            min={1}
            max={14}
            step={0.5}
            value={form.hours}
            onChange={(e) => setForm({ ...form, hours: e.target.value })}
            className={inputCls}
            required
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">
          Quality (1-5) — <span className="text-gray-400">{form.quality}/5</span>
        </label>
        <input
          type="range"
          min={1}
          max={5}
          value={form.quality}
          onChange={(e) => setForm({ ...form, quality: e.target.value })}
          className="w-full"
        />
      </div>
      <button type="submit" disabled={saving} className={btnCls}>
        {saving ? "Saving…" : "Log Sleep"}
      </button>
    </form>
  );
}

const inputCls =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400";
const btnCls =
  "w-full rounded-lg bg-indigo-600 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50";
