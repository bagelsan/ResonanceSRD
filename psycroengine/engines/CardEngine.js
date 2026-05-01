/**
 * PSYCHROMATTICA: CardEngine.js
 * VERSION: 1.1 (FINAL AUDITED)
 * ROLE: The Micro Scale Logic (Card Duel)
 * 
 * DESCRIPTION:
 * Processes the 1v1 Card Game logic. Handles Energy (EN) economy,
 * deploying/equipping limits, Guardian Precedence targeting rules, 
 * and the 6-Step Information Loop for combat resolution.
 * PURE FUNCTIONALITY: Returns state mutations to the Controller.
 */

export const CardEngine = {

    /**
     * THE MASTER ROUTER for the Card Game
     */
    process(actionCategory, payload, state) {
        let result = {
            success: false,
            logs:[],
            mutations: {}
        };

        switch (actionCategory) {
            case 'READY_PHASE':
                result = this.phases.executeReady(payload, state, result);
                break;
            case 'DEPLOY_EQUIP':
                result = this.phases.executeDeploy(payload, state, result);
                break;
            case 'COMBAT_LOOP': // Handles Attack and Critical Strike
                result = this.phases.executeCombat(payload, state, result);
                break;
            case 'SUPPORT_ACTION': // Purge, Support, Charge
                result = this.phases.executeSupport(payload, state, result);
                break;
            case 'KARMA_ACTION':
                result = this.phases.executeKarma(payload, state, result);
                break;
            default:
                result.logs.push(`Unknown Card Action: ${actionCategory}`);
        }

        return result;
    },

    // =======================================================================
    // THE PHASE & ACTION LOGIC
    // =======================================================================

    phases: {
        /**
         * READY PHASE: Energy gain, refresh units, hand management checks.
         */
        executeReady(payload, state, result) {
            const expertise = state.cardState.maxAugments || 1; // Base Expertise
            const currentEn = state.cardState.energy || 0;
            const isFirstTurn = payload.isFirstTurn || false;

            // 1. Gain Energy (Skip on turn 1 per rules)
            if (!isFirstTurn) {
                const enGain = expertise + 1;
                result.mutations.energyDelta = Math.min(enGain, 10 - currentEn); 
                result.logs.push(`Ready Phase: Gained ${result.mutations.energyDelta} Energy. (Max 10)`);
            } else {
                result.logs.push(`Ready Phase: First turn. No Energy gained.`);
            }

            // Note: Hand Draw/Discard is handled by the UI/Controller based on this success
            result.success = true;
            return result;
        },

        /**
         * DEPLOY / EQUIP: Playing cards from hand to field using Energy.
         */
        executeDeploy(payload, state, result) {
            const { cardType, cardPwr } = payload;
            const currentEn = state.cardState.energy || 0;

            // Check Energy Cost
            if (currentEn < cardPwr) {
                result.logs.push(`Failed: Not enough Energy. Cost: ${cardPwr}, Current EN: ${currentEn}`);
                return result;
            }

            // Verify Command Limits (Animations cannot exceed Expertise)
            if (cardType === 'ANIMATION') {
                const activeAnimations = payload.activeAnimationCount || 0;
                const expertise = state.cardState.maxAugments || 1;
                
                if (activeAnimations >= expertise) {
                    result.logs.push(`Failed: Command Limit reached. Max animations is ${expertise}.`);
                    return result;
                }
            }

            result.mutations.energyDelta = -cardPwr;
            result.logs.push(`Success: Deployed/Equipped card. Spent ${cardPwr} Energy.`);
            result.success = true;
            return result;
        },

        /**
         * THE INFORMATION LOOP: Resolving Attacks and Critical Strikes
         * This is the core combat math of the Card Engine.
         */
        executeCombat(payload, state, result) {
            const { 
                isCritical, attackerExp, attackerDiscardPwr, augmentedKeywordsCount,
                defenderExp, defenderReactionPwr, defenderSacrificePwr, 
                targetType, defenderActiveAnimations 
            } = payload;

            // 1. Guardian Precedence Check (Rule 2.3)
            if (targetType === 'PLAYER' && defenderActiveAnimations > 0) {
                result.logs.push(`Failed: Guardian Precedence active. Cannot target Player while Animations are active.`);
                return result;
            }

            // 2. Augmented Keyword Cap Check (Expertise Limit)
            if (augmentedKeywordsCount > attackerExp) {
                result.logs.push(`Failed: Cannot augment more keywords (${augmentedKeywordsCount}) than Expertise (${attackerExp}).`);
                return result;
            }

            // 3. Calculate Base EV (Step 1)
            // Rule: Critical Strikes ignore Expertise in the base calculation.
            let baseEV = isCritical ? attackerDiscardPwr : (attackerExp + attackerDiscardPwr);
            
            // 4. Calculate Final EV (Step 2 & 5)
            // (Keyword EV modifiers are passed in via payload.keywordEvMod from Middleware)
            let finalEV = baseEV + (payload.keywordEvMod || 0);

            // 5. Calculate Final RV (Step 4 & 5)
            let finalRV = defenderExp + (defenderReactionPwr || 0) + (defenderSacrificePwr || 0) + (payload.keywordRvMod || 0);

            // 6. Resolution (Step 6)
            result.logs.push(`Combat resolved: EV ${finalEV} vs RV ${finalRV}.`);

            if (finalEV > finalRV) {
                const damage = finalEV - finalRV;
                result.mutations.damageDealt = damage;
                result.mutations.attackerKarmaDelta = 1; // Reward for successful attack
                result.logs.push(`Success! Dealt ${damage} damage. Attacker gained 1 Karma.`);
            } else {
                result.mutations.damageDealt = 0;
                
                // Rule: Critical Strikes grant Karma even if they deal 0 damage
                if (isCritical) {
                    result.mutations.attackerKarmaDelta = 1;
                    result.logs.push(`Attack blocked, but Critical Strike grants 1 Karma.`);
                } else {
                    result.logs.push(`Attack fully blocked or avoided.`);
                }
            }

            result.success = true;
            return result;
        },

        /**
         * SUPPORT ACTIONS: Basic Universal Actions
         */
        executeSupport(payload, state, result) {
            const { actionType } = payload;

            switch (actionType) {
                case 'CHARGE':
                    // Gain 1 EN (or discard a card for its PWR, passed in as discardPwr)
                    const enGain = payload.discardPwr || 1;
                    result.mutations.energyDelta = enGain;
                    result.logs.push(`Charge successful. Gained ${enGain} Energy.`);
                    result.success = true;
                    break;

                case 'SUPPORT':
                    // Remove 1 damage marker from a friendly unit
                    result.mutations.healAmount = 1;
                    result.logs.push(`Support successful. Removed 1 Damage Marker.`);
                    result.success = true;
                    break;

                case 'PURGE':
                    // Remove 1 damage marker AND 1 Status Tag
                    result.mutations.healAmount = 1;
                    result.mutations.purgeTags = 1;
                    result.logs.push(`Purge successful. Removed 1 Damage Marker and 1 Status Tag.`);
                    result.success = true;
                    break;
            }

            return result;
        },

        /**
         * KARMA ACTIONS: Meta-game economy actions
         */
        executeKarma(payload, state, result) {
            const { actionType } = payload;
            const currentKarma = state.resources.karma || 0;

            const costs = {
                'OVERCLOCK': 1,      // Draw 1 card
                'RE_ENGAGE': 1,      // Un-suppress a unit
                'ACQUIRE_CODEX': 3   // Draw from Codex to Active Area
            };

            const cost = costs[actionType];

            if (!cost || currentKarma < cost) {
                result.logs.push(`Failed: Not enough Karma. Need ${cost}, have ${currentKarma}.`);
                return result;
            }

            result.mutations.karmaDelta = -cost;
            result.mutations.karmaActionTriggered = actionType;
            result.logs.push(`Success: Performed ${actionType} for ${cost} Karma.`);
            result.success = true;

            return result;
        }
    }
};