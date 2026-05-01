/**
 * PSYCHROMATTICA: PsychroEngine.js
 * VERSION: 1.1 (FINAL AUDITED)
 * ROLE: The DNA (Static Data, Master Lists, Base Parser)
 * 
 * DESCRIPTION:
 * The Single Source of Truth. It is strictly READ-ONLY.
 * It contains the master dictionaries for Colors, Stats, and all 100 Keywords.
 * It houses the Universal Build String Parser, heavily patched to dynamically
 * calculate Stats based on progression and motivational profiles.
 */

// -------------------------------------------------------------------------
// 1. MASTER CONSTANTS (THE LAWS)
// -------------------------------------------------------------------------

export const COLORS = Object.freeze({
    0: { id: "0", name: "Null", theme: "Void", lore: "Unpredictability & Potential" },
    1: { id: "1", name: "Silver", theme: "Duality", lore: "Ambition & Adaptation" },
    2: { id: "2", name: "Yellow", theme: "Immediacy", lore: "Freedom & Motion" },
    3: { id: "3", name: "Green", theme: "Stability", lore: "Resilience & Mass" },
    4: { id: "4", name: "Black", theme: "Inevitability", lore: "Endurance & Spirit" },
    5: { id: "5", name: "Orange", theme: "Creation", lore: "Innovation & Chaos" },
    6: { id: "6", name: "White", theme: "Order", lore: "Purity & Biology" },
    7: { id: "7", name: "Red", theme: "Passion", lore: "Energy & Conflict" },
    8: { id: "8", name: "Blue", theme: "Influence", lore: "Cooperation & Speech" },
    9: { id: "9", name: "Purple", theme: "Esotericism", lore: "Identity & Mysticism" }
});

export const STATS = Object.freeze({
    R: "Range",
    A: "Alacrity",
    B: "Brawn",
    W: "Wit",
    E: "Expertise",
    T: "Technique",
    P: "Power",
    I: "Influence",
    F: "Force"
});

export const CATEGORIES = Object.freeze({
    0: "Flaw",
    1: "Gift",
    2: "Talent",
    3: "Quirk",
    4: "Boost",
    5: "Status",
    6: "Form",
    7: "Modifier",
    8: "Drive",
    9: "Unique"
});

/**
 * MASTER KEYWORD DICTIONARY (100 KEYWORDS)
 * Format: "ColorCode.CategoryCode": { name, type, effect }
 */
