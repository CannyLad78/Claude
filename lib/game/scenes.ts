import type { Scene } from "./types";

export const SCENES: Record<string, Scene> = {
  // ══════════════════════════════════════════════════════════════
  // OPENING
  // ══════════════════════════════════════════════════════════════
  title: {
    id: "title",
    title: "The Mandalorian",
    location: "A Galaxy Far, Far Away",
    icon: "🌌",
    text: [],
    choices: [{ id: "start", text: "Begin Your Journey", nextScene: "opening" }],
  },

  opening: {
    id: "opening",
    title: "Nevarro — The Outer Rim",
    location: "Nevarro",
    icon: "🌋",
    text: [
      "The lava fields of Nevarro glow amber against a black sky. You are the Mandalorian — a legendary bounty hunter of the Outer Rim, known across the galaxy only by the gleam of your beskar helmet.",
      "Your quarry is secured. Credits are thin. The Razor Crest sits in the hangar, her hull pocked from a skirmish over Sorgan. You need another job.",
      "Greef Karga has been sending encoded pings for two days. The Guild master rarely reaches out directly. Whatever he has, it's big.",
    ],
    choices: [
      {
        id: "go_cantina",
        text: "Head to the cantina and meet Greef Karga",
        nextScene: "cantina",
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // CANTINA
  // ══════════════════════════════════════════════════════════════
  cantina: {
    id: "cantina",
    title: "The Bounty Hunters' Cantina",
    location: "Nevarro City",
    icon: "🍺",
    text: [
      "The cantina reeks of Spotchka and burned circuitry. A dozen bounty hunters eye you as you enter — none brave enough to cause trouble, all wishing they were.",
      "Greef Karga rises from a corner booth, his blue cape billowing. 'Mando!' He spreads his arms wide. 'Business has been good since you cleared out that nest on Tatooine.' He slides a data pad across the table.",
      "'I have a special commission. Off-book. The client is... Imperial-adjacent. The pay is five fobs of beskar.' He leans in. 'Real beskar. Not a promise — actual ingots waiting in escrow.'",
      "Five beskar ingots. Enough to replate the Razor Crest and fund a season of work. The job details are sparse: recover an asset of fifty years of age, last seen on Arvala-7.",
    ],
    choices: [
      {
        id: "accept",
        text: "Accept the commission — beskar is the way",
        nextScene: "accept_job",
        setsFlag: "accepted_job",
      },
      {
        id: "ask_more",
        text: "Press Greef for more information",
        nextScene: "press_greef",
      },
      {
        id: "decline",
        text: "Decline — something feels wrong about this",
        nextScene: "decline_job",
        setsFlag: "declined_initially",
      },
    ],
  },

  press_greef: {
    id: "press_greef",
    title: "The Bounty Hunters' Cantina",
    location: "Nevarro City",
    icon: "🍺",
    text: [
      "You tap the data pad. 'Fifty years old? That's unusual.' Greef shifts in his seat. 'The client didn't elaborate. Imperial remnant types — they never do.'",
      "'All you get is a tracking fob and the coordinates for Arvala-7. The Guild doesn't ask questions when the pay is this good.' He pauses. 'Neither should you.'",
      "The tracking fob activates with a faint blue pulse. Whatever is on Arvala-7, it's alive.",
    ],
    choices: [
      {
        id: "accept_after_info",
        text: "Accept — the pay justifies the risk",
        nextScene: "accept_job",
        setsFlag: "accepted_job",
      },
      {
        id: "decline_after_info",
        text: "Walk away — this smells like a trap",
        nextScene: "decline_job",
        setsFlag: "declined_initially",
      },
    ],
  },

  decline_job: {
    id: "decline_job",
    title: "Outside the Cantina",
    location: "Nevarro City",
    icon: "🌋",
    timeline: "The Broken Vow",
    text: [
      "You pocket the fob and head for the door. Something about Imperial remnants and secret assets turns your stomach. You've made enough enemies chasing off-book commissions.",
      "But back at the Razor Crest, the credits counter mocks you. The hyperdrive is failing. You need this. An hour later you're back at the cantina.",
      "'Changed your mind?' Greef smiles like he expected this. The tracking fob is still warm.",
    ],
    choices: [
      {
        id: "accept_after_decline",
        text: "Take the job — pride is a luxury you can't afford",
        nextScene: "accept_job",
        setsFlag: "accepted_job",
      },
    ],
  },

  accept_job: {
    id: "accept_job",
    title: "The Razor Crest — Hangar Bay",
    location: "Nevarro City",
    icon: "🚀",
    text: [
      "You collect the tracking fob and a partial advance — two beskar ingots, cold and heavy in your palm. Real Mandalorian iron. You haven't seen this much in years.",
      "The Razor Crest lifts off at dawn. Arvala-7 is eight parsecs out — an arid, windswept world, barely mapped, home to little except dust and whatever the Empire left behind.",
      "En route, you review the fob's signal. The asset is stationary. Fifty years old. Whatever you're hunting, it's been waiting a long time.",
    ],
    choices: [
      {
        id: "to_arvala",
        text: "Set course for Arvala-7",
        nextScene: "arvala_landing",
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // ARVALA-7
  // ══════════════════════════════════════════════════════════════
  arvala_landing: {
    id: "arvala_landing",
    title: "Arvala-7 — The Wastes",
    location: "Arvala-7",
    icon: "🏜️",
    text: [
      "The Razor Crest punches through Arvala-7's atmosphere and immediately you're fighting the controls — sandstorms claw at the hull. Emergency landing. Hard.",
      "You crawl out of the wreck into blistering wind. Two massive lizard-like creatures circle you — blurrgs, four meters at the shoulder, territorial and hungry.",
      "A weathered Ugnaught watches from a ridge above, arms folded. 'They are territorial,' he calls down, voice carrying over the wind. 'You will not outrun them. You must establish dominance.'",
    ],
    combat: {
      enemies: [
        {
          id: "blurrg_alpha",
          name: "Blurrg Alpha",
          maxHealth: 18,
          attack: 5,
          attackPattern: ["attack", "attack", "heavy"],
          special: "Charge: 8 damage",
          icon: "🦕",
          reward: ["blurrg_ride"],
        },
      ],
      intro: "The blurrg charges! Establish dominance!",
      victory: "The blurrg stills, eyeing you with new respect. The Ugnaught descends from the ridge, nodding slowly.",
      defeat: "The blurrg drives you back. You narrowly escape into the rocks.",
      cardRewards: ["blurrg_ride", "kuiil_wisdom"],
    },
    choices: [],
  },

  kuiil_camp: {
    id: "kuiil_camp",
    title: "Kuiil's Homestead",
    location: "Arvala-7",
    icon: "🏚️",
    text: [
      "'I am Kuiil. I have worked these wastes for many seasons.' The Ugnaught leads you to a modest homestead carved into the rock. 'I know of your quarry. Many have come before you. None have returned.'",
      "Over a fire, he explains: a heavily fortified compound half a day's ride north. Mercenaries — maybe thirty — plus some kind of droid. Whatever is inside, people want it badly enough to die for it.",
      "'I will guide you to the compound,' Kuiil says, 'but I will not fight. I have retired from such things.' He pauses, studying you. 'The blurrg you tamed — she is yours to ride. She will not fail you.'",
    ],
    cardReward: "kuiil_wisdom",
    choices: [
      {
        id: "approach_compound",
        text: "Ride out to the compound at dawn",
        nextScene: "compound_approach",
        setsFlag: "kuiil_helped",
      },
    ],
  },

  compound_approach: {
    id: "compound_approach",
    title: "The Mercenary Compound",
    location: "Arvala-7",
    icon: "🏰",
    text: [
      "The compound materializes from the dust — walls of reinforced duracrete, guard towers, a half-dozen mercenaries on patrol. Your tracking fob pulses stronger. The asset is inside.",
      "Before you can formulate a plan, a series of explosions rips through the front gate. An IG-series assassin droid strides through the smoke, guns blazing from every arm, cutting down mercenaries with methodical precision.",
      "IG-11 — a droid bounty hunter, also after your quarry. It pivots toward you and pauses. 'Bounty hunter,' it transmits on open frequency, 'we are competitors. However, given the circumstances, a temporary alliance may be optimal.'",
    ],
    choices: [
      {
        id: "ally_ig11",
        text: "Accept IG-11's partnership — get the asset, split the fee",
        nextScene: "mercenary_battle",
        setsFlag: "ig11_ally",
      },
      {
        id: "ignore_ig11",
        text: "Enter alone — you work solo",
        nextScene: "mercenary_battle",
      },
    ],
  },

  mercenary_battle: {
    id: "mercenary_battle",
    title: "The Mercenary Compound — Interior",
    location: "Arvala-7",
    icon: "💥",
    text: [
      "The compound interior is chaos — fires, bodies, shouting mercenaries who don't know which direction to run. You push deeper, the tracking fob screaming.",
    ],
    combat: {
      enemies: [
        {
          id: "mercenary_captain",
          name: "Mercenary Captain",
          maxHealth: 22,
          attack: 6,
          attackPattern: ["attack", "heavy", "attack", "defend"],
          special: "Call for backup: +4 next attack",
          icon: "🪖",
          reward: ["vibroblade", "flamethrower"],
        },
        {
          id: "mercenary_gunner",
          name: "Mercenary Gunner",
          maxHealth: 14,
          attack: 4,
          attackPattern: ["attack", "attack", "special"],
          special: "Sniper shot: 8 damage",
          icon: "🔫",
          reward: ["tracking_fob"],
        },
      ],
      intro: "Mercenaries converge on your position!",
      victory:
        "The last mercenary drops. Silence. The tracking fob's pulse is deafening. The asset is just ahead.",
      defeat: "Overwhelmed by numbers, you're forced to retreat.",
      cardRewards: ["vibroblade", "flamethrower", "tracking_fob"],
    },
    choices: [],
  },

  // ══════════════════════════════════════════════════════════════
  // THE ASSET — KEY DECISION
  // ══════════════════════════════════════════════════════════════
  asset_found: {
    id: "asset_found",
    title: "The Asset Chamber",
    location: "Arvala-7— Compound",
    icon: "👶",
    text: [
      "The inner chamber is quiet. A spherical metal cradle hovers at the center, humming softly. The tracking fob goes silent.",
      "You open the cradle.",
      "Inside, watching you with enormous dark eyes, is a child. No more than a foot tall, green-skinned, with ears that nearly reach its shoulders. Fifty years old — and an infant by any measure of its species.",
      "This is the asset. The Empire wants this child.",
      "Something shifts in you. The tracking fob shows a comm ping — Greef Karga: 'Retrieve only the asset. Eliminate the nursing unit.' Clinical language for murder.",
      "You look at the child. The child looks at you.",
    ],
    choices: [
      {
        id: "protect",
        text: "\"This is not the way.\" — Take the child and run",
        nextScene: "protect_choice",
        setsFlag: "protect_grogu",
        effect: { timeline: "The Foundling" },
      },
      {
        id: "deliver",
        text: "Complete the job — deliver the asset to the Client",
        nextScene: "deliver_choice",
        setsFlag: "deliver_grogu",
        effect: { timeline: "The Broken Vow" },
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // TIMELINE A: THE FOUNDLING (Protect Grogu)
  // ══════════════════════════════════════════════════════════════
  protect_choice: {
    id: "protect_choice",
    title: "Fleeing Arvala-7",
    location: "Arvala-7",
    icon: "🌟",
    timeline: "The Foundling",
    text: [
      "You scoop the child from the cradle. It reaches up a tiny hand and touches your helmet. You let it.",
      "The Guild tracking fob in every hunter's pocket just lit up. Your own fob — the one that led you here — you snap it in half. You left it on the ground.",
      "Kuiil is waiting at the ship. He takes one look at the child and says nothing for a long moment. Then: 'You will need to repair the Razor Crest. I have supplies.'",
      "'They'll send every hunter in the sector,' you tell him.",
      "'I know. I have spoken.'",
    ],
    cardReward: "rising_phoenix",
    choices: [
      {
        id: "flee_nevarro",
        text: "Rush repairs and flee to Nevarro",
        nextScene: "guild_hunt",
      },
    ],
  },

  guild_hunt: {
    id: "guild_hunt",
    title: "Nevarro — Guild Ambush",
    location: "Nevarro City",
    icon: "⚔️",
    timeline: "The Foundling",
    text: [
      "Nevarro. The Razor Crest touches down and you're immediately surrounded. A dozen Guild hunters step from the shadows — Greef Karga at their center, looking genuinely sorry.",
      "'Mando.' His voice is tired. 'You know how this works. Hand over the child and you walk. The Guild will forget the rest.' He gestures to the hunters. 'We've all been paid.'",
      "The child peeks from under your cloak. One of the hunters moves.",
    ],
    combat: {
      enemies: [
        {
          id: "guild_hunter_1",
          name: "Guild Hunter",
          maxHealth: 16,
          attack: 5,
          attackPattern: ["attack", "attack", "heavy"],
          special: "Net launcher: skip your next card",
          icon: "🏹",
          reward: [],
        },
        {
          id: "guild_hunter_2",
          name: "Guild Hunter",
          maxHealth: 16,
          attack: 4,
          attackPattern: ["attack", "defend", "attack"],
          special: "",
          icon: "🏹",
          reward: [],
        },
        {
          id: "guild_enforcer",
          name: "Guild Enforcer",
          maxHealth: 24,
          attack: 7,
          attackPattern: ["heavy", "attack", "attack", "special"],
          special: "Vibroblade sweep: 7 to all",
          icon: "🪖",
          reward: ["guild_commission"],
        },
      ],
      intro:
        "Guild hunters close in. Fight your way to the covert!",
      victory:
        "The hunters scatter. Greef Karga retreats, looking conflicted. The Mandalorian covert opens its doors.",
      defeat: "Outnumbered, you're forced to surrender the child — for now.",
      cardRewards: ["guild_commission", "ig11_barrage"],
    },
    choices: [],
  },

  covert_refuge: {
    id: "covert_refuge",
    title: "The Mandalorian Covert",
    location: "Nevarro — The Covert",
    icon: "🪖",
    timeline: "The Foundling",
    text: [
      "Deep beneath Nevarro's lava channels, the covert is alive with the sound of hammers on beskar. Your people. Fellow foundlings, all of them.",
      "The Armorer sits at her forge. She studies the child for a long moment. 'The foundling is in your care,' she says finally. 'By creed, it is your duty to protect it — until it can be returned to its own kind.'",
      "'What is its kind?' you ask.",
      "'This, I cannot say.' She lifts a completed pauldron from the forge — a mudhorn sigil etched into the steel. 'But you have both survived. That makes you a clan of two.'",
      "New beskar. Fresh forge. You are ready.",
    ],
    cardReward: "beskar_upgrade",
    choices: [
      {
        id: "make_stand",
        text: "The covert will help you — make a stand on the streets of Nevarro",
        nextScene: "nevarro_stand",
        requires: ["kuiil_helped"],
      },
      {
        id: "escape_alone",
        text: "Take the child and run — you won't risk your people",
        nextScene: "nevarro_escape",
      },
    ],
  },

  nevarro_stand: {
    id: "nevarro_stand",
    title: "The Streets of Nevarro",
    location: "Nevarro City",
    icon: "🏙️",
    timeline: "The Foundling",
    text: [
      "The covert deploys into the streets — a dozen Mandalorians in gleaming beskar, a wall of iron and fire. Stormtroopers pour from the Imperial compound, flanked by death troopers.",
      "Greef Karga appears at your side, rifle raised. 'I owe you a life, Mando. Consider this payment.'",
      "And behind you — the sound of whirring servos. IG-11, reprogrammed by Kuiil, wheels around the corner with both cannons hot.",
      "'I am no longer a hunter,' it broadcasts. 'I am a nurse droid. But I am permitted to defend.'",
    ],
    combat: {
      enemies: [
        {
          id: "death_trooper_1",
          name: "Death Trooper",
          maxHealth: 20,
          attack: 7,
          attackPattern: ["attack", "heavy", "attack"],
          special: "Coordinated fire: +3 next attack",
          icon: "🖤",
          reward: [],
        },
        {
          id: "death_trooper_2",
          name: "Death Trooper",
          maxHealth: 20,
          attack: 7,
          attackPattern: ["defend", "attack", "heavy"],
          special: "",
          icon: "🖤",
          reward: [],
        },
        {
          id: "imperial_commander",
          name: "Imperial Commander",
          maxHealth: 28,
          attack: 8,
          attackPattern: ["attack", "attack", "heavy", "special"],
          special: "Call reinforcements: heal 6 HP",
          icon: "⭐",
          reward: ["dark_trooper_plate", "ig11_barrage"],
        },
      ],
      intro: "Imperial forces flood the street — hold the line!",
      victory:
        "The last trooper falls. Smoke and silence settle over Nevarro. The way to the Razor Crest is clear.",
      defeat: "Imperial forces overwhelm the position.",
      cardRewards: ["ig11_barrage", "dark_trooper_plate", "amban_rifle"],
    },
    choices: [],
  },

  nevarro_escape: {
    id: "nevarro_escape",
    title: "Escaping Nevarro",
    location: "Nevarro — The Tunnels",
    icon: "🌋",
    timeline: "The Foundling",
    text: [
      "You thread through lava tunnels, the child tucked under your arm. Stormtroopers echo behind you.",
      "IG-11 meets you at the tunnel's mouth — Kuiil reprogrammed it before he fell. It provides covering fire long enough for you to reach the Razor Crest.",
      "The child raises its hand. Three death troopers freeze mid-charge — lifted off the ground by an invisible force — then crash to the canyon floor.",
      "The child lowers its hand, exhausted. Closes its eyes.",
      "You stare for a long moment, then seal the cockpit and fire the engines.",
    ],
    choices: [
      {
        id: "to_tython",
        text: "Plot a course to the ancient Jedi temple on Tython",
        nextScene: "tython_approach",
        setsFlag: "seeking_jedi",
      },
      {
        id: "to_tattooine",
        text: "Lie low on Tatooine — find leads there",
        nextScene: "tattooine_arrival",
      },
    ],
  },

  tattooine_arrival: {
    id: "tattooine_arrival",
    title: "Tatooine — Mos Pelgo",
    location: "Tatooine",
    icon: "🌅",
    timeline: "The Foundling",
    text: [
      "Mos Pelgo — a small settlement half-buried in sand. The marshal here wears a full set of Mandalorian armor, scratched and ill-fitting, but unmistakably beskar.",
      "Cobb Vanth. A former slave who bought the armor from Jawas who found it in the desert. He wears it to protect his people. He's not Mandalorian — but the armor is.",
      "There's also a Krayt dragon nesting in the desert, terrorizing both the village and a local Tusken clan. You make a deal: help kill the dragon, the armor comes with you.",
    ],
    combat: {
      enemies: [
        {
          id: "krayt_dragon",
          name: "Krayt Dragon",
          maxHealth: 45,
          attack: 10,
          attackPattern: ["attack", "heavy", "attack", "special", "attack"],
          special: "Acid Spit: 12 damage, ignore defense",
          icon: "🐉",
          reward: ["amban_rifle"],
        },
      ],
      intro:
        "The Krayt dragon emerges from the desert — a beast the size of a ship!",
      victory:
        "The dragon falls. The Tuskens cheer. Cobb Vanth removes the armor piece by piece and sets it before you.",
      defeat: "The dragon's acid spray drives you back into cover.",
      cardRewards: ["amban_rifle", "rising_phoenix"],
    },
    choices: [],
  },

  tython_approach: {
    id: "tython_approach",
    title: "Tython — The Ancient Temple",
    location: "Tython",
    icon: "🌀",
    timeline: "The Foundling",
    text: [
      "Tython. An ancient world, older than the Republic. The temple atop the mountain predates memory. You set the child on the seeing stone at its center.",
      "Grogu closes its eyes. A pillar of Force energy rises from the stone — a beacon, visible from space.",
      "And from orbit, a Lambda-class shuttle descends. Stormtroopers first. Then Moff Gideon, the Darksaber glowing black and terrible in his hand.",
      "'You have something I want,' he says. 'And I have armies.'",
    ],
    combat: {
      enemies: [
        {
          id: "dark_trooper",
          name: "Dark Trooper",
          maxHealth: 30,
          attack: 9,
          attackPattern: ["attack", "heavy", "attack", "special"],
          special: "Rocket boost: 13 damage, ignore defense",
          icon: "🦾",
          reward: ["dark_trooper_plate"],
        },
        {
          id: "moff_gideon",
          name: "Moff Gideon",
          maxHealth: 40,
          attack: 10,
          attackPattern: ["attack", "heavy", "special", "attack", "heavy"],
          special: "Darksaber: 14 damage, ignores 5 defense",
          icon: "🖤",
          reward: ["darksaber_parry", "amban_rifle"],
        },
      ],
      intro:
        "Moff Gideon blocks the path to the temple — this ends here.",
      victory:
        "Gideon falls to one knee, the Darksaber skidding across the stone. A new presence steps from the shadows — a cloaked figure with a lightsaber of green.",
      defeat: "The Dark Troopers overwhelm you. Grogu is taken.",
      cardRewards: ["darksaber_parry", "dark_trooper_plate", "grogu_force"],
    },
    choices: [],
  },

  foundling_ending: {
    id: "foundling_ending",
    title: "The Temple — An Unexpected Arrival",
    location: "Tython",
    icon: "✨",
    timeline: "The Foundling",
    text: [
      "The cloaked figure lowers its hood. Young — mid-thirties — but ancient behind the eyes. One mechanical hand. The other holds a lightsaber of brilliant green.",
      "Grogu scrambles from your arms and runs toward the stranger, reaching up with tiny hands. The stranger kneels.",
      "'I am a Jedi,' the man says quietly. 'I will take the child to train him. He reached out through the Force — I am the answer to that call.'",
      "You look at Grogu. He looks at you. Those enormous eyes, full of something you don't have words for.",
      "The creed says: return the foundling to its kind. This is the way.",
      "You kneel. Remove your helmet — not for yourself, but so Grogu can see your face. Really see you.",
      "'May the Force be with you, little one.'",
      "He reaches out one tiny hand. Holds your finger for a moment. Then turns and goes.",
      "You watch the X-wing disappear into the stars. The Darksaber is cold in your hand. A new weight, a new purpose.",
      "This is the way.",
    ],
    choices: [
      {
        id: "play_again",
        text: "Begin Again — A New Path Awaits",
        nextScene: "title",
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // TIMELINE B: THE BROKEN VOW (Deliver Grogu)
  // ══════════════════════════════════════════════════════════════
  deliver_choice: {
    id: "deliver_choice",
    title: "Returning to Nevarro",
    location: "Razor Crest",
    icon: "🚀",
    timeline: "The Broken Vow",
    text: [
      "You seal the cradle. The child watches you through the viewport, unblinking.",
      "You tell yourself: this is the job. You don't get to choose who your quarries are. Credits keep the ship flying.",
      "The child makes a sound. Something between a chirp and a sigh. You turn up the cockpit noise.",
      "Nevarro. The Client is waiting.",
    ],
    choices: [
      {
        id: "hand_over",
        text: "Complete the delivery — a job is a job",
        nextScene: "client_delivery",
      },
    ],
  },

  client_delivery: {
    id: "client_delivery",
    title: "The Imperial Remnant Facility",
    location: "Nevarro City",
    icon: "🏛️",
    timeline: "The Broken Vow",
    text: [
      "The Client — pale, precise, flanked by death troopers — takes the child without ceremony. Dr. Pershing reaches for the cradle with something that looks like relief, and something else that looks like guilt.",
      "Five beskar ingots slide across the table. A Guild commendation. Your slate wiped clean.",
      "You're almost at the door when you hear it — a sound from behind the sealed blast doors. Small. Brief. Cut off.",
      "You stop walking.",
      "The Client's voice carries: 'The donor material is all that is required. Proceed with extraction.'",
      "Extraction.",
      "Your hand finds the WESTAR at your hip.",
    ],
    cardReward: "guild_commission",
    choices: [
      {
        id: "go_back",
        text: "Turn around. Whatever extraction means — stop it.",
        nextScene: "rescue_attempt",
        setsFlag: "rescue_grogu",
      },
      {
        id: "keep_walking",
        text: "Keep walking. It is not your concern.",
        nextScene: "too_late",
      },
    ],
  },

  too_late: {
    id: "too_late",
    title: "Nevarro — Three Days Later",
    location: "Nevarro City",
    icon: "🌋",
    timeline: "The Broken Vow",
    text: [
      "Three days. You take three contracts. You don't think about the child.",
      "On the fourth day, Greef Karga finds you with a look you've never seen on him before.",
      "'The Imperial facility was hit,' he says. 'Someone tipped off a Rebel cell. They found...' He stops. 'The child is gone. They took it. Gideon's forces took it.'",
      "A holonet message arrives on your ship's comm — an old Imperial frequency. Moff Gideon's voice: 'I know you were the hunter. Come to me, and I'll tell you what they plan to do with it. Or wonder for the rest of your days.'",
      "You look at yourself in the viewport's reflection. A bounty hunter. That's all.",
      "Is it?",
    ],
    choices: [
      {
        id: "go_after_grogu",
        text: "Follow Gideon's signal — this isn't over",
        nextScene: "rescue_attempt",
        setsFlag: "rescue_grogu",
      },
    ],
  },

  rescue_attempt: {
    id: "rescue_attempt",
    title: "Imperial Compound — Breach",
    location: "Nevarro City",
    icon: "💥",
    timeline: "The Broken Vow",
    text: [
      "The facility is locked down. Death troopers on every corridor. Dr. Pershing — cowering behind a terminal — looks up when you enter, then immediately raises his hands.",
      "'I didn't want this,' he says. 'The blood samples — Gideon wants to use the child's Force connection to create something. To transfer the ability.' He swallows. 'The child is already on the Arquitens-class cruiser in orbit.'",
      "Imperial stormtroopers flood the corridor.",
    ],
    combat: {
      enemies: [
        {
          id: "stormtrooper_squad",
          name: "Stormtrooper Squad",
          maxHealth: 20,
          attack: 5,
          attackPattern: ["attack", "attack", "heavy"],
          special: "Coordinated volley: 8 damage",
          icon: "⚡",
          reward: [],
        },
        {
          id: "death_trooper_elite",
          name: "Death Trooper Elite",
          maxHealth: 28,
          attack: 8,
          attackPattern: ["attack", "heavy", "attack", "special"],
          special: "Disruptor blast: 12 damage, bypass defense",
          icon: "🖤",
          reward: ["dark_trooper_plate"],
        },
      ],
      intro: "Imperial forces block your path to the hangar!",
      victory:
        "The last trooper drops. Pershing stares at you. 'I can get you to the cruiser,' he says. 'There's a shuttle.'",
      defeat: "Imperial forces overwhelm you — you're taken prisoner.",
      cardRewards: ["dark_trooper_plate", "amban_rifle", "rising_phoenix"],
    },
    choices: [],
  },

  gideon_confrontation: {
    id: "gideon_confrontation",
    title: "The Arquitens Cruiser — Bridge",
    location: "Imperial Cruiser",
    icon: "🖤",
    timeline: "The Broken Vow",
    text: [
      "The cruiser's bridge is dark except for the stars and the Darksaber's cold black glow. Moff Gideon stands at the viewport, not even turning as you enter.",
      "'I wondered if you'd come,' he says. 'The hunter with a conscience. How disappointing. And how useful.'",
      "Grogu sits in a containment field nearby — unharmed, but straining toward you with tiny hands. Gideon finally turns. The Darksaber rises.",
      "'You had one job. You couldn't even do that right. Let's settle this properly.'",
    ],
    combat: {
      enemies: [
        {
          id: "moff_gideon_final",
          name: "Moff Gideon",
          maxHealth: 45,
          attack: 11,
          attackPattern: ["attack", "heavy", "special", "attack", "heavy"],
          special: "Darksaber Surge: 15 damage, bypasses 6 defense",
          icon: "🖤",
          reward: ["darksaber_parry", "grogu_force"],
        },
      ],
      intro: "Moff Gideon raises the Darksaber — end this.",
      victory:
        "The Darksaber clatters to the deck. Gideon drops to his knees. The containment field flickers and dies. Grogu toddles forward and wraps tiny hands around your finger.",
      defeat: "Gideon's Darksaber finds a gap in your armor.",
      cardRewards: ["darksaber_parry", "grogu_force", "amban_rifle"],
    },
    choices: [],
  },

  broken_vow_ending: {
    id: "broken_vow_ending",
    title: "The Bridge — After",
    location: "Imperial Cruiser",
    icon: "🌟",
    timeline: "The Broken Vow",
    text: [
      "Gideon is restrained. The cruiser is yours — briefly, before its self-destruct begins counting down.",
      "You carry Grogu to the shuttle. The child reaches up and touches your helmet — the same gesture as before, on Arvala-7.",
      "You made the wrong call. Then you made it right.",
      "The shuttle clears the cruiser as it breaks apart. Grogu chirps softly, settling against you as if he'd always been there.",
      "You don't have a plan. You don't have a destination.",
      "But you have this: a child who should not exist, who somehow found you. And a creed that says you protect what you are given to protect.",
      "This is the way.",
    ],
    choices: [
      {
        id: "play_again_broken",
        text: "Begin Again — Choose Differently",
        nextScene: "title",
      },
    ],
  },
};

// Scene transitions after combat victory
export const POST_COMBAT_SCENES: Record<string, string> = {
  arvala_landing: "kuiil_camp",
  mercenary_battle: "asset_found",
  guild_hunt: "covert_refuge",
  nevarro_stand: "foundling_ending",
  tattooine_arrival: "foundling_ending",
  tython_approach: "foundling_ending",
  rescue_attempt: "gideon_confrontation",
  gideon_confrontation: "broken_vow_ending",
};
