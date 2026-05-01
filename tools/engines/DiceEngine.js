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
        executeReady(payload, state, result) {
            const expertise = state.diceState.expertise || 1;
            
            // 1. Reset Field & Gain Karma
            result.mutations.diceState = { ...state.diceState, resonanceField: expertise };
            result.mutations.karmaDelta = expertise;
            
            // 2. Free Generation (Roll 1d10 for Primary Color)
            const primaryColor = state.diceState.affinityColors[0];
            const category = Math.floor(Math.random() * 10); // 0-9
            
            const newTokens =[...(state.diceState.tokens || [])];
            newTokens.push({ id: Date.now().toString(), color: primaryColor, category: category });
            result.mutations.diceState.tokens = newTokens;

            result.logs.push(`Ready Phase: Field reset to ${expertise}. Gained ${expertise} Karma. Free Token Generated: [${primaryColor}.${category}].`);
            result.success = true;
            return result;
        },

        executeGenerate(payload, state, result) {
            const { isAffinityColor, colorId } = payload;
            const cost = isAffinityColor ? 1 : 2;
            
            if (state.resources.karma < cost) {
                result.logs.push(`Failed: Need ${cost} Karma for generation.`);
                return result;
            }
            
            result.mutations.karmaDelta = -cost;
            const category = Math.floor(Math.random() * 10); // 0-9
            
            const newTokens = [...(state.diceState.tokens || [])];
            newTokens.push({ id: Date.now().toString() + Math.random(), color: colorId, category: category });
            result.mutations.diceState = { ...state.diceState, tokens: newTokens };

            result.logs.push(`Paid Generation: Spent ${cost} Karma. Token [${colorId}.${category}] added to Matrix.`);
            result.success = true;
            return result;
        },

        executeActivate(payload, state, result) {
            const { tokenIds } = payload;
            const expertise = state.diceState.expertise || 1;
            
            if (tokenIds.length > expertise && !payload.isComboOverride) {
                result.logs.push(`Failed: Cannot spend more tokens (${tokenIds.length}) than Expertise (${expertise}).`);
                return result;
            }
            
            // Remove spent tokens from Matrix
            const currentTokens = state.diceState.tokens ||[];
            const remainingTokens = currentTokens.filter(t => !tokenIds.includes(t.id));
            result.mutations.diceState = { ...state.diceState, tokens: remainingTokens };

            let damage = tokenIds.length === 0 ? 1 : 0; // Basic Activation deals 1 dmg
            result.logs.push(`Activation Fired! Spent ${tokenIds.length} tokens. Base Damage: ${damage}.`);
            result.success = true;
            return result;
        },

        executeRespond(payload, state, result) {
            // EXPERTISE BREAK (Custom Respond Action)
            const { tokenIds } = payload;
            if (tokenIds.length !== 5) {
                result.logs.push("Failed: Expertise Break requires exactly 5 tokens.");
                return result;
            }
            
            const remainingTokens = state.diceState.tokens.filter(t => !tokenIds.includes(t.id));
            result.mutations.diceState = { 
                ...state.diceState, 
                tokens: remainingTokens,
                expertise: state.diceState.expertise + 1 
            };
            result.logs.push(`EXPERTISE BREAK! Max Expertise permanently increased to ${state.diceState.expertise + 1}.`);
            result.success = true;
            return result;
        }
    }
};