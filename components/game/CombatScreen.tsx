"use client";

import { useState } from "react";
import type { Card, GameState } from "@/lib/game/types";
import { SCENES } from "@/lib/game/scenes";
import CardComponent from "./CardComponent";

type Props = {
  state: GameState;
  onPlayCards: (cardIds: string[]) => void;
  onClaimReward: (cardId: string | null) => void;
  onRetry: () => void;
};

function HealthBar({ current, max, color }: { current: number; max: number; color: string }) {
  const pct = Math.max(0, (current / max) * 100);
  return (
    <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function CombatScreen({ state, onPlayCards, onClaimReward, onRetry }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const combat = state.combat!;
  const scene = SCENES[state.scene];

  function toggleCard(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function handlePlay() {
    if (selected.length === 0) return;
    onPlayCards(selected);
    setSelected([]);
  }

  function handleEndTurn() {
    onPlayCards([]);
    setSelected([]);
  }

  if (combat.phase === "reward") {
    return (
      <RewardScreen
        rewards={combat.pendingRewards}
        victoryText={scene?.combat?.victory ?? "Victory!"}
        onClaim={onClaimReward}
      />
    );
  }

  if (combat.phase === "defeat") {
    return (
      <DefeatScreen
        defeatText={scene?.combat?.defeat ?? "You fall in battle."}
        onRetry={onRetry}
      />
    );
  }

  const activeEnemy = combat.enemies[combat.activeEnemyIndex];

  return (
    <div className="flex flex-col gap-4">
      {/* Enemies */}
      <section className="bg-gray-900/80 rounded-2xl border border-red-900/40 p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-bold text-red-300 uppercase tracking-wider">Enemies</h2>
          <span className="text-xs text-gray-600">Turn {combat.turn}</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {combat.enemies.map((enemy, i) => (
            <div
              key={enemy.id + i}
              className={[
                "flex-1 min-w-[140px] p-3 rounded-xl border transition-all",
                enemy.health <= 0
                  ? "opacity-25 border-gray-800"
                  : i === combat.activeEnemyIndex
                  ? "border-red-500/60 bg-red-950/30"
                  : "border-gray-700 bg-gray-800/30",
              ].join(" ")}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{enemy.icon}</span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{enemy.name}</p>
                  <p className="text-[11px] text-gray-500">
                    {enemy.health}/{enemy.maxHealth} HP
                  </p>
                </div>
              </div>
              <HealthBar
                current={enemy.health}
                max={enemy.maxHealth}
                color={enemy.health > enemy.maxHealth * 0.5 ? "bg-red-500" : "bg-orange-500"}
              />
              {enemy.health > 0 && (
                <p className="text-[11px] text-gray-500 mt-1">⚔️ {enemy.attack} atk/turn</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Player status */}
      <div className="flex items-center gap-3 px-1">
        <div className="flex-1">
          <div className="flex justify-between text-[11px] text-gray-500 mb-1">
            <span>🗡️ The Mandalorian</span>
            <span className={state.health <= 10 ? "text-red-400 font-bold" : ""}>
              {state.health}/{state.maxHealth} HP
            </span>
          </div>
          <HealthBar
            current={state.health}
            max={state.maxHealth}
            color={state.health > state.maxHealth * 0.5 ? "bg-emerald-500" : state.health > state.maxHealth * 0.25 ? "bg-yellow-500" : "bg-red-500"}
          />
        </div>
        {combat.shield > 0 && (
          <div className="text-sm font-bold text-blue-300 bg-blue-900/30 px-2 py-1 rounded-lg border border-blue-800/50">
            🛡️ {combat.shield}
          </div>
        )}
        <div className="text-[11px] text-gray-600 text-right">
          <span className="text-amber-400">{state.deck.length}</span> deck
          <br />
          <span>{state.discard.length}</span> discard
        </div>
      </div>

      {/* Battle log */}
      <div className="bg-black/50 rounded-xl border border-gray-800 p-3 h-32 overflow-y-auto">
        <div className="flex flex-col-reverse gap-1">
          {[...combat.log].reverse().map((entry, i) => (
            <p key={i} className="text-[11px] text-gray-300 leading-relaxed">
              {entry}
            </p>
          ))}
        </div>
      </div>

      {/* Hand */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-500">Hand — tap cards to select, then play</p>
          {selected.length > 0 && (
            <p className="text-xs text-amber-400 font-semibold">{selected.length} selected</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2 justify-center min-h-[120px]">
          {combat.hand.length === 0 ? (
            <p className="text-sm text-gray-600 italic self-center">Empty hand — end your turn to draw</p>
          ) : (
            combat.hand.map((card, i) => (
              <CardComponent
                key={card.id + i}
                card={card}
                selected={selected.includes(card.id)}
                onClick={() => toggleCard(card.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={handlePlay}
          disabled={selected.length === 0 || combat.phase !== "player"}
          className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Play Cards ({selected.length})
        </button>
        <button
          onClick={handleEndTurn}
          disabled={combat.phase !== "player"}
          className="px-5 py-3 rounded-xl border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-gray-200 text-sm transition-all disabled:opacity-40"
        >
          End Turn
        </button>
      </div>
    </div>
  );
}

function RewardScreen({
  rewards,
  victoryText,
  onClaim,
}: {
  rewards: Card[];
  victoryText: string;
  onClaim: (id: string | null) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-6 py-6 text-center">
      <div>
        <div className="text-5xl mb-3">⚔️</div>
        <h2 className="text-2xl font-bold text-amber-400">Victory!</h2>
        <p className="text-gray-300 mt-3 max-w-md text-sm leading-relaxed">{victoryText}</p>
      </div>

      {rewards.length > 0 ? (
        <>
          <p className="text-amber-300 text-sm font-semibold">
            Choose one card to add to your deck:
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {rewards.map((card) => (
              <div key={card.id} className="cursor-pointer" onClick={() => onClaim(card.id)}>
                <CardComponent card={card} size="lg" />
              </div>
            ))}
          </div>
          <button
            onClick={() => onClaim(null)}
            className="text-xs text-gray-600 hover:text-gray-400 underline"
          >
            Skip reward
          </button>
        </>
      ) : (
        <button
          onClick={() => onClaim(null)}
          className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold"
        >
          Continue
        </button>
      )}
    </div>
  );
}

function DefeatScreen({ defeatText, onRetry }: { defeatText: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-6 py-10 text-center">
      <div className="text-5xl">💀</div>
      <div>
        <h2 className="text-2xl font-bold text-red-400">Defeated</h2>
        <p className="text-gray-400 mt-2 max-w-md text-sm leading-relaxed">{defeatText}</p>
        <p className="text-gray-600 text-xs mt-3">
          The Mandalorian falls... but the story is not over.
        </p>
      </div>
      <button
        onClick={onRetry}
        className="px-8 py-3 rounded-xl bg-red-800 hover:bg-red-700 text-white font-bold transition-all"
      >
        Try Again
      </button>
    </div>
  );
}
