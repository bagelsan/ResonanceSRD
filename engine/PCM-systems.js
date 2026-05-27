/**
 * PCM-systems.js
 * Source of Truth: Faction, Scaling & Items Logic
 * 
 * Automates complex cross-entity interactions, including item level
 * matching, durability failure checks, animation scaling, and Faction assemblies.
 */

import { Item, Character } from './PCM-engine.js';

// Step 4.0: Item and Crafting Validation Engine
export class ItemRulesEngine {
  /**
   * Calculates the effective level to use for an item's activation (Layer 5, Section 6.5)
   * If the item's level is higher than the character's, use the character's level instead.
   * @param {Character} character - The acting character
   * @param {Item} item - The item being utilized
   * @returns {number} The resolved level modifier
   */
  static getEffectiveLevel(character, item) {
    return Math.min(character.level, item.level);
  }

  /**
   * Applies durability damage and checks for structural failure (Layer 5, Section 6.7)
   * @param {Item} item - The item taking damage
   * @returns {Object} Updated item state
   */
  static applyDurabilityDamage(item) {
    item.damageItem(); // Deduct 1 durability segment
    
    let stateString = "Undamaged";
    if (item.isDestroyed) {
      stateString = "Destroyed";
    } else if (item.isBroken) {
      stateString = "Broken";
    }

    return {
      durabilityRemaining: item.durability,
      state: stateString,
      imposesDisadvantage: item.isBroken,
      isUsable: !item.isDestroyed
    };
  }

  /**
   * Restores an item's structural state to Undamaged (Layer 5, Section 6.8)
   * @param {Item} item - The item being repaired
   */
  static repair(item) {
    item.repairItem();
  }

  /**
   * Validates if a character is capable of crafting a specific item level during a Rest (Layer 5, Section 7.2)
   * @param {Character} character - The crafting character
   * @param {number} targetLevel - The level of the item to be crafted
   * @returns {boolean} True if eligible
   */
  static canCraftDuringRest(character, targetLevel) {
    // During a Rest, a character can craft an item or effect with a level equal to their Expertise stat or lower
    const maxRestLevel = character.stats.Expertise || 1;
    return targetLevel <= maxRestLevel;
  }

  /**
   * Executes a Rest-Crafting action, applying the verbatim resource penalties (Layer 5, Section 7.3 - 7.5)
   * @param {Character} character - The crafting character
   * @param {string} itemName - Name of the new item
   * @param {number} targetLevel - Target level of the crafted item
   * @param {Array<string>} keywordsToEmbed - Keywords to embed (must be known/available to character)
   * @returns {Object} Crafting result containing the new Item instance or failure parameters
   */
  static executeRestCrafting(character, itemName, targetLevel, keywordsToEmbed = []) {
    // 1. Level eligibility check (Expertise threshold)
    if (!this.canCraftDuringRest(character, targetLevel)) {
      return {
        success: false,
        reason: `Insufficient Expertise. Rest-Crafting level is limited to Expertise score (${character.stats.Expertise || 1}).`
      };
    }

    // 2. Keyword validation (Keywords must be available on the character, allies, or nearby gear)
    const invalidKeywords = keywordsToEmbed.filter(kw => !character.keywords.includes(kw));
    if (invalidKeywords.length > 0) {
      return {
        success: false,
        reason: `Cannot craft. The following keywords are not available: ${invalidKeywords.join(", ")}`
      };
    }

    // 3. Apply Rest Consumption Penalty (Section 7.3)
    // Crafting during a rest consumes the rest and prevents recovery of HP, SP, or EP
    const restConsumptionEffect = {
      hpRecovered: 0,
      spRecovered: 0,
      epRecovered: 0,
      restConsumed: true
    };

    // 4. Apply Maximum SP Reduction Penalty (Section 7.4)
    // Crafting reduces the character's maximum SP by 1 until it is restored during Downtime
    character.clocksMax.sp = Math.max(1, character.clocksMax.sp - 1);
    character.clocks.sp = Math.min(character.clocksMax.sp, character.clocks.sp);

    // 5. Instantiate the newly crafted Item
    const newItem = new Item(itemName, targetLevel);
    keywordsToEmbed.forEach(kw => newItem.addKeyword(kw));

    return {
      success: true,
      item: newItem,
      penaltiesApplied: {
        restEffect: restConsumptionEffect,
        spMaxReduction: 1,
        newSpMax: character.clocksMax.sp
      }
    };
  }

  /**
   * Restores SP penalties during Downtime (Layer 5, Section 7.4)
   * @param {Character} character - The character recovering
   */
  static recoverCraftingMaxSp(character) {
    // Set SP maximum back to standard floor
    character.clocksMax.sp = 10;
  }
}

