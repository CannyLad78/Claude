import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const entries = await prisma.workoutEntry.findMany({
    orderBy: { date: "desc" },
    take: 90,
  });
  return NextResponse.json(entries);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const entry = await prisma.workoutEntry.create({
    data: {
      date: new Date(body.date),
      type: body.type,
      duration: Number(body.duration),
      intensity: Number(body.intensity),
      notes: body.notes || null,
    },
  });
  return NextResponse.json(entry, { status: 201 });
}
