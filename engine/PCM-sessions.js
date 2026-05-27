/**
 * PCM-session.js
 * Source of Truth: Active Session & Campaign State Management
 * 
 * Implements the card-based Priority turn tracker, active action economy,
 * and hidden trackers (Resonance, Discordance) utilized by the Curator.
 */

// Step 5.0: The Card-Based Initiative Priority Engine (Layer 1, Section 5.0)
export class InitiativeDeck {
  constructor() {
    this.deck = [];         // Remaining undrawn participant cards
    this.discard = [];      // Discarded cards
    this.activeCard = null; // The participant who currently has priority
    this.actionPools = {};  // Map of participant IDs to remaining actions for the round
    this.participants = []; // Static list of active participants
  }

  /**
   * Initializes the Initiative deck for a new situation (Layer 1, Section 5.1)
   * @param {Array<Object>} participants - List of participants { id, name, alacrity }
   */
  setupSituation(participants) {
    this.participants = [...participants];
    this.deck = [...participants];
    this.discard = [];
    this.activeCard = null;
    this.actionPools = {};

    // Initialize action pools based on Alacrity scores (Section 5.4)
    participants.forEach(p => {
      this.actionPools[p.id] = p.alacrity || 2;
    });

    this.shuffle(this.deck);
  }

  /**
   * Fisher-Yates Shuffle Algorithm (Layer 6 utility)
   * @param {Array} array - Target array to shuffle in-place
   */
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  /**
   * Draws the next participant from the top of the deck (Layer 1, Section 5.2)
   * If the deck is empty, automatically triggers a new round.
   * @returns {Object|null} Active participant metadata
   */
  drawNext() {
    // If there is currently an active card, move it to the discard pile (Section 5.2)
    if (this.activeCard) {
      this.discard.push(this.activeCard);
      this.activeCard = null;
    }

    // Check if a new round is triggered (deck is empty) (Section 5.3)
    if (this.deck.length === 0) {
      if (this.discard.length === 0) return null; // No survivors remaining

      // Collect discarded cards, shuffle, and reset active action pools (Section 5.3 - 5.4)
      this.deck = [...this.discard];
      this.discard = [];
      this.shuffle(this.deck);

      // Refresh action pools (Section 5.4)
      this.participants.forEach(p => {
        this.actionPools[p.id] = p.alacrity || 2;
      });
    }

    // Draw the top card
    this.activeCard = this.deck.shift();
    return this.activeCard;
  }

  /**
   * Performs the Pass action, shifting Priority (Layer 1, Section 5.4.2)
   * Shuffles active card to the bottom of the deck if they have actions remaining.
   * @returns {Object|null} The newly active participant
   */
  passActive() {
    if (!this.activeCard) return null;

    const activeId = this.activeCard.id;
    const remainingActions = this.actionPools[activeId] || 0;

    // Check if they are allowed to pass (must have actions and cannot be the last card)
    if (remainingActions > 0 && this.deck.length > 0) {
      // Move active card to the bottom of the undrawn deck
      const passedCard = this.activeCard;
      this.deck.push(passedCard);
      this.activeCard = null;

      // Immediately draw the next card
      return this.drawNext();
    } else {
      // If zero actions remain, discard card as normal and draw next
      return this.drawNext();
    }
  }

  /**
   * Seizes priority immediately, ending the current active turn (Layer 1, Section 5.4.3)
   * @param {string} interrupterId - ID of the interrupting participant
   * @returns {boolean} True if the priority was successfully seized
   */
  interrupt(interrupterId) {
    // End the current active turn. Current card is placed back on top of the initiative deck (Section 5.4.3)
    if (this.activeCard) {
      const suspendedCard = this.activeCard;
      this.deck.unshift(suspendedCard);
      this.activeCard = null;
    }

    // Search for the interrupter's card in either deck or discard
    let interrupterCard = null;
    let foundIndex = this.deck.findIndex(p => p.id === interrupterId);

    if (foundIndex > -1) {
      interrupterCard = this.deck.splice(foundIndex, 1)[0];
    } else {
      foundIndex = this.discard.findIndex(p => p.id === interrupterId);
      if (foundIndex > -1) {
        interrupterCard = this.discard.splice(foundIndex, 1)[0];
      }
    }

    if (!interrupterCard) return false;

    // Set interrupter as the active character
    this.activeCard = interrupterCard;
    return true;
  }

  /**
   * Inserts a new participant mid-round (Layer 1, Section 5.5)
   * Shuffles the card into the remaining, undrawn portion of the deck.
   * @param {Object} participant - Participant card metadata
   */
  addParticipantMidRound(participant) {
    this.participants.push(participant);
    this.actionPools[participant.id] = participant.alacrity || 2;
    
    // Shuffle directly into the remaining undrawn portion of the deck
    this.deck.push(participant);
    this.shuffle(this.deck);
  }