import { Animation } from './PCM-engine.js';

// Step 4.1: Animation Auto-Scaling Engine
export class AnimationRulesEngine {
  /**
   * Automatically scales an Animation to maintain a level one below its master (Layer 5, Section 4.3)
   * Calculates stat and keyword budgets matching the new target level.
   * @param {Animation} animation - The animation being scaled
   * @param {Character} master - The controlling character node
   * @param {Array<string>} statsToIncrease - Specific stats to increase for leveling
   * @param {Array<string>} newKeywords - Keywords to fill the progression slots
   * @returns {Object} Scaling results metadata
   */
  static scaleToMaster(animation, master, statsToIncrease = [], newKeywords = []) {
    // An Animation maintains a level one below its master or controller (Section 4.3)
    const targetLevel = Math.max(0, master.level - 1);
    const levelsToGain = targetLevel - animation.level;

    if (levelsToGain <= 0) {
      return {
        scaled: false,
        reason: `Animation is already scaled to appropriate level (${animation.level}) for Master Level (${master.level}).`
      };
    }

    // Step 1: Calculate new budgets (Section 4.4)
    // Total Stats = 9 + (Level * 2)
    // Total Keywords = Level + 1
    const finalStatBudget = 9 + (targetLevel * 2);
    const finalKeywordBudget = targetLevel + 1;

    // Apply incremental leveling up
    for (let i = 0; i < levelsToGain; i++) {
      const levelStatPicks = statsToIncrease.slice(i * 2, (i * 2) + 2);
      const levelKwPick = newKeywords[i] || null;
      animation.levelUpAnimation(levelStatPicks, levelKwPick);
    }

    // Enforce stat ceilings (max 5 in any single stat)
    for (let stat in animation.stats) {
      if (animation.stats[stat] > 5) {
        animation.stats[stat] = 5;
      }
    }

    return {
      scaled: true,
      newLevel: animation.level,
      statBudgetMet: this.getSumOfStats(animation) === finalStatBudget,
      keywordBudgetMet: animation.keywords.length === finalKeywordBudget,
      stats: { ...animation.stats },
      keywords: [...animation.keywords]
    };
  }

  /**
   * Helper method to calculate the sum of an entity's stats
   */
  static getSumOfStats(entity) {
    return Object.values(entity.stats).reduce((sum, val) => sum + val, 0);
  }

  /**
   * Evaluates if a minion is immediately defeated by an incoming action (Layer 5, Section 4.3.3)
   * A Minion is defeated if any EV exceeds its Resistance.
   * @param {Animation} targetAnim - The target animation being hit
   * @param {number} incomingEV - The incoming Effect Value (EV) of the action
   * @returns {boolean} True if the minion is defeated
   */
  static evaluateMinionDefeat(targetAnim, incomingEV) {
    if (!targetAnim.isMinion) return false;
    return incomingEV > targetAnim.resistance;
  }

  /**
   * Validates the active persistent animations limit of a character (Layer 5, Section 4.7 - 4.8)
   * A character can maintain a single animation passively, scaled with Influence.
   * @param {Character} character - The master character
   * @param {Array<Animation>} activeAnimations - Currently active summoned animations
   * @returns {Object} Validation results detailing if any animations must depart
   */
  static validatePersistentAnimations(character, activeAnimations) {
    // Passively allowed animations scales based on the Influence stat (Section 1.3.8 / 4.7)
    // Default floor limit is 1. Max allowed equal to Influence stat.
    const maxAllowedPassively = Math.max(1, character.stats.Influence);
    const activeCount = activeAnimations.length;

    const excessCount = Math.max(0, activeCount - maxAllowedPassively);
    
    return {
      atCapacity: activeCount >= maxAllowedPassively,
      maxAllowed: maxAllowedPassively,
      activeCount,
      excessCount,
      requiresAction: excessCount > 0,
      summary: excessCount > 0 
        ? `Animation limit exceeded by ${excessCount}. Choose animations to persist, the rest must depart (Rule 4.8).`
        : "Animations within healthy limits."
    };
  }
}

import { Faction, Character } from './PCM-engine.js';

