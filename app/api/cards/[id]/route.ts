import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCardAdapter } from "@/lib/cards/registry";
import { mergeConfig } from "@/lib/cards/config";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  const existing = await prisma.dashboardCard.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Card not found" }, { status: 404 });

  const adapter = getCardAdapter(existing.type);
  const data: { title?: string; refreshSec?: number; enabled?: boolean; order?: number; config?: string } = {};

  if (body.title !== undefined) data.title = body.title;
  if (body.refreshSec !== undefined) data.refreshSec = Number(body.refreshSec);
  if (body.enabled !== undefined) data.enabled = Boolean(body.enabled);
  if (body.order !== undefined) data.order = Number(body.order);
  if (body.config !== undefined) {
    const merged = mergeConfig(adapter, body.config, JSON.parse(existing.config));
    data.config = JSON.stringify(merged);
  }

  const card = await prisma.dashboardCard.update({ where: { id }, data });
  return NextResponse.json(card);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.dashboardCard.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