  /**
   * Deducts an action from a participant's remaining round pool
   * @param {string} participantId - Target ID
   * @param {number} count - Number of actions to deduct
   */
  spendActions(participantId, count = 1) {
    if (this.actionPools[participantId] !== undefined) {
      this.actionPools[participantId] = Math.max(0, this.actionPools[participantId] - count);
    }
  }
}

// Step 5.1: The Resonance Tracker (Layer 5, Section 10.0)
export class ResonanceTracker {
  constructor() {
    this._points = 0; // Resonance is a hidden metric tracked exclusively by the Curator (Section 10.5)
  }

  // Hidden getter to prevent accidental player disclosure
  get points() {
    return this._points;
  }

  /**
   * Generates 1 point of Resonance from Tri-Axial introspection (Layer 5, Section 10.2)
   * @param {string} axis - "X" (Source), "Y" (Context), or "Z" (Scope)
   */
  generateResonance(axis) {
    if (["X", "Y", "Z"].includes(axis.toUpperCase())) {
      this._points += 1;
      return {
        success: true,
        axisPassed: axis.toUpperCase(),
        narrativeCue: "Cognitive Consolidation: The character aligns closer with their inner self."
      };
    }
    return { success: false, reason: "Invalid axis registry." };
  }

  /**
   * Expends accumulated Resonance to trigger a mechanical miracle (Layer 5, Section 10.4)
   * @param {string} method - "advantage" (1pt), "eureka" (2pt), or "harmonic" (3pt)
   * @returns {Object} Resolution payload detailing the narrative miracle
   */
  expend(method) {
    const cleanMethod = method.toLowerCase();

    if (cleanMethod === "advantage") {
      if (this._points >= 1) {
        this._points -= 1;
        return {
          success: true,
          pointsRemaining: this._points,
          effect: "The Resonant Advantage",
          cost: 1,
          benefit: "Converts a catastrophic failure into narrow success, or grants Advantage to an important roll.",
          narrativeJustification: "Internal alignment grants a moment of clarity. This allows the character to avoid a fatal blow or notice a hidden flaw in an opponent's stance."
        };
      }
      return { success: false, reason: "Insufficient Resonance points (Requires 1)." };
    }

    if (cleanMethod === "eureka") {
      if (this._points >= 2) {
        this._points -= 2;
        return {
          success: true,
          pointsRemaining: this._points,
          effect: "The Psychromattic Eureka",
          cost: 2,
          benefit: "Grants Advantage on high-stakes roll, or instantly clears a Stress Segment.",
          narrativeJustification: "A synthesis of past lessons allows the character to bypass a mental block or perform a feat of skill beyond their current level."
        };
      }
      return { success: false, reason: "Insufficient Resonance points (Requires 2)." };
    }

    if (cleanMethod === "harmonic") {
      if (this._points >= 3) {
        this._points -= 3;
        return {
          success: true,
          pointsRemaining: this._points,
          effect: "The Environmental Harmonic",
          cost: 3,
          benefit: "Triggers a favorable physical or situational change in the surrounding environment.",
          narrativeJustification: "The character is in alignment with the context of the world. Their presence exerts a stabilizing influence on the potential outcomes around them."
        };
      }
      return { success: false, reason: "Insufficient Resonance points (Requires 3)." };
    }

    return { success: false, reason: "Invalid expenditure method." };
  }
}

// Step 5.2: The Discordance Tracker (Layer 5, Section 11.0)
export class DiscordanceTracker {
  constructor() {
    this._clock = 0; // Hidden 10-segment clock tracked exclusively by the Curator (Section 11.3)
  }

  // Hidden getter
  get clock() {
    return this._clock;
  }

  /**
   * Adds points to the hidden Discordance clock (Layer 5, Section 11.2 - 11.4)
   * Triggers a Schism automatically if the clock reaches its 10-segment capacity.
   * @param {number} amount - Points of Discordance generated
   * @returns {Object} Tracking status and Schism events
   */
  addDiscordance(amount = 1) {
    this._clock += amount;
    
    let triggerSchism = false;
    if (this._clock >= 10) {
      triggerSchism = true;
      this._clock = 0; // Clock resets to zero on Schism (Section 11.3)
    }

    return {
      currentSegments: this._clock,
      schismTriggered: triggerSchism,
      narrativeStatus: triggerSchism 
        ? "The alignment ruptures! A Milestone Schism occurs." 
        : `Dissonance shifts. Clock is now at ${this._clock}/10 segments.`,
      complicationCues: triggerSchism ? {
        nodeAcceleration: "The closest opposing node immediately advances to its next Milestone.",
        actionableComplication: "An immediate complication enters the active scene: an Entity, a Barrier, or a Puzzle (Section 11.5)."
      } : null
    };
  }

