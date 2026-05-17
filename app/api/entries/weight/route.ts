import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const entries = await prisma.weightEntry.findMany({
    orderBy: { date: "desc" },
    take: 90,
  });
  return NextResponse.json(entries);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const entry = await prisma.weightEntry.create({
    data: {
      date: new Date(body.date),
      weight: Number(body.weight),
    },
  });
  return NextResponse.json(entry, { status: 201 });
}
