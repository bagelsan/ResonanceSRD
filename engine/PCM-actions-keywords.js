/**
 * PCM-actions-keywords.js
 * Source of Truth: Core Rules Interaction Pipeline
 * 
 * Implements the Action execution catalog alongside programmatic 
 * interceptor hooks for Keywords to manipulate rolls, stats, and states.
 */

import { StandardDiceRoller } from './PCM-engine.js';

// Step 3.0: Core Action Execution Pipeline

// ==========================================
// 1. IMPORTS (Keep this exactly as it is)
// ==========================================
import { StandardDiceRoller } from './PCM-engine.js';

// ==========================================
// 2. PASTE THE NEW EXPANDED CLASS HERE
// ==========================================
export class ActionExecutor {
  static calculateEPCost(actor, appliedKeywordsCount, useChargeTag = false) {
    // ... code ...
  }

  static executeActivate(actor, target, options = {}) {
    // ... code ...
  }

  static executeManeuver(actor, target, maneuverType, chosenStat = "Brawn", options = {}) {
    // ... code ...
  }

  static executeReaction(actor, incomingEV, reactionType, chosenStat = "Alacrity", options = {}) {
    // ... code ...
  }

  static executeEffortRoll(actor, challengeClock, chosenStat = "Technique") {
    // ... code ...
  }
}

// ==========================================
// 3. KEYWORD HOOKS (Keep all of this exactly as it is)
// ==========================================
export const KEYWORD_HOOKS = {
  "0.0": { ... },
  // ... rest of your Color 0 and 1 hooks ...
};

export const KEYWORD_HOOKS_PART2 = {
  // ... Color 2, 3, 4, 5 hooks ...
};
Object.assign(KEYWORD_HOOKS, KEYWORD_HOOKS_PART2);

export const KEYWORD_HOOKS_PART3 = {
  // ... Color 6, 7, 8, 9 hooks ...
};
Object.assign(KEYWORD_HOOKS, KEYWORD_HOOKS_PART3);

