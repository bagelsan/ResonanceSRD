/**
 * PSYCHROMATTICA: TacticsEngine.js
 * VERSION: 1.1 (FINAL AUDITED)
 * ROLE: The Meso Scale Logic (Grid Combat)
 * 
 * DESCRIPTION:
 * Processes spatial positioning on a 3x3 grid, Token Batteries (Yellow/Green), 
 * Kinetic vs Projected pathing, and the deterministic AI Defense Decision Matrix.
 * PURE FUNCTIONALITY: Returns state mutations to the Controller.
 */

export const TacticsEngine = {

    /**
     * THE MASTER ROUTER for the Tactics Engine
     */
    process(actionCategory, payload, state) {
        let result = {
            success: false,
            logs:[],
            mutations: {}
        };

        switch (actionCategory) {
            case 'TARGET_ACQUISITION':
                result = this.logic.evaluateTarget(payload, state, result);
                break;
            case 'ATTACK_GENERATION':
                result = this.logic.executeAttack(payload, state, result);
                break;
            case 'DEFENSE_DECISION':
                result = this.logic.executeDefenseMatrix(payload, state, result);
                break;
            case 'MANEUVER':
                result = this.logic.executeManeuver(payload, state, result);
                break;
            case 'LOADOUT_PHASE':
                result = this.macro.executeLoadout(payload, state, result);
                break;
            case 'CAMP_PHASE':
                result = this.macro.executeCampAction(payload, state, result);
                break;
            default:
                result.logs.push(`Unknown Tactics Action: ${actionCategory}`);
        }

        return result;
    },

    // =======================================================================
    // 1. THE GRID PHYSICS & COMBAT LOGIC
    // =======================================================================

    logic: {
        /**
         * TARGET ACQUISITION: Checks distance, interception, and obscuration.
         */
        evaluateTarget(payload, state, result) {
            const { attacker, target, attackType, gridOccupancy } = payload;
            
            // 1. Calculate True Distance across the grid gap
            // Formula: (Attacker Row - 1) + (Target Row - 1) + 1 (The Battlefield Gap)
            const distance = (attacker.row - 1) + (target.row - 1) + 1;
            const maxMovement = attacker.stats.R || 1; 
            
            let hasDisadvantage = false;
            if (distance > maxMovement) {
                hasDisadvantage = true;
                result.logs.push(`Distance (${distance}) exceeds Movement (${maxMovement}). Attack has Disadvantage.`);
            }

            // 2. Pathing Check (Interception / Obscuration)
            let finalTarget = target;
            let pathBlocked = false;
            let blockerId = null;

            // Check if any enemy is in a row IN FRONT of the target
            for (let i = 1; i < target.row; i++) {
                if (gridOccupancy[`row${i}`] && gridOccupancy[`row${i}`].length > 0) {
                    pathBlocked = true;
                    blockerId = gridOccupancy[`row${i}`][0];
                    break;
                }
            }

            if (pathBlocked) {
                if (attackType === 'KINETIC') {
                    // Kinetic attacks are intercepted by the front row
                    result.mutations.targetForcedSwitch = blockerId;
                    result.logs.push(`KINETIC Path Blocked: Attack intercepted by Unit ${blockerId}.`);
                } else if (attackType === 'PROJECTED') {
                    // Projected attacks fly over, but suffer Disadvantage
                    hasDisadvantage = true;
                    result.logs.push(`PROJECTED Path Blocked: Attack obscured. Attack suffers Disadvantage.`);
                }
            }

            result.mutations.hasDisadvantage = hasDisadvantage;
            result.success = true;
            return result;
        },

        /**
         * ATTACK GENERATION: Calculates EV based on Action Tier (Powered vs Basic)
         */
        executeAttack(payload, state, result) {
            const { attacker, hasAdvantage, hasDisadvantage, isPoweredAction } = payload;

            // 1. Action Tier Check (Yellow Token)
            if (isPoweredAction) {
                if (attacker.tokens.yellow < 1) {
                    result.logs.push("Failed: Insufficient Yellow Tokens for a Powered Action.");
                    return result;
                }
                result.mutations.yellowTokenDelta = -1;
                result.logs.push("Powered Action triggered. Consumed 1 Yellow Token.");
            } else {
                result.logs.push("Basic Attack triggered (No Yellow Tokens consumed).");
            }

            // 2. Generate EV Roll (2d10)
            const roll1 = Math.floor(Math.random() * 10) + 1;
            const roll2 = Math.floor(Math.random() * 10) + 1;
            
            let baseRoll = roll1 + roll2;

            // Handle Advantage/Disadvantage 2d10 math
            if (hasAdvantage && !hasDisadvantage) {
                const roll3 = Math.floor(Math.random() * 10) + 1;
                const roll4 = Math.floor(Math.random() * 10) + 1;
                baseRoll = Math.max(baseRoll, roll3 + roll4);
            } else if (hasDisadvantage && !hasAdvantage) {
                const roll3 = Math.floor(Math.random() * 10) + 1;
                const roll4 = Math.floor(Math.random() * 10) + 1;
                baseRoll = Math.min(baseRoll, roll3 + roll4);
            }

            // 3. Final EV Calculation
            const statValue = attacker.stats.B || 1; 
            const finalEV = baseRoll + attacker.level + statValue;

            result.mutations.attackEV = finalEV;
            result.logs.push(`Attack Generated: Base Roll [${baseRoll}] + Level [${attacker.level}] + Stat [${statValue}] = EV ${finalEV}.`);
            
            result.success = true;
            return result;
        },

        /**
         * THE DEFENSE DECISION MATRIX: Deterministic AI logic for Reactions
         */
        executeDefenseMatrix(payload, state, result) {
            const { defender, incomingEV } = payload;
            
            const greenTokens = defender.tokens.green || 0;
            const currentHp = defender.hp;
            
            // Calculate Resistance (Sum of 3 highest stats)
            const statsArr = Object.values(defender.stats).sort((a, b) => b - a);
            const resistance = 5 + (statsArr[0] + statsArr[1] + statsArr[2]);
            
            // 1. Defenseless Check
            if (greenTokens === 0) {
                const damage = Math.max(0, incomingEV - resistance);
                result.mutations.decision = 'DEFENSELESS';
                result.mutations.finalDamage = damage;
                result.logs.push(`Defenseless! Takes ${damage} damage. (EV ${incomingEV} - Res ${resistance})`);
                result.success = true;
                return result;
            }

            // 2. Calculate Decision Variables
            const defenselessDmg = Math.max(0, incomingEV - resistance);
            const blockDmg = Math.max(0, incomingEV - (resistance + 5)); // Blocking adds +5 to Resistance
            
            let decision = 'BLOCK'; // Default fallback

            // 3. THE DECISION TREE (Logic Hook C)
            if (defenselessDmg >= currentHp && blockDmg < currentHp) {
                decision = 'BLOCK';
                result.logs.push("AI DECISION: FAILSAFE. Blocking to survive lethal damage.");
            } 
            else if (blockDmg === 0) {
                decision = 'BLOCK';
                result.logs.push("AI DECISION: EFFICIENCY. Blocking fully negates damage.");
            } 
            else if (blockDmg >= (currentHp / 2)) {
                decision = 'DODGE';
                result.logs.push("AI DECISION: DESPERATION. Block damage too high, attempting to Dodge.");
            } 
            else {
                decision = 'BLOCK';
                result.logs.push("AI DECISION: DEFAULT. Safely mitigating damage via Block.");
            }

            // 4. Resolve Decision
            result.mutations.greenTokenDelta = -1; // Consume reaction token
            result.mutations.decision = decision;

            if (decision === 'BLOCK') {
                result.mutations.finalDamage = blockDmg;
                result.logs.push(`Block executed. Took ${blockDmg} damage.`);
            } else if (decision === 'DODGE') {
                const dodgeRoll = (Math.floor(Math.random() * 10) + 1) + (Math.floor(Math.random() * 10) + 1);
                const alacrity = defender.stats.A || 1;
                const dodgeTotal = dodgeRoll + defender.level + alacrity;

                if (dodgeTotal > incomingEV) {
                    result.mutations.finalDamage = 0;
                    result.logs.push(`Dodge SUCCESS! (Roll ${dodgeTotal} > EV ${incomingEV}). 0 Damage taken.`);
                } else {
                    result.mutations.finalDamage = defenselessDmg;
                    result.logs.push(`Dodge FAILED! (Roll ${dodgeTotal} <= EV ${incomingEV}). Took ${defenselessDmg} Defenseless damage.`);
                }
            }

            result.success = true;
            return result;
        },

        /**
         * MANEUVERS: Specialized positional and tactical actions
         */
        executeManeuver(payload, state, result) {
            const { maneuverType, actor, target, ally } = payload;

            if (payload.costYellow && actor.tokens.yellow > 0) {
                result.mutations.yellowTokenDelta = -1;
            }
            if (payload.costGreen && actor.tokens.green > 0) {
                result.mutations.greenTokenDelta = -1;
            }

            switch(maneuverType) {
                case 'CALLED_SHOT':
                    result.mutations.applyAdvantage = true;
                    result.mutations.doubleDamage = true;
                    result.logs.push(`Maneuver: CALLED SHOT. Advantage applied. Damage doubled.`);
                    break;
                case 'SHOVE':
                    result.mutations.bypassResistance = true;
                    result.mutations.shoveTarget = true;
                    result.logs.push(`Maneuver: SHOVE. Bypassing resistance, forcing target back 1 row.`);
                    break;
                case 'DISARM':
                    result.mutations.disableRandomMod = true;
                    result.mutations.applyConditionTarget = 'DISARMED';
                    result.logs.push(`Maneuver: DISARM. Target loses 1 active Mod.`);
                    break;
                case 'RESTRAIN':
                    result.mutations.applyTagTarget = 'BIND';
                    result.logs.push(`Maneuver: RESTRAIN. Applied BIND. Target cannot Dodge next attack.`);
                    break;
                case 'LUNGE':
                    result.mutations.bonusMovement = 1;
                    result.mutations.bonusEVIfBlocked = 1;
                    result.logs.push(`Maneuver: LUNGE. +1 Range. Penetrates Blocks.`);
                    break;
                case 'LOCK_ON':
                    result.mutations.applyConditionActor = 'VULNERABLE';
                    result.mutations.applyConditionTarget = 'LOCKED';
                    result.logs.push(`Maneuver: LOCK ON. Both entities gain Advantage vs each other.`);
                    break;
                case 'TAUNT':
                    result.mutations.applyConditionTarget = 'TAUNTED';
                    result.logs.push(`Maneuver: TAUNT. Target must target Actor.`);
                    break;
                case 'IMPROVISE':
                    result.mutations.applyTagTarget = payload.improvisedTag || 'DAZE';
                    result.logs.push(`Maneuver: IMPROVISE. Applied ${payload.improvisedTag || 'DAZE'} Tag.`);
                    break;
                case 'FEINT':
                    result.mutations.applyConditionTarget = 'EXPOSED';
                    result.logs.push(`Maneuver: FEINT. Target is Exposed.`);
                    break;
            }

            result.success = true;
            return result;
        }
    },

    // =======================================================================
    // 2. MACRO LOGIC (Loadouts & Camp)
    // =======================================================================

    macro: {
        executeLoadout(payload, state, result) {
            const { unit, selectedActives, selectedPassives } = payload;
            if (selectedActives.length > unit.stats.P) return { success: false, logs: ["Exceeds Power stat limit."] };
            if (selectedPassives.length > unit.stats.F) return { success: false, logs: ["Exceeds Force stat limit."] };
            
            result.mutations.lockedLoadout = { actives: selectedActives, passives: selectedPassives };
            result.success = true;
            return result;
        },
        executeCampAction(payload, state, result) {
            const { campAction, targetUnitId } = payload;
            const costs = { 'HEAL_ONE_3HP': 1, 'HEAL_ALL_1HP': 2, 'HEAL_ALL_2HP': 3, 'REVIVE': 4, 'SURPRISE': 5 };
            const cost = costs[campAction] || 0;

            if (state.resources.karma < cost) return { success: false, logs: ["Insufficient Karma."] };
            result.mutations.karmaDelta = -cost;

            if (campAction.startsWith('HEAL')) result.mutations.campHeal = campAction;
            if (campAction === 'REVIVE') result.mutations.campRevive = targetUnitId;
            if (campAction === 'SURPRISE') result.mutations.grantSurprise = true;

            result.success = true;
            return result;
        }
    }
};