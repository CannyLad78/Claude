"use client";

import { useState } from "react";

export default function WeeklyRecap() {
  const [recap, setRecap] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/insights/recap");
      if (!res.ok) throw new Error("Failed to fetch recap");
      const data = await res.json();
      setRecap(data.recap);
    } catch {
      setError("Could not generate recap. Check your ANTHROPIC_API_KEY.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold text-gray-800">Weekly Recap</h2>
        <button
          onClick={load}
          disabled={loading}
          className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Generating…" : recap ? "Refresh" : "Generate"}
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {recap && (
        <p className="text-sm leading-relaxed text-gray-700">{recap}</p>
      )}

      {!recap && !loading && !error && (
        <p className="text-sm text-gray-400">
          Click &ldquo;Generate&rdquo; to get your AI-powered weekly recap.
        </p>
      )}
    </div>
  );
}
