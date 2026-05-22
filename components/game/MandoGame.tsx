"use client";

import { useReducer, useRef, useEffect } from "react";
import type { GameState, Scene } from "@/lib/game/types";
import { SCENES } from "@/lib/game/scenes";
import { ALL_CARDS } from "@/lib/game/cards";
import {
  createInitialState,
  goToScene,
  playCards,
  claimReward,
  retryCombat,
  restartGame,
} from "@/lib/game/engine";
import CombatScreen from "./CombatScreen";
import DeckViewer from "./DeckViewer";
import CardComponent from "./CardComponent";

type Action =
  | { type: "GO_SCENE"; sceneId: string; setsFlag?: string; effect?: Partial<GameState> }
  | { type: "PLAY_CARDS"; cardIds: string[] }
  | { type: "CLAIM_REWARD"; cardId: string | null }
  | { type: "RETRY_COMBAT" }
  | { type: "RESTART" };

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "GO_SCENE":
      return goToScene(state, action.sceneId, action.setsFlag, action.effect);
    case "PLAY_CARDS":
      return playCards(state, action.cardIds);
    case "CLAIM_REWARD":
      return claimReward(state, action.cardId);
    case "RETRY_COMBAT":
      return retryCombat(state);
    case "RESTART":
      return restartGame();
    default:
      return state;
  }
}

const TIMELINE_STYLE: Record<string, string> = {
  "The Mandalorian": "text-gray-400 border-gray-600",
  "The Foundling": "text-amber-400 border-amber-600",
  "The Broken Vow": "text-red-400 border-red-700",
};

export default function MandoGame() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, [state.scene]);

  if (state.phase === "title" || state.scene === "title") {
    return <TitleScreen onStart={() => dispatch({ type: "GO_SCENE", sceneId: "opening" })} />;
  }

  const scene = SCENES[state.scene];
  if (!scene) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Unknown scene: {state.scene}</p>
          <button
            onClick={() => dispatch({ type: "RESTART" })}
            className="px-4 py-2 bg-amber-500 rounded-lg text-black font-bold"
          >
            Restart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header — single row, compact on mobile */}
      <header className="border-b border-gray-800 bg-gray-950/90 backdrop-blur sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-3 py-2 flex items-center gap-2">
          {/* Title — hidden on very small screens to save space */}
          <span className="hidden sm:block text-amber-400 font-bold text-sm tracking-wide shrink-0">
            THE MANDALORIAN
          </span>
          <span className="sm:hidden text-amber-400 font-bold text-xs tracking-wide shrink-0">
            MANDO
          </span>

          {/* Timeline badge */}
          <span
            className={`text-[10px] sm:text-xs border rounded px-1.5 py-0.5 truncate max-w-[100px] sm:max-w-none ${TIMELINE_STYLE[state.timeline] ?? "text-gray-400 border-gray-600"}`}
          >
            {state.timeline}
          </span>

          {/* Right-side controls */}
          <div className="ml-auto flex items-center gap-2">
            {/* Health */}
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-xs">❤️</span>
              <span className="text-sm font-bold text-emerald-400">{state.health}</span>
              <span className="text-xs text-gray-600">/{state.maxHealth}</span>
            </div>

            <DeckViewer deck={state.deck} discard={state.discard} />

            <button
              onClick={() => dispatch({ type: "RESTART" })}
              style={{ touchAction: "manipulation" }}
              className="text-[11px] text-gray-600 active:text-gray-300 px-1 py-1"
            >
              ↺
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main ref={mainRef} className="flex-1 max-w-3xl mx-auto w-full px-4 py-5 overflow-y-auto">
        {state.phase === "combat" && state.combat ? (
          <CombatScreen
            state={state}
            onPlayCards={(ids) => dispatch({ type: "PLAY_CARDS", cardIds: ids })}
            onClaimReward={(id) => dispatch({ type: "CLAIM_REWARD", cardId: id })}
            onRetry={() => dispatch({ type: "RETRY_COMBAT" })}
          />
        ) : (
          <StoryScreen state={state} scene={scene} dispatch={dispatch} />
        )}
      </main>
    </div>
  );
}

