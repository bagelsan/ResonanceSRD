/**
 * PCM-engine.js
 * Source of Truth: Core Tables & Calculations
 * 
 * Implements the tabletop mathematics, core resource trackers,
 * dice rolling mechanics, and entity state models.
 */

// Step 2.0: Core Standard Roll (SR) Dice Engine
export class StandardDiceRoller {
  /**
   * Performs a Standard Roll (SR) with complete chaining logic verbatim to Section 1.0.
   * @param {boolean} hasAdvantage - Apply Advantage (use higher of the final pair).
   * @param {boolean} hasDisadvantage - Apply Disadvantage (use lower of the final pair, check for miss).
   * @returns {Object} Roll Result metadata.
   */
  static roll(hasAdvantage = false, hasDisadvantage = false) {
    let rollsHistory = [];
    let chainSum = 0;
    let isCritical = false;
    let isMiss = false;
    let finalMainDie = 0;
    let finalCritDie = 0;
    let isFirstRoll = true;

    while (true) {
      // Roll 2d10 (1-10)
      const d1 = Math.floor(Math.random() * 10) + 1;
      const d2 = Math.floor(Math.random() * 10) + 1;

      // Check for doubles (matched pair)
      if (d1 === d2) {
        isCritical = true;
        chainSum += (d1 + d2);
        rollsHistory.push({ main: d1, crit: d2, sum: d1 + d2, chained: true });
        isFirstRoll = false;
        // Continue looping (Chaining Doubles rule 1.2)
        continue;
      } else {
        // Resolve non-double final roll
        finalMainDie = d1;
        finalCritDie = d2;

        // Advantage/Disadvantage check (Rule 1.3)
        if (hasAdvantage) {
          finalMainDie = Math.max(d1, d2);
          finalCritDie = Math.min(d1, d2);
        } else if (hasDisadvantage) {
          finalMainDie = Math.min(d1, d2);
          finalCritDie = Math.max(d1, d2);

          // Catastrophic Miss check (Rule 1.6)
          // Miss occurs only if initial roll is made with Disadvantage and the lower of the two dice is a 1.
          if (isFirstRoll && finalMainDie === 1) {
            isMiss = true;
          }
        }

        rollsHistory.push({ main: d1, crit: d2, chosen: finalMainDie, chained: false });
        break;
      }
    }

    // Final standard roll sum calculation
    const finalSR = isMiss ? 0 : (chainSum + finalMainDie);
    const isSuperCritical = finalSR >= 31; // Rule 1.7

    return {
      sr: finalSR,
      isMiss,
      isCritical: isCritical || isSuperCritical,
      isSuperCritical,
      history: rollsHistory,
      summary: isMiss 
        ? "Miss (Fumble)" 
        : `${isSuperCritical ? "Super Critical! " : isCritical ? "Critical! " : ""}SR: ${finalSR}`
    };
  }
}

// Base class for all entities in the Psychromattica universe
export class Entity {
  constructor(name = "Unnamed Entity", level = 0) {
    this.name = name;
    this.level = level;

    // Stat Grid Baseline values (Zone 2)
    this.stats = {
      Range: 1,     // Body Control
      Alacrity: 1,  // Body Execution
      Brawn: 1,     // Body Foundation
      Wit: 1,       // Mind Control
      Expertise: 1, // Mind Execution
      Technique: 1, // Mind Foundation
      Power: 1,     // Essence Control
      Influence: 1, // Essence Execution
      Force: 1      // Essence Foundation
    };

    // Primary Resource Clocks (Zone 3)
    this.clocks = {
      hp: 10,  // Health Points (Physical durability)
      sp: 10,  // Stamina Points (Physical exertion)
      ep: 10   // Energy Points (Inner power)
    };

    this.clocksMax = {
      hp: 10,
      sp: 10,
      ep: 10
    };

    // Tag Pools (Zone 4) - Maximum of 5 of each type (10 total tags)
    this.statusTags = [];
    this.boostTags = [];

    this.conditions = new Set();
    this.keywords = []; // Innate known Keywords
    this.passiveSlots = []; // Active Innate Passive Slot Keywords
    this.gearSlots = []; // Active Gear Passive Slot Keywords
  }

  /**
   * Calculates Passive Resistance (Layer 5, Section 1.4.7)
   * The sum of the three highest core stats.
   * @returns {number} The resistance rating.
   */
  get resistance() {
    const sortedStats = Object.values(this.stats).sort((a, b) => b - a);
    return sortedStats[0] + sortedStats[1] + sortedStats[2];
  }

  // Manage Active Tags limits (Rule 2.1.2)
  addStatusTag(tagName) {
    if (this.statusTags.length >= 5) {
      this.statusTags.shift(); // Remove oldest status tag (Rule 2.1.3)
    }
    this.statusTags.push(tagName);
  }

  addBoostTag(tagName) {
    if (this.boostTags.length >= 5) {
      // Discard or select manually (Default: reject oldest to add new) (Rule 2.1.4)
      this.boostTags.shift();
    }
    this.boostTags.push(tagName);
  }