export const KEYWORDS = Object.freeze({
    // --- COLOR 0: NULL [The Void / Potential] ---
    "0.0": { name: "Restricted", type: "Flaw", effect: "Fundamental limitation; double EP costs." },
    "0.1": { name: "Aura", type: "Gift", effect: "Tangible field of energy; project touch to range." },
    "0.2": { name: "Specialist", type: "Talent", effect: "Deep mastery over a specific stat category." },
    "0.3": { name: "Alert", type: "Quirk", effect: "Uncanny preternatural awareness; cannot be surprised." },
    "0.4": { name: "Liberate", type: "Boost", effect: "Absolute freedom; negate restraint or bind." },
    "0.5": { name: "Mark", type: "Status", effect: "Designate target; expose fundamental weakness." },
    "0.6": { name: "Indirect", type: "Form", effect: "Bypass obstacles and physical cover." },
    "0.7": { name: "Adaptive", type: "Modifier", effect: "Change effect nature to target different core values." },
    "0.8": { name: "Gamble", type: "Drive", effect: "Reliance on pure chance; replace stats with die rolls." },
    "0.9": { name: "Edit", type: "Unique", effect: "Fundamentally rewrite keyword properties of targets." },

    // --- COLOR 1: SILVER [Ambition / Duality] ---
    "1.0": { name: "Bane", type: "Flaw", effect: "Specific acute vulnerability to a chosen color." },
    "1.1": { name: "Traveler", type: "Gift", effect: "Innate affinity for unconventional movement (e.g., Teleport)." },
    "1.2": { name: "Martial", type: "Talent", effect: "Close-quarters proficiency and instant reactions." },
    "1.3": { name: "Attuned", type: "Quirk", effect: "Deep sympathetic link to a person, place, or thing." },
    "1.4": { name: "Augment", type: "Boost", effect: "Temporarily grant additional abilities or keywords." },
    "1.5": { name: "Impair", type: "Status", effect: "Drain stamina; actions cost more exertion." },
    "1.6": { name: "Reactive", type: "Form", effect: "Seamlessly weave potent abilities into defense." },
    "1.7": { name: "Phasing", type: "Modifier", effect: "Intangible attacks; ignore physical defenses." },
    "1.8": { name: "Brutal", type: "Drive", effect: "Overwhelming, devastatingly powerful critical blows." },
    "1.9": { name: "Translocate", type: "Unique", effect: "Mastery of teleportation and spatial boundaries." },

    // --- COLOR 2: YELLOW [Freedom / Speed] ---
    "2.0": { name: "Anxious", type: "Flaw", effect: "Nervous disposition; difficult to concentrate or prepare." },
    "2.1": { name: "Acrobatic", type: "Gift", effect: "Extraordinary grace; ignore environmental movement penalties." },
    "2.2": { name: "Sentry", type: "Talent", effect: "Keen eye; rapid assessment of targets." },
    "2.3": { name: "Eidetic", type: "Quirk", effect: "Flawless perfect memory of sensory experiences." },
    "2.4": { name: "Haste", type: "Boost", effect: "Supernatural speed; grant additional actions." },
    "2.5": { name: "Slow", type: "Status", effect: "Temporal trap; reduce target's ability to act." },
    "2.6": { name: "Snap", type: "Form", effect: "Effect so fast it is impossible to react to." },
    "2.7": { name: "Focus", type: "Modifier", effect: "Concentrated effort; apply extra stats to the effect." },
    "2.8": { name: "Rapid", type: "Drive", effect: "Flurry of multiple successive strikes or triggers." },
    "2.9": { name: "Reckless", type: "Unique", effect: "Abandon defense for pure, unadulterated offense." },

    // --- COLOR 3: GREEN[Stability / Resilience] ---
    "3.0": { name: "Hesitant", type: "Flaw", effect: "Inability to react quickly; disadvantage on defense." },
    "3.1": { name: "Sturdy", type: "Gift", effect: "Unshakeable physical presence; immune to forced movement." },
    "3.2": { name: "Brawler", type: "Talent", effect: "Expertise in grappling and physical maneuvers." },
    "3.3": { name: "Stubborn", type: "Quirk", effect: "Refusal to accept failure; allows effort rerolls." },
    "3.4": { name: "Ward", type: "Boost", effect: "Protective blessing; completely negate a single threat." },
    "3.5": { name: "Daze", type: "Status", effect: "Disorienting blow; leaves target unable to act coherently." },
    "3.6": { name: "Sculpt", type: "Form", effect: "Alter superficial shape; construct/manipulate barriers." },
    "3.7": { name: "Defensive", type: "Modifier", effect: "Outlast opponent through superior fortitude." },
    "3.8": { name: "Impact", type: "Drive", effect: "Immense kinetic force; knocks targets backward." },
    "3.9": { name: "Shift", type: "Unique", effect: "Fundamentally alter one's own physical form and stats." },

    // --- COLOR 4: BLACK [Inevitability / Endurance] ---
    "4.0": { name: "Feeble", type: "Flaw", effect: "Chronic physical weakness; penalty to Body stats." },
    "4.1": { name: "Survivor", type: "Gift", effect: "Tenacity for life; cling to existence beyond limits." },
    "4.2": { name: "Stoic", type: "Talent", effect: "Unshakable mental acuity and economy of action." },
    "4.3": { name: "Ageless", type: "Quirk", effect: "Outside the normal flow of time and aging." },
    "4.4": { name: "Bless", type: "Boost", effect: "Boon of fortune; enhances positive outcomes." },
    "4.5": { name: "Curse", type: "Status", effect: "Withering hex; invites misfortune and foils recovery." },
    "4.6": { name: "Piercing", type: "Form", effect: "Unstoppable force; ignores defenses but deals minimal harm." },
    "4.7": { name: "Flux", type: "Modifier", effect: "Convert personal vitality or energy into raw power." },
    "4.8": { name: "Siphon", type: "Drive", effect: "Forcibly transfer essence or life force to oneself." },
    "4.9": { name: "Animate", type: "Unique", effect: "Necromancy/Artifice; grant temporary life to the inanimate." },

    // --- COLOR 5: ORANGE [Innovation / Creation] ---
    "5.0": { name: "Gremlins", type: "Flaw", effect: "Persistent bad luck; 1s are critical misses." },
    "5.1": { name: "Sensor", type: "Gift", effect: "Supernatural or technological sense beyond the mundane." },
    "5.2": { name: "Improvisor", type: "Talent", effect: "Use disparate components together in novel ways." },
    "5.3": { name: "Crafty", type: "Quirk", effect: "Knack for creating permanent lasting effects easily." },
    "5.4": { name: "Charge", type: "Boost", effect: "Infusion of raw energy; used to fuel abilities." },
    "5.5": { name: "Bind", type: "Status", effect: "Entraps or ensnares a target; rooting them to the spot." },
    "5.6": { name: "Imbue", type: "Form", effect: "Temporarily invest an object/person with a known power." },
    "5.7": { name: "Material", type: "Modifier", effect: "Consume an object to fuel or enhance an effect." },
    "5.8": { name: "Leverage", type: "Drive", effect: "Mastery of physics/positioning to gain advantage." },
    "5.9": { name: "Manifest", type: "Unique", effect: "Create temporary functional items out of pure energy." },

    // --- COLOR 6: WHITE [Purity / Order] ---
    "6.0": { name: "Vulnerable", type: "Flaw", effect: "Glaring weakness; invites debilitating precision strikes." },
    "6.1": { name: "Tolerant", type: "Gift", effect: "Exceptional resilience to negative status effects." },
    "6.2": { name: "Deadeye", type: "Talent", effect: "Expert eye for identifying and striking weak points." },
    "6.3": { name: "Immunized", type: "Quirk", effect: "Perfect innate defense against a specific ailment." },
    "6.4": { name: "Cure", type: "Boost", effect: "Purifying power; cleanse negative conditions." },
    "6.5": { name: "Weaken", type: "Status", effect: "Corrodes defenses; leaves target brittle." },
    "6.6": { name: "Sticky", type: "Form", effect: "Adheres to target; delivers payload after a delay." },
    "6.7": { name: "Restore", type: "Modifier", effect: "Healing power; mends wounds and restores vitality." },
    "6.8": { name: "Exploit", type: "Drive", effect: "Turn an enemy's weakness/tags against them for power." },
    "6.9": { name: "Growth", type: "Unique", effect: "Manipulate age, growth, and biological processes." },

    // --- COLOR 7: RED [Energy / Glory] ---
    "7.0": { name: "Limited", type: "Flaw", effect: "Permanent reduction in vital reserves (HP/SP/EP)." },
    "7.1": { name: "Resilient", type: "Gift", effect: "Permanent increase in vital reserves; enhanced endurance." },
    "7.2": { name: "Font", type: "Talent", effect: "Use any form of personal energy to fuel powers." },
    "7.3": { name: "Insulated", type: "Quirk", effect: "Natural immunity to dangers of the surrounding environment." },
    "7.4": { name: "Regen", type: "Boost", effect: "Blessing of rapid, continuous healing over time." },
    "7.5": { name: "Blight", type: "Status", effect: "Decaying curse; slowly rots target's life force away." },
    "7.6": { name: "Area", type: "Form", effect: "Blankets a wide area; sacrifices power for coverage." },
    "7.7": { name: "Ranged", type: "Modifier", effect: "Projectile effect; ignores standard distance penalties." },
    "7.8": { name: "Multiply", type: "Drive", effect: "Strike multiple discrete targets simultaneously." },
    "7.9": { name: "Split", type: "Unique", effect: "Divide oneself or an object into multiple smaller copies." },

    // --- COLOR 8: BLUE[Influence / Cooperation] ---
    "8.0": { name: "Awkward", type: "Flaw", effect: "Social/mental clumsiness; penalty to Mind stats." },
    "8.1": { name: "Charismatic", type: "Gift", effect: "Innate magnetism and force of personality." },
    "8.2": { name: "Leader", type: "Talent", effect: "Natural command; direct allies and subordinates." },
    "8.3": { name: "Insightful", type: "Quirk", effect: "Deep empathy; perceives emotional/mental state of others." },
    "8.4": { name: "Enhance", type: "Boost", effect: "Targeted inspiration; improves a single action." },
    "8.5": { name: "Silence", type: "Status", effect: "Severs connection to inner power; prevents keyword use." },
    "8.6": { name: "Splash", type: "Form", effect: "Arcs from primary target; spreads nature but not intensity." },
    "8.7": { name: "Lingering", type: "Modifier", effect: "Persists in an area; enhanced lasting impact." },
    "8.8": { name: "Spread", type: "Drive", effect: "Moves an affliction from one target to another." },
    "8.9": { name: "Potent", type: "Unique", effect: "Applies secondary effects even when primary effect is resisted." },

    // --- COLOR 9: PURPLE[Esotericism / Identity] ---
    "9.0": { name: "Mundane", type: "Flaw", effect: "Disconnect from essence; penalty to Essence stats." },
    "9.1": { name: "Aware", type: "Gift", effect: "Sense and identify the use of supernatural powers." },
    "9.2": { name: "Stealthy", type: "Talent", effect: "Natural talent for concealment and moving undetected." },
    "9.3": { name: "Trickster", type: "Quirk", effect: "Illusion, misdirection, and psychological manipulation." },
    "9.4": { name: "Obscure", type: "Boost", effect: "Concealment; renders one undetectable to a chosen sense." },
    "9.5": { name: "Nullify", type: "Status", effect: "Disrupts innate abilities; shuts down passive powers." },
    "9.6": { name: "Chain", type: "Form", effect: "Leaps from one target to the next in sequence." },
    "9.7": { name: "Natural", type: "Modifier", effect: "Innate ability treated as part of one's own physical body." },
    "9.8": { name: "Ambience", type: "Drive", effect: "Influence and control the surrounding environment itself." },
    "9.9": { name: "Channel", type: "Unique", effect: "Share innate powers and passive abilities with others." }
});

