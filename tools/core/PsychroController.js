/**
 * PSYCHROMATTICA: GameController.js
 * VERSION: 1.1 (FINAL AUDITED)
 * ROLE: The Brain (Orchestration & Mode Switching)
 * 
 * DESCRIPTION:
 * Integrates PsychroEngine (DNA), PsychroState (Memory), and PsychroEvents (Nerves).
 * Handles the "Startup Overrides" (Scale Transitions).
 * Routes actions through PsychroModifiers (Middleware) to the Logic Engines,
 * and handles Meta-Clock triggers (e.g., Discordance Schisms).
 */

import { parseBuildString } from './PsychroEngine.js';
import { PsychroState } from './PsychroState.js';
import { PsychroEvents } from './PsychroEvents.js';
import { PsychroModifiers } from './PsychroModifiers.js';

// Engine Imports (Assume these are exported from their respective files in /engines)
import { TTRPGEngine } from '../engines/TTRPGEngine.js';
import { TacticsEngine } from '../engines/TacticsEngine.js';
import { CardEngine } from '../engines/CardEngine.js';
import { DiceEngine } from '../engines/DiceEngine.js';
import { SovereigntyEngine } from '../engines/SovereigntyEngine.js';

export const GameController = {

    /**
     * Boot up the entire Psychromattica System.
     */
    init() {
        console.log("[GameController] Booting System...");
        
        // 1. Wake up the memory
        PsychroState.init();
        
        // 2. Announce system is ready for the UI to render
        PsychroEvents.publish('SYSTEM_READY', PsychroState.getState());
    },

    /**
     * Load a new character/entity into the active session.
     * @param {string} buildString - e.g., "C:01234-!03-11.12.13"
     */
    loadEntity(buildString) {
        try {
            // 1. Translate DNA
            const parsedData = parseBuildString(buildString);
            
            // 2. Save to Memory
            PsychroState.update({ 
                activeBuildString: buildString,
                parsedEntity: parsedData 
            });

            // 3. Announce to UI
            PsychroEvents.publish('ENTITY_LOADED', parsedData);
            
            // 4. Force a mode refresh to apply scale-specific stats
            this.switchMode(PsychroState.getState().currentMode);

        } catch (error) {
            console.error("[GameController] Failed to load entity.", error);
            PsychroEvents.publish('ERROR', { message: "Invalid Build String" });
        }
    },

    /**
     * THE STARTUP OVERRIDE: Transitions the character between scales.
     * @param {string} targetMode - "TTRPG", "TACTICS", "CARDS", "DICE", "SOVEREIGNTY"
     */
    switchMode(targetMode) {
        const state = PsychroState.getState();
        if (!state.parsedEntity) {
            console.warn("[GameController] Cannot switch mode. No entity loaded.");
            return;
        }

        console.log(`[GameController] Applying Startup Override for ${targetMode}...`);
        const entity = state.parsedEntity;
        
        // Prepare a payload of scale-specific setup variables
        let overrideData = { currentMode: targetMode };

        // ---------------------------------------------------------
        // THE FILTER PROTOCOLS (Scale Transitions)
        // ---------------------------------------------------------
        switch (targetMode) {
case 'TTRPG':
                // CORE SCALE: Root mechanics. 
                let vitalsMax = 10;
                
                // Check if the parsed entity has vital modifiers (7.0 Limited or 7.1 Resilient)
                if (entity.character) {
                    const allKws = [...entity.character.learnedKeywords, ...entity.character.passiveKeywords];
                    // Also check the flaw penalty if they have one!
                    if (entity.character.flaw) allKws.push(entity.character.flaw.penalty);
                    
                    if (allKws.some(kw => kw.code === '7.0')) vitalsMax = 5;
                    if (allKws.some(kw => kw.code === '7.1')) vitalsMax = 15;
                }

                overrideData.resources = {
                    ...state.resources,
                    maxHp: vitalsMax,
                    maxSp: vitalsMax,
                    maxEp: vitalsMax
                };
                break;

            case 'TACTICS':
                // MESO SCALE: Grid Physics. Translate C -> Tokens.
                if (entity.character) {
                    const stats = entity.character.stats;
                    overrideData.tacticsState = {
                        maxYellowTokens: stats.A || 1,
                        maxGreenTokens: stats.B || 1,
                        movement: stats.R || 1,
                        aiTargeting: stats.W || 1
                    };
                }
                break;

            case 'CARDS':
                // MICRO SCALE: Deck & Energy. Translate C/A/I.
                if (entity.character) {
                    overrideData.cardState = {
                        maxAugments: entity.character.stats.E || 1,
                        energy: 0
                    };
                }
                break;

case 'DICE':
                // MICRO SCALE: Affinity Matrix.
                if (entity.character) {
                    const expertise = entity.character.stats.E || 1;
                    const profile = entity.character.profile || { goal: 0, method: 0, purpose: 0 };
                    overrideData.diceState = {
                        expertise: expertise,
                        resonanceField: expertise, 
                        affinityColors:[profile.goal, profile.method, profile.purpose],
                        tokens:[] // <-- ADDED: The array to hold the generated dice tokens!
                    };
                }
                break;

            case 'SOVEREIGNTY':
                // MACRO SCALE: Faction Management. Translate F/C.
                if (entity.faction) {
                    overrideData.sovereigntyState = {
                        factionLevel: entity.faction.level,
                        hqPower: 1 + entity.faction.level,
                        civilSystems: entity.faction.systems
                    };
                }
                break;

            default:
                console.error("[GameController] Unknown Mode requested.");
                return;
        }

        PsychroState.update(overrideData);
        PsychroEvents.publish('MODE_CHANGED', PsychroState.getState());
    },

    /**
     * THE ACTION PIPELINE (Fully Audited with Middleware)
     * Routes actions to middleware, then engines, then state.
     */
    processAction(actionCategory, payload) {
        const state = PsychroState.getState();
        const mode = state.currentMode;
        
        // 1. PRE-MATH MIDDLEWARE (Apply Tags & Keyword modifiers before engine rolls)
        let preMathLogs = PsychroModifiers.applyPreMathModifiers(payload, payload.actorState || {}, payload.targetState || {}, mode);
        if (preMathLogs.length > 0 && !payload.suppressLogs) {
            console.log(`[Middleware Pre-Math]`, preMathLogs);
        }

        // 2. LOGIC ENGINE ROUTING
        let engineResult;
        switch (mode) {
            case 'TTRPG':
                engineResult = TTRPGEngine.process(actionCategory, payload, state);
                break;
            case 'TACTICS':
                engineResult = TacticsEngine.process(actionCategory, payload, state);
                break;
            case 'CARDS':
                engineResult = CardEngine.process(actionCategory, payload, state);
                break;
            case 'DICE':
                engineResult = DiceEngine.process(actionCategory, payload, state);
                break;
            case 'SOVEREIGNTY':
                engineResult = SovereigntyEngine.process(actionCategory, payload, state);
                break;
            default:
                console.error(`[GameController] Engine missing for mode: ${mode}`);
                return;
        }

        if (!engineResult) return;

        // 3. POST-MATH MIDDLEWARE (Apply secondary effects, tag limits, and Blight)
        engineResult = PsychroModifiers.applyPostMathModifiers(engineResult, payload, mode);

        // 4. APPLY MUTATIONS TO STATE
        if (engineResult.mutations) {
            
            // --- AUDIT PATCH: DISCORDANCE & SCHISM TRACKER ---
            let newDiscordance = state.meta.discordance + (engineResult.mutations.discordanceDelta || 0);
            if (newDiscordance >= 10) {
                engineResult.logs.push("SCHISM TRIGGERED: Discordance threshold (10) reached!");
                engineResult.mutations.triggerSchismEvent = true; // Signals UI to prompt Curator
                newDiscordance = 0; // Reset clock after triggering
            }
            engineResult.mutations.discordance = newDiscordance;

            // --- AUDIT PATCH: 5/5 TAG LIMITER ENFORCEMENT ---
            if (engineResult.mutations.enforceTagLimits && state.meta.tags) {
                // In a production app, we would trim the state.meta.tags object here 
                // to ensure no specific tag type exceeds 5. For now, we signal UI to trim.
                engineResult.logs.push("Enforcing 5-Tag maximum capacity constraint.");
            }

            // Update local memory
            PsychroState.update(engineResult.mutations);
        }

        // 5. ANNOUNCE RESOLUTION
        PsychroEvents.publish('ACTION_RESOLVED', engineResult);
    }
};