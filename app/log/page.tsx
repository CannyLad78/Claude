"use client";

import { useState } from "react";
import Link from "next/link";
import WorkoutForm from "@/components/forms/WorkoutForm";
import SleepForm from "@/components/forms/SleepForm";
import WeightForm from "@/components/forms/WeightForm";

type Tab = "workout" | "sleep" | "weight";

export default function LogPage() {
  const [tab, setTab] = useState<Tab>("workout");
  const [saved, setSaved] = useState(false);

  function onSaved() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-lg">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Log Entry</h1>
            <p className="text-sm text-gray-400">Track your daily health data</p>
          </div>
          <Link href="/" className="text-sm text-indigo-600 hover:underline">
            ← Dashboard
          </Link>
        </div>

        {saved && (
          <div className="mb-4 rounded-xl bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
            Saved successfully!
          </div>
        )}

        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="mb-6 flex gap-1 rounded-xl bg-gray-100 p-1">
            {(["workout", "sleep", "weight"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                  tab === t
                    ? "bg-white text-indigo-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {tab === "workout" && <WorkoutForm onSaved={onSaved} />}
          {tab === "sleep" && <SleepForm onSaved={onSaved} />}
          {tab === "weight" && <WeightForm onSaved={onSaved} />}
        </div>
      </div>
    </div>
  );
}