// -------------------------------------------------------------------------
// 2. THE UNIVERSAL BUILD STRING PARSER (WITH AUDIT 4 PATCH)
// -------------------------------------------------------------------------

/**
 * @function parseBuildString
 * @description Converts a compressed Build String into a deeply nested, expanded JS Object.
 * @param {string} buildString - The raw string (e.g., "[C:01234+0088-!03-11.12.13]")
 * @returns {Object} The expanded Entity object containing parsed ecosystems.
 */
export function parseBuildString(buildString) {
    if (!buildString || typeof buildString !== 'string') {
        throw new Error("Invalid Build String: Input must be a non-empty string.");
    }

    const ecosystem = {};
    const segments = buildString.split(';'); // Split distinct Ecosystems

    for (let segment of segments) {
        const containerRegex = /\[([FACI]):(.*?)\]/g;
        let match;

        while ((match = containerRegex.exec(segment)) !== null) {
            const type = match[1]; // F, C, A, or I
            const data = match[2]; // The content inside the brackets

            if (type === 'F') {
                ecosystem.faction = parseFaction(data);
            } else if (type === 'C') {
                ecosystem.character = parseCharacter(data);
            } else if (type === 'A') {
                if (!ecosystem.animations) ecosystem.animations =[];
                ecosystem.animations.push(...parseAnimations(data));
            } else if (type === 'I') {
                if (!ecosystem.items) ecosystem.items =[];
                ecosystem.items.push(...parseItems(data));
            }
        }
    }

    return ecosystem;
}

