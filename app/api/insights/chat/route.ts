import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { anthropic, buildHealthContext } from "@/lib/claude";

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  const [workouts, sleep, weight] = await Promise.all([
    prisma.workoutEntry.findMany({ orderBy: { date: "desc" }, take: 60 }),
    prisma.sleepEntry.findMany({ orderBy: { date: "desc" }, take: 60 }),
    prisma.weightEntry.findMany({ orderBy: { date: "desc" }, take: 60 }),
  ]);

  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  const context = buildHealthContext({
    workouts: workouts.map((w) => ({ ...w, date: formatDate(w.date) })),
    sleep: sleep.map((s) => ({ ...s, date: formatDate(s.date) })),
    weight: weight.map((w) => ({ ...w, date: formatDate(w.date) })),
  });

  const stream = await anthropic.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 600,
    system: `You are a knowledgeable, friendly health assistant. Answer questions about the user's health data concisely and specifically. Always reference actual numbers from the data when relevant.\n\nUser's health data:\n${context}`,
    messages: [{ role: "user", content: message }],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === "content_block_delta" &&
          chunk.delta.type === "text_delta"
        ) {
          controller.enqueue(encoder.encode(chunk.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
