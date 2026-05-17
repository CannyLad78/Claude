import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { anthropic, buildHealthContext } from "@/lib/claude";

export async function GET() {
  const since = new Date();
  since.setDate(since.getDate() - 7);

  const [workouts, sleep, weight] = await Promise.all([
    prisma.workoutEntry.findMany({ where: { date: { gte: since } }, orderBy: { date: "asc" } }),
    prisma.sleepEntry.findMany({ where: { date: { gte: since } }, orderBy: { date: "asc" } }),
    prisma.weightEntry.findMany({ where: { date: { gte: since } }, orderBy: { date: "asc" } }),
  ]);

  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  const context = buildHealthContext({
    workouts: workouts.map((w) => ({ ...w, date: formatDate(w.date) })),
    sleep: sleep.map((s) => ({ ...s, date: formatDate(s.date) })),
    weight: weight.map((w) => ({ ...w, date: formatDate(w.date) })),
  });

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 500,
    system:
      "You are a supportive health coach analyzing a user's weekly fitness data. Give an encouraging, concise weekly recap (3-4 sentences). Mention specific numbers. Highlight one positive pattern and one area to focus on.",
    messages: [
      {
        role: "user",
        content: `Here is my health data from the past 7 days:\n\n${context}\n\nPlease give me a weekly recap.`,
      },
    ],
  });

  const recap = message.content[0].type === "text" ? message.content[0].text : "";
  return NextResponse.json({ recap });
}