/** 
 * INTERNAL PARSING FUNCTIONS 
 */

function parseFaction(data) {
    // Format: #####-L#[S#.S#...]-[K##.##...]
    const parts = data.split('-');
    if (parts.length < 2) return null;

    const profileArr = parts[0].split('').map(Number);
    const sysString = parts.length > 2 ? parts[2].replace(/[\[\]S]/g, '') : "";
    const kwString = parts.length > 3 ? parts[3].replace(/[\[\]K]/g, '') : "";

    return {
        profile: {
            goal: profileArr[0] ?? null,
            method: profileArr[1] ?? null,
            purpose: profileArr[2] ?? null,
            conflict1: profileArr[3] ?? null,
            conflict2: profileArr[4] ?? null
        },
        level: parseInt(parts[1].substring(1)) || 0,
        systems: sysString ? sysString.split('.').map(Number) :[],
        keywords: kwString ? kwString.split('.').map(s => s.trim()) :[]
    };
}

function parseCharacter(data) {
    // Format: #####[+####]-##-##.##.##
    const parts = data.split('-');
    
    // Part 1: Profile & Flaw
    let profilePart = parts[0];
    let flaw = null;

    if (profilePart.includes('+')) {
        const flawMatch = profilePart.match(/\+([0-9]{4})/);
        if (flawMatch) {
            const flawCodeStr = flawMatch[1];
            const flawCode = `${flawCodeStr[0]}.${flawCodeStr[1]}`;
            const compCode = `${flawCodeStr[2]}.${flawCodeStr[3]}`;
            
            flaw = { 
                penalty: expandKeyword(flawCode), 
                compensation: expandKeyword(compCode) 
            };
            profilePart = profilePart.replace(/\+[0-9]{4}/, '');
        }
    }

    const profileDigits = profilePart.split('').map(Number);
    const profile = {
        goal: profileDigits[0] ?? null,
        method: profileDigits[1] ?? null,
        purpose: profileDigits[2] ?? null,
        conflict1: profileDigits[3] ?? null,
        conflict2: profileDigits[4] ?? null
    };

    // Part 2: Seed Keyword
    const seedKeywordStr = parts[1] || "";
    let seedKeyword = null;
    let seedIsPassive = false;
    
    if (seedKeywordStr) {
        let cleanSeed = seedKeywordStr;
        if (cleanSeed.startsWith('!')) {
            seedIsPassive = true;
            cleanSeed = cleanSeed.substring(1);
        }
        seedKeyword = expandKeyword(cleanSeed);
        if (seedIsPassive) seedKeyword.isSlottedPassive = true;
    }

    // Part 3: Progression & Passives
    const progressionPart = parts[2] || "";
    const keywords = [];
    const passives =[];
    const kwCodes = progressionPart.split('.');

    for (let code of kwCodes) {
        if (!code) continue;
        let isPassive = false;
        let cleanCode = code;

        if (code.startsWith('!')) {
            isPassive = true;
            cleanCode = code.substring(1);
        }

        const kwObj = expandKeyword(cleanCode);
        if (isPassive) {
            kwObj.isSlottedPassive = true;
            passives.push(kwObj);
        } else {
            keywords.push(kwObj);
        }
    }

    // =======================================================================
    // DYNAMIC STAT CALCULATION (AUDIT PATCH #4 APPLIED)
    // =======================================================================

    // 1. Calculate Level based on Total Keywords (1 for Seed + Learned)
    const totalKeywords = 1 + keywords.length + passives.length;
    let level = 0;
    if (totalKeywords >= 4) level = 1;
    if (totalKeywords >= 6) level = 2;
    if (totalKeywords >= 8) level = 3;
    if (totalKeywords >= 10) level = 4;
    if (totalKeywords >= 12) level = 5;
    if (totalKeywords >= 14) level = 6;
    if (totalKeywords >= 16) level = 7;
    if (totalKeywords >= 18) level = 8;
    if (totalKeywords >= 20) level = 9;

    // 2. Map Colors to Stats for the Trinity Bonus
    // Note: Color 0 (Null) defaults to 'P' (Power) per mechanics if used in Trinity.
    const colorToStat = { 1:'R', 2:'A', 3:'B', 4:'W', 5:'E', 6:'T', 7:'P', 8:'I', 9:'F', 0:'P' };

    // 3. Base Stats
    let baseStatValue = level >= 1 ? 2 : 1;
    let calculatedStats = { 
        R: baseStatValue, A: baseStatValue, B: baseStatValue, 
        W: baseStatValue, E: baseStatValue, T: baseStatValue, 
        P: baseStatValue, I: baseStatValue, F: baseStatValue 
    };

    // 4. Apply Level 1 Trinity Bonus
    if (level >= 1 && profile) {
        if (profile.goal !== null && colorToStat[profile.goal]) calculatedStats[colorToStat[profile.goal]] += 1;
        if (profile.method !== null && colorToStat[profile.method]) calculatedStats[colorToStat[profile.method]] += 1;
        if (profile.purpose !== null && colorToStat[profile.purpose]) calculatedStats[colorToStat[profile.purpose]] += 1;
    }

    // 5. Apply Flaw Bonus (if exists)
    if (flaw && flaw.compensation) {
        const compColor = parseInt(flaw.compensation.code.split('.')[0]);
        if (colorToStat[compColor]) {
            calculatedStats[colorToStat[compColor]] = Math.min(5, calculatedStats[colorToStat[compColor]] + 1);
        }
    }

    return {
        profile,
        flaw,
        level: level,
        seed: seedKeyword,
        learnedKeywords: keywords,
        passiveKeywords: passives,
        stats: calculatedStats 
    };
}

