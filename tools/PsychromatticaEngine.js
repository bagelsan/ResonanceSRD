/**
 * PSYCHROMATTICA CORE ENGINE & DATA REPOSITORY
 * Version: 1.1 (Unified Data Architecture)
 */

const PsychroEngine = (function() {
    
    // ==========================================
    // 1. THE DATA REPOSITORY (The "Knowledge Base")
    // ==========================================
    const Data = {
        STAT_KEYS: ['R', 'A', 'B', 'W', 'E', 'T', 'P', 'I', 'F'],
        STAT_NAMES: { 
            'R': 'Range', 'A': 'Alacrity', 'B': 'Brawn', 
            'W': 'Wit', 'E': 'Expertise', 'T': 'Technique', 
            'P': 'Power', 'I': 'Influence', 'F': 'Force' 
        },
        STAT_MAPPING: { 'M': 'R', 'A': 'A', 'B': 'B', 'W': 'W', 'E': 'E', 'T': 'T', 'P': 'P', 'I': 'I', 'F': 'F' },
        
        COLORS: ['null', 'silver', 'yellow', 'green', 'black', 'orange', 'white', 'red', 'blue', 'purple'],
        
        MOTIVATIONS: {
            '0':'Discovery','1':'Ambition','2':'Freedom','3':'Security','4':'Legacy',
            '5':'Innovation','6':'Purity','7':'Glory','8':'Influence','9':'Faith'
        },

        CIVIL_SYSTEMS: { 
            'S0': 'Food', 'S1': 'Water', 'S2': 'Shelter', 'S3': 'Infrastructure', 
            'S4': 'Humanitarian', 'S5': 'Education', 'S6': 'Healthcare', 
            'S7': 'Government', 'S8': 'Commerce', 'S9': 'Military' 
        },

        SITUATION_TYPES: ["Hybrid/Curator", "Conflict", "Obstacle", "Interaction", "Exploration", "Twist"],

        TAGS: {
            boost: ['Liberate', 'Augment', 'Haste', 'Ward', 'Bless', 'Charge', 'Cure', 'Regen', 'Enhance', 'Obscure'],
            status: ['Mark', 'Impair', 'Slow', 'Daze', 'Curse', 'Bind', 'Weaken', 'Blight', 'Silence', 'Nullify']
        },

        TAG_COLORS: {
            'Mark':'null', 'Impair':'silver', 'Slow':'yellow', 'Daze':'green', 'Curse':'black', 'Bind':'orange', 
            'Weaken':'white', 'Blight':'red', 'Silence':'blue', 'Nullify':'purple', 
            'Liberate':'null', 'Augment':'silver', 'Haste':'yellow', 'Ward':'green', 'Bless':'black', 
            'Charge':'orange', 'Cure':'white', 'Regen':'red', 'Enhance':'blue', 'Obscure':'purple'
        },

        KEYWORDS: {
            '00':{name:"Restricted", intent:"A fundamental limitation or flaw."},
            '01':{name:"Aura", intent:"A tangible field of energy."},
            '02':{name:"Specialist", intent:"Focused mastery over a domain."},
            '03':{name:"Alert", intent:"Preternatural awareness."},
            '04':{name:"Liberate", intent:"Freedom from restraint."},
            '05':{name:"Mark", intent:"Expose a fundamental weakness."},
            '06':{name:"Indirect", intent:"Bypass obstacles to strike."},
            '07':{name:"Adaptive", intent:"Change an effect's nature."},
            '08':{name:"Gamble", intent:"Reliance on pure chance."},
            '09':{name:"Edit", intent:"Fundamentally rewrite properties."},
            '10':{name:"Bane", intent:"A specific, acute vulnerability."},
            '11':{name:"Traveler", intent:"Innate unconventional movement.", options:{'0':'Walk','1':'Teleport','2':'Fly','3':'Dig','4':'Permeation','5':'Jump','6':'Parkour','7':'Climb','8':'Swim','9':'Lightfoot'}},
            '12':{name:"Martial", intent:"Proficiency in close-quarters combat."},
            '13':{name:"Attuned", intent:"A deep link to a target."},
            '14':{name:"Augment", intent:"Grant additional abilities."},
            '15':{name:"Impair", intent:"Drains a target's stamina."},
            '16':{name:"Reactive", intent:"Weave abilities into defensive maneuvers."},
            '17':{name:"Phasing", intent:"Become intangible to strike essence."},
            '18':{name:"Brutal", intent:"Overwhelmingly powerful critical blows."},
            '19':{name:"Translocate", intent:"Mastery of teleportation."},
            '20':{name:"Anxious", intent:"Difficulty with focus or precision."},
            '21':{name:"Acrobatic", intent:"Extraordinary grace and movement."},
            '22':{name:"Sentry", intent:"Rapidly assess a target's nature."},
            '23':{name:"Eidetic", intent:"A perfect, flawless memory."},
            '24':{name:"Haste", intent:"A surge of supernatural speed."},
            '25':{name:"Slow", intent:"Reduce a target's ability to act."},
            '26':{name:"Snap", intent:"An effect too fast to be reacted to."},
            '27':{name:"Condense", intent:"Applying greater force by concentration."},
            '28':{name:"Rapid", intent:"A flurry of multiple strikes."},
            '29':{name:"Reckless", intent:"Abandoning all defense for pure offense."},
            '30':{name:"Hesitant", intent:"Inability to react quickly."},
            '31':{name:"Sturdy", intent:"Unshakeable physical presence."},
            '32':{name:"Brawler", intent:"Expertise in grappling and maneuvers."},
            '33':{name:"Stubborn", intent:"Refusal to accept failure."},
            '34':{name:"Ward", intent:"Negate a single incoming threat."},
            '35':{name:"Daze", intent:"A disorienting blow."},
            '36':{name:"Sculpt", intent:"Alter the superficial shape or form."},
            '37':{name:"Defensive", intent:"Outlasting through superior fortitude."},
            '38':{name:"Impact", intent:"Immense kinetic force."},
            '39':{name:"Shift", intent:"Fundamentally alter one's own form."},
            '40':{name:"Feeble", intent:"Chronic physical weakness."},
            '41':{name:"Survivor", intent:"Incredible tenacity for life."},
            '42':{name:"Stoic", intent:"Unshakable mental focus."},
            '43':{name:"Ageless", intent:"Outside the normal flow of time."},
            '44':{name:"Bless", intent:"A boon of fortune."},
            '45':{name:"Curse", intent:"A withering hex of misfortune."},
            '46':{name:"Piercing", intent:"Unstoppable, penetrating force."},
            '47':{name:"Flux", intent:"Convert vitality or energy into power."},
            '48':{name:"Siphon", intent:"Forcibly transfer life force."},
            '49':{name:"Animate", intent:"Granting temporary life to the inanimate."},
            '50':{name:"Gremlins", intent:"Persistent streak of bad luck."},
            '51':{name:"Sensor", intent:"Possession of a supernatural sense.", options:{'0':'Karma','1':'Keywords','2':'Echolocation','3':'Vibration','4':'Energy','5':'Materials','6':'Life','7':'Infrared','8':'Emotion','9':'The Weave'}},
            '52':{name:"Improvisor", intent:"Talent for using components in novel ways."},
            '53':{name:"Crafty", intent:"Knack for creating permanent effects."},
            '54':{name:"Charge", intent:"Infusion of raw energy."},
            '55':{name:"Bind", intent:"Entraps or ensnares a target."},
            '56':{name:"Imbue", intent:"Temporarily investing an object with power."},
            '57':{name:"Material", intent:"Consume an object to fuel an effect."},
            '58':{name:"Leverage", intent:"Mastery of physics and positioning."},
            '59':{name:"Manifest", intent:"Create temporary, functional items."},
            '60':{name:"Vulnerable", intent:"A glaring weakness to precise strikes."},
            '61':{name:"Tolerant", intent:"Exceptional resilience to negative effects."},
            '62':{name:"Deadeye", intent:"Expert eye for weak points."},
            '63':{name:"Immunized", intent:"Innate defense against a specific ailment."},
            '64':{name:"Cure", intent:"A purifying power that cleanses afflictions."},
            '65':{name:"Weaken", intent:"Corrodes a target's defenses."},
            '66':{name:"Sticky", intent:"An effect that adheres and triggers later."},
            '67':{name:"Restore", intent:"A healing power that mends wounds."},
            '68':{name:"Exploit", intent:"Turning an enemy's weakness against them."},
            '69':{name:"Growth", intent:"Manipulate a target's age and biology."},
            '70':{name:"Limited", intent:"A permanent reduction in vital reserves."},
            '71':{name:"Resilient", intent:"A permanent increase in vital reserves."},
            '72':{name:"Font", intent:"Use any personal energy to fuel powers."},
            '73':{name:"Insulated", intent:"Immunity to environmental dangers."},
            '74':{name:"Regen", intent:"Rapid, continuous healing over time."},
            '75':{name:"Blight", intent:"A decaying curse that rots life force."},
            '76':{name:"Area", intent:"Blankets a wide area."},
            '77':{name:"Ranged", intent:"A projectile or thrown effect."},
            '78':{name:"Multiply", intent:"Strike multiple, discrete targets."},
            '79':{name:"Split", intent:"Divide oneself into multiple copies."},
            '80':{name:"Awkward", intent:"Social or mental clumsiness."},
            '81':{name:"Charismatic", intent:"Innate magnetism and personality."},
            '82':{name:"Leader", intent:"Natural command over allies."},
            '83':{name:"Insightful", intent:"Deep empathy and perception."},
            '84':{name:"Enhance", intent:"A boon of targeted inspiration."},
            '85':{name:"Silence", intent:"Severs connection to inner power."},
            '86':{name:"Splash", intent:"Effect splashes from the primary target."},
            '87':{name:"Lingering", intent:"An effect that persists or has lasting impact."},
            '88':{name:"Spread", intent:"Move an affliction from one target to another."},
            '89':{name:"Potent", intent:"Applies secondary effects even when resisted."},
            '90':{name:"Mundane", intent:"Innate disconnect from essence."},
            '91':{name:"Aware", intent:"Sense and identify supernatural powers."},
            '92':{name:"Stealthy", intent:"Talent for concealment."},
            '93':{name:"Trickster", intent:"Use of illusion and misdirection."},
            '94':{name:"Obscure", intent:"A boon of concealment."},
            '95':{name:"Nullify", intent:"Disrupts a target's innate abilities."},
            '96':{name:"Chain", intent:"Effect leaps from one target to the next."},
            '97':{name:"Natural", intent:"Ability is treated as part of one's body."},
            '98':{name:"Ambience", intent:"Influence the surrounding environment."},
            '99':{name:"Channel", intent:"Share innate powers with others."}
        }
    };

    // ==========================================
    // 2. THE BLUEPRINT PARSER (LOGIC)
    // ==========================================
    function parseArchive(masterString) {
        if (!masterString) return[];
        const ecosystemStrings = masterString.split(';').map(s => s.trim()).filter(Boolean);
        return ecosystemStrings.map(parseEcosystem);
    }

    function parseEcosystem(ecoString) {
        const tokens = ecoString.split(/(?=[@/])/).map(s => s.trim()).filter(Boolean);
        let rootEntity = null;
        let lastEntity = null;
        for (let token of tokens) {
            let operator = 'root';
            let payload = token;
            if (token.startsWith('@') || token.startsWith('/')) {
                operator = token.charAt(0);
                payload = token.slice(1);
            }
            const parsedEntity = parseEntity(payload);
            if (operator === 'root') { rootEntity = parsedEntity; lastEntity = parsedEntity; } 
            else if (operator === '@') { rootEntity.attachments.push(parsedEntity); lastEntity = parsedEntity; } 
            else if (operator === '/') { lastEntity.attachments.push(parsedEntity); lastEntity = parsedEntity; }
        }
        return rootEntity;
    }

    function parseEntity(entityString) {
        const prefix = entityString.substring(0, 2).toUpperCase();
        const payload = entityString.substring(2);
        let entity = { type: 'UNKNOWN', raw: entityString, attachments:[] };
        switch (prefix) {
            case 'C:': entity = parseCharacter(payload); break;
            case 'A:': entity = parseAnimation(payload); break;
            case 'I:': entity = parseItem(payload); break;
            case 'F:': entity = parseFaction(payload); break;
        }
        entity.attachments =[];
        return entity;
    }

    function parseCharacter(payload) {
        let char = { type: 'CHARACTER', profile: '00000', level: 0, keywords:[], flawPackage: null, stats: {}, resistance: 0 };
        const profileMatch = payload.match(/^(\d{5})/);
        if (profileMatch) char.profile = profileMatch[1];
        let cleanPayload = payload;
        const flawMatch = payload.match(/\+(\d{2})(\d{2})/);
        if (flawMatch) {
            char.flawPackage = { flaw: flawMatch[1], comp: flawMatch[2] };
            cleanPayload = cleanPayload.replace(flawMatch[0], '');
        }
        const kwRegex = /(!?)(\d{2})(?:\((\d)\))?/g;
        let match;
        while ((match = kwRegex.exec(cleanPayload)) !== null) {
            char.keywords.push({ code: match[2], isPassive: match[1] === '!', option: match[3] || null });
        }
        const kwCount = char.keywords.length;
        char.level = kwCount < 4 ? 0 : 1 + Math.floor((kwCount - 4) / 2);
        const baseline = char.level > 0 ? 2 : 1;
        Data.STAT_KEYS.forEach(k => char.stats[k] = baseline);
        const statLetters = cleanPayload.match(/[RABWETPIFM]/g) ||[];
        statLetters.forEach(letter => {
            if(Data.STAT_MAPPING[letter] && char.stats[Data.STAT_MAPPING[letter]] < 5) char.stats[Data.STAT_MAPPING[letter]]++;
        });
        char.resistance = calculateResistance(char.stats);
        return char;
    }

    function parseAnimation(payload) {
        let anim = { type: 'ANIMATION', level: 0, keywords:[], flawPackage: null, stats: {}, resistance: 0 };
        let cleanPayload = payload;
        const flawMatch = payload.match(/\+(\d{2})(\d{2})/);
        if (flawMatch) { anim.flawPackage = { flaw: flawMatch[1], comp: flawMatch[2] }; cleanPayload = cleanPayload.replace(flawMatch[0], ''); }
        const kwRegex = /(!?)(\d{2})(?:\((\d)\))?/g;
        let match;
        while ((match = kwRegex.exec(cleanPayload)) !== null) {
            anim.keywords.push({ code: match[2], isPassive: match[1] === '!', option: match[3] || null });
        }
        anim.level = Math.max(0, anim.keywords.length - 1);
        Data.STAT_KEYS.forEach(k => anim.stats[k] = 1);
        const statLetters = cleanPayload.match(/[RABWETPIFM]/g) ||[];
        statLetters.forEach(letter => {
            if(Data.STAT_MAPPING[letter] && anim.stats[Data.STAT_MAPPING[letter]] < 5) anim.stats[Data.STAT_MAPPING[letter]]++;
        });
        anim.resistance = calculateResistance(anim.stats);
        return anim;
    }

    function parseItem(payload) {
        let item = { type: 'ITEM', level: 0, keywords:[], flawPackage: null };
        const lvlMatch = payload.match(/^L(\d+)/);
        if (lvlMatch) item.level = parseInt(lvlMatch[1], 10);
        let cleanPayload = payload;
        const flawMatch = payload.match(/\+(\d{2})(\d{2})/);
        if (flawMatch) { item.flawPackage = { flaw: flawMatch[1], comp: flawMatch[2] }; cleanPayload = cleanPayload.replace(flawMatch[0], ''); }
        const kwRegex = /(!?)(\d{2})(?:\((\d)\))?/g;
        let match;
        while ((match = kwRegex.exec(cleanPayload)) !== null) {
            item.keywords.push({ code: match[2], isPassive: match[1] === '!', option: match[3] || null });
        }
        return item;
    }

    function parseFaction(payload) {
        let faction = { type: 'FACTION', profile: '00000', level: 0, systems: [], keywords: [] };
        const parts = payload.split(/\[|\]-\[K|\]/);
        const profLvlMatch = parts[0].match(/^(\d{5})-L(\d+)/);
        if (profLvlMatch) { faction.profile = profLvlMatch[1]; faction.level = parseInt(profLvlMatch[2], 10); }
        if (parts[1]) { faction.systems = parts[1].split('.').map(s => s.trim()).filter(Boolean); }
        if (parts[2]) { faction.keywords = parts[2].split('.').map(k => k.trim()).filter(Boolean); }
        return faction;
    }

    function calculateResistance(statObject) {
        const values = Object.values(statObject).sort((a, b) => b - a);
        return values.slice(0, 3).reduce((sum, val) => sum + val, 0);
    }

    // ==========================================
    // 3. RESOLUTION LOGIC (Math)
    // ==========================================
    function calculateEffectValue(standardRoll, level, stat, applyTwice = false) {
        if (applyTwice) return standardRoll + stat + stat;
        return standardRoll + level + stat;
    }

    function checkStressRoll(standardRoll, witStat, totalKnownKeywords) {
        return (standardRoll + witStat) > totalKnownKeywords;
    }

    return {
        Data: Data,
        Parse: { archive: parseArchive, ecosystem: parseEcosystem, entity: parseEntity },
        Math: { calculateEV: calculateEffectValue, checkStressRoll: checkStressRoll }
    };
})();