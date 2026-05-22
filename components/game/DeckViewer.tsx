"use client";

import { useState } from "react";
import type { Card } from "@/lib/game/types";
import CardComponent from "./CardComponent";

type Props = {
  deck: Card[];
  discard: Card[];
};

export default function DeckViewer({ deck, discard }: Props) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"deck" | "discard">("deck");

  const cards = tab === "deck" ? deck : discard;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-700 hover:border-amber-600/60 text-gray-400 hover:text-amber-300 text-xs transition-all"
      >
        <span>🃏</span>
        <span>Deck ({deck.length})</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gray-950 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h2 className="text-white font-bold">Your Deck</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-white text-xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="flex border-b border-gray-800">
              {(["deck", "discard"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={[
                    "flex-1 py-2 text-sm font-medium capitalize transition-all",
                    tab === t
                      ? "text-amber-400 border-b-2 border-amber-400"
                      : "text-gray-500 hover:text-gray-300",
                  ].join(" ")}
                >
                  {t} ({t === "deck" ? deck.length : discard.length})
                </button>
              ))}
            </div>

            <div className="overflow-y-auto p-4 flex flex-wrap gap-3 justify-center">
              {cards.length === 0 ? (
                <p className="text-gray-600 text-sm py-8">No cards here</p>
              ) : (
                cards.map((card, i) => (
                  <CardComponent key={card.id + i} card={card} size="md" />
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