// Step 3.1: Keyword Programmatic Hooks Registry
export const KEYWORD_HOOKS = {
  // --- Color 0: Null ---
  "0.0": {
    // Restricted (Flaw): Handled directly inside ActionExecutor.calculateEPCost
  },
  "0.1": {
    // Aura (Gift)
    beforeRoll: (actor, target, context) => {
      // If any applied keyword matches actor's primary motivation color, add +1 to EV
      if (context.appliedKeywords.some(kw => kw.startsWith(String(actor.profile?.goal)))) {
        context.evModifier += 1;
      }
    }
  },
  "0.2": {
    // Specialist (Talent)
    beforeRollPassive: (actor, target, context) => {
      // Grants advantage to chosen grid Category. Checked on external effort checks.
      context.hasAdvantage = true; 
    }
  },
  "0.3": {
    // Alert (Quirk): Handled in initiative logic (prevents Surprise)
  },
  "0.4": {
    // Liberate (Boost): Trigger effect can be called manually
    trigger: (actor) => {
      actor.removeStatusTag("Bind"); // Clears Immobilized condition
      actor.removeBoostTag("Liberate");
    }
  },
  "0.5": {
    // Mark (Status): Targets are treated as Exposed on trigger
    passiveTrigger: (actor, target, context) => {
      context.hasAdvantage = true; // Mark Tag grants advantage on next incoming attack
      target.removeStatusTag("Mark");
    }
  },
  "0.6": {
    // Indirect (Form)
    beforeRoll: (actor, target, context) => {
      context.bypassCover = true; // Striking ignores cover defensive benefits
    }
  },
  "0.7": {
    // Adaptive (Modifier)
    beforeRoll: (actor, target, context) => {
      // Prompt option to target HP, SP, or EP. Default overrides to option parameters
      context.targetValue = "ep"; // Example override: redirects value loss to Energy Clocks
    }
  },
  "0.8": {
    // Gamble (Drive)
    beforeRoll: (actor, target, context) => {
      // Replaces actor level with random d10
      context.evModifier -= actor.level;
      context.evModifier += Math.floor(Math.random() * 10) + 1;
    }
  },
  "0.9": {
    // Edit (Unique)
    afterRoll: (actor, target, rollResult, damage, context) => {
      if (damage > 0) {
        // Swap target passive slots temporarily (handled in campaign rules)
      }
    }
  },

  // --- Color 1: Silver ---
  "1.0": {
    // Bane (Flaw)
    beforeRollPassive: (actor, target, context) => {
      // If attacking keyword matches vulnerability, ignore actor's resistance entirely
    }
  },
  "1.1": {
    // Traveler (Gift): Implements movement vectors inside programmatic navigation maps
  },
  "1.2": {
    // Martial (Talent): Adds advantage to defensive Reaction rolls
    beforeRollPassive: (actor, target, context) => {
      if (context.isReaction) {
        context.hasAdvantage = true;
      }
    }
  },
  "1.3": {
    // Attuned (Quirk)
    beforeRoll: (actor, target, context) => {
      context.bypassCover = true; // Attuned ignores ranges, distances, or cover checks
    }
  },
  "1.4": {
    // Augment (Boost)
    trigger: (actor, target, targetKeywordCode) => {
      actor.removeBoostTag("Augment");
      // Grant keyword to target context
    }
  },
  "1.5": {
    // Impair (Status)
    passiveTrigger: (actor) => {
      actor.clocks.sp = Math.max(0, actor.clocks.sp - 1); // Triggers +1 SP expenditure penalty
      actor.removeStatusTag("Impair");
    }
  },
  "1.6": {
    // Reactive (Form)
    beforeRoll: (actor, target, context) => {
      if (context.isReaction) {
        context.evModifier += actor.stats.Technique; // Add technique to dodge calculations
      }
    }
  },
  "1.7": {
    // Phasing (Modifier)
    beforeRoll: (actor, target, context) => {
      context.bypassResistance = true; // Bypasses item and passive resistance
      context.targetValue = "ep";      // Affects Energy Points directly
    }
  },
  "1.8": {
    // Brutal (Drive)
    beforeRoll: (actor, target, context) => {
      // Crit is triggered on raw SR result of 6+
    }
  },
  "1.9": {
    // Translocate (Unique): Changes target physical coordinates maps inside coordinate boards
  }
};

