/**
 * PSYCHROMATTICA: DiceEngine.js
 * VERSION: 1.1 (FINAL AUDITED)
 * ROLE: The Micro Scale Logic (Matrix Dice)
 * 
 * DESCRIPTION:
 * Processes the token-based Affinity Matrix. Handles high-speed turn cycles,
 * combo-driven power spikes (Chroma Bursts, Resonance Cascades), 
 * and the Resonance Field (Temporary Defense).
 * PURE FUNCTIONALITY: Returns state mutations to the Controller.
 */

export const DiceEngine = {

    /**
     * THE MASTER ROUTER for the Dice Matrix
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
            case 'GENERATE_TOKEN':
                result = this.phases.executeGenerate(payload, state, result);
                break;
            case 'ACTIVATE':
                result = this.phases.executeActivate(payload, state, result);
                break;
            case 'RESPOND':
                result = this.phases.executeRespond(payload, state, result);
                break;
            case 'RESOLVE':
                result = this.phases.executeResolve(payload, state, result);
                break;
            default:
                result.logs.push(`Unknown Dice Action: ${actionCategory}`);
        }

        return result;
    },

    // =======================================================================
    // 1. THE TURN CYCLE LOGIC
    // =======================================================================

    phases: {
        /**
         * READY PHASE: Upkeep, Field reset, and Karma generation.
         */
        executeReady(payload, state, result) {
            const expertise = state.diceState.expertise || 1;
            
            // 1. Generate Resonance Field (Reset every turn to Expertise)
            result.mutations.resonanceField = expertise;
            
            // 2. Gain Resources (Karma = Expertise)
            result.mutations.karmaDelta = expertise;
            
            result.logs.push(`Ready Phase: Resonance Field reset to ${expertise}. Gained ${expertise} Karma.`);
            result.success = true;
            return result;
        },

        /**
         * GENERATE TOKEN: Free vs. Paid generation handling.
         */
        executeGenerate(payload, state, result) {
            const { isFree, colorId, categoryId, isAffinityColor } = payload;

            if (!isFree) {
                // Cost is 1 Karma for Affinity colors, 2 for Non-Affinity
                const cost = isAffinityColor ? 1 : 2;
                if (state.resources.karma < cost) {
                    result.logs.push("Failed: Insufficient Karma to generate token.");
                    return result;
                }
                result.mutations.karmaDelta = -cost;
                result.logs.push(`Paid ${cost} Karma for generation.`);
            }

            // Tell state to add this token to the matrix
            result.mutations.newToken = { color: colorId, category: categoryId };
            result.logs.push(`Generated Token: [${colorId}.${categoryId}]`);
            result.success = true;
            return result;
        },

        /**
         * ACTIVATE PHASE: Token expenditure and Combo detection.
         */
        executeActivate(payload, state, result) {
            const { tokensSpent, isKarmaSurge, actorState } = payload; 
            const expertise = state.diceState.expertise || 1;

            // 1. Validate Expertise Ceiling (Limit on tokens per activation)
            if (tokensSpent.length > expertise && !payload.isComboOverride) {
                result.logs.push(`Failed: Cannot spend more tokens (${tokensSpent.length}) than Expertise (${expertise}).`);
                return result;
            }

            let baseDamage = tokensSpent.length === 0 ? 1 : 0; // Basic Activations deal 1 damage
            
            // 2. Karma Surge Check (Spend 2 Karma for +1 damage)
            if (isKarmaSurge) {
                if (state.resources.karma < 2) {
                    result.logs.push("Failed: Need 2 Karma for a Surge.");
                    return result;
                }
                result.mutations.karmaDelta = -2;
                baseDamage += 1;
            }

            // 3. COMBO DETECTION ALGORITHM
            let comboType = null;
            let isCritical = false;
            let karmaReward = 0;

            // Count occurrences of each color
            const colorCounts = {};
            tokensSpent.forEach(t => {
                colorCounts[t.color] = (colorCounts[t.color] || 0) + 1;
            });
            const colorsUsed = Object.keys(colorCounts);

            // A. Critical Activation (5 of same color)
            if (colorsUsed.length === 1 && colorCounts[colorsUsed[0]] === 5) {
                comboType = 'CRITICAL_ACTIVATION';
                isCritical = true;
                baseDamage = expertise; // Effect replacement rule: deal damage equal to Expertise
                karmaReward = 3;
                result.mutations.targetKarmaLoss = expertise;
            }
            // B. Chroma Burst (3+ of same color)
            else if (colorsUsed.length === 1 && colorCounts[colorsUsed[0]] >= 3) {
                comboType = 'CHROMA_BURST';
                karmaReward = 1;
            }
            // C. Resonance Cascade (Exactly 3 tokens, 3 different affinity colors)
            else if (tokensSpent.length === 3 && colorsUsed.length === 3) {
                // Affinity check is handled by the Controller/Middleware
                comboType = 'RESONANCE_CASCADE';
                karmaReward = 2;
            }

            result.mutations.activation = {
                damage: baseDamage,
                combo: comboType,
                karmaReward: karmaReward,
                isCritical: isCritical
            };

            result.logs.push(`Activation declared with ${tokensSpent.length} tokens. Combo: ${comboType || 'None'}`);
            result.success = true;
            return result;
        },

        /**
         * RESPOND PHASE: Reaction logic for defender.
         */
        executeRespond(payload, state, result) {
            const { respondType, tokensSpentByDefender, incomingTokens } = payload;

            if (respondType === 'RESIST') {
                // Spend 1 token (or 2 Karma) to prevent 1 damage.
                result.mutations.damageReduction = 1;
                result.logs.push("Resist Declared: Damage reduced by 1.");
                result.success = true;

            } else if (respondType === 'AVOID') {
                // To avoid, defender tokens must exactly match the colors of the incoming tokens
                const incomingColors = incomingTokens.map(t => t.color).sort().join(',');
                const defenderColors = tokensSpentByDefender.map(t => t.color).sort().join(',');

                if (incomingColors === defenderColors) {
                    result.mutations.avoided = true;
                    result.logs.push("Avoid Declared: Cost matched! Activation negated.");
                    result.success = true;
                } else {
                    result.logs.push("Avoid Failed: Spent tokens did not match incoming token colors.");
                }
            }
            return result;
        },

        /**
         * RESOLVE PHASE: Applying damage to Fields, HP, and granting Stress Karma.
         */
        executeResolve(payload, state, result) {
            const { incomingDamage, avoided, isAttacker } = payload;

            if (avoided) {
                result.logs.push("Activation was avoided. No damage applied.");
                return result;
            }

            if (!isAttacker) {
                let currentField = state.diceState.resonanceField || 0;
                let currentHp = state.resources.hp;
                let remainingDmg = incomingDamage;

                // 1. Damage hits Resonance Field first
                if (currentField >= remainingDmg) {
                    result.mutations.fieldDelta = -remainingDmg;
                    remainingDmg = 0;
                    result.logs.push(`Resonance Field absorbed all ${incomingDamage} damage.`);
                } else {
                    result.mutations.fieldDelta = -currentField;
                    remainingDmg -= currentField;
                    
                    // 2. Remaining damage hits HP
                    result.mutations.hpDelta = -remainingDmg;
                    
                    // 3. Stress Karma (Gain 1 Karma per HP lost)
                    result.mutations.karmaDelta = remainingDmg; 
                    
                    result.logs.push(`Field absorbed ${currentField}. HP took ${remainingDmg} damage. Gained ${remainingDmg} Stress Karma.`);
                }
            }
            
            result.success = true;
            return result;
        }
    }
};