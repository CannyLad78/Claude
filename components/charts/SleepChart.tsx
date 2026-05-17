"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

type SleepEntry = { date: string; hours: number; quality: number };

export default function SleepChart({ data }: { data: SleepEntry[] }) {
  const chartData = [...data]
    .slice(0, 14)
    .reverse()
    .map((s) => ({
      date: new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      hours: s.hours,
      quality: s.quality,
    }));

  if (chartData.length === 0) {
    return (
      <div className="flex h-44 items-center justify-center text-sm text-gray-400">
        No sleep logged yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} domain={[4, 10]} unit="h" />
        <Tooltip formatter={(v) => [`${v}h`, "Sleep"]} />
        <ReferenceLine y={8} stroke="#10b981" strokeDasharray="4 2" label={{ value: "8h goal", fontSize: 10, fill: "#10b981" }} />
        <Line
          type="monotone"
          dataKey="hours"
          stroke="#6366f1"
          strokeWidth={2}
          dot={{ r: 3, fill: "#6366f1" }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
