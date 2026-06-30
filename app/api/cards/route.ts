import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCardAdapter } from "@/lib/cards/registry";
import { redactSecrets } from "@/lib/cards/config";

export async function GET() {
  const cards = await prisma.dashboardCard.findMany({ orderBy: { order: "asc" } });

  const result = cards.map((card) => {
    const adapter = getCardAdapter(card.type);
    const { config, secretFieldsSet } = redactSecrets(adapter, JSON.parse(card.config));
    return {
      id: card.id,
      title: card.title,
      type: card.type,
      order: card.order,
      refreshSec: card.refreshSec,
      enabled: card.enabled,
      config,
      secretFieldsSet,
    };
  });

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  let adapter;
  try {
    adapter = getCardAdapter(body.type);
  } catch {
    return NextResponse.json({ error: "Unknown card type" }, { status: 400 });
  }

  for (const field of adapter.fields) {
    if (field.required && !body.config?.[field.key]) {
      return NextResponse.json({ error: `Missing required field: ${field.label}` }, { status: 400 });
    }
  }

  const last = await prisma.dashboardCard.findFirst({ orderBy: { order: "desc" } });

  const card = await prisma.dashboardCard.create({
    data: {
      title: body.title || adapter.label,
      type: adapter.type,
      config: JSON.stringify(body.config ?? {}),
      refreshSec: Number(body.refreshSec) || 60,
      order: (last?.order ?? -1) + 1,
    },
  });

  return NextResponse.json(card, { status: 201 });
}
