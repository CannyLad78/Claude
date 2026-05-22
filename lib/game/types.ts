export type CardType = "weapon" | "ability" | "gear" | "ally" | "force";

export type Card = {
  id: string;
  name: string;
  type: CardType;
  cost: number;
  damage?: number;
  defense?: number;
  healing?: number;
  drawCount?: number;
  aoeDamage?: number;
  description: string;
  icon: string;
  flavor?: string;
  effect?: "stun" | "discard_enemy" | "double_next" | "shield";
};

export type Enemy = {
  id: string;
  name: string;
  maxHealth: number;
  health: number;
  attack: number;
  attackPattern: ("attack" | "heavy" | "special" | "defend")[];
  special?: string;
  icon: string;
  reward: string[];
};

export type Choice = {
  id: string;
  text: string;
  nextScene: string;
  requires?: string[];
  setsFlag?: string;
  effect?: Partial<GameState>;
  disabled?: string;
};

export type CombatSetup = {
  enemies: Omit<Enemy, "health">[];
  intro: string;
  victory: string;
  defeat: string;
  cardRewards: string[];
};

export type Scene = {
  id: string;
  title: string;
  location: string;
  text: string[];
  icon: string;
  timeline?: string;
  combat?: CombatSetup;
  cardReward?: string;
  choices?: Choice[];
  autoNext?: string;
  setsFlag?: string;
};

export type Timeline = "The Mandalorian" | "The Foundling" | "The Broken Vow";

export type CombatState = {
  enemies: Enemy[];
  hand: Card[];
  activeEnemyIndex: number;
  turn: number;
  log: string[];
  phase: "player" | "enemy" | "reward" | "victory" | "defeat";
  selectedCards: string[];
  pendingRewards: Card[];
  shield: number;
  enemyStunned: boolean;
};

export type GameState = {
  scene: string;
  previousScene: string;
  playerName: string;
  health: number;
  maxHealth: number;
  deck: Card[];
  discard: Card[];
  flags: Record<string, boolean>;
  timeline: Timeline;
  credits: number;
  cardsCollected: string[];
  combat: CombatState | null;
  phase: "story" | "combat" | "reward" | "gameover" | "victory" | "title";
  turnCount: number;
};
