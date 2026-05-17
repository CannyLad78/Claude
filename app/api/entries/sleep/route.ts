import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const entries = await prisma.sleepEntry.findMany({
    orderBy: { date: "desc" },
    take: 90,
  });
  return NextResponse.json(entries);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const entry = await prisma.sleepEntry.create({
    data: {
      date: new Date(body.date),
      hours: Number(body.hours),
      quality: Number(body.quality),
    },
  });
  return NextResponse.json(entry, { status: 201 });
}
