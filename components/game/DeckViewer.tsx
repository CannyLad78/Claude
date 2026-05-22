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
        style={{ touchAction: "manipulation" }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-700 active:border-amber-600/60 text-gray-400 active:text-amber-300 text-xs transition-colors"
      >
        <span>🃏</span>
        <span>Deck ({deck.length})</span>
      </button>

      {open && (
        /* Full-screen on mobile, centered modal on larger screens */
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Sheet — slides up on mobile, centred on desktop */}
          <div className="relative bg-gray-950 border border-gray-700 w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h2 className="text-white font-bold">Your Deck</h2>
              <button
                onClick={() => setOpen(false)}
                style={{ touchAction: "manipulation" }}
                className="text-gray-500 active:text-white text-2xl leading-none w-8 h-8 flex items-center justify-center"
              >
                ×
              </button>
            </div>

            <div className="flex border-b border-gray-800">
              {(["deck", "discard"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{ touchAction: "manipulation" }}
                  className={[
                    "flex-1 py-3 text-sm font-medium capitalize transition-colors",
                    tab === t
                      ? "text-amber-400 border-b-2 border-amber-400"
                      : "text-gray-500 active:text-gray-300",
                  ].join(" ")}
                >
                  {t} ({t === "deck" ? deck.length : discard.length})
                </button>
              ))}
            </div>

            <div className="overflow-y-auto p-4 flex flex-wrap gap-3 justify-center">
              {cards.length === 0 ? (
                <p className="text-gray-600 text-sm py-10">No cards here</p>
              ) : (
                cards.map((card, i) => (
                  <CardComponent key={card.id + i} card={card} />
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