// Step 3.2: Keyword Programmatic Hooks Registry - Part 2 (Colors 2 to 5)
export const KEYWORD_HOOKS_PART2 = {
  // --- Color 2: Yellow (Immediacy & Motion) ---
  "2.0": {
    // Anxious (Flaw): Setup actions cost double (handled in setup action triggers)
  },
  "2.1": {
    // Acrobatic (Gift)
    beforeRollPassive: (actor, target, context) => {
      context.ignoreDifficultTerrain = true; // Negates movement/positioning environmental blocks
    }
  },
  "2.2": {
    // Sentry (Talent): Allows assess as standard single action rather than full setup
  },
  "2.3": {
    // Eidetic (Quirk)
    beforeRoll: (actor, target, context) => {
      // If target type was encountered before, gain Advantage on EV/ER
      if (context.hasEncounteredTargetType) {
        context.hasAdvantage = true;
      }
    }
  },
  "2.4": {
    // Haste (Boost)
    trigger: (actor) => {
      actor.removeBoostTag("Haste");
      // Add +1 Action to the character's active action pool for the current round
      actor.currentRoundActions = (actor.currentRoundActions || 0) + 1;
    }
  },
  "2.5": {
    // Slow (Status)
    passiveTrigger: (actor) => {
      // Subtracts 1 Action from the pool at turn start (min 1 action)
      actor.currentRoundActions = Math.max(1, (actor.currentRoundActions || actor.stats.Alacrity) - 1);
      actor.removeStatusTag("Slow");
    }
  },
  "2.6": {
    // Snap (Form)
    beforeRoll: (actor, target, context) => {
      context.isUnreactable = true; // Negates target reaction triggers (Avoid, Resist, Parry etc.)
    }
  },
  "2.7": {
    // Focus (Modifier)
    beforeRoll: (actor, target, context) => {
      // Apply chosen stat an additional time to the EV calculation
      const chosenStatVal = actor.stats[context.chosenStat || "Force"] || 1;
      context.evModifier += chosenStatVal;
    }
  },
  "2.8": {
    // Rapid (Drive)
    beforeRoll: (actor, target, context) => {
      // Handled in multi-strike action resolution logic (Active)
    }
  },
  "2.9": {
    // Reckless (Unique)
    beforeRollPassive: (actor, target, context) => {
      if (actor.hasCondition("Reckless")) {
        actor.addCondition("Exposed");
        context.hasAdvantage = true; // All actions gain Advantage while reckless
      }
    }
  },

  // --- Color 3: Green (Stability & Resilience) ---
  "3.0": {
    // Hesitant (Flaw): Checked when executing Dodge/Avoid reactions
    beforeRollPassive: (actor, target, context) => {
      if (context.isReaction) {
        context.hasDisadvantage = true;
      }
    }
  },
  "3.1": {
    // Sturdy (Gift): Resists forced movement / maneuvers
  },
  "3.2": {
    // Brawler (Talent): Enables maneuvers without SP cost
  },
  "3.3": {
    // Stubborn (Quirk)
    afterRoll: (actor, target, rollResult, damage, context) => {
      // If target successfully Avoided/Blocked, player can spend 1 SP to reroll EV
    }
  },
  "3.4": {
    // Ward (Boost)
    trigger: (actor) => {
      actor.removeBoostTag("Ward");
      // Flag current incoming target attack to deal 0 damage / ignore effects entirely
    }
  },
  "3.5": {
    // Daze (Status)
    beforeRollPassive: (actor, target, context) => {
      // Count total daze tags in actor status pool
      const dazeCount = actor.statusTags.filter(tag => tag === "Daze").length;
      context.evModifier -= dazeCount; // Reduces SR by the number of Daze Tags
      actor.removeStatusTag("Daze");
    }
  },
  "3.6": {
    // Sculpt (Form): Alters Barrier clocks or Target Numbers
  },
  "3.7": {
    // Defensive (Modifier)
    beforeRoll: (actor, target, context) => {
      context.evModifier += actor.level; // Adds level to resistance values on blocks
    }
  },
  "3.8": {
    // Impact (Drive)
    afterRoll: (actor, target, rollResult, damage, context) => {
      if (damage > 0) {
        target.addCondition("Prone"); // Forces knock down or push
      }
    }
  },
  "3.9": {
    // Shift (Unique): Dynamically swaps core stat configurations inside stat grids
  },

  // --- Color 4: Black (Inevitability & Endurance) ---
  "4.0": {
    // Feeble (Flaw)
    beforeRollPassive: (actor, target, context) => {
      // Disadvantage on any roll that uses a Body stat (Range, Alacrity, Brawn)
      if (["Range", "Alacrity", "Brawn"].includes(context.chosenStat)) {
        context.hasDisadvantage = true;
      }
    }
  },
  "4.1": {
    // Survivor (Gift): Alive until HP, SP, and EP are all 0
  },
  "4.2": {
    // Stoic (Talent): Checked when executing setup actions
  },
  "4.3": {
    // Ageless (Quirk): Immune to biological / Growth effects
  },
  "4.4": {
    // Bless (Boost)
    trigger: (actor, context) => {
      actor.removeBoostTag("Bless");
      if (context.isRestoration) {
        context.restorationValue += 1; // Increase restored value by 1
      } else {
        context.hasAdvantage = true; // Or gain Advantage on the roll
      }
    }
  },
  "4.5": {
    // Curse (Status)
    beforeRollPassive: (actor, target, context) => {
      context.hasDisadvantage = true; // Triggers Disadvantage on next roll
      actor.removeStatusTag("Curse");
    }
  },
  "4.6": {
    // Piercing (Form)
    beforeRoll: (actor, target, context) => {
      context.bypassCover = true;
      context.bypassResistance = true; // Ignores all cover and physical defenses
    }
  },
  "4.7": {
    // Flux (Modifier)
    beforeRoll: (actor, target, context) => {
      // Spend SP or EP up to Technique stat value to add directly to EV
      const spendAmount = Math.min(context.fluxSpend || 0, actor.stats.Technique);
      if (actor.clocks.sp >= spendAmount) {
        actor.clocks.sp -= spendAmount;
        context.evModifier += spendAmount;
      }
    }
  },
  "4.8": {
    // Siphon (Drive)
    afterRoll: (actor, target, rollResult, damage, context) => {
      if (damage > 0) {
        // Restore 1 point to a chosen personal resource clock
        actor.clocks.hp = Math.min(actor.clocksMax.hp, actor.clocks.hp + 1);
      }
    }
  },
  "4.9": {
    // Animate (Unique): Summons temporary animation nodes into active play
  },

  // --- Color 5: Orange (Creation & Chaos) ---
  "5.0": {
    // Gremlins (Flaw): Handled inside standard rolling logic (die result of 1 is automatic miss)
  },
  "5.1": {
    // Sensor (Gift): Overrides map sensory variables inside radar canvases
  },
  "5.2": {
    // Improvisor (Talent): Adds Level to the EV of improvised actions
    beforeRoll: (actor, target, context) => {
      if (context.isImprovised) {
        context.evModifier += actor.level;
      }
    }
  },
  "5.3": {
    // Crafty (Quirk): Bypasses maximum SP reductions on item builds
  },
  "5.4": {
    // Charge (Boost): Trigger handles cost reduction (coded in ActionExecutor.calculateEPCost)
  },
  "5.5": {
    // Bind (Status)
    beforeRollPassive: (actor, target, context) => {
      actor.addCondition("Exposed"); // Immobilized and Exposed
    }
  },
  "5.6": {
    // Imbue (Form): Imbues item keywords onto targets during active strikes
  },
  "5.7": {
    // Material (Modifier)
    beforeRoll: (actor, target, context) => {
      if (context.consumedMaterial) {
        // Increase EV by Expertise or material level
        context.evModifier += Math.max(actor.stats.Expertise, context.consumedMaterial.level);
      }
    }
  },
  "5.8": {
    // Leverage (Drive)
    beforeRollPassive: (actor, target, context) => {
      if (context.isManeuver || context.isEffortRoll) {
        context.hasAdvantage = true; // Maneuvers and Effort Rolls gain Advantage
      }
    }
  },
  "5.9": {
    // Manifest (Unique): Projects temporary items with level/keywords in active inventory
  }
};