// Step 4.2: Faction Council and Nation Assembly Engine
export class FactionRulesEngine {
  /**
   * Generates a Civil Leader for a specific Faction Civil System on the fly (Layer 5, Section 8.7)
   * @param {Faction} faction - The parent faction
   * @param {string} systemCode - The system code (e.g. "S0", "S3")
   * @param {string} leaderName - Name of the leader NPC
   * @returns {Character} The generated Level 2 NPC Leader
   */
  static generateCivilLeader(faction, systemCode, leaderName = "Civil Leader") {
    // Extract the faction's Goal (1st digit of Hex Code) (Section 8.7.2)
    const factionGoalStr = faction.hexCode.replace("#", "")[0];
    const leaderGoal = parseInt(factionGoalStr, 10);

    // Map S0-S9 to corresponding secondary motivation colors (Section 8.7.3)
    const systemMotivationMatrix = {
      "S0": 0, // Food -> Discovery (Null)
      "S1": 1, // Water -> Ambition (Silver)
      "S2": 2, // Shelter -> Freedom (Yellow)
      "S3": 3, // Infrastructure -> Security (Green)
      "S4": 4, // Humanitarian -> Legacy (Black)
      "S5": 5, // Education -> Innovation (Orange)
      "S6": 6, // Healthcare -> Purity (White)
      "S7": 7, // Government -> Glory (Red)
      "S8": 8, // Commerce -> Influence (Blue)
      "S9": 9  // Military -> Faith (Purple)
    };

    const leaderMethod = systemMotivationMatrix[systemCode];
    if (leaderMethod === undefined) {
      throw new Error(`Invalid system code "${systemCode}" for leader generation.`);
    }

    // Default remaining motivation registers to form a valid 6-char hex string
    const defaultPurpose = 9;       // Faith
    const defaultExtConflict = 3;   // Security
    const defaultIntConflict = 4;   // Legacy
    const defaultScope = "X";       // External

    const leaderHexCode = `#${leaderGoal}${leaderMethod}${defaultPurpose}${defaultExtConflict}${defaultIntConflict}${defaultScope}`;

    // Civil leaders are standard characters (usually Level 2)
    const leader = new Character(leaderName, leaderHexCode);
    
    // Auto-scale to Level 2 (Section 8.6.2)
    leader.awaken({}, []);
    leader.levelUp("Technique", []);

    return leader;
  }

  /**
   * Compiles a unified National Hex Code from 3 or more founding factions (Layer 5, Section 8.8)
   * @param {Array<Faction>} factions - Array of at least 3 founding factions
   * @returns {Object} Compiling result containing National Hex Code and hierarchy status
   */
  static assembleNationHexCode(factions) {
    if (factions.length < 3) {
      return {
        success: false,
        reason: "A Nation requires a formal union of three or more Factions (Section 8.8.1)."
      };
    }

    // Sort factions descending by level to determine the Trinity of Governance (Section 8.8.3)
    const sortedFactions = [...factions].sort((a, b) => b.level - a.level);

    const goalFaction = sortedFactions[0];    // Highest level (Goal Faction)
    const methodFaction = sortedFactions[1];  // Second pillar (Method Faction)
    const purposeFaction = sortedFactions[2]; // Third pillar (Purpose Faction)

    // Helper to get raw clean hex
    const getCleanHex = (fac) => fac.hexCode.replace("#", "");

    // 1st Digit (Primary Motivation) is inherited from Goal Faction's Goal (Section 8.8.3)
    const nationGoal = getCleanHex(goalFaction)[0];

    // 2nd Digit (Secondary Motivation) is inherited from Method Faction's Goal
    const nationMethod = getCleanHex(methodFaction)[0];

    // 3rd Digit (Tertiary Motivation) is inherited from Purpose Faction's Goal
    const nationPurpose = getCleanHex(purposeFaction)[0];

    // Conflicts and Scope are inherited directly from the Goal Faction (Section 8.8.3)
    const goalFacHex = getCleanHex(goalFaction);
    const nationExtConflict = goalFacHex[3];
    const nationIntConflict = goalFacHex[4];
    const nationScope = goalFacHex[5]; // N, X, or C

    const nationalHexCode = `#${nationGoal}${nationMethod}${nationPurpose}${nationExtConflict}${nationIntConflict}${nationScope}`;

    // Total population is the sum of all members
    const totalPopulation = factions.reduce((sum, fac) => sum + fac.supportedPopulation, 0);

    return {
      success: true,
      nationalHexCode,
      population: totalPopulation,
      governanceTrinity: {
        goalFaction: goalFaction.name,
        methodFaction: methodFaction.name,
        purposeFaction: purposeFaction.name
      }
    };
  }
}

// Step 4.3: The Dynamic Campaign & Node Engine (Appendix H, Part 2)
export class CampaignNode {
  /**
   * Represents an active narrative force/faction in the campaign (Appendix H, Part 3.2)
   * @param {string} id - Unique identifier for the Node (e.g. "VulturesGang")
   * @param {string} title - Human-readable name of the force
   * @param {string} type - "Faction", "Person", "Location", "Event", or "Item"
   * @param {string} hexCode - Faction/Entity's core motivational Hex Code
   */
  constructor(id, title, type, hexCode) {
    this.id = id;
    this.title = title;
    this.type = type;
    this.hexCode = hexCode;
    this.status = "Neutral"; // "Neutral", "Hostile", or "Allied"
    
    // Milestone Progression log (Appendix H, Part 3.2, Section 4)
    this.milestones = []; 
    this.currentMilestoneIndex = 0;
  }