  /**
   * Resets the clock to zero at Episode conclusion (Layer 5, Section 11.3)
   */
  resetEpisode() {
    this._clock = 0;
  }
}

// Step 5.3: The Social Challenge Parameter Calculator (Layer 2, Section 5.2)
export class SocialChallengeCalculator {
  /**
   * Translates social contexts into mechanical limits verbatim to Section 5.2
   * @param {string} factionTrust - "ally", "neutral", or "enemy"
   * @param {string} characterTrust - "trusting", "neutral", or "doubting"
   * @param {string} tension - "calm", "neutral", or "tense"
   * @returns {Object} Compiled parameters { advantageOption, tn, clockSize }
   */
  static calculateParameters(factionTrust, characterTrust, tension) {
    const cleanFaction = factionTrust.toLowerCase();
    const cleanChar = characterTrust.toLowerCase();
    const cleanTension = tension.toLowerCase();

    // 1. Faction Trust determines roll modifiers (Section 5.2.1)
    let hasAdvantage = false;
    let hasDisadvantage = false;

    if (cleanFaction === "ally") {
      hasAdvantage = true;
    } else if (cleanFaction === "enemy") {
      hasDisadvantage = true;
    }

    // 2. Character Trust determines the Target Number (Section 5.2.2)
    let tn = 8; // Default Neutral
    if (cleanChar === "trusting") {
      tn = 5;
    } else if (cleanChar === "doubting") {
      tn = 12;
    }

    // 3. Tension determines the Task Clock size (Section 5.2.3)
    let clockSize = 5; // Default Neutral
    if (cleanTension === "calm") {
      clockSize = 3;
    } else if (cleanTension === "tense") {
      clockSize = 10;
    }

    return {
      rollOptions: { hasAdvantage, hasDisadvantage },
      tn,
      clockSize,
      summary: `Social Effort Check: Roll TN ${tn} against a ${clockSize}-segment Clock. Roll has ${hasAdvantage ? "Advantage" : hasDisadvantage ? "Disadvantage" : "no modifications"}.`
    };
  }
}

// Step 5.4: The Emergency Resuscitation Calculator (Layer 2, Section 7.3.2)
export class ResuscitationCalculator {
  /**
   * Calculates the Target Number (TN) for the Resuscitation roll (Section 7.3.2)
   * Formula: Target's Maximum HP + Number of rounds they have been dead.
   * @param {number} targetMaxHP - The dead character's maximum HP limit
   * @param {number} roundsSpentDead - Rounds passed since character died
   * @returns {number} The required TN
   */
  static getTargetNumber(targetMaxHP, roundsSpentDead) {
    return targetMaxHP + roundsSpentDead;
  }

  /**
   * Evaluates an Emergency Care Resuscitation attempt (Layer 2, Section 7.3.2)
   * @param {Object} actor - The character attempting resuscitation
   * @param {Object} target - The dead character
   * @param {number} roundsSpentDead - Rounds passed since death occurred
   * @param {number} standardRollResult - The raw SR result of the attempt
   * @returns {Object} Attempt results detailing success/failure state
   */
  static attemptResuscitation(actor, target, roundsSpentDead, standardRollResult) {
    const tn = this.getTargetNumber(target.clocksMax.hp, roundsSpentDead);
    
    // The roll is made as a standard roll (SR) + The acting character's Level (Section 7.3.2)
    const effortResult = standardRollResult + actor.level;

    // Strict comparison: Effort must be strictly greater than target TN
    const isSuccessful = effortResult > tn;

    if (isSuccessful) {
      // A successful roll results in an alive but still Downed Character with all clocks set to 0
      target.clocks.hp = 0;
      target.clocks.sp = 0;
      target.clocks.ep = 0;
      target.removeCondition("Dead");
      target.addCondition("Unconscious"); // Returns to downed/unconscious state

      return {
        success: true,
        tn,
        rollEffort: effortResult,
        targetState: "Alive (Downed)",
        summary: "Resuscitation Successful! Target is alive but remains unconscious at 0 HP. Avoid further damage."
      };
    } else {
      // A failed roll results in the character requiring Downtime to be resurrected
      return {
        success: false,
        tn,
        rollEffort: effortResult,
        targetState: "Dead (Irreversible outside Downtime)",
        summary: "Resuscitation Failed. The spark cannot be restored within this Scene. Character requires Downtime to revive."
      };
    }
  }
}