  removeStatusTag(tagName) {
    const index = this.statusTags.indexOf(tagName);
    if (index > -1) {
      this.statusTags.splice(index, 1);
    }
  }

  removeBoostTag(tagName) {
    const index = this.boostTags.indexOf(tagName);
    if (index > -1) {
      this.boostTags.splice(index, 1);
    }
  }

  addCondition(condition) {
    this.conditions.add(condition);
  }

  removeCondition(condition) {
    this.conditions.delete(condition);
  }

  hasCondition(condition) {
    return this.conditions.has(condition);
  }
}

import { PCM_COLORS, PCM_KEYWORDS_DICTIONARY } from './PCM-definitions.js';

// --- Character Entity Class ---
export class Character extends Entity {
  constructor(name = "Unnamed Character", hexCode = "#32647CN") {
    super(name, 1); // Characters default to Level 1 on awakening
    this.hexCode = hexCode;
    this.profile = null;
    this.flawPackage = null; // { flawCode, compensationCode }
    this.karma = 0;
    
    // Page 2 Attachments
    this.attachedAnimations = [];
    this.attachedItems = [];

    this.recalculateFromProfile();
  }

  /**
   * Recalculates stats and resistance from the 6-character Hex Code (Layer 5, Section 2.2)
   */
  recalculateFromProfile() {
    const cleanHex = this.hexCode.replace("#", "");
    if (cleanHex.length !== 6) return;

    const goal = parseInt(cleanHex[0], 10);
    const method = parseInt(cleanHex[1], 10);
    const purpose = parseInt(cleanHex[2], 10);
    const extConflict = parseInt(cleanHex[3], 10);
    const intConflict = parseInt(cleanHex[4], 10);
    const scope = cleanHex[5];

    this.profile = { goal, method, purpose, externalConflict: extConflict, internalConflict: intConflict, scope };

    // Level 1 Baseline: All nine stats start at 2 (Section 2.2.3)
    const statKeys = ["Range", "Alacrity", "Brawn", "Wit", "Expertise", "Technique", "Power", "Influence", "Force"];
    statKeys.forEach(k => this.stats[k] = 2);

    // Trinity Stat Bonus: +1 to stats associated with Goal, Method, and Purpose (Section 2.2.4)
    const colorToStatMap = {
      1: "Range", 2: "Alacrity", 3: "Brawn", 4: "Wit", 
      5: "Expertise", 6: "Technique", 7: "Power", 8: "Influence", 9: "Force"
    };

    if (colorToStatMap[goal]) this.stats[colorToStatMap[goal]] += 1;
    if (colorToStatMap[method]) this.stats[colorToStatMap[method]] += 1;
    if (colorToStatMap[purpose]) this.stats[colorToStatMap[purpose]] += 1;

    // Apply Flaw Package Bonus Stat Point (Section 3.5.3)
    if (this.flawPackage) {
      const compKw = PCM_KEYWORDS_DICTIONARY[this.flawPackage.compensationCode];
      if (compKw && colorToStatMap[compKw.color]) {
        this.stats[colorToStatMap[compKw.color]] = Math.min(5, this.stats[colorToStatMap[compKw.color]] + 1);
      }
    }

    // Apply Passive Keyword adjustments to Max Clocks (e.g. Resilient 7.1 / Limited 7.0)
    this.clocksMax.hp = 10;
    this.clocksMax.sp = 10;
    this.clocksMax.ep = 10;

    if (this.keywords.includes("7.1")) { // Resilient: +5 Max HP
      this.clocksMax.hp += 5;
    }
    if (this.keywords.includes("7.0")) { // Limited: -5 Max HP
      this.clocksMax.hp -= 5;
    }

    // Bind current resource values to new maximum boundaries
    this.clocks.hp = Math.min(this.clocksMax.hp, this.clocks.hp);
    this.clocks.sp = Math.min(this.clocksMax.sp, this.clocks.sp);
    this.clocks.ep = Math.min(this.clocksMax.ep, this.clocks.ep);
  }
}

// --- Animation Entity Class ---
export class Animation extends Entity {
  constructor(name = "Unnamed Drone") {
    super(name, 0); // Animations begin at Level 0 (Layer 5, Section 4.1)
    this.isMinion = false;
  }

  /**
   * Automatically scales stats and keywords for leveling (Layer 5, Section 4.4)
   */
  levelUpAnimation(statsToIncrease = [], newKeyword = null) {
    this.level += 1;
    
    // Budget: 2 stats and 1 keyword per level
    statsToIncrease.forEach(statName => {
      if (this.stats[statName] !== undefined) {
        this.stats[statName] = Math.min(5, this.stats[statName] + 1);
      }
    });

    if (newKeyword) {
      this.keywords.push(newKeyword);
    }
  }
}

// --- Item / Gear Entity Class ---
export class Item {
  constructor(name = "Mundane Item", level = 0) {
    this.name = name;
    this.level = level;
    this.durability = 2; // Durability Clock starts at 2 (Layer 5, Section 6.7)
    this.keywords = [];
  }