  /**
   * Adds a milestone to the Node's causal timeline
   * @param {number} id - Milestone number/index
   * @param {number} scheduledTick - The campaign tick this event is set to occur
   * @param {string} context - The base objective situation
   * @param {string} perception - How the Node interprets the situation (based on profile)
   * @param {string} motivation - Action taken, driven by their Motivational Profile
   * @param {string} result - The immediate outcome
   */
  addMilestone(id, scheduledTick, context, perception, motivation, result) {
    this.milestones.push({
      id,
      scheduledTick,
      context,
      perception,
      motivation,
      result,
      triggered: false
    });
    // Ensure chronological sorting of milestones
    this.milestones.sort((a, b) => a.scheduledTick - b.scheduledTick);
  }
}

export class CampaignTimelineEngine {
  constructor() {
    this.currentTick = 1; // Master Campaign Timeline Clock (Appendix H, Section 1.0)
    this.nodes = [];      // Tracked active Campaign Nodes (Factions/Threats)
  }

  registerNode(node) {
    this.nodes.push(node);
  }

  /**
   * Advances the master Campaign Timeline Clock by 1 Tick (Appendix H, Section 1.0)
   * Evaluates if any active Nodes have milestones scheduled for the new Tick.
   * @returns {Array<Object>} Triggered milestones with narrative parameters
   */
  advanceTimeline() {
    this.currentTick += 1;
    const triggeredEvents = [];

    this.nodes.forEach(node => {
      node.milestones.forEach(milestone => {
        if (!milestone.triggered && milestone.scheduledTick === this.currentTick) {
          milestone.triggered = true;
          triggeredEvents.push({
            nodeId: node.id,
            nodeTitle: node.title,
            milestoneId: milestone.id,
            context: milestone.context,
            perception: milestone.perception,
            motivation: milestone.motivation,
            result: milestone.result
          });
        }
      });
    });

    return triggeredEvents;
  }

  /**
   * Applies the programmatic consequences of an Episode outcome on a Node (Appendix H, Section 3.1)
   * @param {string} nodeId - Target Node ID
   * @param {string} consequence - "accelerate" (earlier), "delay" (later), or "remove" (wipe)
   * @returns {Object} Progress report
   */
  applyEpisodeConsequence(nodeId, consequence) {
    const node = this.nodes.find(n => n.id === nodeId);
    if (!node) return { success: false, reason: "Node not found." };

    const cleanConsequence = consequence.toLowerCase();

    if (cleanConsequence === "accelerate") {
      // Moves future milestones 1 Tick earlier (Success for the Node)
      node.milestones.forEach(m => {
        if (!m.triggered) {
          m.scheduledTick = Math.max(this.currentTick, m.scheduledTick - 1);
        }
      });
      return { success: true, summary: `Consequence [Accelerate] applied to ${node.title}. Future milestones shifted 1 Tick earlier.` };
    }

    if (cleanConsequence === "delay") {
      // Moves future milestones 1 Tick later (Setback for the Node)
      node.milestones.forEach(m => {
        if (!m.triggered) {
          m.scheduledTick += 1;
        }
      });
      return { success: true, summary: `Consequence [Delay] applied to ${node.title}. Future milestones shifted 1 Tick later.` };
    }

    if (cleanConsequence === "remove") {
      // Wipes out all future milestones entirely (Catastrophic defeat)
      node.milestones = node.milestones.filter(m => m.triggered);
      return { success: true, summary: `Consequence [Remove] applied to ${node.title}. All future milestones have been purged.` };
    }

    return { success: false, reason: "Invalid consequence type." };
  }

  /**
   * Executes a Strategic Intervention Downtime Karma action (Appendix H, Section 3.2)
   * @param {string} nodeId - Target Node ID
   * @param {string} interventionType - "bolster" (earlier) or "sabotage" (later)
   * @returns {Object} Progress report
   */
  executeStrategicIntervention(nodeId, interventionType) {
    const cleanIntervention = interventionType.toLowerCase();

    if (cleanIntervention === "bolster") {
      // Bolster moves the next milestone 1 Tick earlier
      return this.applyEpisodeConsequence(nodeId, "accelerate");
    } else if (cleanIntervention === "sabotage") {
      // Sabotage moves the next milestone 1 Tick later
      return this.applyEpisodeConsequence(nodeId, "delay");
    }

    return { success: false, reason: "Invalid intervention type." };
  }
}