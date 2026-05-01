/**
 * PSYCHROMATTICA: SovereigntyEngine.js
 * VERSION: 1.1 (FINAL AUDITED)
 * ROLE: The Macro Scale Logic (Map & Faction Simulator)
 * 
 * DESCRIPTION:
 * Processes Hex-based territorial control, the Shard Economy, 
 * Civil System Licensing, and the Shard War bidding system.
 * PURE FUNCTIONALITY: Returns state mutations to the Controller.
 */

export const SovereigntyEngine = {

    /**
     * THE MASTER ROUTER for the Sovereignty Engine
     */
    process(actionCategory, payload, state) {
        let result = {
            success: false,
            logs:[],
            mutations: {}
        };

        switch (actionCategory) {
            case 'REINFORCEMENT':
                result = this.phases.executeReinforcement(payload, state, result);
                break;
            case 'ACTION':
                result = this.phases.executeAction(payload, state, result);
                break;
            case 'SHARD_WAR':
                result = this.combat.resolveShardWar(payload, state, result);
                break;
            default:
                result.logs.push(`Unknown Sovereignty Action: ${actionCategory}`);
        }

        return result;
    },

    // =======================================================================
    // 1. PHASE LOGIC & ECONOMY
    // =======================================================================

    phases: {
        /**
         * REINFORCEMENT PHASE: Income, Overloads, and HQ Power updates
         */
        executeReinforcement(payload, state, result) {
            const { garrisonedStructures, activeWellsprings } = payload;
            
            // 1. Recalculate HQ Power (1 + number of friendly structures)
            const structureCount = garrisonedStructures.length;
            const newHqPower = 1 + structureCount;
            result.mutations.hqPower = newHqPower;
            result.logs.push(`HQ Power updated to ${newHqPower} based on ${structureCount} structures.`);

            // 2. Standard Income (1 Shard per garrisoned structure based on hex color)
            let shardIncome = {};
            garrisonedStructures.forEach(struct => {
                const color = struct.hexColor;
                shardIncome[color] = (shardIncome[color] || 0) + 1;
            });

            // 3. Wellspring Overload Check (Risk vs Reward)
            activeWellsprings.forEach(wellspring => {
                const ev = payload.totalMapWellsprings || 1; // Map-wide instability
                const rv = wellspring.squadPower + (wellspring.shardBid || 0);
                
                if (ev > rv) {
                    const damage = ev - rv;
                    result.logs.push(`Wellspring Overload! Squad at ${wellspring.hexId} took ${damage} damage.`);
                    // Route damage to the specific squad ID
                    result.mutations[`squadDamage_${wellspring.squadId}`] = damage;
                }
                
                // Income is gained regardless of overload
                shardIncome[wellspring.hexColor] = (shardIncome[wellspring.hexColor] || 0) + 3;
            });

            result.mutations.shardIncome = shardIncome;
            result.logs.push("Reinforcement Phase complete. Income generated.");
            result.success = true;
            return result;
        },

        /**
         * ACTION PHASE: Spending 3 AP on movements and constructions
         */
        executeAction(payload, state, result) {
            const { actionType, costAp = 1, factionState } = payload;

            // AP Validation
            if (payload.currentAp < costAp) {
                result.logs.push("Failed: Insufficient Action Points (AP).");
                return result;
            }
            result.mutations.apDelta = -costAp;

            switch (actionType) {
                case 'CONSTRUCT':
                    // Verify cost based on Structure Tier (S0-S9)
                    const shardCost = payload.structureCost;
                    if (factionState.shards[payload.shardColor] < shardCost) {
                        result.logs.push(`Failed: Need ${shardCost} shards of color ${payload.shardColor} to construct.`);
                        return result;
                    }
                    result.mutations.shardDelta = { color: payload.shardColor, amount: -shardCost };
                    result.mutations.buildStructure = payload.structureType; 
                    result.logs.push(`Constructed ${payload.structureType}. Doctrine License active!`);
                    break;
                
                case 'INVEST':
                    // Spend 50 shards at HQ to gain 1 VP
                    const totalShards = Object.values(factionState.shards).reduce((a, b) => a + b, 0);
                    if (totalShards < 50) {
                        result.logs.push("Failed: Need 50 total shards to Invest.");
                        return result;
                    }
                    result.mutations.spendAnyShards = 50; 
                    result.mutations.vpDelta = 1;
                    result.logs.push("Investment successful! Gained 1 Victory Point (VP).");
                    break;

                case 'MOVE':
                    result.mutations.moveSquad = { squadId: payload.squadId, targetHex: payload.targetHex };
                    result.logs.push(`Moved squad to hex ${payload.targetHex}.`);
                    break;

                case 'EXPLORE':
                    result.mutations.revealHex = payload.targetHex;
                    result.logs.push(`Explored hex ${payload.targetHex}. Tile revealed.`);
                    break;

                case 'GARRISON':
                case 'EGRESS':
                    result.mutations.updateGarrisonState = { squadId: payload.squadId, isGarrisoned: actionType === 'GARRISON' };
                    result.logs.push(`Squad ${payload.squadId} ${actionType}ed the structure.`);
                    break;

                case 'CONVERT':
                    const convertCost = payload.structureCost; 
                    if (factionState.shards[payload.shardColor] < convertCost) {
                        result.logs.push(`Failed: Insufficient shards to convert structure.`);
                        return result;
                    }
                    result.mutations.shardDelta = { color: payload.shardColor, amount: -convertCost };
                    result.mutations.changeStructureOwnership = payload.targetHex;
                    result.logs.push(`Converted enemy structure at ${payload.targetHex}.`);
                    break;

                case 'COLLECT_DEPOSIT':
                    result.mutations.transferShards = { direction: payload.direction, amount: payload.amount, color: payload.shardColor };
                    result.logs.push(`Transferred ${payload.amount} ${payload.shardColor} shards.`);
                    break;
            }

            result.success = true;
            return result;
        }
    },

    // =======================================================================
    // 2. SHARD WAR & TERRITORY COMBAT
    // =======================================================================

    combat: {
        /**
         * RESOLVE SHARD WAR: Bidding combat for territory and resources
         */
        resolveShardWar(payload, state, result) {
            const { 
                attackerPower, attackerBid, 
                defenderPower, defenderBid, 
                isTheft, targetHexId 
            } = payload;

            // 1. Calculate EV and RV (Bidding Logic)
            const finalEV = attackerPower + attackerBid;
            const finalRV = defenderPower + defenderBid;

            result.logs.push(`Shard War! EV (${attackerPower} + ${attackerBid} bid) vs RV (${defenderPower} + ${defenderBid} bid).`);
            result.logs.push(`Final totals -> EV: ${finalEV} | RV: ${finalRV}`);

            // 2. Deduct Bids from pools immediately
            result.mutations.attackerBidSpent = attackerBid;
            result.mutations.defenderBidSpent = defenderBid;

            // 3. Determine Outcome
            if (finalEV > finalRV) {
                // ATTACKER WINS
                const difference = finalEV - finalRV;
                result.logs.push(`Attacker Wins by ${difference}!`);

                if (isTheft) {
                    // Theft: Steal shards up to the difference
                    result.mutations.theftAmount = difference;
                    result.logs.push(`Theft successful. Stole ${difference} shards.`);
                } else {
                    // Attack: Damage target and Shunt defender
                    result.mutations.defenderDamage = difference;
                    result.mutations.shuntDefender = true;
                    result.mutations.occupyHex = targetHexId;
                    result.logs.push(`Defender takes ${difference} damage and is Shunted from hex.`);
                    
                    // Check for HQ damage -> Stress Shard generation
                    if (payload.isHqTarget) {
                        result.mutations.defenderStressShards = 5;
                        result.logs.push("HQ Damaged! Defender gains 5 Stress Shards.");
                    }
                }
            } else {
                // DEFENDER WINS
                result.logs.push(`Defender Holds! RV (${finalRV}) beats EV (${finalEV}).`);
                
                // Attacker is Shunted back to origin
                result.mutations.shuntAttacker = true;
                result.logs.push("Attacker's assault breaks. Attacker is Shunted back to origin hex.");
            }

            result.success = true;
            return result;
        }
    }
};