import Link from "next/link";
import { prisma } from "@/lib/db";
import CardShell from "./CardShell";

export default async function CardGrid() {
  const cards = await prisma.dashboardCard.findMany({
    where: { enabled: true },
    orderBy: { order: "asc" },
  });

  return (
    <div className="mb-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">Connected Cards</h2>
        <Link href="/cards" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
          Manage cards →
        </Link>
      </div>

      {cards.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-400">
          No cards yet.{" "}
          <Link href="/cards" className="text-indigo-600 hover:text-indigo-700">
            Add one
          </Link>{" "}
          to pull in data from Home Assistant or any API.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <CardShell key={card.id} id={card.id} title={card.title} refreshSec={card.refreshSec} />
          ))}
        </div>
      )}
    </div>
  );
}
