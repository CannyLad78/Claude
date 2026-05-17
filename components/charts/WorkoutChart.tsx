"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

type WorkoutEntry = {
  date: string;
  type: string;
  duration: number;
  intensity: number;
};

const TYPE_COLORS: Record<string, string> = {
  strength: "#6366f1",
  cardio: "#f59e0b",
  yoga: "#10b981",
  hiit: "#ef4444",
  other: "#8b5cf6",
};

export default function WorkoutChart({ data }: { data: WorkoutEntry[] }) {
  const chartData = [...data]
    .slice(0, 14)
    .reverse()
    .map((w) => ({
      date: new Date(w.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      duration: w.duration,
      type: w.type,
    }));

  if (chartData.length === 0) {
    return <EmptyState label="No workouts logged yet" />;
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} unit="m" />
        <Tooltip
          formatter={(v, _, props) => [
            `${v} min (${(props.payload as { type?: string } | undefined)?.type ?? ""})`,
            "Duration",
          ]}
        />
        <Bar dataKey="duration" radius={[4, 4, 0, 0]}>
          {chartData.map((entry, i) => (
            <Cell key={i} fill={TYPE_COLORS[entry.type] ?? TYPE_COLORS.other} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex h-44 items-center justify-center text-sm text-gray-400">
      {label}
    </div>
  );
}
