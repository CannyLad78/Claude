"use client";

import { useEffect, useState } from "react";
import type { CardData } from "@/lib/cards/types";

export default function CardShell({
  id,
  title,
  refreshSec,
}: {
  id: string;
  title: string;
  refreshSec: number;
}) {
  const [data, setData] = useState<CardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`/api/cards/${id}/data`, { cache: "no-store" });
        const body = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(body.error || "Failed to load");
        } else {
          setData(body);
          setError(null);
        }
      } catch {
        if (!cancelled) setError("Network error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    const interval = setInterval(load, Math.max(refreshSec, 5) * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [id, refreshSec]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{title}</p>

      {loading && !data && !error && <p className="mt-2 text-sm text-gray-400">Loading…</p>}
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      {data && (
        <>
          <p className="mt-1 inline-block rounded-lg bg-indigo-50 px-2 py-0.5 text-2xl font-bold text-indigo-700">
            {data.primary.value}
            {data.primary.unit ? ` ${data.primary.unit}` : ""}
          </p>
          <p className="mt-1 text-xs text-gray-400">{data.primary.label}</p>

          {data.items && data.items.length > 0 && (
            <ul className="mt-3 space-y-1 border-t border-gray-100 pt-3">
              {data.items.map((item, i) => (
                <li key={i} className="flex justify-between text-xs text-gray-500">
                  <span>{item.label}</span>
                  <span className="font-medium text-gray-700">
                    {item.value}
                    {item.unit ? ` ${item.unit}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
