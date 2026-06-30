import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCardAdapter } from "@/lib/cards/registry";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const card = await prisma.dashboardCard.findUnique({ where: { id } });
  if (!card) return NextResponse.json({ error: "Card not found" }, { status: 404 });

  const adapter = getCardAdapter(card.type);

  try {
    const data = await adapter.fetchData(JSON.parse(card.config));
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch card data" },
      { status: 502 }
    );
  }
}
