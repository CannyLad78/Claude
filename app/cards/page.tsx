import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCardAdapter, getCardTypeMetas } from "@/lib/cards/registry";
import { redactSecrets } from "@/lib/cards/config";
import CardManager from "@/components/cards/CardManager";

export const dynamic = "force-dynamic";

async function getCards() {
  const cards = await prisma.dashboardCard.findMany({ orderBy: { order: "asc" } });
  return cards.map((card) => {
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
}

export default async function CardsPage() {
  const cards = await getCards();
  const types = getCardTypeMetas();

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Cards</h1>
            <p className="text-sm text-gray-400">Connect APIs and arrange your dashboard</p>
          </div>
          <Link href="/" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
            ← Back to dashboard
          </Link>
        </div>
        <CardManager initialCards={cards} types={types} />
      </div>
    </div>
  );
}