function parseAnimations(data) {
    const animations =[];
    const animSegments = data.split(',');

    for (let seg of animSegments) {
        const parts = seg.trim().split('-');
        if (parts.length < 2) continue;

        const level = parseInt(parts[0].substring(1)) || 0;
        const kwCodes = parts[1].split('.');
        
        animations.push({
            level: level,
            keywords: kwCodes.map(c => expandKeyword(c.replace('!', '')))
        });
    }
    return animations;
}

function parseItems(data) {
    const items =[];
    const itemSegments = data.split(',');

    for (let seg of itemSegments) {
        const parts = seg.trim().split('-');
        if (parts.length < 2) continue;

        const level = parseInt(parts[0].substring(1)) || 0;
        const kwCodes = parts[1].split('.');

        items.push({
            level: level,
            keywords: kwCodes.map(c => expandKeyword(c.replace('!', '')))
        });
    }
    return items;
}

/**
 * Helper to turn a raw code (e.g., "12" or "1.2") into a full object.
 */
function expandKeyword(code) {
    let cleanCode = code.replace(/[^\d.]/g, ''); 
    
    // Patch: If the code is missing the decimal (e.g., "12"), format it to "1.2"
    if (!cleanCode.includes('.') && cleanCode.length === 2) {
        cleanCode = `${cleanCode[0]}.${cleanCode[1]}`;
    }

    const masterData = KEYWORDS[cleanCode];

    if (!masterData) {
        return { code: cleanCode, name: "Unknown", type: "Unknown", effect: "Missing from Master Dictionary" };
    }

    return {
        code: cleanCode,
        ...masterData
    };
}

// -------------------------------------------------------------------------
// 3. DEBUG UTILITY
// -------------------------------------------------------------------------

/**
 * Use this to verify your parser is working in the console.
 */
export function debugParse(testString) {
    console.log("Parsing String:", testString);
    try {
        const result = parseBuildString(testString);
        console.log("Success:", JSON.stringify(result, null, 2));
        return result;
    } catch (e) {
        console.error("Parse Failed:", e.message);
        return null;
    }
}