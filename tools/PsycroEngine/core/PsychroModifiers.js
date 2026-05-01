/**
 * PSYCHROMATTICA: PsychroModifiers.js
 * VERSION: 1.1 (FINAL AUDITED)
 * ROLE: The Middleware (Tag, Keyword, and Action Logic Executor)
 * 
 * DESCRIPTION:
 * Intercepts action payloads BEFORE and AFTER the core engine math.
 * Translates narrative tags (e.g., "Daze") and Keywords (e.g., "1.8 Brutal") 
 * into raw mathematical mutations (e.g., EV - 1).
 */

export const PsychroModifiers = {

    // =======================================================================
    // 1. THE COMPLETE TAG REGISTRY (20 Tags)
    // =======================================================================

    TAGS: {
        // --- STATUS TAGS (Debuffs - Trigger automatically) ---
        "MARK": {
            onDefensePreMath: (payload, tagCount) => {
                payload.hasAdvantage = true;
                return { removeTags: 1, log: "Mark triggered: Attacker gained Advantage." };
            }
        },
        "IMPAIR": {
            onActionCost: (payload, tagCount) => {
                if (payload.costType === 'SP' || payload.costType === 'GREEN_TOKEN' || payload.costType === 'EP') {
                    payload.cost += 1;
                    return { removeTags: 1, log: "Impair triggered: Action cost increased by 1." };
                }
                return null;
            }
        },
        "SLOW": {
            onTurnStart: (payload, tagCount) => {
                payload.actionPool = Math.max(1, payload.actionPool - 1);
                return { removeTags: 1, log: "Slow triggered: Action pool reduced by 1." };
            }
        },
        "DAZE": {
            onAttackPreMath: (payload, tagCount) => {
                payload.evModifier = (payload.evModifier || 0) - tagCount;
                return { removeTags: 1, log: `Daze triggered: EV reduced by ${tagCount}.` };
            }
        },
        "CURSE": {
            onAttackPreMath: (payload, tagCount) => {
                payload.hasDisadvantage = true;
                return { removeTags: 1, log: "Curse triggered: Roll suffers Disadvantage." };
            }
        },
        "BIND": {
            onMovePreMath: (payload, tagCount) => {
                payload.isImmobilized = true;
                return { removeTags: 0, log: "Bind active: Movement or positional shift prevented." }; 
            }
        },
        "WEAKEN": {
            onDefensePreMath: (payload, tagCount) => {
                payload.rvModifier = (payload.rvModifier || 0) - tagCount;
                return { removeTags: 1, log: `Weaken triggered: Resistance reduced by ${tagCount}.` };
            }
        },
        "BLIGHT": {
            onActionPostMath: (result, tagCount) => {
                result.mutations.selfDamage = (result.mutations.selfDamage || 0) + 1;
                return { removeTags: 1, log: "Blight triggered: Suffered 1 unavoidable Value Loss." };
            }
        },
        "SILENCE": {
            onAttackPreMath: (payload, tagCount) => {
                if (payload.activeKeywords && payload.activeKeywords.length > 0) {
                    payload.activeKeywords =[]; 
                    return { removeTags: 1, log: "Silence triggered: All Active Keywords stripped from action." };
                }
                return null;
            }
        },
        "NULLIFY": {
            onTurnStart: (payload, tagCount) => {
                payload.passivesDisabled = true;
                return { removeTags: 1, log: "Nullify triggered: Passive Keywords disabled for this turn." };
            }
        },

        // --- BOOST TAGS (Buffs - Player chooses to expend) ---
        "LIBERATE": {
            onMovePreMath: (payload, isExpending) => {
                if (isExpending && payload.isImmobilized) {
                    payload.isImmobilized = false;
                    return { removeTags: 1, log: "Liberate expended: Immobilization negated." };
                }
                return null;
            }
        },
        "AUGMENT": {
            onAttackPreMath: (payload, isExpending) => {
                if (isExpending && payload.augmentKeywordId) {
                    payload.activeKeywords.push(payload.augmentKeywordId);
                    return { removeTags: 1, log: `Augment expended: Added keyword [${payload.augmentKeywordId}].` };
                }
                return null;
            }
        },
        "HASTE": {
            onTurnStart: (payload, isExpending) => {
                if (isExpending) {
                    payload.actionPool += 1;
                    return { removeTags: 1, log: "Haste expended: Gained 1 additional action." };
                }
                return null;
            }
        },
        "WARD": {
            onDefensePreMath: (payload, isExpending) => {
                if (isExpending) {
                    payload.negateIncomingEffect = true;
                    return { removeTags: 1, log: "Ward expended: Incoming attack completely negated." };
                }
                return null;
            }
        },
        "BLESS": {
            onAttackPreMath: (payload, isExpending) => {
                if (isExpending) {
                    payload.hasAdvantage = true;
                    return { removeTags: 1, log: "Bless expended: Gained Advantage on roll." };
                }
                return null;
            }
        },
        "CHARGE": {
            onActionCost: (payload, isExpending) => {
                if (isExpending && payload.costType === 'EP') {
                    payload.cost = Math.max(0, payload.cost - 1);
                    return { removeTags: 1, log: "Charge expended: EP cost reduced by 1." };
                }
                return null;
            }
        },
        "CURE": {
            onFreeAction: (payload, isExpending) => {
                if (isExpending && payload.targetStatusTag) {
                    payload.tagsToRemoveFromActor = { [payload.targetStatusTag]: 1 };
                    return { removeTags: 1, log: `Cure expended: Purged ${payload.targetStatusTag} Status Tag.` };
                }
                return null;
            }
        },
        "REGEN": {
            onActionPostMath: (result, isExpending) => {
                if (isExpending) {
                    result.mutations.hpDelta = (result.mutations.hpDelta || 0) + 1;
                    return { removeTags: 1, log: "Regen expended: Restored 1 HP." };
                }
                return null;
            }
        },
        "ENHANCE": {
            onAttackPostMath: (result, payload) => {
                if (payload.isExpendingEnhance) {
                    const influenceStat = payload.actorStats.I || 1;
                    result.mutations.evModifier = (result.mutations.evModifier || 0) + influenceStat;
                    return { removeTags: 1, log: `Enhance expended: Added +${influenceStat} to final EV.` };
                }
                return null;
            }
        },
        "OBSCURE": {
            onActionPostMath: (result, isExpending) => {
                if (isExpending) {
                    result.mutations.addCondition = 'HIDDEN';
                    return { removeTags: 1, log: "Obscure expended: Unit is now Hidden." };
                }
                return null;
            }
        }
    },

    // =======================================================================
    // 2. THE COMPLETE KEYWORD LOGIC REGISTRY (100 Keywords)
    // =======================================================================
    
    KEYWORDS: {
        // --- COLOR 0: NULL ---
        "0.0": {
            TTRPG:   { onActionCost: (payload) => { payload.costMultiplier = 2; } },
            TACTICS: { onTurnStart: (payload) => { payload.maxYellowTokens -= 1; payload.maxGreenTokens -= 1; } },
            CARDS:   { onActionCost: (payload) => { if (payload.actionType === 'DEPLOY' || payload.actionType === 'EQUIP') payload.cost += 1; } }
        },
        "0.1": {
            TTRPG:   { onAttackPreMath: (payload) => { payload.hasAdvantage = true; } },
            TACTICS: { onAttackPreMath: (payload) => { payload.ignoreInterception = true; } },
            CARDS:   { onAttackPreMath: (payload) => { payload.evModifier = (payload.evModifier || 0) + 1; } }
        },
        "0.2": {
            TTRPG:   { onAttackPreMath: (payload) => { if (payload.isSpecialistCategory) payload.hasAdvantage = true; } },
            TACTICS: { onAttackPostMath: (result, payload) => { if (payload.usedHighestStat) result.mutations.targetDamage += 1; } },
            CARDS:   { onAttackPostMath: (result, payload) => { if (payload.augmentedKeywordsCount > 0) result.mutations.drawCards = 1; } }
        },
        "0.3": {
            TTRPG:   { onDefensePreMath: (payload) => { payload.cannotBeSurprised = true; } },
            TACTICS: { onAttackPreMath: (payload) => { if (payload.targetRow === 1) payload.hasAdvantage = true; } }
        },
        "0.4": {
            ALL:     { onAttackPostMath: (result) => { result.mutations.applyTagsToTarget = { 'LIBERATE': 1 }; } }
        },
        "0.5": {
            ALL:     { onAttackPostMath: (result) => { result.mutations.applyTagsToTarget = { 'MARK': 1 }; } }
        },
        "0.6": {
            TTRPG:   { onAttackPreMath: (payload) => { payload.ignoreCover = true; } },
            TACTICS: { onAttackPreMath: (payload) => { payload.ignoreBlockValue = true; } }
        },
        "0.7": {
            TTRPG:   { onAttackPreMath: (payload) => { payload.targetResource = payload.chosenResourceOverride || 'HP'; } },
            TACTICS: { onAttackPostMath: (result, payload) => { 
                result.mutations.targetDamage = 0; 
                result.mutations.targetTokenLoss = { type: payload.chosenTokenType || 'YELLOW', amount: 1 }; 
            }}
        },
        "0.8": {
            TTRPG:   { onAttackPreMath: (payload) => { payload.replaceStatsWithD10 = true; } },
            TACTICS: { onAttackPreMath: (payload) => { payload.replaceStatsWithD10 = true; } }
        },
        "0.9": {
            TACTICS: { onAttackPostMath: (result) => { result.mutations.disableTargetPassive = true; } },
            DICE:    { onAttackPostMath: (result) => { result.mutations.swapMatrixTokens = true; } }
        },

        // --- COLOR 1: SILVER ---
        "1.0": {
            ALL:     { onDefensePreMath: (payload) => { if (payload.incomingColor === payload.baneColor) payload.hasDisadvantage = true; } }
        },
        "1.1": {
            TACTICS: { onAttackPreMath: (payload) => { payload.hasDisadvantage = false; payload.ignoreRangePenalties = true; } },
            CARDS:   { onAttackPreMath: (payload) => { payload.ignoreGuardianPrecedence = true; } }
        },
        "1.2": {
            TACTICS: { onDefensePreMath: (payload) => { if (payload.incomingDistance === 1) payload.rvModifier = (payload.rvModifier || 0) + 1; } },
            CARDS:   { onDefensePostMath: (result, payload) => { if (result.mutations.survival) result.mutations.recoilDamageToAttacker = 1; } }
        },
        "1.3": {
            TACTICS: { onAttackPreMath: (payload) => { payload.useAllyStatForEV = true; } },
            CARDS:   { onAttackPreMath: (payload) => { payload.useAnimationExpForEV = true; } }
        },
        "1.4": {
            ALL:     { onAttackPostMath: (result) => { result.mutations.applyTagsToTarget = { 'AUGMENT': 1 }; } }
        },
        "1.5": {
            ALL:     { onAttackPostMath: (result) => { result.mutations.applyTagsToTarget = { 'IMPAIR': 1 }; } }
        },
        "1.6": {
            TACTICS: { onDefensePreMath: (payload) => { if (payload.isDodge) payload.rvModifier = (payload.rvModifier || 0) + payload.actorStats.A; } },
            CARDS:   { onDefensePreMath: (payload) => { payload.allowExtraCardDiscardForRV = true; } }
        },
        "1.7": {
            TACTICS: { onAttackPreMath: (payload) => { payload.ignoreInterception = true; payload.ignoreResistance = true; payload.fixedDamage = 1; } },
            CARDS:   { onAttackPreMath: (payload) => { payload.uncancellableDamage = true; payload.ignoreSacrifice = true; } }
        },
        "1.8": {
            TTRPG:   { onAttackPostMath: (result) => { if (result.mutations.isCritical) result.mutations.criticalChoices = 2; } },
            TACTICS: { onAttackPostMath: (result) => { if (result.mutations.isCritical) result.mutations.targetDamage += 1; } },
            CARDS:   { onAttackPostMath: (result, payload) => { if (payload.actionType === 'CRITICAL_STRIKE') result.mutations.targetDamage += 1; } }
        },
        "1.9": {
            TACTICS: { onAttackPostMath: (result) => { result.mutations.forceTargetRelocation = true; } },
            CARDS:   { onAttackPostMath: (result) => { result.mutations.returnTargetToHand = true; result.mutations.targetDamage = 0; } }
        },

        // --- COLOR 2: YELLOW ---
        "2.0": {
            TACTICS: { onTurnStart: (payload) => { payload.maxYellowTokens -= 1; } },
            CARDS:   { onAttackPreMath: (payload) => { if (payload.actionType === 'CRITICAL_STRIKE') payload.isInvalid = true; } }
        },
        "2.1": {
            TTRPG:   { onMovePreMath: (payload) => { payload.ignoreTerrainPenalties = true; } },
            TACTICS: { onAttackPreMath: (payload) => { payload.ignoreRangeDisadvantage = true; } }
        },
        "2.2": {
            TACTICS: { onAttackPostMath: (result) => { result.mutations.revealTargetPassives = true; } },
            CARDS:   { onAttackPreMath: (payload) => { payload.revealDefenderHand = true; } }
        },
        "2.3": {
            TACTICS: { onAttackPreMath: (payload) => { if (payload.previouslyTargeted) payload.hasAdvantage = true; } },
            CARDS:   { onAttackPreMath: (payload) => { if (payload.previouslyTargeted) payload.evModifier = (payload.evModifier || 0) + 1; } }
        },
        "2.4": {
            ALL:     { onAttackPostMath: (result) => { result.mutations.applyTagsToTarget = { 'HASTE': 1 }; } }
        },
        "2.5": {
            ALL:     { onAttackPostMath: (result) => { result.mutations.applyTagsToTarget = { 'SLOW': 1 }; } }
        },
        "2.6": {
            TTRPG:   { onDefensePreMath: (payload) => { payload.reactionsDisabled = true; } },
            TACTICS: { onAttackPreMath: (payload) => { payload.targetDefenseless = true; } },
            DICE:    { onAttackPreMath: (payload) => { payload.respondActionsDisabled = true; } }
        },
        "2.7": {
            TTRPG:   { onAttackPreMath: (payload) => { payload.statMultiplier = 2; } },
            TACTICS: { onAttackPreMath: (payload) => { payload.evModifier = (payload.evModifier || 0) + payload.actorStats.W; } }
        },
        "2.8": {
            TACTICS: { onAttackPostMath: (result) => { result.mutations.triggerSecondaryBasicAttack = true; } },
            DICE:    { onAttackPostMath: (result) => { result.mutations.splitDamageIntoInstances = true; } }
        },
        "2.9": {
            ALL:     { onAttackPreMath: (payload) => { payload.actorCondition = 'EXPOSED'; payload.evModifier = (payload.evModifier || 0) + 2; payload.targetRvModifier = -99; } }
        },

        // --- COLOR 3: GREEN ---
        "3.0": {
            TTRPG:   { onDefensePreMath: (payload) => { payload.hasDisadvantage = true; } },
            TACTICS: { onDefensePreMath: (payload) => { payload.hasDisadvantage = true; } }
        },
        "3.1": {
            TACTICS: { onDefensePreMath: (payload) => { payload.immuneToShove = true; if (payload.actorRow === 1) payload.rvModifier = (payload.rvModifier || 0) + 1; } }
        },
        "3.2": {
            TACTICS: { onAttackPostMath: (result) => { result.mutations.shoveTarget = true; } },
            CARDS:   { onAttackPostMath: (result) => { result.mutations.forceDefenderDiscard = 1; } }
        },
        "3.3": {
            TTRPG:   { onAttackPostMath: (result, payload) => { if (!result.success && payload.sp >= 1) result.mutations.allowReroll = true; } }
        },
        "3.4": {
            ALL:     { onAttackPostMath: (result) => { result.mutations.applyTagsToTarget = { 'WARD': 1 }; } }
        },
        "3.5": {
            ALL:     { onAttackPostMath: (result) => { result.mutations.applyTagsToTarget = { 'DAZE': 1 }; } }
        },
        "3.6": {
            TACTICS: { onAttackPostMath: (result) => { result.mutations.spawnBarrierAdjacent = true; } }
        },
        "3.7": {
            TACTICS: { onDefensePreMath: (payload) => { payload.rvModifier = (payload.rvModifier || 0) + payload.actorStats.B; } }
        },
        "3.8": {
            TACTICS: { onAttackPostMath: (result, payload) => { if (payload.targetRow === 1) result.mutations.targetDamage += 1; } }
        },
        "3.9": {
            TACTICS: { onAttackPostMath: (result) => { result.mutations.swapTargetAndAllyPosition = true; } }
        },

        // --- COLOR 4: BLACK ---
        "4.0": {
            TTRPG:   { onAttackPreMath: (payload) => { if (['R','A','B'].includes(payload.chosenStat)) payload.hasDisadvantage = true; } },
            TACTICS: { onAttackPreMath: (payload) => { payload.actorStats.E -= 1; } }
        },
        "4.1": {
            ALL:     { onDefensePostMath: (result) => { if (result.mutations.hpDelta <= -result.currentHp) result.mutations.surviveAtOneHP = true; } }
        },
        "4.2": {
            TTRPG:   { onAttackPreMath: (payload) => { payload.hasAdvantage = false; payload.hasDisadvantage = false; } },
            CARDS:   { onAttackPreMath: (payload) => { if (payload.noDiscardFuel) payload.evModifier = (payload.evModifier || 0) + (payload.actorStats.E * 2); } }
        },
        "4.3": {
            TACTICS: { onAttackPreMath: (payload) => { payload.ignoreTargetPassives = true; } }
        },
        "4.4": {
            ALL:     { onAttackPostMath: (result) => { result.mutations.applyTagsToTarget = { 'BLESS': 1 }; } }
        },
        "4.5": {
            ALL:     { onAttackPostMath: (result) => { result.mutations.applyTagsToTarget = { 'CURSE': 1 }; } }
        },
        "4.6": {
            TACTICS: { onAttackPreMath: (payload) => { payload.ignoreInterception = true; payload.ignoreBlockValue = true; payload.fixedDamage = 1; } },
            CARDS:   { onAttackPostMath: (result) => { result.mutations.damageToPlayerDirectly = true; } }
        },
        "4.7": {
            TTRPG:   { onAttackPreMath: (payload) => { if (payload.sacrificeHP) { payload.hpDelta = -1; payload.evModifier = (payload.evModifier || 0) + 1; } } },
            TACTICS: { onAttackPreMath: (payload) => { payload.hpDelta = -1; payload.evModifier = (payload.evModifier || 0) + 1; } }
        },
        "4.8": {
            ALL:     { onAttackPostMath: (result) => { if (result.mutations.targetDamage > 0) result.mutations.healAmount = 1; } }
        },
        "4.9": {
            TACTICS: { onAttackPostMath: (result) => { result.mutations.spawnShadowConstruct = true; } },
            CARDS:   { onAttackPostMath: (result) => { result.mutations.retrieveAnimationFromDiscard = true; } }
        },

        // --- COLOR 5: ORANGE ---
        "5.0": {
            TTRPG:   { onAttackPreMath: (payload) => { payload.criticalMissOnOne = true; } },
            TACTICS: { onAttackPreMath: (payload) => { payload.loseGreenTokenOnOne = true; } }
        },
        "5.1": {
            ALL:     { onAttackPreMath: (payload) => { payload.ignoreHidden = true; payload.ignoreObscured = true; } }
        },
        "5.2": {
            TTRPG:   { onAttackPreMath: (payload) => { payload.addLevelToImprovised = true; } },
            TACTICS: { onAttackPreMath: (payload) => { payload.copyAdjacentAllyKeyword = true; } }
        },
        "5.3": {
            TTRPG:   { onActionCost: (payload) => { payload.noMaxSpReduction = true; } },
            TACTICS: { onAttackPostMath: (result) => { result.mutations.restoreModCharge = true; } }
        },
        "5.4": {
            ALL:     { onAttackPostMath: (result) => { result.mutations.applyTagsToTarget = { 'CHARGE': 1 }; } }
        },
        "5.5": {
            ALL:     { onAttackPostMath: (result) => { result.mutations.applyTagsToTarget = { 'BIND': 1 }; } }
        },
        "5.6": {
            TACTICS: { onAttackPostMath: (result) => { result.mutations.copyTagToAdjacentEnemy = true; } },
            CARDS:   { onAttackPreMath: (payload) => { payload.allowCodexKeywordAddition = true; } }
        },
        "5.7": {
            TTRPG:   { onAttackPreMath: (payload) => { if (payload.consumeItem) payload.evModifier = (payload.evModifier || 0) + payload.actorStats.E; } },
            CARDS:   { onAttackPreMath: (payload) => { if (payload.sacrificeItem) payload.preventDefenderDiscard = true; } }
        },
        "5.8": {
            TTRPG:   { onMovePreMath: (payload) => { payload.hasAdvantage = true; } },
            TACTICS: { onAttackPreMath: (payload) => { if (payload.actorTagsCount > 0) payload.evModifier = (payload.evModifier || 0) + 1; } }
        },
        "5.9": {
            TACTICS: { onAttackPostMath: (result) => { result.mutations.manifestSentryMod = true; } },
            CARDS:   { onAttackPostMath: (result) => { result.mutations.drawTopCardIfItem = true; } }
        },

        // --- COLOR 6: WHITE ---
        "6.0": {
            ALL:     { onDefensePreMath: (payload) => { payload.attackerHasAdvantage = true; } }
        },
        "6.1": {
            ALL:     { onDefensePostMath: (result) => { result.mutations.negateNextStatusTag = true; } }
        },
        "6.2": {
            TTRPG:   { onAttackPreMath: (payload) => { payload.allowCalledShotWithoutAdvantage = true; } },
            TACTICS: { onAttackPreMath: (payload) => { if (payload.isCritical) payload.ignoreResistance = true; } }
        },
        "6.3": {
            ALL:     { onAttackPostMath: (result) => { result.mutations.purgeAllTagsOnTarget = true; } }
        },
        "6.4": {
            ALL:     { onAttackPostMath: (result) => { result.mutations.applyTagsToTarget = { 'CURE': 1 }; } }
        },
        "6.5": {
            ALL:     { onAttackPostMath: (result) => { result.mutations.applyTagsToTarget = { 'WEAKEN': 1 }; } }
        },
        "6.6": {
            TACTICS: { onAttackPostMath: (result) => { result.mutations.applyDelayedBlastTag = true; } },
            CARDS:   { onAttackPostMath: (result) => { if (result.mutations.damageDealt > 0) result.mutations.suppressTarget = true; } }
        },
        "6.7": {
            TTRPG:   { onAttackPostMath: (result, payload) => { result.mutations.healAmount = payload.actorStats.T || 1; result.mutations.targetDamage = 0; } },
            TACTICS: { onAttackPostMath: (result) => { result.mutations.healAmount = 1; result.mutations.targetDamage = 0; } }
        },
        "6.8": {
            ALL:     { onAttackPreMath: (payload) => { if (payload.targetTagsCount > 0) payload.evModifier = (payload.evModifier || 0) + 1; } },
            TTRPG:   { onAttackPostMath: (result, payload) => { if (payload.removeTargetTag) result.mutations.targetDamage += 1; } }
        },
        "6.9": {
            TTRPG:   { onAttackPostMath: (result) => { result.mutations.alterAmbientStage = true; } },
            TACTICS: { onAttackPostMath: (result) => { result.mutations.increaseTargetLevel = 1; } }
        },

        // --- COLOR 7: RED ---
        "7.0": {
            TTRPG:   { onTurnStart: (payload) => { payload.maxHp -= 5; payload.maxSp -= 5; payload.maxEp -= 5; } },
            TACTICS: { onTurnStart: (payload) => { payload.maxGreenTokens -= 1; } }
        },
        "7.1": {
            TTRPG:   { onTurnStart: (payload) => { payload.maxHp += 5; payload.maxSp += 5; payload.maxEp += 5; } },
            TACTICS: { onAttackPreMath: (payload) => { payload.rvModifier = (payload.rvModifier || 0) + payload.actorLevel; } }
        },
        "7.2": {
            TTRPG:   { onActionCost: (payload) => { payload.allowHpForEpSwap = true; } },
            TACTICS: { onAttackPreMath: (payload) => { if (payload.hpDelta < 0) payload.evModifier = (payload.evModifier || 0) + 1; } }
        },
        "7.3": {
            ALL:     { onDefensePreMath: (payload) => { payload.immuneToBlight = true; payload.immuneToAmbient = true; } },
            TACTICS: { onAttackPreMath: (payload) => { payload.ignoreInterception = true; payload.ignoreObscured = true; } }
        },
        "7.4": {
            ALL:     { onAttackPostMath: (result) => { result.mutations.applyTagsToTarget = { 'REGEN': 1 }; } }
        },
        "7.5": {
            ALL:     { onAttackPostMath: (result) => { result.mutations.applyTagsToTarget = { 'BLIGHT': 1 }; } }
        },
        "7.6": {
            TTRPG:   { onAttackPreMath: (payload) => { payload.targetAllInRadius = payload.actorStats.T; payload.ignoreLevelInEV = true; } },
            TACTICS: { onAttackPostMath: (result) => { result.mutations.damageAdjacentEnemies = 1; } }
        },
        "7.7": {
            TTRPG:   { onAttackPreMath: (payload) => { payload.ignoreRangePenalties = true; } },
            CARDS:   { onAttackPreMath: (payload) => { payload.ignoreExpertiseModifier = true; } }
        },
        "7.8": {
            TTRPG:   { onAttackPostMath: (result, payload) => { result.mutations.additionalTargets = payload.actorStats.T; result.mutations.ignoreLevelInEV = true; } },
            TACTICS: { onAttackPostMath: (result) => { result.mutations.targetAdditionalRowEnemy = true; } }
        },
        "7.9": {
            TTRPG:   { onAttackPostMath: (result, payload) => { result.mutations.splitIntoAnimations = payload.actorStats.T; } },
            TACTICS: { onAttackPostMath: (result) => { result.mutations.spawnEchoFragment = true; } }
        },

        // --- COLOR 8: BLUE ---
        "8.0": {
            TTRPG:   { onAttackPreMath: (payload) => { if (['W','E','T'].includes(payload.chosenStat)) payload.hasDisadvantage = true; } },
            CARDS:   { onAttackPreMath: (payload) => { payload.requireAdditionalDiscard = true; } }
        },
        "8.1": {
            TTRPG:   { onAttackPreMath: (payload) => { payload.targetHasDisadvantageOnDefense = true; } },
            TACTICS: { onAttackPreMath: (payload) => { payload.targetHasDisadvantageOnDodge = true; } }
        },
        "8.2": {
            TACTICS: { onAttackPostMath: (result) => { result.mutations.restoreAdjacentAllyYellowToken = true; } },
            CARDS:   { onAttackPreMath: (payload) => { payload.boostAllyPwr = 1; } }
        },
        "8.3": {
            TTRPG:   { onAttackPostMath: (result) => { result.mutations.freeClue = true; } },
            TACTICS: { onAttackPostMath: (result) => { result.mutations.revealEnemyTokens = true; } }
        },
        "8.4": {
            ALL:     { onAttackPostMath: (result) => { result.mutations.applyTagsToTarget = { 'ENHANCE': 1 }; } }
        },
        "8.5": {
            ALL:     { onAttackPostMath: (result) => { result.mutations.applyTagsToTarget = { 'SILENCE': 1 }; } }
        },
        "8.6": {
            TACTICS: { onAttackPostMath: (result) => { result.mutations.applyActiveKeywordsToAdjacent = true; result.mutations.targetDamage = 0; } },
            CARDS:   { onAttackPostMath: (result) => { result.mutations.applyKeywordsToSecondaryTarget = true; } }
        },
        "8.7": {
            ALL:     { onAttackPostMath: (result) => { result.mutations.doubleAppliedTags = true; } }
        },
        "8.8": {
            TACTICS: { onAttackPostMath: (result) => { result.mutations.moveTargetStatusTagToAnotherEnemy = true; } },
            CARDS:   { onAttackPostMath: (result) => { result.mutations.secondaryTargetDamage = 1; } }
        },
        "8.9": {
            ALL:     { onAttackPostMath: (result) => { result.mutations.applyTagsEvenOnMiss = true; result.mutations.targetDamage = 0; } }
        },

        // --- COLOR 9: PURPLE ---
        "9.0": {
            TTRPG:   { onAttackPreMath: (payload) => { if (['P','I','F'].includes(payload.chosenStat)) payload.hasDisadvantage = true; } },
            CARDS:   { onAttackPreMath: (payload) => { payload.cannotUsePersonalCodex = true; } }
        },
        "9.1": {
            TTRPG:   { onAttackPostMath: (result) => { result.mutations.revealTargetPassives = true; } },
            TACTICS: { onAttackPostMath: (result) => { result.mutations.revealTargetAndAdjacentPassives = true; } }
        },
        "9.2": {
            TTRPG:   { onAttackPostMath: (result) => { result.mutations.freeHideAction = true; } },
            TACTICS: { onAttackPostMath: (result) => { result.mutations.freeHideAction = true; } }
        },
        "9.3": {
            ALL:     { onDefensePreMath: (payload) => { payload.attackerHasDisadvantage = true; } },
            CARDS:   { onDefensePostMath: (result) => { result.mutations.forceAttackerDiscard = 1; } }
        },
        "9.4": {
            ALL:     { onAttackPostMath: (result) => { result.mutations.applyTagsToTarget = { 'OBSCURE': 1 }; } }
        },
        "9.5": {
            ALL:     { onAttackPostMath: (result) => { result.mutations.applyTagsToTarget = { 'NULLIFY': 1 }; } }
        },
        "9.6": {
            TTRPG:   { onAttackPostMath: (result) => { result.mutations.chainToAdjacentFixed1Damage = true; } },
            TACTICS: { onAttackPostMath: (result) => { result.mutations.chainToAdjacentFixed1Damage = true; } }
        },
        "9.7": {
            TACTICS: { onAttackPreMath: (payload) => { payload.ignoreSilence = true; } },
            CARDS:   { onTurnStart: (payload) => { payload.maxItems += 1; } }
        },
        "9.8": {
            TTRPG:   { onAttackPostMath: (result, payload) => { result.mutations.alterHazardSteps = payload.actorStats.T; } },
            TACTICS: { onAttackPostMath: (result) => { result.mutations.alterAmbientStageGlobal = 1; } }
        },
        "9.9": {
            TTRPG:   { onAttackPostMath: (result, payload) => { result.mutations.sharePassivesWithTarget = payload.actorStats.T; } },
            TACTICS: { onAttackPostMath: (result) => { result.mutations.sharePassivesWithTarget = 99; } }
        }
    },

    // =======================================================================
    // 3. THE MIDDLEWARE EXECUTORS
    // =======================================================================

    /**
     * Intercepts the action before the engine does its math.
     * Modifies EV, RV, Costs, Advantage, Disadvantage, etc.
     */
    applyPreMathModifiers(payload, actorState, targetState, mode) {
        let logs =[];

        // 1. Process Status Tags on Actor
        if (actorState.tags) {
            for (const [tagId, count] of Object.entries(actorState.tags)) {
                if (count > 0 && this.TAGS[tagId] && this.TAGS[tagId].onAttackPreMath) {
                    const res = this.TAGS[tagId].onAttackPreMath(payload, count);
                    if (res) {
                        logs.push(res.log);
                        if (res.removeTags > 0) payload.tagsToRemoveFromActor = { [tagId]: res.removeTags };
                    }
                }
            }
        }

        // 2. Process Status Tags on Target
        if (targetState && targetState.tags) {
            for (const[tagId, count] of Object.entries(targetState.tags)) {
                if (count > 0 && this.TAGS[tagId] && this.TAGS[tagId].onDefensePreMath) {
                    const res = this.TAGS[tagId].onDefensePreMath(payload, count);
                    if (res) {
                        logs.push(res.log);
                        if (res.removeTags > 0) payload.tagsToRemoveFromTarget = { [tagId]: res.removeTags };
                    }
                }
            }
        }

        // 3. Process Active Keywords (Engine specific + ALL)
        if (payload.activeKeywords) {
            payload.activeKeywords.forEach(kwCode => {
                if (this.KEYWORDS[kwCode]) {
                    // Check mode-specific logic
                    if (this.KEYWORDS[kwCode][mode] && this.KEYWORDS[kwCode][mode].onAttackPreMath) {
                        this.KEYWORDS[kwCode][mode].onAttackPreMath(payload);
                        logs.push(`Keyword [${kwCode}] PreMath applied for ${mode}.`);
                    }
                    // Check universal (ALL) logic
                    if (this.KEYWORDS[kwCode]['ALL'] && this.KEYWORDS[kwCode]['ALL'].onAttackPreMath) {
                        this.KEYWORDS[kwCode]['ALL'].onAttackPreMath(payload);
                        logs.push(`Keyword [${kwCode}] PreMath applied (Universal).`);
                    }
                }
            });
        }

        return logs;
    },

    /**
     * Intercepts the action after the engine finishes its math.
     * Modifies Damage Dealt, Clocks, Secondary Effects, Karma, and enforces limits.
     */
    applyPostMathModifiers(result, payload, mode) {
        if (!result.mutations) result.mutations = {};

        // 1. Process Active Keywords Post-Math
        if (payload.activeKeywords) {
            payload.activeKeywords.forEach(kwCode => {
                if (this.KEYWORDS[kwCode]) {
                    if (this.KEYWORDS[kwCode][mode] && this.KEYWORDS[kwCode][mode].onAttackPostMath) {
                        this.KEYWORDS[kwCode][mode].onAttackPostMath(result, payload);
                    }
                    if (this.KEYWORDS[kwCode]['ALL'] && this.KEYWORDS[kwCode]['ALL'].onAttackPostMath) {
                        this.KEYWORDS[kwCode]['ALL'].onAttackPostMath(result, payload);
                    }
                }
            });
        }
        
        // 2. Process Blight Post-Action damage
        if (payload.actorTags && payload.actorTags['BLIGHT'] > 0) {
            const res = this.TAGS['BLIGHT'].onActionPostMath(result, payload.actorTags['BLIGHT']);
            if (res) result.logs.push(res.log);
        }

        // 3. AUDIT PATCH: Enforce the 5 Boost / 5 Status Tag Maximums
        if (result.mutations.applyTagsToTarget) {
            // Signal the State Manager/UI to enforce the ceiling when applying these tags
            result.mutations.enforceTagLimits = { maxStatus: 5, maxBoost: 5 };
        }

        return result;
    }
};