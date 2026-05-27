/**
 * PCM-definitions.js
 * Source of Truth: Static Text & Reference Data
 * 
 * Verbatim text extracted directly from the Psychromattica SRD.
 * This file decouples rule descriptions from the mathematical simulation engine.
 */

export const PCM_SYSTEM_METADATA = {
  systemName: "Psychromattica",
  copyright: "© 2010 - 2025 by David \"Bagel\" Beall",
  license: "CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/)",
  description: "The mathematical and mechanical expression of the human soul. The bridge between intent and reality."
};

// Official Hex Color codes mapped to each Psychroma color
export const PCM_COLORS = {
  0: { name: "Null", hex: "#DEA193", motivation: "Discovery" },
  1: { name: "Silver", hex: "#A7A9AC", motivation: "Ambition" },
  2: { name: "Yellow", hex: "#F5D36C", motivation: "Freedom" },
  3: { name: "Green", hex: "#688D4C", motivation: "Security" },
  4: { name: "Black", hex: "#414042", motivation: "Legacy" },
  5: { name: "Orange", hex: "#F7855D", motivation: "Innovation" },
  6: { name: "White", hex: "#E3E1DA", motivation: "Purity" },
  7: { name: "Red", hex: "#A95B5A", motivation: "Glory" },
  8: { name: "Blue", hex: "#88BFE8", motivation: "Influence" },
  9: { name: "Purple", hex: "#957FA3", motivation: "Faith" }
};

// Verbatim Conditions from Layer 3, Section 1.0
export const PCM_CONDITIONS = {
  Mounted: {
    name: "Mounted",
    description: "Another entity is riding you. While being ridden you are silenced unless commanded. The rider dictates all actions during either entities’ turn and may expend actions from the action pool of either the rider or the mount."
  },
  Riding: {
    name: "Riding",
    description: "While Riding, you dictate all actions during either the rider’s or mount’s turn and may expend actions from the action pool of either the rider or the mount."
  },
  Prone: {
    name: "Prone",
    description: "Disadvantage on all actions. Standing costs a Move Action."
  },
  Crouching: {
    name: "Crouching",
    description: "Grants advantage to concealment. Movement is halved."
  },
  Cover: {
    name: "Cover",
    description: "Attacks against you suffer disadvantage. Grants advantage to Hide."
  },
  HighGround: {
    name: "High Ground",
    description: "+10 ft elevation. Advantage on ranged effects."
  },
  Submerged: {
    name: "Submerged",
    description: "Underwater. Disadvantage on actions; movement halved; grants cover."
  },
  Hidden: {
    name: "Hidden",
    description: "Undetected. Grants advantage on next action vs unaware target. Cannot be targeted."
  },
  Exhausted: {
    name: "Exhausted",
    description: "SP = 0. Disadvantage on all rolls."
  },
  Injured: {
    name: "Injured",
    description: "Max HP, SP, and EP are reduced by 5 (minimum 1) until next Downtime."
  },
  Unconscious: {
    name: "Unconscious",
    description: "HP = 0 or asleep. Cannot act. A Called shot can be used to destroy the target, ignoring Resistance."
  },
  Silenced: {
    name: "Silenced",
    description: "EP = 0, cannot use innate Keywords."
  },
  Exposed: {
    name: "Exposed",
    description: "Actions gain Advantage when targeting Exposed targets."
  }
};

// Verbatim Status Tags from Layer 3, Section 2.4
export const PCM_STATUS_TAGS = {
  Null: {
    name: "Mark",
    color: "Null",
    description: "The next attack roll made against you gains Advantage. After the attack resolves, one Mark Tag is removed from your pool."
  },
  Silver: {
    name: "Impair",
    color: "Silver",
    description: "The next time you use an action that would cost Stamina (SP), the cost is increased by 1. After the cost is paid, one Impair Tag is removed from your pool."
  },
  Yellow: {
    name: "Slow",
    color: "Yellow",
    description: "On your next turn, you have 1 fewer action (to a minimum of 1). At the end of that turn, one Slow Tag is removed from your pool."
  },
  Green: {
    name: "Daze",
    color: "Green",
    description: "Your next SR is reduced by the number of Daze Tags in your pool, when that roll is resolved, one Daze Tag is removed from your pool."
  },
  Black: {
    name: "Curse",
    color: "Black",
    description: "The next time you roll, you gain Disadvantage. After the roll resolves, one Curse Tag is removed from your pool."
  },
  Orange: {
    name: "Bind",
    color: "Orange",
    description: "While you have a Bind Tag in your pool, you are Immobilized. You can spend 1 SP, and an action, to remove one Bind Tag from your pool."
  },
  White: {
    name: "Weaken",
    color: "White",
    description: "The next time you would receive Damage, your Resistance is reduced by 1 for each Weaken Tag in your Tag Pool. After the Damage resolves, one Weaken Tag is removed from your pool."
  },
  Red: {
    name: "Blight",
    color: "Red",
    description: "The next time you take any action or reaction, you immediately suffer 1 unavoidable point of Value Loss. After the Value Loss is dealt, one Blight Tag is removed from your pool."
  },
  Blue: {
    name: "Silence",
    color: "Blue",
    description: "The next time you take an action, you cannot apply any Innate Keywords to it. After that action resolves, one Silence Tag is removed from your pool."
  },
  Purple: {
    name: "Nullify",
    color: "Purple",
    description: "When applied, the target’s passive Keywords are rendered inactive for as long as they have a nullify Tag in their pool. When a nullify Tag is added to the pool, remove a boost Tag from the pool. A Nullify Tag is removed when you gain priority for the first time in a round."
  }
};

// Verbatim Boost Tags from Layer 3, Section 2.5
export const PCM_BOOST_TAGS = {
  Null: {
    name: "Liberate",
    color: "Null",
    description: "When an effect would make you Immobilized, you may expend this Tag to negate that effect."
  },
  Silver: {
    name: "Augment",
    color: "Silver",
    description: "When you Activate an ability, you may expend this Tag to add any Keyword to that effect (its EP cost must still be paid)."
  },
  Yellow: {
    name: "Haste",
    color: "Yellow",
    description: "At any point during your turn, you may expend this Tag to gain additional action."
  },
  Green: {
    name: "Ward",
    color: "Green",
    description: "When you would be targeted by an action, you may expend this Tag to ignore that action's effects."
  },
  Black: {
    name: "Bless",
    color: "Black",
    description: "When you make a roll, you may expend this Tag before rolling to gain Advantage."
  },
  Orange: {
    name: "Charge",
    color: "Orange",
    description: "When you would spend Energy Points (EP) to apply Keywords, you may expend this Tag to reduce the total EP cost by 1."
  },
  White: {
    name: "Cure",
    color: "White",
    description: "As a free action on your turn, you may expend this Tag to remove one Status Tag from your pool."
  },
  Red: {
    name: "Regen",
    color: "Red",
    description: "When you make an action, you may expend this Tag to Restore 1 point to a Value of your choice."
  },
  Blue: {
    name: "Enhance",
    color: "Blue",
    description: "When you make a roll, you may expend this Tag after the roll to add a bonus to the final result equal to your Influence."
  },
  Purple: {
    name: "Obscure",
    color: "Purple",
    description: "As an action, you may expend this Tag to become Hidden. The Target Number to locate you is 10 + Level + Chosen Stat."
  }
};