function StoryScreen({
  state,
  scene,
  dispatch,
}: {
  state: GameState;
  scene: Scene;
  dispatch: (a: Action) => void;
}) {
  const isEnding = scene.id === "foundling_ending" || scene.id === "broken_vow_ending";
  const cardRewardId = scene.cardReward;
  const justGotCard = cardRewardId && state.cardsCollected.includes(cardRewardId);

  return (
    <div className="flex flex-col gap-6">
      {/* Scene header */}
      <div className="flex items-start gap-3">
        <span className="text-4xl">{scene.icon}</span>
        <div>
          <h1 className="text-xl font-bold text-white leading-tight">{scene.title}</h1>
          <p className="text-xs text-gray-500 mt-0.5">📍 {scene.location}</p>
        </div>
      </div>

      {/* Narrative text */}
      <div className="space-y-4">
        {scene.text.map((para, i) => (
          <p
            key={i}
            className={`leading-relaxed ${
              isEnding ? "text-amber-100 text-base" : "text-gray-200 text-sm"
            }`}
          >
            {para}
          </p>
        ))}
      </div>

      {/* Card reward banner */}
      {cardRewardId && justGotCard && (
        <div className="bg-amber-950/40 border border-amber-700/50 rounded-xl p-4">
          <p className="text-amber-300 text-xs font-semibold mb-2">✨ Card added to your deck:</p>
          <CardComponent card={ALL_CARDS[cardRewardId]} size="sm" />
        </div>
      )}

      {/* Choices */}
      {scene.choices && scene.choices.length > 0 && (
        <div className="space-y-2 mt-2">
          {scene.choices.map((choice) => {
            const missingFlags = choice.requires?.filter((f) => !state.flags[f]);
            const locked = missingFlags && missingFlags.length > 0;
            const disabledReason = locked
              ? `Requires: ${missingFlags.join(", ")}`
              : choice.disabled;

            return (
              <button
                key={choice.id}
                disabled={!!disabledReason}
                style={{ touchAction: "manipulation" }}
                onClick={() =>
                  dispatch({
                    type: "GO_SCENE",
                    sceneId: choice.nextScene,
                    setsFlag: choice.setsFlag,
                    effect: choice.effect as Partial<GameState> | undefined,
                  })
                }
                className={[
                  "w-full text-left px-4 py-4 rounded-xl border text-sm font-medium transition-colors",
                  disabledReason
                    ? "border-gray-800 text-gray-600 cursor-not-allowed bg-gray-900/20"
                    : "border-amber-800/50 active:border-amber-500 bg-amber-950/20 active:bg-amber-950/40 text-amber-100",
                ].join(" ")}
              >
                <span className="text-amber-500 mr-2">›</span>
                {choice.text}
                {disabledReason && (
                  <span className="block text-xs text-gray-600 mt-0.5 ml-4">
                    🔒 {disabledReason}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TitleScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-lg w-full space-y-6">
        <div>
          <p className="text-amber-500 text-xs tracking-[0.3em] uppercase mb-3">
            A Long Time Ago In A Galaxy Far, Far Away...
          </p>
          <h1 className="text-5xl font-black text-white tracking-tight">THE MANDALORIAN</h1>
          <p className="text-gray-500 mt-2 text-sm">Choose Your Own Adventure · Deck Builder</p>
        </div>

        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 text-left space-y-4">
          <p className="text-gray-300 text-sm leading-relaxed">
            Navigate the Outer Rim as a legendary bounty hunter. Every decision shapes your
            timeline — and every battle is won with the cards you collect.
          </p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-gray-800/60 rounded-lg p-3">
              <p className="text-amber-400 font-bold mb-1">📖 Branching Story</p>
              <p className="text-gray-400">Choices unlock two distinct timelines</p>
            </div>
            <div className="bg-gray-800/60 rounded-lg p-3">
              <p className="text-amber-400 font-bold mb-1">🃏 Deck Building</p>
              <p className="text-gray-400">Collect weapons, gear & allies in battle</p>
            </div>
            <div className="bg-gray-800/60 rounded-lg p-3">
              <p className="text-amber-400 font-bold mb-1">⚔️ Card Combat</p>
              <p className="text-gray-400">Select cards each turn to fight your way through</p>
            </div>
            <div className="bg-gray-800/60 rounded-lg p-3">
              <p className="text-amber-400 font-bold mb-1">🌌 Two Timelines</p>
              <p className="text-gray-400">The Foundling · The Broken Vow</p>
            </div>
          </div>
        </div>

        <button
          onClick={onStart}
          className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          THIS IS THE WAY
        </button>

        <p className="text-gray-700 text-xs">
          5-card starting deck · Multiple endings · Beskar not included
        </p>
      </div>
    </div>
  );
}
