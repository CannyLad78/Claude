import type { Card } from "./types";

export const ALL_CARDS: Record<string, Card> = {
  // ── STARTING DECK ──────────────────────────────────────────────
  westar_blaster: {
    id: "westar_blaster",
    name: "WESTAR-35 Blaster",
    type: "weapon",
    cost: 1,
    damage: 4,
    description: "Standard Mandalorian sidearm. Reliable in any firefight.",
    icon: "🔫",
    flavor: "This is the way.",
  },
  beskar_plate: {
    id: "beskar_plate",
    name: "Beskar Plate",
    type: "gear",
    cost: 1,
    defense: 4,
    description: "Mandalorian iron. Worth more than credits.",
    icon: "🛡️",
    flavor: "Beskar can withstand a direct blaster shot.",
    effect: "shield",
  },
  combat_training: {
    id: "combat_training",
    name: "Combat Training",
    type: "ability",
    cost: 0,
    damage: 2,
    drawCount: 2,
    description: "Strike, then draw two cards. The Mandalorian is always prepared.",
    icon: "⚔️",
  },
  whistling_birds: {
    id: "whistling_birds",
    name: "Whistling Birds",
    type: "weapon",
    cost: 2,
    aoeDamage: 3,
    description: "Wrist-mounted micro-rockets fan out to hit all enemies.",
    icon: "🎯",
    flavor: "One shot, many targets.",
  },
  quick_draw: {
    id: "quick_draw",
    name: "Quick Draw",
    type: "ability",
    cost: 1,
    damage: 5,
    description: "Strike before the enemy can react. Deal 5 damage.",
    icon: "⚡",
    flavor: "Speed is the difference between a bounty and a bounty hunter.",
  },

  // ── ARVALA-7 CARDS ──────────────────────────────────────────────
  blurrg_ride: {
    id: "blurrg_ride",
    name: "Blurrg Charge",
    type: "ability",
    cost: 1,
    damage: 6,
    description: "Mount a blurrg and charge into battle for heavy damage.",
    icon: "🦕",
    flavor: "Kuiil said it with quiet pride: 'I have spoken.'",
  },
  vibroblade: {
    id: "vibroblade",
    name: "Vibroblade",
    type: "weapon",
    cost: 1,
    damage: 3,
    healing: 1,
    description: "Recovered from the mercenary compound. Hits hard; the vibration seals minor wounds.",
    icon: "🗡️",
  },
  flamethrower: {
    id: "flamethrower",
    name: "Flamethrower",
    type: "weapon",
    cost: 2,
    aoeDamage: 4,
    description: "Wrist-mounted flamethrower. Clears groups fast.",
    icon: "🔥",
    flavor: "Not for use near children. Especially one in particular.",
  },
  kuiil_wisdom: {
    id: "kuiil_wisdom",
    name: "Kuiil's Wisdom",
    type: "ability",
    cost: 0,
    healing: 3,
    drawCount: 1,
    description: "A calm mind before battle. Heal 3, draw 1.",
    icon: "🏜️",
    flavor: "'I have spoken.'",
  },

  // ── GUILD / NEVARRO CARDS ──────────────────────────────────────
  ig11_barrage: {
    id: "ig11_barrage",
    name: "IG-11 Barrage",
    type: "ally",
    cost: 2,
    damage: 3,
    aoeDamage: 3,
    description: "IG-11 unloads on every target. 3 damage to primary + 3 to all others.",
    icon: "🤖",
    flavor: "IG-11 is no longer bound by bounty hunter protocols.",
  },
  beskar_upgrade: {
    id: "beskar_upgrade",
    name: "Beskar Upgrade",
    type: "gear",
    cost: 1,
    defense: 6,
    description: "Freshly forged beskar plate. Superior protection.",
    icon: "⚗️",
    effect: "shield",
  },
  guild_commission: {
    id: "guild_commission",
    name: "Guild Commission",
    type: "ability",
    cost: 0,
    drawCount: 3,
    description: "Leverage Guild connections. Draw 3 cards immediately.",
    icon: "📜",
    flavor: "The Guild protects its own — until it doesn't.",
  },
  tracking_fob: {
    id: "tracking_fob",
    name: "Tracking Fob",
    type: "ability",
    cost: 1,
    damage: 2,
    description: "Target locked. Deal 2 damage; the fob marks the enemy — they can't hide.",
    icon: "📡",
    effect: "double_next",
  },

  // ── LATE-GAME CARDS ────────────────────────────────────────────
  darksaber_parry: {
    id: "darksaber_parry",
    name: "Darksaber Parry",
    type: "ability",
    cost: 1,
    defense: 8,
    description: "Intercept a Darksaber strike. Block up to 8 damage.",
    icon: "🖤",
    effect: "shield",
  },
  amban_rifle: {
    id: "amban_rifle",
    name: "Amban Phase-Pulse Rifle",
    type: "weapon",
    cost: 3,
    damage: 12,
    description: "The Mandalorian's signature rifle. Massive single-target damage.",
    icon: "🎖️",
    flavor: "A disintegration leaves little to claim.",
    effect: "stun",
  },
  grogu_force: {
    id: "grogu_force",
    name: "Grogu's Force",
    type: "force",
    cost: 0,
    healing: 6,
    description: "Grogu reaches out with the Force, mending your wounds.",
    icon: "✨",
    flavor: "The Child watches with large, luminous eyes.",
  },
  rising_phoenix: {
    id: "rising_phoenix",
    name: "Rising Phoenix",
    type: "ability",
    cost: 2,
    healing: 4,
    damage: 4,
    description: "Jetpack burn — rise above the fight, heal 4, then dive for 4 damage.",
    icon: "🚀",
  },
  dark_trooper_plate: {
    id: "dark_trooper_plate",
    name: "Dark Trooper Plating",
    type: "gear",
    cost: 2,
    defense: 10,
    description: "Salvaged phrik armor plating. Heavy but near-impenetrable.",
    icon: "🦾",
    effect: "shield",
  },
};

export const STARTING_DECK: string[] = [
  "westar_blaster",
  "westar_blaster",
  "beskar_plate",
  "combat_training",
  "quick_draw",
];

export function getCard(id: string): Card {
  const card = ALL_CARDS[id];
  if (!card) throw new Error(`Unknown card: ${id}`);
  return card;
}

export function makeCard(id: string): Card {
  return { ...getCard(id) };
}
