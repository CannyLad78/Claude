"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type WeightEntry = { date: string; weight: number };

export default function WeightChart({ data }: { data: WeightEntry[] }) {
  const chartData = [...data]
    .slice(0, 30)
    .reverse()
    .map((w) => ({
      date: new Date(w.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      weight: w.weight,
    }));

  if (chartData.length === 0) {
    return (
      <div className="flex h-44 items-center justify-center text-sm text-gray-400">
        No weight logged yet
      </div>
    );
  }

  const min = Math.min(...chartData.map((d) => d.weight));
  const max = Math.max(...chartData.map((d) => d.weight));
  const pad = 1;

  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} domain={[min - pad, max + pad]} unit="kg" />
        <Tooltip formatter={(v) => [`${v} kg`, "Weight"]} />
        <Area
          type="monotone"
          dataKey="weight"
          stroke="#6366f1"
          strokeWidth={2}
          fill="url(#weightGrad)"
          dot={{ r: 3, fill: "#6366f1" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