// Combine Part 2 hooks with the core KEYWORD_HOOKS registry
Object.assign(KEYWORD_HOOKS, KEYWORD_HOOKS_PART2);

// Step 3.3: Keyword Programmatic Hooks Registry - Part 3 (Colors 6 to 9)
export const KEYWORD_HOOKS_PART3 = {
  // --- Color 6: White (Order & Purity) ---
  "6.0": {
    // Vulnerable (Flaw): Handled inside target selection logic (called shot does not require Advantage)
  },
  "6.1": {
    // Tolerant (Gift)
    onRemoveStatusTags: (actor, tagsList) => {
      // When removing a Status Tag, remove 2 instead (Layer 3, Section 2.5/Gift)
    }
  },
  "6.2": {
    // Deadeye (Talent)
    beforeRoll: (actor, target, context) => {
      if (context.isCalledShot) {
        context.hasDisadvantage = false; // Bypasses Called Shot Disadvantage penalty
      }
    }
  },
  "6.3": {
    // Immunized (Quirk): Immune to chosen Status Tag (handled in target.addStatusTag validation)
  },
  "6.4": {
    // Cure (Boost)
    trigger: (actor, targetTag) => {
      actor.removeBoostTag("Cure");
      actor.removeStatusTag(targetTag); // Cleanses targeted status tag (White Boost)
    }
  },
  "6.5": {
    // Weaken (Status)
    beforeDamageIncoming: (actor, context) => {
      const weakenCount = actor.statusTags.filter(tag => tag === "Weaken").length;
      context.targetResistance = Math.max(0, context.targetResistance - weakenCount); // Reduces resistance by Weaken count
      actor.removeStatusTag("Weaken");
    }
  },
  "6.6": {
    // Sticky (Form): Clings to target, delivering a payload after a delay
  },
  "6.7": {
    // Restore (Modifier)
    beforeRoll: (actor, target, context) => {
      context.isRestoration = true;
      context.targetValue = "hp"; // Overrides target output to restore values
      context.restorationValue = actor.stats.Technique; // Base restore equal to Technique
    }
  },
  "6.8": {
    // Exploit (Drive)
    beforeRoll: (actor, target, context) => {
      // Remove up to Technique status tags from target to increase EV by that amount
      const targetTags = target.statusTags;
      const removeCount = Math.min(targetTags.length, actor.stats.Technique);
      for (let i = 0; i < removeCount; i++) {
        target.statusTags.shift();
      }
      context.evModifier += removeCount;
    }
  },
  "6.9": {
    // Growth (Unique): Manipulates target biology (handled in custom scene scripts)
  },

  // --- Color 7: Red (Passion & Conflict) ---
  "7.0": {
    // Limited (Flaw): Handled inside constructor/max value calculators (reduces value max by 5)
  },
  "7.1": {
    // Resilient (Gift): Handled inside constructor/max value calculators (increases value max by 5)
  },
  "7.2": {
    // Font (Talent): Allows paying EP costs using HP/SP instead
  },
  "7.3": {
    // Insulated (Quirk): Immune to negative environmental changes (handled in scene mechanics)
  },
  "7.4": {
    // Regen (Boost)
    trigger: (actor, chosenValue = "hp") => {
      actor.removeBoostTag("Regen");
      actor.clocks[chosenValue] = Math.min(actor.clocksMax[chosenValue], actor.clocks[chosenValue] + 1);
    }
  },
  "7.5": {
    // Blight (Status)
    passiveTrigger: (actor) => {
      // Suffer 1 unavoidable point of Value Loss on next action
      actor.clocks.hp = Math.max(0, actor.clocks.hp - 1);
      actor.removeStatusTag("Blight");
    }
  },
  "7.6": {
    // Area (Form)
    beforeRoll: (actor, target, context) => {
      context.evModifier -= actor.level; // Bypasses Level contribution to hit all targets in radius
      context.isAoE = true;
    }
  },
  "7.7": {
    // Ranged (Modifier)
    beforeRoll: (actor, target, context) => {
      context.isRangedOverride = true; // Negates range penalty for distant shots
    }
  },
  "7.8": {
    // Multiply (Drive)
    beforeRoll: (actor, target, context) => {
      context.evModifier -= actor.level; // Bypasses Level contribution to strike additional targets
      context.maxTargets = 1 + actor.stats.Technique;
    }
  },
  "7.9": {
    // Split (Unique): Divides character or items into multiple sub-nodes (handled in scene actions)
  },

  // --- Color 8: Blue (Influence & Cooperation) ---
  "8.0": {
    // Awkward (Flaw)
    beforeRollPassive: (actor, target, context) => {
      // Disadvantage on any roll that uses a Mind stat (Wit, Expertise, Technique)
      if (["Wit", "Expertise", "Technique"].includes(context.chosenStat)) {
        context.hasDisadvantage = true;
      }
    }
  },
  "8.1": {
    // Charismatic (Gift): Automatically grants Advantage on Social Effort Rolls
    beforeRollPassive: (actor, target, context) => {
      if (context.isSocialCheck) {
        context.hasAdvantage = true;
      }
    }
  },
  "8.2": {
    // Leader (Talent): Integrates animations/companions into actions checks
  },
  "8.3": {
    // Insightful (Quirk): Grants free clue from Assess on target
  },
  "8.4": {
    // Enhance (Boost)
    trigger: (actor, context) => {
      actor.removeBoostTag("Enhance");
      context.evModifier += 1; // Increase SR result by 1
    }
  },
  "8.5": {
    // Silence (Status)
    beforeRollPassive: (actor, target, context) => {
      // Forfeits active keyword applications
      context.appliedKeywords = [];
      actor.removeStatusTag("Silence");
    }
  },
  "8.6": {
    // Splash (Form)
    afterRoll: (actor, target, rollResult, damage, context) => {
      // Splash copies of applied tags onto adjacent targets
      context.isSplashEnabled = true;
    }
  },
  "8.7": {
    // Lingering (Modifier)
    afterRoll: (actor, target, rollResult, damage, context) => {
      // Doubles the number of tags successfully applied
      context.doubleTagsApplied = true;
    }
  },
  "8.8": {
    // Spread (Drive)
    afterRoll: (actor, target, rollResult, damage, context) => {
      // Copies one of the target's status tags to another target
    }
  },
  "8.9": {
    // Potent (Unique)
    beforeRoll: (actor, target, context) => {
      context.bypassResistance = true; // Automatically grants tags ignoring resistance
      context.dealsDamage = false;     // Does not deal HP damage (Value Loss)
    }
  },

  // --- Color 9: Purple (Esotericism & Identity) ---
  "9.0": {
    // Mundane (Flaw)
    beforeRollPassive: (actor, target, context) => {
      // Disadvantage on any roll that uses an Essence stat (Power, Influence, Force)
      if (["Power", "Influence", "Force"].includes(context.chosenStat)) {
        context.hasDisadvantage = true;
      }
    }
  },
  "9.1": {
    // Aware (Gift): Senses keyword color and location (handled in Assess)
  },
  "9.2": {
    // Stealthy (Talent): Grants Advantage on stealth/Hide rolls
    beforeRollPassive: (actor, target, context) => {
      if (context.isStealthCheck) {
        context.hasAdvantage = true;
      }
    }
  },
  "9.3": {
    // Trickster (Quirk): Forced Disadvantage on enemy reactions to user's effects
  },
  "9.4": {
    // Obscure (Boost)
    trigger: (actor) => {
      actor.removeBoostTag("Obscure");
      actor.addCondition("Hidden"); // Grants Hidden state immediately
    }
  },
  "9.5": {
    // Nullify (Status)
    passiveTrigger: (actor) => {
      // Disables passive slots (handled in parser / calculation engines)
    }
  },
  "9.6": {
    // Chain (Form)
    afterRoll: (actor, target, rollResult, damage, context) => {
      // Chains to adjacent target dealing fixed 1 EV
      context.isChainEnabled = true;
    }
  },
  "9.7": {
    // Natural (Modifier): Permits adding innate Keywords to gear effects at no EP cost
  },
  "9.8": {
    // Ambience (Drive): Overrides scene maps environmental metrics
  },
  "9.9": {
    // Channel (Unique)
    afterRoll: (actor, target, rollResult, damage, context) => {
      // Shared passives with target (handled inside stats registers)
    }
  }
};

// Merge Part 3 keywords with main KEYWORD_HOOKS registry
Object.assign(KEYWORD_HOOKS, KEYWORD_HOOKS_PART3);