// Verbatim Action Catalog from Layer 2, Section 4.0
export const PCM_ACTIONS_CATALOG = {
  EffectActions: {
    Activate: {
      name: "Activate",
      cost: { ap: 1, sp: 0, ep: 0 },
      description: "The primary action for causing an effect. The base roll for an Activate action is called an Effect Value (EV). The EV is calculated by adding a Standard Roll, The Character's Level, and the Character's Chosen Stat. Keyword Active Effects can be applied for a cost of one EP per Keyword. To calculate the final Energy Point (EP) cost for applying Keywords to this action, follow these steps in order: Step 1: Determine Base Cost. The base cost is 1 EP for each Keyword you apply to the action. Step 2: Apply Innate Reduction. Reduce the base cost by your character's Power (P) stat. The cost cannot be reduced below 0. This is your action's Actual Cost. Step 3: Apply Temporary Reductions. You may now choose to expend resources from temporary sources (such as a 'Charge' Boost Tag) to reduce the remaining Actual Cost further. If the EV does not exceed the target's Resistance, the Action has no effect unless a Keyword states otherwise. A Basic Activation is an Activate action that uses no Keywords."
    },
    CalledShot: {
      name: "Called Shot",
      cost: { ap: 1, sp: 0, ep: 0 },
      description: "You make a specialized Activate action with Disadvantage to target a specific weak point on an enemy Character or to target an item they are holding. Targeting an Item: A successful hit deals Value Loss to the item's Durability Clock instead of the wielder's HP. The wielder defends with their normal Resistance. Targeting an Entity: A successful Called Shot against an Entity is a Critical Hit, granting the choice of its bonus effects. If the target is already Unconscious or Downed, a successful Called Shot acts as an immediate death or destruction of the target, ignoring any clock rules and the target's passive keywords."
    },
    Rush: {
      name: "Rush",
      cost: { ap: 1, sp: 0, ep: 0 },
      description: "You may make a free Move Action in addition to an Activate Action. The Activate action is made with Disadvantage."
    },
    Blitz: {
      name: "Blitz",
      cost: { ap: 1, sp: 0, ep: 0 },
      description: "You may make two Basic Activations for the cost of one action. Both Activate actions are made with Disadvantage."
    },
    Slam: {
      name: "Slam",
      cost: { ap: 1, sp: 0, ep: 0 },
      description: "You may make a Basic Activation and add the Chosen stat an additional time. This Activation is made with Disadvantage."
    }
  },
  MoveActions: {
    Move: {
      name: "Move",
      cost: { ap: 1, sp: 0, ep: 0 },
      description: "Travel up to a number of range bands equal to your Range stat."
    },
    Mount: {
      name: "Mount",
      cost: { ap: 1, sp: 0, ep: 0 },
      description: "Perform an Interact action to gain the Riding condition on a valid target."
    },
    Dismount: {
      name: "Dismount",
      cost: { ap: 1, sp: 0, ep: 0 },
      description: "Perform an Interact action to end the Riding condition."
    },
    Hide: {
      name: "Hide",
      cost: { ap: 1, sp: 0, ep: 0 },
      description: "Make an Effort Roll (SR + Level + Stat) to become Hidden. The result is the TN to find you."
    }
  },
  ManeuverActions: {
    Shove: {
      name: "Shove",
      cost: { ap: 1, sp: 1, ep: 0 },
      description: "Make an EV roll vs. target's Resistance to push them or knock them Prone."
    },
    Disarm: {
      name: "Disarm",
      cost: { ap: 1, sp: 1, ep: 0 },
      description: "Make an opposed EV roll to force a target to drop an item."
    },
    Restrain: {
      name: "Restrain",
      cost: { ap: 1, sp: 1, ep: 0 },
      description: "Make an EV roll to grant the Bind Tag to a target."
    },
    Lunge: {
      name: "Lunge",
      cost: { ap: 1, sp: 1, ep: 0 },
      description: "Make a melee strike that can target an enemy at Close range instead of Touch range."
    },
    LockOn: {
      name: "Lock On",
      cost: { ap: 1, sp: 1, ep: 0 },
      description: "Gain Advantage against a target, who also gains Advantage against you."
    },
    Taunt: {
      name: "Taunt",
      cost: { ap: 1, sp: 1, ep: 0 },
      description: "Make an opposed EV roll to force a target to use Lock On against you."
    },
    Improvise: {
      name: "Improvise",
      cost: { ap: 1, sp: 1, ep: 0 },
      description: "Use the environment or an item to apply a Status Tag without dealing Value Loss."
    },
    CombinedStrike: {
      name: "Combined Strike",
      cost: { ap: 1, sp: 1, ep: 0 },
      description: "When making an Activate action, for an additional 1 SP, you may add the Level and one Keyword from a second equipped item to your effect. This added Keyword does not alter the EP cost of the action."
    },
    Feint: {
      name: "Feint",
      cost: { ap: 1, sp: 1, ep: 0 },
      description: "Make an opposed EV roll to make the target Exposed."
    }
  },
  SetupAssessActions: {
    _generalRule: "When you choose to take a Setup or Assess action, it is the only action you can take during your current turn. You immediately expend any remaining actions you have in your pool for this turn, and your turn ends.",
    Recharge: {
      name: "Recharge",
      cost: { consumesTurn: true, sp: 1, ep: 0 },
      description: "Choose one of these options: Restore Stamina Points (SP) equal to your Brawn stat (or 1 point if activated at 0 SP). Restore Energy Points (EP) equal to your Wit stat (or 1 point if activated at 0 SP)."
    },
    Defy: {
      name: "Defy",
      cost: { consumesTurn: true, sp: 0, ep: 0 },
      description: "Does not cost SP. Can be used regardless of condition and ignoring Tags. The character can Restore 1 point to one of their Values. Introduces a Complication. (Limit 1 per Situation)"
    },
    Recover: {
      name: "Recover",
      cost: { consumesTurn: true, sp: 1, ep: 0 },
      description: "Remove a number of Tags of your choice equal to either Brawn, Wit, or Influence from your Tag pool."
    },
    Ready: {
      name: "Ready",
      cost: { consumesTurn: true, sp: 1, ep: 0 },
      description: "Add your Wit stat to your Resistance value until the start of your next turn."
    },
    Advantage: {
      name: "Advantage",
      cost: { consumesTurn: true, sp: 1, ep: 0 },
      description: "Gain Advantage on the first SR you make on your next turn."
    },
    Reveal: {
      name: "Reveal",
      cost: { consumesTurn: true, sp: 1, ep: 0 },
      description: "Make an Effort Roll against a Hidden target's Hide roll to locate and target them."
    },
    Clue: {
      name: "Clue",
      cost: { consumesTurn: true, sp: 1, ep: 0 },
      description: "Learn a number of facts about a target equal to your Technique stat."
    }
  },
  EffortTeamActions: {
    EffortRoll: {
      name: "Effort Roll",
      cost: { ap: 1, sp: 0, ep: 0 },
      description: "The primary action for targeting a Barrier's Task Clock or solving a Puzzle."
    },
    Teamwork: {
      name: "Teamwork",
      cost: { ap: 1, sp: 0, ep: 0 },
      description: "Grant a stat of your choice as a bonus to an ally’s next Effort Roll."
    },
    Sabotage: {
      name: "Sabotage",
      cost: { ap: 1, sp: 0, ep: 0 },
      description: "A target suffers Disadvantage on their next Effort Roll."
    }
  },
  ReactionActions: {
    _generalRule: "Triggered outside your turn.",
    Avoid: {
      name: "Avoid (Dodge)",
      cost: { ap: 0, sp: 1, ep: 0 },
      description: "Make an opposed EV roll to negate an incoming effect. If the EV is higher than the incoming EV, ignore the effect."
    },
    Resist: {
      name: "Resist (Block)",
      cost: { ap: 0, sp: 1, ep: 0 },
      description: "Add your Level to your Resistance against a single incoming effect."
    },
    Parry: {
      name: "Parry",
      cost: { ap: 0, sp: 3, ep: 0 },
      description: "Make an opposed EV roll to negate an incoming effect. If the EV is higher than the incoming EV, ignore the effect then immediately gain priority as described in Layer 1 (5.4.3). If you have no remaining actions for the round, you may make 1 free action. This can be any single action from the catalog (such as Activate or Move), but any associated SP or EP costs must still be paid."
    },
    Clash: {
      name: "Clash",
      cost: { ap: 0, sp: 2, ep: 0 },
      description: "Use your own effect to intercept another; the loser takes the combined Value Loss. (SR vs SR)"
    },
    Reflect: {
      name: "Reflect",
      cost: { ap: 0, sp: 1, ep: 0 },
      description: "After a successful Avoid or Resist, redirect the original effect back at the attacker. (Use the effect's original SR)"
    },
    Counter: {
      name: "Counter",
      cost: { ap: 0, sp: 1, ep: 0 },
      description: "After a successful Avoid or Resist, make an immediate Basic Activate action."
    },
    Guard: {
      name: "Guard",
      cost: { ap: 0, sp: 1, ep: 0 },
      description: "Intercept an attack targeting an ally, become the target of the effect and allow you to react if able. The ally must be within close proximity."
    },
    Combo: {
      name: "Combo",
      cost: { ap: 0, sp: 1, ep: 0 },
      description: "Add a stat of your choice and one of your known Keywords to an ally’s effect."
    },
    Flank: {
      name: "Flank",
      cost: { ap: 0, sp: 1, ep: 0 },
      description: "If an ally attacks an enemy adjacent to you, the enemy has disadvantage on any reactions to that attack and their next action also gains disadvantage."
    }
  },
  MiscActions: {
    Reload: {
      name: "Reload",
      cost: { ap: 1, sp: 0, ep: 0 },
      description: "Required by the Material Keyword; consumes an item."
    },
    Assist: {
      name: "Assist",
      cost: { ap: 1, sp: 0, ep: 0 },
      description: "Designate one target. All allies gain Advantage on their next action against that target."
    },
    Pass: {
      name: "Pass",
      cost: { ap: 0, sp: 0, ep: 0 },
      description: "End your turn, ceding Priority. If you have actions remaining in your pool for the round, your initiative card is moved to the bottom of the Initiative deck. If you have zero actions remaining, your card is placed in the discard pile. You cannot use the Pass action if your initiative card is the last one to be drawn in the current round."
    },
    Command: {
      name: "Command",
      cost: { ap: 1, sp: 0, ep: 0 },
      description: "Direct a Companion, Animation, or Mount under your control to act in place of your action."
    }
  }
};
// Verbatim Master Keyword List from Appendix A (100 Keywords)
export const PCM_KEYWORDS_DICTIONARY = {
  // --- Color 0: Null (Unpredictability & Potential) ---
  "0.0": {
    name: "Restricted", color: 0, category: 0,
    intent: "A fundamental limitation or flaw that inhibits the use of one's full power.",
    passive: "Each Keyword you use costs double the Energy (EP) to activate.",
    active: "When you take this Flaw, choose a Compensation Keyword. You may use the Active effect of that Keyword as if it was an innate keyword to you.",
    equipment: "All costs to activate this item's Keywords are doubled."
  },
  "0.1": {
    name: "Aura", color: 0, category: 1,
    intent: "The outward manifestation of one's inner power as a tangible field of energy.",
    passive: "You are surrounded by a tangible field of energy that you can manipulate to effect objects and targets at a distance up to your Range stat as if they were at Touch range. This also includes changing the opacity and shape of the aura to provide cover or communicate through visuals.",
    active: "Grants a +1 to the EV of any roll with a Keyword that matches your aura color.",
    equipment: "The item can manifest simple, non-mechanical objects made of light or pure force that mimic the passive effect of this Keyword."
  },
  "0.2": {
    name: "Specialist", color: 0, category: 2,
    intent: "A deep, natural or trained mastery over a particular domain of one's own capabilities.",
    passive: "Choose one Stat Grid category (Body, Mind, or Essence). You have Advantage on all Effort Rolls (Barriers, Puzzles, and Social Interaction) that use a stat from your chosen category.",
    active: "Once per Situation, you may gain Advantage on a reaction or action that uses a stat of your chosen category.",
    equipment: "The wielder gains Advantage on Effort Rolls made using this item."
  },
  "0.3": {
    name: "Alert", color: 0, category: 3,
    intent: "An uncanny and preternatural awareness of one's immediate surroundings.",
    passive: "You cannot be surprised unless you are incapacitated.",
    active: "Gain Advantage on effects targeting concealed targets.",
    equipment: "The item passively indicates to the wielder any activity parameters set at its creation."
  },
  "0.4": {
    name: "Liberate", color: 0, category: 4,
    intent: "The power to grant or achieve absolute freedom from physical or magical restraint.",
    passive: "At the start of conflict, gain up to a number of Liberate Tags equal to your Influence.",
    active: "When this Keyword is part of an effect, grant the targets a combined total of Liberate Tags equal to your Influence.",
    equipment: "As an action, the wielder can use this item to remove a restraint or lock.",
    triggerEffect: "You may spend one Liberate Tag from your pool to ignore a movement-reducing or bind effect targeting you."
  },
  "0.5": {
    name: "Mark", color: 0, category: 5,
    intent: "The act of designating a target, exposing a fundamental weakness for all to see.",
    passive: "When making a Basic Activation, if successful, you may grant the target the Mark Tag if no other tag is granted.",
    active: "When this Keyword is part of a successful effect, grant the target a Mark Tag.",
    equipment: "On a successful hit, this item grants the target a Mark Tag.",
    passiveTrigger: "The next incoming effect against the target treats them as Exposed. After the effect is resolved, remove a Mark Tag from your pool."
  },
  "0.6": {
    name: "Indirect", color: 0, category: 6,
    intent: "An effect that can bypass obstacles, striking from an unexpected angle or origin.",
    passive: "You maintain awareness of targets regardless of cover.",
    active: "This effect can strike a target and ignore cover.",
    equipment: "Attacks made with this item ignore the defensive benefits of Cover."
  },
  "0.7": {
    name: "Adaptive", color: 0, category: 7,
    intent: "The ability for an effect to change its nature to target a different aspect of a foe's resilience.",
    passive: "You can choose which value (HP, SP, or EP) your effects will target.",
    active: "You can choose which value (HP, SP, or EP) this specific effect will cause Value Loss.",
    equipment: "Choose a value when this Keyword is added to an item. Effects made with this item always target the chosen value."
  },
  "0.8": {
    name: "Gamble", color: 0, category: 8,
    intent: "A reliance on pure chance, surrendering control for unpredictable, potentially powerful outcomes.",
    passive: "You may choose to replace any single level or stat value in a roll with a d10 roll. If improvising equipment to apply a Status, the die result (0-9) determines the Status Tag applied.",
    active: "You may replace all level and stat values in this roll with separate d10 rolls.",
    equipment: "You may replace the item's Level in an EV calculation with a d10 roll."
  },
  "0.9": {
    name: "Edit", color: 0, category: 9,
    intent: "The power to fundamentally rewrite the keyword properties of oneself, another, or an object.",
    passive: "As an action, you may change one of your known Keywords to another Keyword of the same Category. (x.z to y.z, this changes its color designation)",
    active: "On a successful hit, you may change one of the target's Keywords to a keyword of the same category, or to one of your Innate keywords until their next Downtime.",
    equipment: "The wielder may use an action to change any Keyword on this item to any of their Innate Keywords."
  },

  // --- Color 1: Silver (Duality & Adaptation) ---
  "1.0": {
    name: "Bane", color: 1, category: 0,
    intent: "A specific, acute vulnerability to a certain type of power or substance.",
    passive: "Choose a Color when you take this Flaw. If an effect contains a Keyword of that color, it ignores your resistances.",
    active: "When you take this Flaw, choose a Compensation Keyword. You may use the Active effect of that Keyword as if you knew it.",
    equipment: "This item is immediately destroyed if successfully affected by an effect containing a Keyword of your chosen Bane Color."
  },
  "1.1": {
    name: "Traveler", color: 1, category: 1,
    intent: "An innate affinity for a specific, unconventional mode of movement.",
    passive: "Choose a Color. You permanently gain the associated movement type.",
    active: "As part of this effect, you may immediately move according to a chosen movement type.",
    equipment: "The wielder gains access to the chosen movement type while this item is equipped.",
    types: {
      0: "Null - Walk: Default; follows terrain and cover rules.",
      1: "Silver - Teleport: Instantly relocate to a visible or attuned location.",
      2: "Yellow - Fly: Move freely in all directions.",
      3: "Green - Dig: Move through loose solids.",
      4: "Black - Permeation: Pass through solid matter.",
      5: "Orange - Jump: Leap directly to a visible location.",
      6: "White - Parkour: Ignore penalties from difficult terrain.",
      7: "Red - Climb: Traverse vertical surfaces effortlessly.",
      8: "Blue - Swim: Move through liquids.",
      9: "Purple - Lightfoot: Walk on non-gas surfaces; tremorsense can't detect."
    }
  },
  "1.2": {
    name: "Martial", color: 1, category: 2,
    intent: "Proficiency in close-quarters conflict and the ability to react instantly to threats.",
    passive: "You may spend 1 SP to make a basic EV attack against a target that enters your touch range.",
    active: "Gain Advantage on a reaction.",
    equipment: "Gain Advantage when using this item as part of a reaction."
  },
  "1.3": {
    name: "Attuned", color: 1, category: 3,
    intent: "A deep, persistent sympathetic link to a person, place, or thing.",
    passive: "During Downtime, you can link yourself to a willing or non-living target. You always know the target's location and status.",
    active: "This effect can target your attuned target regardless of range, distance, or cover.",
    equipment: "Items linked together via the Attuned passive can target each other with their effects when utilized."
  },
  "1.4": {
    name: "Augment", color: 1, category: 4,
    intent: "The power to temporarily grant additional abilities or options to an ally or oneself.",
    passive: "At the start of conflict, gain a number of Augment Tags equal to your Influence.",
    active: "When this Keyword is part of an effect, grant the target a number of Augment Tags equal to your Influence.",
    equipment: "The object can be used to grant access to a single Keyword to its wielder (chosen at crafting).",
    triggerEffect: "You may spend one Augment Tag from your Tag pool to add any single Keyword to an effect (the Keyword's EP cost must still be paid)."
  },
  "1.5": {
    name: "Impair", color: 1, category: 5,
    intent: "A curse that drains a target's stamina, making every action more difficult.",
    passive: "When making a Basic Activation, if successful, you may grant the target the Impair Tag if no other tag is granted.",
    active: "When this Keyword is part of a successful effect, grant the target the Impair Tag.",
    equipment: "On a successful hit, this item grants the target the Impair Tag.",
    passiveTrigger: "If you would make an action or reaction that would cost SP increase that cost by one then remove an Impair Tag."
  },
  "1.6": {
    name: "Reactive", color: 1, category: 6,
    intent: "The ability to seamlessly weave potent abilities into defensive maneuvers.",
    passive: "you may add Keywords to dodge reactions up to your Technique, you must still pay all EP costs.",
    active: "Whenever you apply this Keyword to a Dodge reaction, you may add a Chosen Stat to the SR an additional time.",
    equipment: "When used in a Dodge reaction, the reaction has no SP cost."
  },
  "1.7": {
    name: "Phasing", color: 1, category: 7,
    intent: "An effect that becomes intangible, passing through physical defenses to strike a target's essence.",
    passive: "Your effects can be designated to ignore objects , specified targets, and physical cover.",
    active: "Effects with this Keyword ignore all resistances from gear and cover.",
    equipment: "This gear ignores physical barriers, cover, and gear; it only affects the target’s Energy."
  },
  "1.8": {
    name: "Brutal", color: 1, category: 8,
    intent: "A fighting style comprised of overwhelming, devastatingly powerful critical blows.",
    passive: "Critical effects from this character may choose 2 different bonus effects instead of 1.",
    active: "Effects with this Keyword are a critical hit on a SR result of greater than 6.",
    equipment: "Effects from this gear are a critical hit on a SR result of greater than 6."
  },
  "1.9": {
    name: "Translocate", color: 1, category: 9,
    intent: "The mastery of teleportation and the manipulation of spatial boundaries.",
    passive: "You have a personal pocket dimension to store and recall targets.",
    active: "As part of this effect, you may instantly change a target’s position to another target location.",
    equipment: "This object contains a portal to a set location, a storage pocket dimension, or can be re-equipped as part of any action regardless of its location."
  },

  // --- Color 2: Yellow (Immediacy & Motion) ---
  "2.0": {
    name: "Anxious", color: 2, category: 0,
    intent: "A nervous disposition that makes it difficult to concentrate or aim with precision.",
    passive: "Your Setup actions cost double.",
    active: "When you take this Flaw, choose a Compensation Keyword. You may use the Active effect of that Keyword as if you knew it.",
    equipment: "Effects from this gear cannot be used to make a called shot."
  },
  "2.1": {
    name: "Acrobatic", color: 2, category: 1,
    intent: "The ability to move with extraordinary grace, blending movement and action into one.",
    passive: "You may ignore any hindering environmental effects that would affect movement or positioning. You can spend 1 SP to replicate any form of travel during a move action.",
    active: "You can apply this Keyword to make an activation ignore the penalty of being part of a Rush Action.",
    equipment: "The wielder may make a Move action as part of an action that utilizes this gear."
  },
  "2.2": {
    name: "Sentry", color: 2, category: 2,
    intent: "A keen eye for detail and the ability to rapidly assess a target's nature.",
    passive: "You can make one free assessment when encountering a target for the first time.",
    active: "You may perform an Assess action as a single action instead of a full turn action.",
    equipment: "Choose one clue type at creation. When this gear affects a target, the wielder learns that specific clue."
  },
  "2.3": {
    name: "Eidetic", color: 2, category: 3,
    intent: "A perfect, flawless memory of all sensory experiences.",
    passive: "You can remember all details you have experienced, including visual, audio, and any other sense.",
    active: "This effect gains Advantage against any target type you have encountered before.",
    equipment: "This item can store sensory information."
  },
  "2.4": {
    name: "Haste", color: 2, category: 4,
    intent: "A surge of supernatural speed, granting additional actions in a flurry of motion.",
    passive: "At the start of conflict, gain a number of Haste Tags equal to your Influence.",
    active: "When this Keyword is part of an effect, grant the target a number of Haste Tags equal to your Influence.",
    equipment: "You may make an additional action your turn utilizing this item.",
    triggerEffect: "You may spend one Haste Tag from your Tag pool to immediately gain one additional action this turn."
  },
  "2.5": {
    name: "Slow", color: 2, category: 5,
    intent: "A temporal effect that traps a target, reducing their ability to act.",
    passive: "When making a Basic Activation, if successful, you may grant the target the Slow Tag if no other tag is granted.",
    active: "When this Keyword is part of a successful effect, grant the target the Slow Tag.",
    equipment: "On a successful hit, this item grants the target the Slow Tag.",
    passiveTrigger: "At the beginning of your turn, reduce your total actions by 1 for that turn and remove one Slow Tag from your Tag pool."
  },
  "2.6": {
    name: "Snap", color: 2, category: 6,
    intent: "An effect so fast it is impossible to react to.",
    passive: "You can make reactions to any effect, including those with Snap.",
    active: "This effect cannot be responded to. It is limited to a single strike or trigger, regardless of other Keywords.",
    equipment: "This equipment can be used to react to any effect."
  },
  "2.7": {
    name: "Focus", color: 2, category: 7,
    intent: "The principle of applying greater force by concentrated effort or material.",
    passive: "You may add your chosen stat an additional time to a Basic Activation for 1SP",
    active: "You may apply another stat of your choice to the EV calculation, this can duplicate the initial chosen stat.",
    equipment: "If the wielder uses this item for the effect, they may apply another stat of their choice to the EV calculation of its effects."
  },
  "2.8": {
    name: "Rapid", color: 2, category: 8,
    intent: "A flurry of multiple, successive strikes or triggers.",
    passive: "You do not receive disadvantage when making a Blitz or Slam action.",
    active: "This effect strikes or triggers a number of additional times equal to your Technique (TEC). You do not add your Level to the EV of these hits; instead, you apply the chosen stat a second time to the EV calculation.",
    equipment: "When used, this item's effect strikes or triggers a number of additional times equal to the wielder's Expertise (Expertise). These extra hits do not add the item's Level to the EV; instead, the wielder may apply their Expertise a second time to the EV calculation."
  },
  "2.9": {
    name: "Reckless", color: 2, category: 9,
    intent: "A dangerous state of abandoning all defense for pure, unadulterated offense.",
    passive: "As part of an action, you can toggle a reckless state. While in this state, you are Exposed, and all of your own effects gain Advantage.",
    active: "If you are currently Locked On to the target, you may add your chosen stat to the EV an additional time when applying this Keyword.",
    equipment: "Add the chosen stat to the EV an additional time when wielder is Locked On to the target."
  },

  // --- Color 3: Green (Stability & Resilience) ---
  "3.0": {
    name: "Hesitant", color: 3, category: 0,
    intent: "A chronic inability to react quickly, leaving one vulnerable.",
    passive: "You have Disadvantage on all React Actions you take.",
    active: "When you take this Flaw, choose a Compensation Keyword. You may use the Active effect of that Keyword as if you knew it.",
    equipment: "Utilizing this gear takes a full turn instead of a single action."
  },
  "3.1": {
    name: "Sturdy", color: 3, category: 1,
    intent: "An unshakeable physical presence, impossible to move or knock down.",
    passive: "Maneuvers that target you gain Disadvantage. You also cannot be forced to move or made prone.",
    active: "Add your Level to reactions against maneuvers.",
    equipment: "The wielder adds this gear’s Level to their reactions made against Maneuver actions."
  },
  "3.2": {
    name: "Brawler", color: 3, category: 2,
    intent: "Expertise in grappling and other physical maneuvers in conflict.",
    passive: "You can make Maneuver actions without costing Stamina (SP).",
    active: "You may apply this Keyword to a Maneuver action to allow you to add other Keywords you know to it, up to a number equal to your Technique (TEC).",
    equipment: "Utilizing this gear to perform a Maneuver action removes the action's SP cost."
  },
  "3.3": {
    name: "Stubborn", color: 3, category: 3,
    intent: "A sheer refusal to accept failure, allowing one to try again.",
    passive: "You can spend 1 SP to reroll any Effort Roll you make.",
    active: "If this effect is successfully reacted to by the target, you may spend 1 SP to immediately reroll your EV to change the outcome.",
    equipment: "The wielder can spend 1 SP to reroll an Effort Roll when utilizing this gear."
  },
  "3.4": {
    name: "Ward", color: 3, category: 4,
    intent: "A protective blessing that can completely negate a single incoming threat.",
    passive: "At the start of conflict, add a number of Ward Tags to your Tag pool equal to your Influence.",
    active: "When this Keyword is part of an effect, grant the target a number of Ward Tags to your Tag pool equal to your Influence.",
    equipment: "This item can be used to replace its wielder as the target for an effect as a reaction.",
    triggerEffect: "You may spend one Ward Tag from your Tag pool to cause a single incoming effect targeting you to be ignored."
  },
  "3.5": {
    name: "Daze", color: 3, category: 5,
    intent: "A disorienting blow to the mind or senses that leaves a target unable to act coherently.",
    passive: "When making a Basic Activation, if successful, you may grant the target the Daze Tag if no other tag is granted.",
    active: "When this Keyword is part of a successful effect, grant the target the Daze Tag.",
    equipment: "On a successful hit, this item grants the target the Daze Tag.",
    passiveTrigger: "When you would roll for EV reduce the result by the number of Daze Tags in your Tag pool, then remove one Daze Tag from your Tag pool."
  },
  "3.6": {
    name: "Sculpt", color: 3, category: 6,
    intent: "The power to alter the superficial shape or form of an object or target.",
    passive: "As an action, you can change the cosmetic appearance or superficial form of an object or target (without changing its raw materials). You may also use 1 SP to increase or decrease a Barrier TN by 1.",
    active: "This effect either created or modifies a barrier. The Barrier created has a TN equal to your Technique and a Clock Equal to your Level, if you are modifying an existing barrier , you can increase or decrease the TN of that barrier up to your Technique.",
    equipment: "This equipment can be used to change the shape or form of a target or increase or decrease the TN of a barrier by the items level for 1 SP."
  },
  "3.7": {
    name: "Defensive", color: 3, category: 7,
    intent: "The philosophy of outlasting an opponent through superior fortitude and resilience.",
    passive: "You may add a number of Keywords to a Block reaction up to your Technique Stat and all EP costs must still be paid.",
    active: "You add your Level to your resistance.",
    equipment: "When used in a block reaction, that reaction has no SP cost."
  },
  "3.8": {
    name: "Impact", color: 3, category: 8,
    intent: "An effect that carries immense kinetic force, knocking targets around the battlefield.",
    passive: "You ignore secondary Value Loss from striking or being struck by Impact effects.",
    active: "This effect forces the target to move or be knocked down. If the forced movement causes the target to strike another object, your EV is rolled a second time and affects both.",
    equipment: "Effects from this item can force a target to move or be knocked down."
  },
  "3.9": {
    name: "Shift", color: 3, category: 9,
    intent: "The ability to fundamentally alter one's own physical form and attributes.",
    passive: "As part of an action, you can relocate a number of stat points equal to your Technique (TEC). You can also change your form/appearance.",
    active: "This effect will change the target’s appearance and form.",
    equipment: "This item can change its appearance and form as part of an effect."
  },

  // --- Color 4: Black (Inevitability & Endurance) ---
  "4.0": {
    name: "Feeble", color: 4, category: 0,
    intent: "A chronic physical weakness that hinders bodily action.",
    passive: "You have Disadvantage on any roll that uses a Body stat.",
    active: "When you take this Flaw, choose a Compensation Keyword. You may use the Active effect of that Keyword as if you knew it.",
    equipment: "The wielder has Disadvantage when applying a Body stat to effects made with this gear."
  },
  "4.1": {
    name: "Survivor", color: 4, category: 1,
    intent: "An incredible tenacity for life, allowing one to cling to existence beyond normal limits.",
    passive: "All of your values must be zero for you to be downed.",
    active: "As a reaction that costs 1 SP, if an effect would reduce your HP to 0, you may use this Keyword to instead be reduced to 1 HP.",
    equipment: "As long as this item is not broken, the wielder cannot be downed unless their Stamina is zero."
  },
  "4.2": {
    name: "Stoic", color: 4, category: 2,
    intent: "An unshakable mental acuity and economy of action.",
    passive: "You may make a Setup Action as a single action instead of taking a full turn.",
    active: "When this Keyword is applied to an effect the EV roll can not have Disadvantage or Advantage applied.",
    equipment: "This gear may be used to perform a designated Setup Action as a single action."
  },
  "4.3": {
    name: "Ageless", color: 4, category: 3,
    intent: "The state of being outside the normal flow of time and aging.",
    passive: "Once you reach maturity, you no longer age and can no longer die of natural causes.",
    active: "Effects with this Keyword are immune to the Growth Keyword.",
    equipment: "This item is immune to the Growth Keyword."
  },
  "4.4": {
    name: "Bless", color: 4, category: 4,
    intent: "A boon of fortune that enhances positive outcomes and aids restoration.",
    passive: "At the start of conflict, gain a number of Bless Tags to your Tag pool equal to your Influence.",
    active: "When this Keyword is part of an effect, grant the target a number of Bless Tags equal to your Influence.",
    equipment: "Choose a value. When the wielder has that value restored, increase the amount by 1.",
    triggerEffect: "You may spend one Bless Tag from your Tag pool when a value is restored to increase the amount by 1, or to gain Advantage on a roll."
  },
  "4.5": {
    name: "Curse", color: 4, category: 5,
    intent: "A withering hex that invites misfortune and foils attempts to recover.",
    passive: "When making a Basic Activation, if successful, you may grant the target the Curse Tag if no other tag is granted.",
    active: "When this Keyword is part of a successful effect, grant the target a Curse Tag.",
    equipment: "On a successful hit, this item grants the target a Curse Tag.",
    passiveTrigger: "When you make a roll, gain disadvantage on that roll and remove a Curse Tag."
  },
  "4.6": {
    name: "Piercing", color: 4, category: 6,
    intent: "An unstoppable, penetrating force that ignores all defenses but deals minimal harm.",
    passive: "You can set the origin point of an effect to anywhere within your current range.",
    active: "This effect hits everything in its path and continues to maximum range, ignoring cover and resistance and bypassing Ward.",
    equipment: "This item or its parts can pass through anything. Its EV is fixed at 1 and it bypasses resistance, cover, and Ward."
  },
  "4.7": {
    name: "Flux", color: 4, category: 7,
    intent: "The ability to convert one's own vitality or energy into raw power.",
    passive: "As an action, you can spend any of your values to grant them to another target as a separate resource pool. This pool disappears at the end of the target's turn.",
    active: "You may choose to spend a value to increase this effect's EV by the amount spent up to a maximum of your Technique.",
    equipment: "This item can be used to store and dispense values as part of an effect (storage maximum equal to item's level)."
  },
  "4.8": {
    name: "Siphon", color: 4, category: 8,
    intent: "The principle of forcibly transferring essence or life force from one being to another.",
    passive: "As an action, you can siphon values from willing targets. Values gained this way cannot exceed your maximum.",
    active: "When this ability deals Value Loss to a target, you restore 1 point to one of your own Values.",
    equipment: "This object stores values targeted by its effect, up to a maximum capacity equal to the equipment’s Level. The wielder can expend these stored points as if they were their own."
  },
  "4.9": {
    name: "Animate", color: 4, category: 9,
    intent: "The power of necromancy or artifice, granting temporary life to the inanimate.",
    passive: "Your maximum number of bonded animations is increased by your Technique Stat. At the end of the scene any bonded animations that exceed your base maximum can no longer be bonded.",
    active: "As part of an effect, you can animate a non-living target, turning it into a temporary Animation under your control. The level of the Animation cannot exceed your level minus one.",
    equipment: "This item has a specific animation bonded to it, which can be manifested and controlled. This bonded animation does not count toward your character's normal limit."
  },

  // --- Color 5: Orange (Creation & Chaos) ---
  "5.0": {
    name: "Gremlins", color: 5, category: 0,
    intent: "A persistent streak of bad luck, causing critical failures at the worst moments.",
    passive: "A die result of 1 on any roll is a miss or failed effect.",
    active: "When you take this Flaw, choose a Compensation Keyword. You may use the Active effect of that Keyword as if you knew it.",
    equipment: "A die result of 1 when using this gear will break it and cause the effect to miss or fail."
  },
  "5.1": {
    name: "Sensor", color: 5, category: 1,
    intent: "The possession of a supernatural or technological sense beyond the mundane.",
    passive: "Choose a Color. You permanently gain the associated sense at a range set by your Wit (WIT) stat.",
    active: "Utilize a sense of your choice at full range in a radius around the target.",
    equipment: "The wielder gains access to the chosen sense type while this item is equipped.",
    types: {
      0: "Null - Karma",
      1: "Silver - Keywords",
      2: "Yellow - Echolocation",
      3: "Green - Vibration",
      4: "Black - Energy",
      5: "Orange - Materials",
      6: "White - Life",
      7: "Red - Infrared",
      8: "Blue - Emotion",
      9: "Purple - The Weave"
    }
  },
  "5.2": {
    name: "Improvisor", color: 5, category: 2,
    intent: "An innate talent for using disparate components together in novel, effective ways.",
    passive: "This character can change their Innate Passive Keywords as an action instead of just during downtime.",
    active: "You may add your Level to the EV of any effect created using improvised gear.",
    equipment: "You can use your level instead of this item’s level when determining EV."
  },
  "5.3": {
    name: "Crafty", color: 5, category: 3,
    intent: "A knack for creating permanent, lasting effects with ease and efficiency.",
    passive: "You can create permanent effects without reducing your maximum SP.",
    active: "You can use this Keyword to create a permanent effect or item with a level up to your Technique stat. It may contain any Keyword also in an entity or item within close range.",
    equipment: "When this item is used to create a permanent effect or item, it reduces the crafting time to a Full Action."
  },
  "5.4": {
    name: "Charge", color: 5, category: 4,
    intent: "An infusion of raw energy that can be used to fuel one's abilities.",
    passive: "At the start of conflict, gain a number of Charge Tags equal to your Influence.",
    active: "When this Keyword is part of an effect, grant the target a number of Charge Tags equal to your Influence.",
    equipment: "When utilized as part of an effect, reduce the total EP cost by 1.",
    triggerEffect: "You may spend one Charge Tag from your Tag pool to pay 1 Stamina (SP) or 1 Energy (EP) of a cost."
  },
  "5.5": {
    name: "Bind", color: 5, category: 5,
    intent: "An effect that entraps or ensnares a target, rooting them to the spot.",
    passive: "When making a Basic Activation, if successful, you may grant the target the Bind Tag if no other tag is granted.",
    active: "When this Keyword is part of a successful effect, grant the target a Bind Tag.",
    equipment: "On a successful hit, this item grants the target a Bind Tag.",
    passiveTrigger: "Your movement is reduced to 0. You may spend 1 SP and an action to remove one Bind Tag."
  },
  "5.6": {
    name: "Imbue", color: 5, category: 6,
    intent: "The act of temporarily investing an object or person with a known power.",
    passive: "You may grant a Keyword you know to a target as part of any action.",
    active: "You may add a Keyword to the effect from a source within close range.",
    equipment: "Choose a Keyword you know when this Keyword is added to the item. The wielder gains access to that chosen Keyword while the gear is equipped."
  },
  "5.7": {
    name: "Material", color: 5, category: 7,
    intent: "The power to consume an object to fuel or enhance an effect.",
    passive: "You can consume objects to apply their Keywords to your effects (the EP cost must still be paid for each Keyword.)",
    active: "Consume an object as part of an effect to increase the EV by your Expertise (Expertise) or the consumed item's Level, whichever is higher.",
    equipment: "This item has a \"Reload\" property. As a Reload action, you can consume an item to increase the EV of the next effect by your Expertise or the consumed item's Level (whichever is higher). If the consumed item has Keywords, you may choose 1 to apply to the effect."
  },
  "5.8": {
    name: "Leverage", color: 5, category: 8,
    intent: "A mastery of physics and positioning to gain an advantage in physical contests.",
    passive: "When using equipment in an Effort Roll, add the item’s Level to the effort value.",
    active: "Maneuvers gain Advantage.",
    equipment: "Maneuvers or Effort rolls made using this gear gain Advantage."
  },
  "5.9": {
    name: "Manifest", color: 5, category: 9,
    intent: "The power to create temporary, functional items out of pure energy or ambient materials.",
    passive: "You can manifest items that persist only while being utilized. These manifestations may have a number of Keywords equal to your Technique (TEC) and a level equal to yours.",
    active: "As part of this effect, create an item (1 cubic foot per Technique). It gains a number of Keywords equal to your Technique, chosen from entities or items within your Range or that have been Witnessed or Assessed during the current Scene.",
    equipment: "This item can manifest temporary items with a number of Keywords up to the wielder's Technique."
  },

  // --- Color 6: White (Order & Purity) ---
  "6.0": {
    name: "Vulnerable", color: 6, category: 0,
    intent: "A glaring weakness or lack of structural integrity that invites precise, debilitating strikes.",
    passive: "Effects do not require Advantage to be a called shot when targeting you.",
    active: "When you take this Flaw, choose a Compensation Keyword. You may use the Active effect of that Keyword as if you knew it.",
    equipment: "Called Shots targeting this item will destroy it."
  },
  "6.1": {
    name: "Tolerant", color: 6, category: 1,
    intent: "An exceptional resilience to negative effects, requiring immense pressure to be affected.",
    passive: "When you would remove a Status Tag, Remove 2 instead.",
    active: "As part of any action that uses this Keyword, you may remove a status Tag from your pool.",
    equipment: "As an action, the wielder can use this item to remove Status Tags from themself."
  },
  "6.2": {
    name: "Deadeye", color: 6, category: 2,
    intent: "An expert eye for identifying and striking at a target's weak points.",
    passive: "You know all weak points, flaws, and Status Tags on a target.",
    active: "You may make a Called Shot with this effect without needing to have Advantage.",
    equipment: "When targeting an Exposed target with an effect utilizing this item, the effect is Critical."
  },
  "6.3": {
    name: "Immunized", color: 6, category: 3,
    intent: "A perfect, innate defense against a single, specific type of ailment or curse.",
    passive: "Choose a single Status Tag. You can no longer gain that Tag.",
    active: "This effect removes the chosen Tag from the target.",
    equipment: "This equipment can remove all instances of one type of Tag from a target as an action."
  },
  "6.4": {
    name: "Cure", color: 6, category: 4,
    intent: "A purifying power that can cleanse negative conditions and afflictions.",
    passive: "At the start of conflict, gain a number of Cure Tags equal to your Influence.",
    active: "When this Keyword is part of an effect, grant the target a number of Cure Tags equal to your Influence.",
    equipment: "As an action, use this item to grant the wielder the Cure Tag.",
    triggerEffect: "You may spend one Cure Tag to remove any one Status Tag from your Tag pool."
  },
  "6.5": {
    name: "Weaken", color: 6, category: 5,
    intent: "An effect that corrodes a target's defenses, leaving them brittle and vulnerable.",
    passive: "When making a Basic Activation, if successful, you may grant the target a Weaken Tag if no other tag is granted.",
    active: "When this Keyword is part of a successful effect, grant the target a Weaken Tag.",
    equipment: "On a successful hit, this item grants the target a Weaken Tag.",
    passiveTrigger: "When you are targeted by an effect, reduce your resistance by 1 for each Weaken Tag in your Tag pool, then remove one Weaken Tag from your Tag pool."
  },
  "6.6": {
    name: "Sticky", color: 6, category: 6,
    intent: "An effect that adheres to a target, delivering a payload after a delay.",
    passive: "You can cling to and climb on any solid surface. You can also permanently connect two objects for 1 SP.",
    active: "This effect leaves a persistent object on the target, which triggers again at the end of each of the target’s turns. It can be removed with a Setup Action.",
    equipment: "This item leaves an object on a target that triggers at the end of their turn; it can be removed with a Setup Action."
  },
  "6.7": {
    name: "Restore", color: 6, category: 7,
    intent: "A healing power that mends wounds and restores vitality.",
    passive: "As an action, you can repair or heal cosmetic/superficial cuts, breaks, and abrasions or ease nausea or pain on a target.",
    active: "This effect restores a target's value by an amount equal to your Technique (TEC).",
    equipment: "As an action, this item can be used to restore a target's value by an amount equal to the wielder's Expertise (Expertise)."
  },
  "6.8": {
    name: "Exploit", color: 6, category: 8,
    intent: "A ruthless tactic of turning an enemy's weakness against them for increased power.",
    passive: "You gain Advantage on all effects targeting an enemy who currently has any Status Tag.",
    active: "You may remove a number of Status Tags from the target to increase this effect's EV by that amount. This can be done a number of times equal to your Technique stat.",
    equipment: "You may remove a Status Tag from a target to increase this item's EV by an amount equal to the wielder's Expertise (Expertise)."
  },
  "6.9": {
    name: "Growth", color: 6, category: 9,
    intent: "The power to manipulate a target's age, growth, and biological processes.",
    passive: "You know a targets Value maximums and current amounts if they are within your Range, as well as their current age and Exhaustion status.",
    active: "You can cause a target to age, regress, grow, or shrink as part of an effect in exchange for not targeting any values. This gives the user two options: toggle the target's Exhausted state, or increase or decrease the Ambient Stage by 1 for the Target only.",
    equipment: "This item can be utilized to fix the user to a set Ambient Stage determined when this object is created."
  },

  // --- Color 7: Red (Passion & Conflict) ---
  "7.0": {
    name: "Limited", color: 7, category: 0,
    intent: "A permanent reduction in one's vital reserves, limiting endurance.",
    passive: "Choose one of your Values (HP, SP, or EP). Its maximum is permanently reduced by 5.",
    active: "When you take this Flaw, choose a Compensation Keyword. You may use the Active effect of that Keyword as if you knew it.",
    equipment: "This item cannot be utilized when broken."
  },
  "7.1": {
    name: "Resilient", color: 7, category: 1,
    intent: "A permanent increase in one's vital reserves, enhancing endurance.",
    passive: "Choose one of your Values (HP, SP, or EP). Its maximum is permanently increased by 5.",
    active: "As part of this effect, you may add your Technique (TEC) to your resistances.",
    equipment: "This item does not suffer Disadvantage on its effect rolls for being broken."
  },
  "7.2": {
    name: "Font", color: 7, category: 2,
    intent: "The ability to use any form of personal energy to fuel one's powers.",
    passive: "You are not considered dead unless your Energy (EP) is 0.",
    active: "You may choose to pay any Keyword cost for this effect by spending any of your values instead of Energy.",
    equipment: "The wielder may use any of their values (including those stored in this item) to pay for costs."
  },
  "7.3": {
    name: "Insulated", color: 7, category: 3,
    intent: "A natural immunity to the dangers of the surrounding environment.",
    passive: "You are unaffected by the negative effects of environmental changes.",
    active: "This effect is immune to being altered by the ambient environmental conditions.",
    equipment: "The wielder and the item itself are unaffected by environmental changes."
  },
  "7.4": {
    name: "Regen", color: 7, category: 4,
    intent: "A blessing of rapid, continuous healing over time.",
    passive: "At the start of conflict, gain a number of Regen Tags equal to your Influence.",
    active: "When this Keyword is part of an effect, grant the target a number of Regen Tags equal to your Influence.",
    equipment: "At the end of the wielder’s turn, restore the chosen value by 1.",
    triggerEffect: "As part of an action, you may spend one Regen Tag from your Tag Pool to restore a chosen value."
  },
  "7.5": {
    name: "Blight", color: 7, category: 5,
    intent: "A decaying curse that causes a target's life force to slowly rot away.",
    passive: "When making a Basic Activation, if successful, you may grant the target a Blight Tag if no other tag is granted.",
    active: "When this Keyword is part of a successful effect, grant the target a Blight Tag.",
    equipment: "On a successful hit, this item grants the target a Blight Tag.",
    passiveTrigger: "The next time you take any action or reaction, you immediately suffer 1 unavoidable point of Value Loss. After the Value Loss is resolved, one Blight Tag is removed from your Tag pool."
  },
  "7.6": {
    name: "Area", color: 7, category: 6,
    intent: "An effect that blankets a wide area, sacrificing power for coverage.",
    passive: "You can elect not to add your Level to an effect to instead affect everything in a radius (1 range band per point in Technique).",
    active: "This effect targets everything within a radius (1 range band per Technique/TEC) around a central point. You do not add your Level to the EV of this effect.",
    equipment: "This item's effect targets everything within a radius (1 range band per Expertise/Expertise). The wielder does not add the item's Level to the EV."
  },
  "7.7": {
    name: "Ranged", color: 7, category: 7,
    intent: "The property of being a projectile or thrown effect that strikes from a distance.",
    passive: "The origin point of your effects can be set to any point you can see within your normal range.",
    active: "This effect is not penalized for being made at a range further than your Range Stat.",
    equipment: "Ranged effects utilized by this equipment suffer no penalties for targets further than melee."
  },
  "7.8": {
    name: "Multiply", color: 7, category: 8,
    intent: "The ability for an effect to strike multiple, discrete targets simultaneously.",
    passive: "Your Teamwork effort action can target all allies within range.",
    active: "This effect can strike a number of additional targets equal to your Technique. You do not add your Level to the EV of this effect.",
    equipment: "This item's effect can strike a number of additional targets equal to the wielder's Expertise (Expertise). The wielder does not add the item's Level to the EV."
  },
  "7.9": {
    name: "Split", color: 7, category: 9,
    intent: "The power to divide oneself or an object into multiple, smaller copies or parts.",
    passive: "As a full turn action, you can split into a number of copies of yourself, up to your Force stat. These copies are Level 1 Animations that look identical to you. Your current HP, SP, and EP are divided as you choose among yourself and all copies. They share your Keywords and stats but act on your command.",
    active: "This effect causes the target to split into a number of equal-level animations under your control, up to your Technique. The target's values are divided among them.",
    equipment: "This item can separate into a number of smaller parts. The item’s Keywords are divided among the parts. Each part may contain as little as one Keyword. The number of Keywords contained in a part determines that part's level."
  },

  // --- Color 8: Blue (Speech & Influence) ---
  "8.0": {
    name: "Awkward", color: 8, category: 0,
    intent: "A social or mental clumsiness that hinders intellectual and influential actions.",
    passive: "You have Disadvantage on any roll that uses a Mind stat (Wit, Expertise, Technique).",
    active: "When you take this Flaw, choose a Compensation Keyword. You may use the Active effect of that Keyword as if you knew it.",
    equipment: "Utilizing this gear requires two Interact actions instead of one to equip or stow."
  },
  "8.1": {
    name: "Charismatic", color: 8, category: 1,
    intent: "An innate magnetism and force of personality that sways others.",
    passive: "You have Advantage on Social Effort Rolls regardless of Faction Reputation.",
    active: "The target of this effect has Disadvantage on any Effort Roll made to resist its social or intellectual influence.",
    equipment: "The wielder has Advantage on Taunt and Social Effort Rolls while this item is visibly equipped."
  },
  "8.2": {
    name: "Leader", color: 8, category: 2,
    intent: "A natural command over allies and subordinates, directing them with ease.",
    passive: "Increase the number of Animations you may have bound to you to 2.",
    active: "A willing Companion or Animation may apply one of its Keywords to your Effect.",
    equipment: "A Companion or Animation bonded to this item does not require a Command action to use its Keywords."
  },
  "8.3": {
    name: "Insightful", color: 8, category: 3,
    intent: "A deep empathy and perception for the emotional and mental state of others.",
    passive: "You can passively sense the surface-level emotional state of characters around you and can tell if someone is knowingly speaking a lie. You also know the Motivational Trinity of any target in range if you Assess.",
    active: "This effect grants you one free Clue from the Assess action on the target.",
    equipment: "The wielder can use this item to determine if a target is telling the truth as an Assess action."
  },
  "8.4": {
    name: "Enhance", color: 8, category: 4,
    intent: "A boon of targeted inspiration or power that improves any single action.",
    passive: "At the start of conflict, gain a number of Enhance Tags equal to your Influence.",
    active: "When this Keyword is part of an effect, grant the target a number of Enhance Tags equal to your Influence.",
    equipment: "The wielder may spend 1 SP as an action to grant themselves the Enhance Tag.",
    triggerEffect: "When you make a SR you may spend an Enhance Tag to increase the result by 1."
  },
  "8.5": {
    name: "Silence", color: 8, category: 5,
    intent: "An effect that severs a target's connection to their inner power, preventing them from using innate abilities.",
    passive: "When making a Basic Activation, if successful, you may grant the target a Silence Tag if no other tag is granted.",
    active: "When this Keyword is part of a successful effect, grant the target a Silence Tag.",
    equipment: "On a successful hit, this item grants the target a Silence Tag.",
    passiveTrigger: "When you would make an action or reaction that would allow you to apply Keywords, you forfeit the application and remove a Silence Tag from your Tag Pool."
  },
  "8.6": {
    name: "Splash", color: 8, category: 6,
    intent: "An effect that splashes or arcs from the primary target, spreading its nature but not its intensity.",
    passive: "When you successfully grant a target with a Tag, you may choose one adjacent target. The secondary target gains one instance of any Tag that was granted to the primary target as part of the effect.",
    active: "This effect hits the primary target and all targets adjacent to it. The primary target is affected as normal. All secondary targets are not dealt Value Loss, but they gain a copy of all of the Tags the effect applied to the primary target.",
    equipment: "On a successful hit, this item's effect splashes to an adjacent target to the original target, applying all of the effect's Tags to that secondary target."
  },
  "8.7": {
    name: "Lingering", color: 8, category: 7,
    intent: "An effect that persists in an area or has an enhanced, lasting impact on its target.",
    passive: "If you would grant a target Tags, grant them an additional Tag of one of the types granted.",
    active: "When this effect successfully grants Tags, the total number of each Tag granted is doubled.",
    equipment: "If this item is utilized as part of an effect that grants a Tag, grant an additional Tag of one of the types granted."
  },
  "8.8": {
    name: "Spread", color: 8, category: 8,
    intent: "The ability to move an affliction from one target to another.",
    passive: "As an action, choose a target with at least one Status Tag in their pool. You may then choose a second target within touch range and copy one of those Tags to the second target's pool.",
    active: "If this effect successfully exceeds the target's resistance, you may copy one of the target's Tags to another target within close range of the original target.",
    equipment: "If an effect that utilizes these items successfully exceeds the target's resistance you may copy one of the target's status Tags to another target within close range of the original target."
  },
  "8.9": {
    name: "Potent", color: 8, category: 9,
    intent: "A power so strong that it applies its secondary effects even when the primary effect is resisted.",
    passive: "As part of any successful Activate action, you may choose to deal no Value Loss. If you do, the target automatically gains the effect's Tags. This action can still be Dodged, Parried or Clashed against to mitigate its effect.",
    active: "This effect automatically grants its Tags, ignoring the target's Resistance. This action does not cause Value Loss.",
    equipment: "Effects from this item automatically grant their Tags, ignoring the target's Resistance. They do not cause Value Loss."
  },

  // --- Color 9: Purple (Esotericism & Identity) ---
  "9.0": {
    name: "Mundane", color: 9, category: 0,
    intent: "An innate disconnect from one's essence, hindering the use of supernatural abilities.",
    passive: "You have Disadvantage on any roll that uses an Essence stat (Power, Influence, Force).",
    active: "When you take this Flaw, choose a Compensation Keyword. You may use the Active effect of that Keyword as if you knew it.",
    equipment: "The wielder cannot add their innate Keywords to effects made with this gear."
  },
  "9.1": {
    name: "Aware", color: 9, category: 1,
    intent: "The ability to sense and identify the use of supernatural powers.",
    passive: "You can passively sense the use of any Keyword within your Range, knowing its Color and general location.",
    active: "On a successful hit, you are revealed all the Passively Slotted Keywords on the target.",
    equipment: "Choose a Keyword at creation. This item can be used as an Assess action to sense and locate any use of that specific Keyword."
  },
  "9.2": {
    name: "Stealthy", color: 9, category: 2,
    intent: "A natural talent for concealment and moving undetected.",
    passive: "You have Advantage on all rolls made to hide, move silently, or conceal objects.",
    active: "You may make a Hide action as part of this Effect Action.",
    equipment: "Attempts to find this item via the Assess action are made with Disadvantage."
  },
  "9.3": {
    name: "Trickster", color: 9, category: 3,
    intent: "The use of illusion, misdirection, and psychological manipulation to create openings.",
    passive: "As a Setup Action, you may manifest an Illusory Puzzle (TN: Technique, Clock: Level) targeting one entity. Until this Puzzle is resolved, you and all allies gain Concealment from that target.",
    active: "Actions or reactions made against effects with this Keyword are made with Disadvantage.",
    equipment: "This equipment can be utilized to perform a Hide action as a single action, regardless of available cover."
  },
  "9.4": {
    name: "Obscure", color: 9, category: 4,
    intent: "A boon of concealment that can render one undetectable to a chosen sense.",
    passive: "At the start of conflict, gain a number of Obscure Tags equal to your Influence.",
    active: "When this Keyword is part of an effect, grant a target a number of Obscure Tags equal to your Influence.",
    equipment: "The wielder may spend 1 SP as an action to grant themselves the Obscure Tag.",
    triggerEffect: "You may spend one Obscure Tag from your Tag pool to become undetectable by a single chosen sense until you take a hostile action or are detected (TN = 10 + Chosen Stat + Level)."
  },
  "9.5": {
    name: "Nullify", color: 9, category: 5,
    intent: "An effect that disrupts a target's innate abilities, shutting down their passive powers.",
    passive: "When making a Basic Activation, if successful, you may grant the target a Nullify Tag if no other tag is granted.",
    active: "When this Keyword is part of a successful effect, grant the target a Nullify Tag.",
    equipment: "On a successful hit, this item grants the target a Nullify Tag.",
    passiveTrigger: "When applied, the target’s Passive Keywords are rendered inactive for as long as they have a Nullify Tag in their pool. When a Nullify Tag is added to the pool, remove a Boost Tag from the pool. A Nullify Tag is removed when you gain priority for the first time in a round."
  },
  "9.6": {
    name: "Chain", color: 9, category: 6,
    intent: "An effect that leaps from one target to the next.",
    passive: "Effects that target a willing ally can be made to chain to additional willing allies, up to your Technique.",
    active: "After this effect hits its primary target, it may \"chain\" to one adjacent enemy, dealing a fixed EV of 1.",
    equipment: "On a successful hit, this item's effect may chain to an additional target within close range, dealing 1 point of Value Loss."
  },
  "9.7": {
    name: "Natural", color: 9, category: 7,
    intent: "The quality of an ability being so innate it is treated as part of one's own body.",
    passive: "You can add any innate Keyword you know to a Gear effect at no extra EP cost, up to your Technique.",
    active: "This effect can be used even if you are Silenced.",
    equipment: "This gear is considered part of the wielder. It cannot be Disarmed and can be used to channel any of the wielder’s Keywords at no additional EP cost."
  },
  "9.8": {
    name: "Ambience", color: 9, category: 8,
    intent: "The power to influence and control the surrounding environment itself.",
    passive: "As an action, you can alter the ambient environmental conditions around you by one step. This persists as long as you concentrate.",
    active: "You may modify one environmental hazard within range by a number of steps up to your Technique.",
    equipment: "This item can be activated to change a chosen environmental condition within a small radius by a number of steps equal to the wielder's Expertise (Expertise).",
    stages: {
      1: "Calm: No special effect.",
      2: "Rough: All actions within or against targets in this area have disadvantage.",
      3: "Difficult: Half movement; all targets gain cover.",
      4: "Tricky: Movement is restricted to 1. All targets are hidden.",
      5: "Impassable: Blocks movement unless a movement type permits entry. Targets inside are hidden and untargetable unless exposed."
    }
  },
  "9.9": {
    name: "Channel", color: 9, category: 9,
    intent: "The ability to share one's own innate powers and passive abilities with others.",
    passive: "When this Keyword is placed in a passive slot, you combine your gear and innate passive pools into one unified pool. This unified pool can then slot passive Keywords from either innate or gear Keywords. The unified pool is increased in capacity by one to provide a slot for this Keyword.",
    active: "A willing target of this effect gains the passive benefits of a number of your passive slotted Keywords (up to your Technique) until the end of their next turn.",
    equipment: "The wielder can grant a passive from this item to a willing target as an action."
  }
};