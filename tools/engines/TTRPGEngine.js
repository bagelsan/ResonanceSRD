/**
 * PSYCHROMATTICA: TTRPGEngine.js
 * VERSION: 1.1 (FINAL AUDITED)
 * ROLE: The Core Scale Logic (Master SRD Referee)
 * 
 * DESCRIPTION:
 * Processes all TTRPG-scale actions. Handles 2d10 chaining math, 
 * the complete Action Catalog, Clocks, Tags, Karma contexts, 
 * Curator Resonance interventions, and Discordance Schism generation.
 * PURE FUNCTIONALITY: Returns a "Result Payload" to the Controller.
 */

export const TTRPGEngine = {

    /**
     * THE MASTER ROUTER
     * @param {string} actionCategory - e.g., 'ACTIVATE', 'EFFORT', 'SETUP', 'KARMA', etc.
     * @param {Object} payload - Details (stats used, target, keywords applied)
     * @param {Object} state - The current game state from PsychroState
     * @returns {Object} result - The calculations and state mutations to apply
     */
    process(actionCategory, payload, state) {
        let result = {
            success: false,
            logs:[],
            mutations: {} // Changes to apply to the state
        };

        switch (actionCategory) {
            case 'ACTIVATE':
                result = this.actions.executeActivate(payload, state, result);
                break;
            case 'EFFORT':
                result = this.actions.executeEffort(payload, state, result);
                break;
            case 'MANEUVER':
                result = this.actions.executeManeuver(payload, state, result);
                break;
            case 'SETUP':
                result = this.actions.executeSetup(payload, state, result);
                break;
            case 'REACTION':
                result = this.actions.executeReaction(payload, state, result);
                break;
            case 'KARMA':
                result = this.actions.executeKarma(payload, state, result);
                break;
            case 'CURATOR_INTERVENTION':
                result = this.actions.executeResonance(payload, state, result);
                break;
            default:
                result.logs.push(`Unknown Action Category: ${actionCategory}`);
        }

        return result;
    },

    // =======================================================================
    // 1. THE ACTION CATALOG (LAYER 2 & 3 RULES)
    // =======================================================================
    
    actions: {
        /**
         * ACTIVATE: The primary action for causing an effect vs Entities.
         */
        executeActivate(payload, state, result) {
            const { 
                actor, target, chosenStat, appliedKeywords =[], 
                isCalledShot, isRush, isBlitz, isSlam, 
                isStressRoll, targetStressKeyword 
            } = payload;
            
            // 1. Action Modifiers (Apply Disadvantage as per Layer 2 Rules)
            if (isCalledShot || isRush || isBlitz || isSlam) {
                payload.disadvantage = true; 
                result.logs.push("Action Modifier applied: Roll suffers Disadvantage.");
            }

            // 2. Calculate EP Cost (1 per Keyword, reduced by Power stat)
            const rawCost = appliedKeywords.length;
            const powerStat = actor.stats.P || 1;
            const finalEpCost = Math.max(0, rawCost - powerStat);

            if (actor.resources.ep < finalEpCost) {
                result.logs.push(`Action Failed: Insufficient Energy. Need ${finalEpCost} EP.`);
                return result;
            }

            // --- AUDIT PATCH: DISCORDANCE GENERATION CHECK (Section 11.2) ---
            const flawCompCode = state.parsedEntity?.flaw?.compensation?.code;
            if (flawCompCode && appliedKeywords.includes(flawCompCode)) {
                result.mutations.discordanceDelta = 1;
                result.logs.push("WARNING: Flaw Compensation Keyword utilized. Discordance increased by 1.");
            }

            // 3. Roll Dice & Calculate EV
            const roll = TTRPGEngine.math.rollStandard(payload.advantage, payload.disadvantage);
            if (roll.isMiss) {
                result.logs.push("Catastrophic Miss! Action fails completely.");
                result.mutations.epDelta = -finalEpCost;
                return result;
            }

            const statValue = actor.stats[chosenStat] || 1;
            let ev = roll.total + actor.level + statValue;

            // Apply specific EV modifications from Action Modifiers
            if (isSlam) {
                ev += statValue;
                result.logs.push("Slam Maneuver: Stat added to EV an additional time.");
            }
            
            // 4. Compare to Resistance
            const targetResistance = TTRPGEngine.math.calculateResistance(target);
            let damage = ev - targetResistance;

            result.logs.push(`Rolled ${roll.total}. EV is ${ev} vs Resistance ${targetResistance}.`);

            // 5. Output Mutations
            result.mutations.epDelta = -finalEpCost;

            if (damage > 0) {
                result.success = true;
                
                // Action Modifier special damage rules
                if (isCalledShot) {
                    if (payload.targetIsItem) {
                        result.mutations.itemDurabilityLoss = 1;
                        damage = 0; // Bypasses HP
                        result.logs.push("Called Shot on Item: Item loses 1 Durability.");
                    } else {
                        result.mutations.isCritical = true; // Auto-crit vs entities
                        result.logs.push("Called Shot on Entity: Automatic Critical Hit.");
                    }
                }
                
                if (damage > 0) {
                    result.mutations.targetDamage = damage;
                    result.logs.push(`Success! Dealt ${damage} damage.`);
                }
            } else {
                result.logs.push("Effect failed to overcome Resistance.");
            }

            // Post-Damage specific mutations
            if (isRush) result.mutations.grantFreeMove = true;
            if (isBlitz) result.mutations.grantSecondActivation = true;

            // 6. The Stress Roll (Layer 5, 2.5)
            if (isStressRoll && targetStressKeyword) {
                const wit = actor.stats.W || 1;
                const stressResult = roll.total + wit; // SR + Wit
                const knownKWs = (actor.learnedKeywords || []).length + (actor.passiveKeywords ||[]).length + 1; // +1 for Seed
                
                if (stressResult > knownKWs) {
                    result.mutations.learnKeyword = targetStressKeyword;
                    result.logs.push(`STRESS ROLL SUCCESS! (${stressResult} > ${knownKWs}). Learned ${targetStressKeyword}.`);
                } else {
                    result.logs.push(`Stress Roll Failed (${stressResult} <= ${knownKWs}).`);
                }
            }

            // Append Critical data if applicable
            if (roll.isCritical) result.mutations.isCritical = true;
            if (roll.isSuperCritical) result.mutations.isSuperCritical = true;

            return result;
        },

        /**
         * EFFORT ROLL: Non-conflict challenges (Barriers, Puzzles, Social)
         */
        executeEffort(payload, state, result) {
            const { actor, challenge, chosenStat, isSocial } = payload;
            
            // --- AUDIT PATCH: Social Effort Context Modifiers ---
            if (isSocial) {
                // Trust sets Advantage/Disadvantage
                if (payload.factionTrust === 'ALLY') payload.advantage = true;
                if (payload.factionTrust === 'ENEMY') payload.disadvantage = true;
                
                // Character Trust sets the TN
                let socialTN = 8; // Neutral
                if (payload.characterTrust === 'TRUSTING') socialTN = 5;
                if (payload.characterTrust === 'DOUBTING') socialTN = 12;
                challenge.targetNumber = socialTN;
                
                result.logs.push(`Social Effort parameters applied: TN set to ${socialTN}.`);
            }

            const roll = TTRPGEngine.math.rollStandard(payload.advantage, payload.disadvantage);
            if (roll.isMiss) {
                result.logs.push("Miss! Effort fails.");
                return result;
            }

            const statValue = actor.stats[chosenStat] || 1;
            const er = roll.total + actor.level + statValue;
            const progress = er - challenge.targetNumber;

            result.logs.push(`Effort Roll: ER ${er} vs TN ${challenge.targetNumber}.`);

            if (progress > 0) {
                result.success = true;
                result.mutations.clockDepletion = progress;
                result.logs.push(`Success! Clock reduced by ${progress}.`);
                
                // Check if it's a Race Situation (Layer 4)
                if (state.world && state.world.isRaceSituation) {
                    result.mutations.threatClockDelta = -1; // Effort rolls tick the threat clock
                    result.logs.push("Race Situation: Threat Clock depleted by 1 due to Effort expenditure.");
                }
            } else {
                result.logs.push("Effort failed to exceed the Target Number.");
            }
            return result;
        },

        /**
         * MANEUVERS: Tactical actions focused on battlefield control. Cost 1 SP.
         */
        executeManeuver(payload, state, result) {
            const { actor, target, maneuverType, chosenStat } = payload;

            if (actor.resources.sp < 1) {
                result.logs.push(`Maneuver Failed: Exhausted (0 SP).`);
                return result;
            }
            result.mutations.spDelta = -1;

            const roll = TTRPGEngine.math.rollStandard(payload.advantage, payload.disadvantage);
            if (roll.isMiss) {
                result.logs.push("Miss! Maneuver fails.");
                return result;
            }

            const ev = roll.total + actor.level + (actor.stats[chosenStat] || 1);
            const rv = TTRPGEngine.math.calculateResistance(target);

            result.logs.push(`Maneuver [${maneuverType}] EV: ${ev} vs RV: ${rv}.`);

            switch(maneuverType) {
                case 'SHOVE':
                    if (ev > rv) {
                        result.mutations.targetCondition = 'PRONE';
                        result.logs.push("Shove successful. Target knocked Prone/Pushed.");
                        result.success = true;
                    }
                    break;
                case 'DISARM':
                    if (ev > rv) {
                        result.mutations.targetDisarmed = true;
                        result.logs.push("Disarm successful. Target dropped item.");
                        result.success = true;
                    }
                    break;
                case 'RESTRAIN':
                    if (ev > rv) {
                        result.mutations.applyTagsToTarget = { 'BIND': 1 };
                        result.logs.push("Restrain successful. Target gains Bind Tag.");
                        result.success = true;
                    }
                    break;
                case 'LOCK_ON':
                    result.mutations.applyConditionToActor = 'VULNERABLE';
                    result.mutations.applyConditionToTarget = 'LOCKED';
                    result.logs.push("Lock On applied. Both entities gain Advantage vs each other.");
                    result.success = true;
                    break;
                case 'TAUNT':
                    if (ev > rv) {
                        result.mutations.applyConditionToTarget = 'TAUNTED';
                        result.logs.push("Taunt successful. Target must target Actor.");
                        result.success = true;
                    }
                    break;
                case 'IMPROVISE':
                    if (ev > rv) {
                        result.mutations.applyTagsToTarget = payload.improvisedTag ? { [payload.improvisedTag]: 1 } : { 'DAZE': 1 };
                        result.logs.push(`Improvise successful. Applied ${payload.improvisedTag || 'DAZE'} Tag.`);
                        result.success = true;
                    }
                    break;
                case 'FEINT':
                    if (ev > rv) {
                        result.mutations.applyConditionToTarget = 'EXPOSED';
                        result.logs.push("Feint successful. Target is Exposed.");
                        result.success = true;
                    }
                    break;
            }
            return result;
        },

        /**
         * SETUP ACTIONS: Consumes turn to prepare. Cost 1 SP.
         */
        executeSetup(payload, state, result) {
            const { actor, setupType } = payload;
            
            if (actor.resources.sp < 1) {
                result.logs.push("Cannot perform Setup: Exhausted (0 SP).");
                return result;
            }
            result.mutations.spDelta = -1;

            switch(setupType) {
                case 'RECHARGE':
                    if (payload.rechargeTarget === 'SP') {
                        result.mutations.spDelta += (actor.stats.B || 1); // Refunds cost + adds Brawn
                    } else {
                        result.mutations.epDelta = (actor.stats.W || 1);
                    }
                    result.logs.push(`Recharged ${payload.rechargeTarget}.`);
                    break;
                case 'RECOVER':
                    const purgeAmount = Math.max(actor.stats.B || 1, actor.stats.W || 1, actor.stats.I || 1);
                    result.mutations.removeTagsCount = purgeAmount;
                    result.logs.push(`Recovered: Purged up to ${purgeAmount} Tags.`);
                    break;
                case 'READY':
                    result.mutations.bonusRv = (actor.stats.W || 1);
                    result.logs.push(`Readied: Gained +${result.mutations.bonusRv} RV until next turn.`);
                    break;
                case 'ADVANTAGE':
                    result.mutations.addCondition = 'ADVANTAGE_NEXT_ROLL';
                    result.logs.push("Taking aim: Gained Advantage on next roll.");
                    break;
                case 'CLUE':
                    result.mutations.cluesGained = (actor.stats.T || 1);
                    result.logs.push(`Assessed target: Gained ${result.mutations.cluesGained} Clues.`);
                    break;
            }
            result.success = true;
            return result;
        },

/**
         * REACTIONS: Defensive out-of-turn actions. Cost SP.
         */
        executeReaction(payload, state, result) {
            const { actor, incomingEV, reactionType, chosenStat } = payload;
            
            const costs = { 'AVOID': 1, 'RESIST': 1, 'PARRY': 3, 'CLASH': 2, 'REFLECT': 1, 'COUNTER': 1, 'GUARD': 1 };
            const spCost = costs[reactionType] || 1;

            if (actor.resources.sp < spCost) {
                result.logs.push(`Reaction Failed: Insufficient SP for ${reactionType}.`);
                return result;
            }
            result.mutations.spDelta = -spCost;

            const roll = TTRPGEngine.math.rollStandard(payload.advantage, payload.disadvantage);
            const reactionEV = roll.total + actor.level + (actor.stats[chosenStat] || 1);

            switch(reactionType) {
                case 'AVOID':
                    if (reactionEV > incomingEV) {
                        result.mutations.negateIncoming = true;
                        result.logs.push(`Avoided! (Roll ${reactionEV} > Incoming ${incomingEV})`);
                        result.success = true;
                    }
                    break;
                case 'RESIST':
                    result.mutations.bonusRv = actor.level;
                    result.logs.push(`Resist: Added Level (${actor.level}) to RV against this attack.`);
                    result.success = true;
                    break;
                case 'PARRY':
                    if (reactionEV > incomingEV) {
                        result.mutations.negateIncoming = true;
                        result.mutations.seizePriority = true;
                        result.logs.push(`PARRY SUCCESS! Negated attack and Seized Priority.`);
                        result.success = true;
                    }
                    break;
                case 'CLASH':
                    if (reactionEV > incomingEV) {
                        result.mutations.negateIncoming = true;
                        result.mutations.damageReflected = (reactionEV + incomingEV) - TTRPGEngine.math.calculateResistance(payload.attacker);
                        result.logs.push(`CLASH WON! Attacker takes combined Value Loss.`);
                    } else {
                        result.mutations.damageTaken = (reactionEV + incomingEV) - TTRPGEngine.math.calculateResistance(actor);
                        result.logs.push(`CLASH LOST! Defender takes combined Value Loss.`);
                    }
                    result.success = true;
                    break;
            }
            return result;
        },

        /**
         * KARMA ACTIONS: Context-aware Meta-currency spends
         */
        executeKarma(payload, state, result) {
            const { actionType, actor, context } = payload; // 'SITUATION' or 'DOWNTIME'
            let cost = 1; // Default Karma cost

            if (actionType === 'GROW') cost = Math.ceil(actor.level / 2);
            if (actionType === 'REST' && context === 'DOWNTIME') cost = 0; // Free in downtime

            if (state.resources.karma < cost) {
                result.logs.push(`Karma Action Failed: Need ${cost} Karma.`);
                return result;
            }
            result.mutations.karmaDelta = -cost;

            if (context === 'DOWNTIME') {
                // --- DOWNTIME EFFECTS ---
                switch(actionType) {
                    case 'REST':
                        result.mutations.restoreAllVitals = true;
                        result.logs.push("Downtime (Rest): All HP/SP/EP restored to Maximum (0 Karma).");
                        break;
                    case 'RESTORE':
                        result.mutations.removeCondition = 'INJURED';
                        result.logs.push("Downtime (Restore): Injured condition removed.");
                        break;
                    case 'RECHARGE':
                        result.mutations.upgradeGearLevel = true;
                        result.logs.push("Downtime (Recharge): Gear upgraded to equal Level.");
                        break;
                    case 'LEARN':
                        result.mutations.grantSurpriseNextSituation = true;
                        result.logs.push("Downtime (Learn): Gained Surprise for next Situation.");
                        break;
                    case 'GROW':
                        result.mutations.learnNewInnateKeyword = true;
                        result.logs.push("Downtime (Grow): Added new Innate Keyword.");
                        break;
                    case 'CREATE':
                        result.mutations.grantFactionKeyword = payload.factionId;
                        result.logs.push("Downtime (Create): Granted Faction a new Keyword.");
                        break;
                    case 'INSPIRE':
                        result.mutations.grantFactionCivilSystem = payload.factionId;
                        result.logs.push("Downtime (Inspire): Faction gains a new Civil System.");
                        break;
                    case 'MENTOR':
                        result.mutations.bondAnimation = payload.animationId;
                        result.logs.push("Downtime (Mentor): Bonded with Animation.");
                        break;
                    case 'AMPLIFY':
                        result.mutations.createPermanentTrap = actor.level;
                        result.logs.push(`Downtime (Amplify): Created Permanent Trap (Level ${actor.level}).`);
                        break;
                }
            } else {
                // --- SITUATION EFFECTS ---
                switch(actionType) {
                    case 'REST':
                        result.mutations.hpDelta = 1;
                        result.logs.push("Situation (Rest): Restored 1 HP.");
                        break;
                    case 'RESTORE':
                        result.mutations.removeTagsCount = Math.max(actor.stats.B, actor.stats.W, actor.stats.I);
                        result.logs.push("Situation (Restore): Purged Status Tags.");
                        break;
                    case 'RECHARGE':
                        result.mutations.epDelta = actor.stats.W || 1;
                        result.logs.push("Situation (Recharge): Restored EP via Wit.");
                        break;
                    case 'LEARN':
                        result.mutations.addCondition = 'ADVANTAGE_NEXT_ROLL';
                        result.logs.push("Situation (Learn): Granted Advantage to next roll.");
                        break;
                    case 'GROW':
                        result.mutations.addKeywordToActivation = true;
                        result.logs.push("Situation (Grow): Added ad-hoc Keyword to Activation.");
                        break;
                    case 'CREATE':
                        result.mutations.manifestTemporaryItem = actor.level;
                        result.logs.push(`Situation (Create): Manifested Item (Level ${actor.level}).`);
                        break;
                    case 'INSPIRE':
                        result.mutations.applyTagsToTarget = { [payload.boostTag]: (actor.stats.W || 1) };
                        result.logs.push(`Situation (Inspire): Granted Boost Tags via Wit.`);
                        break;
                    case 'MENTOR':
                        result.mutations.freeAnimationKeywordUse = true;
                        result.logs.push("Situation (Mentor): Animation uses Keyword for free.");
                        break;
                    case 'AMPLIFY':
                        result.mutations.forceCritical = true;
                        result.logs.push("Situation (Amplify): Next roll is a guaranteed Critical.");
                        break;
                }
            }
            result.success = true;
            return result;
        },

        /**
         * CURATOR INTERVENTION: Expending Resonance (Section 10.4)
         */
        executeResonance(payload, state, result) {
            const { cost, interventionType } = payload;
            
            if (state.meta.resonance < cost) {
                result.logs.push(`Curator Intervention Failed: Insufficient Resonance (${cost} needed).`);
                return result;
            }
            result.mutations.resonanceDelta = -cost;

            switch (interventionType) {
                case 'RESONANT_ADVANTAGE': // 1 Resonance
                    result.mutations.grantAdvantage = true;
                    result.mutations.negateCatastrophicMiss = true;
                    result.logs.push("Curator Intervention (1 Res): The Resonant Advantage applied. Disaster averted.");
                    break;
                case 'PSYCHROMATTIC_EUREKA': // 2 Resonance
                    result.mutations.grantAdvantage = true;
                    result.mutations.clearStressSegment = true;
                    result.logs.push("Curator Intervention (2 Res): Psychromattic Eureka applied. Mental block bypassed.");
                    break;
                case 'ENVIRONMENTAL_HARMONIC': // 3 Resonance
                    result.mutations.triggerEnvironmentalHarmonic = true;
                    result.logs.push("Curator Intervention (3 Res): Environmental Harmonic applied. The world yields to intent.");
                    break;
            }
            result.success = true;
            return result;
        }
    },

    // =======================================================================
    // 2. THE MATHEMATICS & DICE LOGIC (LAYER 1 RULES)
    // =======================================================================

    math: {
        /**
         * The core 2d10 Chaining System
         */
        rollStandard(hasAdvantage, hasDisadvantage) {
            let total = 0;
            let isCritical = false;
            let isMiss = false;
            let chaining = true;

            const rollDie = () => Math.floor(Math.random() * 10) + 1;

            while (chaining) {
                let d1 = rollDie();
                let d2 = rollDie();

                // Advantage / Disadvantage only applies to the final non-double result
                let mainDie = d1;
                
                if (d1 === d2) {
                    isCritical = true;
                    total += (d1 + d2); // Double 1s are NOT a miss. They are chaos.
                    // Loop continues (Chaining)
                } else {
                    if (hasAdvantage) mainDie = Math.max(d1, d2);
                    if (hasDisadvantage) {
                        mainDie = Math.min(d1, d2);
                        if (mainDie === 1 && total === 0) {
                            isMiss = true; // Catastrophic miss
                        }
                    }
                    total += mainDie;
                    chaining = false; // Stop rolling
                }
            }

            return {
                total: total,
                isCritical: isCritical,
                isSuperCritical: (total >= 31),
                isMiss: isMiss
            };
        },

        /**
         * Calculates Target Resistance (Sum of 3 highest stats)
         */
        calculateResistance(entity) {
            if (!entity.stats) return 10; // Fallback for simple props
            const statValues = Object.values(entity.stats);
            statValues.sort((a, b) => b - a); // Sort descending
            return statValues[0] + statValues[1] + statValues[2];
        }
    },

  // =======================================================================
    // 3. CLOCK & ENVIRONMENT MANAGEMENT (LAYER 4)
    // =======================================================================
    
    clocks: {
        /**
         * Processes the ripple effect of depleting a clock.
         * When a Task is finished, it ticks the Situation.
         * When a Situation is finished, it ticks the Scene.
         */
        depleteClock(clockType, amount, state) {
            const eventLogs = [];
            
            // 1. Process Task/Barrier Clock Depletion
            if (clockType === 'TASK') {
                eventLogs.push(`Depleted Task Clock by ${amount}.`);
                
                // Check if Task is resolved (reached 0)
                if (state.world.activeTaskClock <= 0) {
                    eventLogs.push("Task resolved! Rippling effect: Situation Clock depleted by 1.");
                    state.world.situationClock -= 1;
                }
            }

            // 2. Check for Situation Resolution
            if (state.world.situationClock <= 0) {
                eventLogs.push("SITUATION RESOLVED! Rippling effect: Scene Clock depleted by 1. All party members gain 1 Karma.");
                state.world.sceneClock -= 1;
                // Note: Karma gain is handled by the Controller using this log
            }

            return {
                logs: eventLogs,
                success: true
            };
        }
    }
}; // End of TTRPGEngine object