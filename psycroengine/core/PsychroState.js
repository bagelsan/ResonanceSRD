/**
 * PSYCHROMATTICA: PsychroState.js
 * VERSION: 1.1 (FINAL AUDITED)
 * ROLE: The Memory (Session State, Persistence)
 * 
 * DESCRIPTION:
 * The Single Source of Truth for the current session.
 * Stores the active build string, current mode, dynamic resources,
 * and nested engine states (world, tactics, cards, etc.).
 * Handles localStorage persistence safely.
 * GOLDEN RULE: This file does NO math or game logic. It only stores and retrieves data.
 */

const STATE_KEY = 'psychromattica_session_state';

// The baseline template for a brand new game session
const defaultState = {
    currentMode: "TTRPG",     // Options: TTRPG, TACTICS, CARDS, DICE, SOVEREIGNTY
    activeBuildString: "",    // The raw string, e.g., "[C:01234-!03-11.12.13]"
    parsedEntity: null,       // The expanded JSON object from PsychroEngine.js
    
    // Core Vitals (Tracked persistently across most modes)
    resources: {
        hp: 10, maxHp: 10,
        sp: 10, maxSp: 10,
        ep: 10, maxEp: 10,
        karma: 0,
        // Macro-economy (Sovereignty)
        shards: { 0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0 } 
    },
    
    // Hidden & Temporary Metrics
    meta: {
        resonance: 0,       // Tracks internal narrative alignment (Curator Intervention fuel)
        discordance: 0,     // Tracks narrative debt (Triggers Schism event at 10)
        tags: {}            // Object map to hold active Status/Boost Tags, e.g., { 'DAZE': 1 }
    },

    // Core Scale (TTRPG) World Context
    world: {
        sceneClock: 0,
        situationClock: 0,
        activeTaskClock: 0,
        threatClock: 0,
        isRaceSituation: false
    },

    // Scale-Specific States (Populated by the GameController's Startup Overrides)
    tacticsState: null,
    cardState: null,
    diceState: null,
    sovereigntyState: null
};

// The private state object currently loaded in memory
let state = JSON.parse(JSON.stringify(defaultState));

export const PsychroState = {
    
    /**
     * Call this when the app boots up. 
     * It checks if the player has a saved game in their browser.
     */
    init() {
        try {
            const savedState = localStorage.getItem(STATE_KEY);
            if (savedState) {
                state = JSON.parse(savedState);
                console.log("PsychroState: Session loaded from memory.");
            } else {
                console.log("PsychroState: No save found. New session initialized.");
            }
        } catch (e) {
            console.error("PsychroState: Failed to load state from localStorage.", e);
            this.reset();
        }
    },

    /**
     * Get a READ-ONLY copy of the current state.
     * We use JSON stringify/parse to create a "Deep Copy". 
     * This prevents Logic Engines from accidentally mutating the master state directly.
     * @returns {Object} A safe clone of the state
     */
    getState() {
        return JSON.parse(JSON.stringify(state));
    },

    /**
     * The ONLY way to alter the game state. 
     * Pass in the specific values you want to change, and it merges them recursively.
     * @param {Object} partialState - The data to update (e.g., { resources: { hp: 8 } })
     */
    update(partialState) {
        // Deep merge helper function
        const merge = (target, source) => {
            for (const key in source) {
                // If the value is an object (but not an array or null), recursively merge
                if (source[key] instanceof Object && !Array.isArray(source[key]) && target[key]) {
                    Object.assign(target[key], merge(target[key], source[key]));
                } else {
                    // Otherwise, just overwrite the value
                    target[key] = source[key];
                }
            }
            return target;
        };

        merge(state, partialState);
        this.save();
    },

    /**
     * Writes the current memory state to the browser's hard drive.
     */
    save() {
        try {
            localStorage.setItem(STATE_KEY, JSON.stringify(state));
        } catch (e) {
            console.error("PsychroState: Failed to save to localStorage.", e);
        }
    },

    /**
     * Wipes the save file. Used for "New Game" or death.
     */
    reset() {
        state = JSON.parse(JSON.stringify(defaultState));
        this.save();
        console.log("PsychroState: Session reset to defaults.");
    }
};