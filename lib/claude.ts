import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export type HealthData = {
  workouts: { date: string; type: string; duration: number; intensity: number; notes?: string | null }[];
  sleep: { date: string; hours: number; quality: number }[];
  weight: { date: string; weight: number }[];
};

export function buildHealthContext(data: HealthData): string {
  const workoutSummary = data.workouts
    .map((w) => `${w.date}: ${w.type}, ${w.duration}min, intensity ${w.intensity}/5${w.notes ? `, notes: ${w.notes}` : ""}`)
    .join("\n");

  const sleepSummary = data.sleep
    .map((s) => `${s.date}: ${s.hours}hrs, quality ${s.quality}/5`)
    .join("\n");

  const weightSummary = data.weight
    .map((w) => `${w.date}: ${w.weight}kg`)
    .join("\n");

  return `
WORKOUT LOG:
${workoutSummary || "No workouts logged"}

SLEEP LOG:
${sleepSummary || "No sleep logged"}

WEIGHT LOG:
${weightSummary || "No weight logged"}
`.trim();
}
