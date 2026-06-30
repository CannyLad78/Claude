import { prisma } from "@/lib/db";
import WorkoutChart from "@/components/charts/WorkoutChart";
import SleepChart from "@/components/charts/SleepChart";
import WeightChart from "@/components/charts/WeightChart";
import StatCard from "@/components/StatCard";
import WeeklyRecap from "@/components/ai/WeeklyRecap";
import ChatAssistant from "@/components/ai/ChatAssistant";
import CardGrid from "@/components/cards/CardGrid";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getData() {
  const [workouts, sleep, weight] = await Promise.all([
    prisma.workoutEntry.findMany({ orderBy: { date: "desc" }, take: 90 }),
    prisma.sleepEntry.findMany({ orderBy: { date: "desc" }, take: 90 }),
    prisma.weightEntry.findMany({ orderBy: { date: "desc" }, take: 90 }),
  ]);
  return { workouts, sleep, weight };
}

export default async function Dashboard() {
  const { workouts, sleep, weight } = await getData();

  const since7 = new Date();
  since7.setDate(since7.getDate() - 7);

  const workoutsThisWeek = workouts.filter((w) => new Date(w.date) >= since7).length;
  const avgSleep =
    sleep.length > 0
      ? (sleep.slice(0, 7).reduce((s, e) => s + e.hours, 0) / Math.min(sleep.length, 7)).toFixed(1)
      : "—";
  const latestWeight = weight[0] ? `${weight[0].weight} kg` : "—";

  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Health Dashboard</h1>
            <p className="text-sm text-gray-400">Your personal fitness snapshot</p>
          </div>
          <Link
            href="/log"
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            + Log Entry
          </Link>
        </div>

        <div className="mb-6 grid grid-cols-3 gap-4">
          <StatCard
            label="Workouts this week"
            value={workoutsThisWeek}
            sub="last 7 days"
            accent="bg-indigo-50 text-indigo-700"
          />
          <StatCard
            label="Avg sleep (7d)"
            value={`${avgSleep}h`}
            sub="goal: 8h"
            accent="bg-purple-50 text-purple-700"
          />
          <StatCard
            label="Latest weight"
            value={latestWeight}
            sub={weight[0] ? formatDate(weight[0].date) : "not logged"}
            accent="bg-emerald-50 text-emerald-700"
          />
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <ChartCard title="Workouts" subtitle="last 14 sessions">
            <WorkoutChart
              data={workouts.map((w) => ({ ...w, date: formatDate(w.date) }))}
            />
          </ChartCard>
          <ChartCard title="Sleep" subtitle="last 14 nights">
            <SleepChart
              data={sleep.map((s) => ({ ...s, date: formatDate(s.date) }))}
            />
          </ChartCard>
          <ChartCard title="Weight" subtitle="last 30 entries">
            <WeightChart
              data={weight.map((w) => ({ ...w, date: formatDate(w.date) }))}
            />
          </ChartCard>
        </div>

        <CardGrid />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <WeeklyRecap />
          <ChatAssistant />
        </div>
      </div>
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="mb-3">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
