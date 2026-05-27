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