"use client";

import { useState } from "react";

export default function WeightForm({ onSaved }: { onSaved: () => void }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    weight: "",
  });
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/entries/weight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setForm((f) => ({ ...f, weight: "" }));
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
          <label className="mb-1 block text-xs font-medium text-gray-500">Weight (kg)</label>
          <input
            type="number"
            min={30}
            max={300}
            step={0.1}
            value={form.weight}
            onChange={(e) => setForm({ ...form, weight: e.target.value })}
            className={inputCls}
            required
          />
        </div>
      </div>
      <button type="submit" disabled={saving} className={btnCls}>
        {saving ? "Saving…" : "Log Weight"}
      </button>
    </form>
  );
}

const inputCls =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400";
const btnCls =
  "w-full rounded-lg bg-indigo-600 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50";
