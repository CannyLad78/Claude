"use client";

import type { Card } from "@/lib/game/types";

const TYPE_COLORS: Record<string, string> = {
  weapon: "border-red-500/60 bg-red-950/40",
  ability: "border-amber-500/60 bg-amber-950/40",
  gear: "border-blue-500/60 bg-blue-950/40",
  ally: "border-green-500/60 bg-green-950/40",
  force: "border-purple-500/60 bg-purple-950/40",
};

const TYPE_BADGE: Record<string, string> = {
  weapon: "bg-red-900/80 text-red-300",
  ability: "bg-amber-900/80 text-amber-300",
  gear: "bg-blue-900/80 text-blue-300",
  ally: "bg-green-900/80 text-green-300",
  force: "bg-purple-900/80 text-purple-300",
};

type Props = {
  card: Card;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
};

export default function CardComponent({ card, selected, onClick, disabled, size = "md" }: Props) {
  const isSmall = size === "sm";
  const isLarge = size === "lg";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        "relative rounded-xl border-2 text-left transition-all duration-150",
        "flex flex-col",
        isSmall
          ? "p-2 gap-1 min-w-[100px]"
          : isLarge
          ? "p-4 gap-2 min-w-[150px] max-w-[180px]"
          : "p-3 gap-2 min-w-[130px] max-w-[160px]",
        TYPE_COLORS[card.type] ?? "border-gray-600 bg-gray-900",
        selected
          ? "ring-2 ring-amber-400 scale-105 brightness-125"
          : "hover:scale-105 hover:brightness-110",
        disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
      ].join(" ")}
    >
      {selected && (
        <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center">
          <span className="text-black text-xs font-bold">✓</span>
        </div>
      )}

      <div className="flex items-start justify-between gap-1">
        <span className={isSmall ? "text-lg" : "text-2xl"}>{card.icon}</span>
        {card.cost > 0 && (
          <span className="text-xs font-bold text-amber-400 bg-amber-400/10 rounded px-1">
            ⚡{card.cost}
          </span>
        )}
      </div>

      <div>
        <p className={`font-bold text-white leading-tight ${isSmall ? "text-xs" : "text-sm"}`}>
          {card.name}
        </p>
        <span className={`inline-block rounded px-1 text-[10px] font-semibold mt-0.5 ${TYPE_BADGE[card.type]}`}>
          {card.type}
        </span>
      </div>

      {!isSmall && (
        <>
          <p className="text-[11px] text-gray-300 leading-tight flex-1">{card.description}</p>
          {isLarge && card.flavor && (
            <p className="text-[10px] text-gray-500 italic leading-tight mt-1">{card.flavor}</p>
          )}
        </>
      )}

      <div className="flex flex-wrap gap-1 mt-auto">
        {card.damage && (
          <Stat label="⚔️" value={card.damage} color="text-red-300" />
        )}
        {card.aoeDamage && (
          <Stat label="💥" value={card.aoeDamage} color="text-orange-300" suffix="aoe" />
        )}
        {card.defense && (
          <Stat label="🛡️" value={card.defense} color="text-blue-300" />
        )}
        {card.healing && (
          <Stat label="💚" value={card.healing} color="text-green-300" />
        )}
        {card.drawCount && (
          <Stat label="🃏" value={card.drawCount} color="text-purple-300" />
        )}
      </div>
    </button>
  );
}

function Stat({ label, value, color, suffix }: { label: string; value: number; color: string; suffix?: string }) {
  return (
    <span className={`text-[11px] font-bold ${color} bg-black/30 rounded px-1 py-0.5`}>
      {label} {value}{suffix ? ` ${suffix}` : ""}
    </span>
  );
}
