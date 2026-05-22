import type { Card, CombatState, Enemy, GameState } from "./types";
import { ALL_CARDS, STARTING_DECK, makeCard } from "./cards";
import { SCENES, POST_COMBAT_SCENES } from "./scenes";

export function createInitialState(): GameState {
  return {
    scene: "title",
    previousScene: "",
    playerName: "The Mandalorian",
    health: 30,
    maxHealth: 30,
    deck: STARTING_DECK.map(makeCard),
    discard: [],
    flags: {},
    timeline: "The Mandalorian",
    credits: 200,
    cardsCollected: [...STARTING_DECK],
    combat: null,
    phase: "title",
    turnCount: 0,
  };
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function drawFromPiles(deck: Card[], discard: Card[], count: number) {
  let d = [...deck];
  let dis = [...discard];
  const drawn: Card[] = [];

  for (let i = 0; i < count; i++) {
    if (d.length === 0) {
      d = shuffle(dis);
      dis = [];
    }
    if (d.length === 0) break;
    drawn.push(d.shift()!);
  }
  return { drawn, deck: d, discard: dis };
}

export function startCombat(state: GameState): GameState {
  const scene = SCENES[state.scene];
  if (!scene?.combat) return state;

  const enemies: Enemy[] = scene.combat.enemies.map((e) => ({
    ...e,
    health: e.maxHealth,
  }));

  const shuffledDeck = shuffle([...state.deck]);
  const { drawn: hand, deck, discard } = drawFromPiles(shuffledDeck, [], 4);

  const combat: CombatState = {
    enemies,
    hand,
    activeEnemyIndex: 0,
    turn: 1,
    log: [scene.combat.intro],
    phase: "player",
    selectedCards: [],
    pendingRewards: [],
    shield: 0,
    enemyStunned: false,
  };

  return { ...state, combat, phase: "combat", deck, discard };
}

function getEnemyAction(enemy: Enemy, turn: number): { action: string; damage: number } {
  const idx = turn % enemy.attackPattern.length;
  const pattern = enemy.attackPattern[idx];
  switch (pattern) {
    case "heavy":
      return { action: "heavy attack", damage: Math.floor(enemy.attack * 1.5) };
    case "special":
      return { action: enemy.special ?? "special attack", damage: enemy.attack + 4 };
    case "defend":
      return { action: "defensive stance", damage: 0 };
    default:
      return { action: "attack", damage: enemy.attack };
  }
}

export function playCards(state: GameState, cardIds: string[]): GameState {
  if (!state.combat || state.combat.phase !== "player") return state;

  let { enemies, hand, activeEnemyIndex, turn, log, shield, enemyStunned } = {
    ...state.combat,
    enemies: state.combat.enemies.map((e) => ({ ...e })),
    hand: [...state.combat.hand],
    log: [...state.combat.log],
  };

  let health = state.health;
  let deck = [...state.deck];
  let discard = [...state.discard];
  let doubleNext = false;

  // --- Player turn: process each selected card ---
  for (const cardId of cardIds) {
    const cardIdx = hand.findIndex((c) => c.id === cardId);
    if (cardIdx === -1) continue;
    const [card] = hand.splice(cardIdx, 1);
    discard.push(card);

    let dmg = (card.damage ?? 0) * (doubleNext ? 2 : 1);
    let aoeDmg = (card.aoeDamage ?? 0) * (doubleNext ? 2 : 1);
    doubleNext = false;

    // Defense / shield
    if (card.defense) {
      shield += card.defense;
      log.push(`${card.icon} ${card.name}: +${card.defense} shield`);
    }

    // Single-target damage
    if (dmg > 0) {
      const target = enemies.find((e, i) => i === activeEnemyIndex && e.health > 0)
        ?? enemies.find((e) => e.health > 0);
      if (target) {
        target.health = Math.max(0, target.health - dmg);
        log.push(`${card.icon} ${card.name}: ${dmg} damage → ${target.name} (${target.health}/${target.maxHealth} HP)`);
        if (target.health === 0) {
          log.push(`💀 ${target.name} defeated!`);
          const nextIdx = enemies.findIndex((e) => e.health > 0);
          if (nextIdx !== -1) activeEnemyIndex = nextIdx;
        }
      }
    }

    // AoE damage
    if (aoeDmg > 0) {
      for (const e of enemies) {
        if (e.health <= 0) continue;
        e.health = Math.max(0, e.health - aoeDmg);
        log.push(`${card.icon} ${card.name}: ${aoeDmg} AoE → ${e.name} (${e.health}/${e.maxHealth} HP)`);
        if (e.health === 0) log.push(`💀 ${e.name} defeated!`);
      }
    }

    // Healing
    if (card.healing) {
      health = Math.min(state.maxHealth, health + card.healing);
      log.push(`${card.icon} ${card.name}: +${card.healing} HP`);
    }

    // Draw cards
    if (card.drawCount) {
      const { drawn, deck: d2, discard: dis2 } = drawFromPiles(deck, discard, card.drawCount);
      deck = d2;
      discard = dis2;
      hand.push(...drawn);
      log.push(`${card.icon} ${card.name}: Drew ${drawn.length} card(s)`);
    }

    // Special effects
    if (card.effect === "stun") {
      enemyStunned = true;
      log.push(`${card.icon} ${card.name}: Enemy stunned!`);
    }
    if (card.effect === "double_next") {
      doubleNext = true;
      log.push(`${card.icon} ${card.name}: Next damage doubled!`);
    }
  }

  // --- Check all enemies dead → go to reward ---
  if (enemies.every((e) => e.health <= 0)) {
    const scene = SCENES[state.scene];
    const pendingRewards = (scene?.combat?.cardRewards ?? [])
      .map((id) => ALL_CARDS[id])
      .filter(Boolean) as Card[];

    return {
      ...state,
      health,
      deck,
      discard,
      combat: {
        ...state.combat,
        enemies,
        hand,
        activeEnemyIndex,
        turn,
        log: [...log, `⚔️ All enemies defeated!`],
        phase: "reward",
        pendingRewards,
        shield,
        enemyStunned: false,
      },
    };
  }

  // --- Enemy turn ---
  if (!enemyStunned) {
    for (const enemy of enemies) {
      if (enemy.health <= 0) continue;
      const { action, damage: rawDmg } = getEnemyAction(enemy, turn);
      if (rawDmg === 0) {
        log.push(`${enemy.icon} ${enemy.name} takes a defensive stance.`);
        continue;
      }
      const absorbed = Math.min(shield, rawDmg);
      shield = Math.max(0, shield - rawDmg);
      const finalDmg = rawDmg - absorbed;
      health = Math.max(0, health - finalDmg);

      log.push(
        absorbed > 0
          ? `${enemy.icon} ${enemy.name} ${action}: ${rawDmg} → ${absorbed} blocked → ${finalDmg} damage taken`
          : `${enemy.icon} ${enemy.name} ${action}: ${rawDmg} damage!`
      );
    }
  } else {
    log.push(`⚡ Enemy stunned — skipped attack!`);
    enemyStunned = false;
  }

  // Player death
  if (health <= 0) {
    return {
      ...state,
      health: 0,
      deck,
      discard,
      combat: {
        ...state.combat,
        enemies,
        hand,
        activeEnemyIndex,
        turn,
        log,
        phase: "defeat",
        shield: 0,
        enemyStunned: false,
      },
    };
  }

  // Refill hand to 4
  const needed = Math.max(0, 4 - hand.length);
  const { drawn: refill, deck: d3, discard: dis3 } = drawFromPiles(deck, discard, needed);
  hand.push(...refill);

  return {
    ...state,
    health,
    deck: d3,
    discard: dis3,
    combat: {
      ...state.combat,
      enemies,
      hand,
      activeEnemyIndex,
      turn: turn + 1,
      log,
      phase: "player",
      shield,
      enemyStunned: false,
    },
  };
}

export function claimReward(state: GameState, cardId: string | null): GameState {
  if (!state.combat) return state;

  let newDeck = [...state.deck];
  let cardsCollected = [...state.cardsCollected];

  if (cardId) {
    const card = ALL_CARDS[cardId];
    if (card) {
      newDeck.push(makeCard(cardId));
      if (!cardsCollected.includes(cardId)) cardsCollected.push(cardId);
    }
  }

  const nextScene = POST_COMBAT_SCENES[state.scene] ?? state.scene;

  return {
    ...state,
    deck: newDeck,
    cardsCollected,
    combat: null,
    phase: "story",
    scene: nextScene,
    previousScene: state.scene,
  };
}

export function retryCombat(state: GameState): GameState {
  // Restore some HP before retry so the player isn't immediately overwhelmed
  const restored = Math.max(15, Math.floor(state.maxHealth * 0.5));
  return startCombat({ ...state, health: restored });
}

export function goToScene(
  state: GameState,
  sceneId: string,
  setsFlag?: string,
  effect?: Partial<GameState>
): GameState {
  const scene = SCENES[sceneId];
  if (!scene) return state;

  const newFlags = setsFlag ? { ...state.flags, [setsFlag]: true } : { ...state.flags };
  const timeline =
    (effect?.timeline as GameState["timeline"]) ??
    (scene.timeline as GameState["timeline"] | undefined) ??
    state.timeline;

  // Grant any card reward for entering this scene
  let newDeck = [...state.deck];
  let cardsCollected = [...state.cardsCollected];
  if (scene.cardReward && !cardsCollected.includes(scene.cardReward)) {
    newDeck.push(makeCard(scene.cardReward));
    cardsCollected.push(scene.cardReward);
  }

  const nextState: GameState = {
    ...state,
    scene: sceneId,
    previousScene: state.scene,
    flags: newFlags,
    timeline,
    deck: newDeck,
    cardsCollected,
    turnCount: state.turnCount + 1,
  };

  if (scene.combat) {
    return startCombat(nextState);
  }

  return { ...nextState, phase: "story" };
}

export function restartGame(): GameState {
  return createInitialState();
}