// Step 5.5: The Roguelite Run Engine (Appendix G - The Archive)
export class ArchiveRunManager {
  constructor() {
    this.masterEpisodeClock = 20; // The master run clock (Appendix G, Section 2.1)
    this.completedScenesCount = 0; // Tally of cleared data sectors (Section 3.2)
    this.episodeMastered = false;
    this.episodeFailed = false;
  }

  /**
   * Initializes a new Integrity Agent run into the Archive (Appendix G, Section 1.0)
   */
  startEpisode() {
    this.masterEpisodeClock = 20;
    this.completedScenesCount = 0;
    this.episodeMastered = false;
    this.episodeFailed = false;

    return {
      started: true,
      masterEpisodeClock: this.masterEpisodeClock,
      completedScenesCount: this.completedScenesCount,
      summary: "Episode Initialized. Entering system directory..."
    };
  }

  /**
   * Increments the cleared scene tally upon resolving a Situation Clock (Appendix G, Section 2.2)
   */
  clearScene() {
    this.completedScenesCount += 1;
    return this.completedScenesCount;
  }

  /**
   * Executes the crucial Link-Space Stability Check to deplete the Master Clock (Appendix G, Section 3.2)
   * @param {number} standardRollResult - The raw SR result of the group roll
   * @param {boolean} useKarmaOverride - If true, spends 1 Karma to guarantee safety
   * @returns {Object} Stability results payload
   */
  executeStabilityCheck(standardRollResult, useKarmaOverride = false) {
    if (this.episodeFailed || this.episodeMastered) {
      return { success: false, reason: "Episode is already closed." };
    }

    // Target Number is equal to the number of completed scenes in the run (Section 3.2)
    const tn = this.completedScenesCount;

    // A) Karma Override Option (Appendix G, Section 4.2)
    if (useKarmaOverride) {
      // Prevents failure but does not deplete the Master Episode Clock
      return {
        success: true,
        useKarmaOverride: true,
        depletion: 0,
        masterEpisodeClock: this.masterEpisodeClock,
        mastered: false,
        summary: "Karma Override Spent. Connection declared stable automatically. Master Clock remains unchanged (0 depletion)."
      };
    }

    // B) Standard Stability Check Roll
    // Success: SR is strictly greater than the TN (SR > TN) (Section 3.2)
    const isStable = standardRollResult > tn;

    if (isStable) {
      // Depletes the Master Episode Clock by the positive difference (SR - TN) (Section 3.2)
      const depletion = standardRollResult - tn;
      this.masterEpisodeClock = Math.max(0, this.masterEpisodeClock - depletion);

      // Check for Mastered state (Master Clock reached 0) (Section 3.3)
      if (this.masterEpisodeClock === 0) {
        this.episodeMastered = true;
      }

      return {
        success: true,
        rollResult: standardRollResult,
        tnTarget: tn,
        depletion,
        masterEpisodeClock: this.masterEpisodeClock,
        mastered: this.episodeMastered,
        summary: this.episodeMastered
          ? "Mastery achieved! Master Episode Clock reduced to 0. Retrieve permanent keyword integration reward."
          : `Stability Check Succeeded! Depleted Master Clock by ${depletion}. ${this.masterEpisodeClock} segments remaining.`
      };
    } else {
      // Failure (SR <= TN): The connection is lost. Run ends in emergency reboot (Section 3.2)
      this.episodeFailed = true;

      return {
        success: false,
        failed: true,
        rollResult: standardRollResult,
        tnTarget: tn,
        summary: "Emergency Reboot! Stability Check Failed (SR <= TN). Agent connection severed. Resetting sector directory..."
      };
    }
  }

  /**
   * Helper to handle static Karma costs for Link-Space options (Appendix G, Section 4.2)
   * @param {string} option - "override" (1pt), "theme" (1pt), or "type" (3pt)
   * @returns {Object} Transaction receipt
   */
  purchaseLinkSpaceOption(option) {
    const cleanOption = option.toLowerCase();
    
    let cost = 0;
    let description = "";

    if (cleanOption === "override") {
      cost = 1;
      description = "Karma Override: Spend 1 Karma to declare upcoming Stability Check an automatic success.";
    } else if (cleanOption === "theme") {
      cost = 1;
      description = "Architect Run (Theme): Dictate the next Scene's Theme Color or Category.";
    } else if (cleanOption === "type") {
      cost = 3;
      description = "Architect Run (Type): Dictate the next Scene's Type (force a Puzzle or Boss Situation).";
    } else {
      return { success: false, reason: "Invalid Link-Space option." };
    }

    return {
      success: true,
      cost,
      optionSelected: option,
      description
    };
  }
}