  get isBroken() {
    return this.durability === 1;
  }

  get isDestroyed() {
    return this.durability === 0;
  }

  damageItem() {
    this.durability = Math.max(0, this.durability - 1);
  }

  repairItem() {
    this.durability = 2;
  }

  addKeyword(keywordCode) {
    if (!this.keywords.includes(keywordCode)) {
      this.keywords.push(keywordCode);
    }
  }
}

// --- Faction Entity Class ---
export class Faction {
  constructor(name = "Unnamed Faction", hexCode = "#333333N") {
    this.name = name;
    this.hexCode = hexCode;
    this.level = 0;
    this.civilSystems = [];
    this.keywords = [];
  }

  /**
   * Approximates supported population based on exponential scaling (Layer 5, Section 8.6.1)
   */
  get supportedPopulation() {
    if (this.level <= 5) {
      return Math.pow(10, this.level);
    }
    // Scale increases by 250k per level above 5
    return 100000 + ((this.level - 5) * 250000);
  }
}

// --- Unified Ecosystem & Build String Parser ---
export class PsychromatticaParser {
  /**
   * Parses Unified Build Strings verbatim to Appendix I, Section 1.0 - 1.8
   * Handles C: character structures, @ attachments, and / sub-structures.
   * @param {string} str - Unified Build String (e.g. "C:#32647CN-!03-11.12.13")
   * @returns {Array<Entity>} Extracted, parsed entities list
   */
  static parse(str) {
    const ecosystems = [];
    const parts = str.split(';');

    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;

      const attachments = trimmed.split('@');
      let rootEntity = null;

      for (let i = 0; i < attachments.length; i++) {
        const attachNode = attachments[i].trim();
        if (!attachNode) continue;

        const prefix = attachNode.substring(0, 2); // "C:", "A:", "I:", "F:"
        const content = attachNode.substring(2);

        if (prefix === "C:") {
          const char = this.parseCharacter(content);
          if (i === 0) rootEntity = char;
        } else if (prefix === "A:") {
          const anim = this.parseAnimation(content);
          if (rootEntity && rootEntity instanceof Character) {
            rootEntity.attachedAnimations.push(anim);
          }
        } else if (prefix === "I:") {
          const item = this.parseItem(content);
          if (rootEntity && rootEntity instanceof Character) {
            rootEntity.attachedItems.push(item);
          }
        }
      }

      if (rootEntity) {
        ecosystems.push(rootEntity);
      }
    }

    return ecosystems;
  }

  static parseCharacter(content) {
    // Format: #[HexCode][+####]-##-##.##.##
    const segments = content.split('-');
    const header = segments[0];

    const hexMatch = header.match(/#([0-9]{5}[NXC])/);
    const hexCode = hexMatch ? `#${hexMatch[1]}` : "#222222N";

    const char = new Character("Awakened Subject", hexCode);

    // Parse Flaw Package (+####)
    const flawMatch = header.match(/\+([0-9]{4})/);
    if (flawMatch) {
      const fVal = flawMatch[1];
      const flawCode = `${fVal[0]}.${fVal[1]}`;
      const compCode = `${fVal[2]}.${fVal[3]}`;
      char.flawPackage = { flawCode, compensationCode: compCode };
      char.keywords.push(flawCode);
    }

    // Parse Seed Keyword (Segment 1)
    if (segments.length > 1) {
      let seedCode = segments[1];
      let isPassive = false;
      if (seedCode.startsWith('!')) {
        isPassive = true;
        seedCode = seedCode.substring(1);
      }
      if (seedCode.length === 2) {
        const formattedSeed = `${seedCode[0]}.${seedCode[1]}`;
        char.keywords.push(formattedSeed);
        if (isPassive) char.passiveSlots.push(formattedSeed);
      }
    }

    // Parse Awakening Keywords (Segment 2)
    if (segments.length > 2) {
      const awkList = segments[2].split('.');
      awkList.forEach(code => {
        if (code.length === 2) {
          char.keywords.push(`${code[0]}.${code[1]}`);
        }
      });
    }

    char.recalculateFromProfile();
    return char;
  }

  static parseAnimation(content) {
    const segments = content.split('-');
    const anim = new Animation("Tactical Companion");
    
    if (segments.length > 0) {
      let seed = segments[0];
      if (seed.length === 2) anim.keywords.push(`${seed[0]}.${seed[1]}`);
    }
    return anim;
  }

  static parseItem(content) {
    // Format: L#[-####]-##.##
    const segments = content.split('-');
    const lvlMatch = segments[0].match(/L([0-9])/);
    const level = lvlMatch ? parseInt(lvlMatch[1], 10) : 1;

    const item = new Item("Synthesized Gear", level);

    if (segments.length > 1) {
      const kws = segments[1].split('.');
      kws.forEach(code => {
        if (code.length === 2) {
          item.addKeyword(`${code[0]}.${code[1]}`);
        }
      });
    }
    return item;
  }
}