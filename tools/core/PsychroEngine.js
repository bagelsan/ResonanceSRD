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
 * Format: "ColorCode.CategoryCode": { name, type, passive, active, equipment }
 */
export const KEYWORDS = Object.freeze({
    // --- COLOR 0: NULL [The Void / Potential] ---
    "0.0": { name: "Restricted", type: "Flaw", passive: "Each Keyword you use costs double the Energy (EP) to activate.", active: "When you take this Flaw, choose a Compensation Keyword. You may use its Active effect as if you knew it.", equipment: "All costs to activate this item's Keywords are doubled." },
    "0.1": { name: "Aura", type: "Gift", passive: "You are surrounded by a tangible energy field. You can manipulate objects/targets up to your Range stat as if at Touch range.", active: "Grants a +1 to the EV of any roll with a Keyword that matches your aura color.", equipment: "The item can manifest simple, non-mechanical objects made of light/force." },
    "0.2": { name: "Specialist", type: "Talent", passive: "Choose a Stat Category (Body, Mind, Essence). Gain Advantage on Effort Rolls using a stat from that category.", active: "Once per Situation, gain Advantage on a reaction/action using a stat from your chosen category.", equipment: "The wielder gains Advantage on Effort Rolls made using this item." },
    "0.3": { name: "Alert", type: "Quirk", passive: "You cannot be surprised unless you are incapacitated.", active: "Gain Advantage on effects targeting concealed targets.", equipment: "Passively indicates to the wielder any activity parameters set at creation." },
    "0.4": { name: "Liberate", type: "Boost", passive: "At the start of conflict, gain Liberate Tags equal to your Influence. (TRIGGER: Spend 1 to ignore a movement-reducing or bind effect).", active: "Grant targets a combined total of Liberate Tags equal to your Influence.", equipment: "As an action, the wielder can use this item to remove a restraint or lock." },
    "0.5": { name: "Mark", type: "Status", passive: "On a successful Basic Activation, you may grant the Mark Tag. (TRIGGER: The next attack against target gains Advantage. Remove 1 Mark after).", active: "When part of a successful effect, grant the target a Mark Tag.", equipment: "On a successful hit, this item grants the target a Mark Tag." },
    "0.6": { name: "Indirect", type: "Form", passive: "You maintain awareness of targets regardless of cover.", active: "This effect can strike a target and ignore cover.", equipment: "Attacks made with this item ignore the defensive benefits of Cover." },
    "0.7": { name: "Adaptive", type: "Modifier", passive: "You can choose which value (HP, SP, or EP) your effects will target.", active: "You can choose which value this specific effect will cause Value Loss.", equipment: "Choose a value when created. Effects made with this item always target the chosen value." },
    "0.8": { name: "Gamble", type: "Drive", passive: "You may replace any single level/stat value in a roll with a d10 roll. (If improvising a Status, d10 determines the Tag).", active: "You may replace all level and stat values in this roll with separate d10 rolls.", equipment: "You may replace the item's Level in an EV calculation with a d10 roll." },
    "0.9": { name: "Edit", type: "Unique", passive: "As an action, change one of your known Keywords to another of the same Category (changes its color).", active: "On a successful hit, change one of the target's Keywords to the same category, or to one of your Innate keywords until Downtime.", equipment: "The wielder may use an action to change any Keyword on this item to any of their Innate Keywords." },

    // --- COLOR 1: SILVER [Ambition / Duality] ---
    "1.0": { name: "Bane", type: "Flaw", passive: "Choose a Color. If an effect contains a Keyword of that color, it ignores your resistances.", active: "When you take this Flaw, choose a Compensation Keyword. You may use its Active effect as if you knew it.", equipment: "This item is immediately destroyed if successfully affected by a Keyword of your chosen Bane Color." },
    "1.1": { name: "Traveler", type: "Gift", passive: "Choose a Color. You permanently gain the associated movement type (e.g., Silver=Teleport).", active: "As part of this effect, you may immediately move according to a chosen movement type.", equipment: "The wielder gains access to the chosen movement type while equipped." },
    "1.2": { name: "Martial", type: "Talent", passive: "You may spend 1 SP to make a basic EV attack against a target that enters your touch range.", active: "Gain Advantage on a reaction.", equipment: "Gain Advantage when using this item as part of a reaction." },
    "1.3": { name: "Attuned", type: "Quirk", passive: "During Downtime, link yourself to a target. You always know their location and status.", active: "This effect can target your attuned target regardless of range, distance, or cover.", equipment: "Items linked via Attuned can target each other with their effects when utilized." },
    "1.4": { name: "Augment", type: "Boost", passive: "At the start of conflict, gain Augment Tags equal to your Influence. (TRIGGER: Spend 1 to add any single Keyword to an effect; EP cost still applies).", active: "Grant the target Augment Tags equal to your Influence.", equipment: "Grants access to a single Keyword to its wielder (chosen at crafting)." },
    "1.5": { name: "Impair", type: "Status", passive: "On a successful Basic Activation, you may grant the Impair Tag. (TRIGGER: Next time target spends SP, cost increases by 1. Remove 1 Impair after).", active: "When part of a successful effect, grant the target the Impair Tag.", equipment: "On a successful hit, this item grants the Impair Tag." },
    "1.6": { name: "Reactive", type: "Form", passive: "You may add Keywords to dodge reactions up to your Technique; EP costs must still be paid.", active: "When applied to a Dodge reaction, add a Chosen Stat to the SR an additional time.", equipment: "When used in a Dodge reaction, the reaction has no SP cost." },
    "1.7": { name: "Phasing", type: "Modifier", passive: "Your effects can be designated to ignore objects, specified targets, and physical cover.", active: "Effects with this Keyword ignore all resistances from gear and cover.", equipment: "Ignores physical barriers, cover, and gear; only affects target’s Energy." },
    "1.8": { name: "Brutal", type: "Drive", passive: "Critical effects from this character may choose 2 different bonus effects instead of 1.", active: "Effects with this Keyword are a critical hit on a SR result greater than 6.", equipment: "Effects from this gear are a critical hit on a SR result greater than 6." },
    "1.9": { name: "Translocate", type: "Unique", passive: "You have a personal pocket dimension to store and recall targets.", active: "As part of this effect, instantly change a target’s position to another target location.", equipment: "Contains a portal to a set location, a storage dimension, or can be re-equipped from anywhere." },

    // --- COLOR 2: YELLOW [Freedom / Speed] ---
    "2.0": { name: "Anxious", type: "Flaw", passive: "Your Setup actions cost double.", active: "When you take this Flaw, choose a Compensation Keyword. You may use its Active effect as if you knew it.", equipment: "Effects from this gear cannot be used to make a called shot." },
    "2.1": { name: "Acrobatic", type: "Gift", passive: "Ignore hindering environmental movement effects. Spend 1 SP to replicate any form of travel during a move.", active: "Apply this to an activation to ignore the penalty of a Rush Action.", equipment: "The wielder may make a Move action as part of an action utilizing this gear." },
    "2.2": { name: "Sentry", type: "Talent", passive: "You can make one free assessment when encountering a target for the first time.", active: "Perform an Assess action as a single action instead of a full turn action.", equipment: "Choose one clue type at creation. When gear affects a target, wielder learns that clue." },
    "2.3": { name: "Eidetic", type: "Quirk", passive: "You can remember all details you have experienced perfectly (visual, audio, etc).", active: "This effect gains Advantage against any target type you have encountered before.", equipment: "This item can store sensory information." },
    "2.4": { name: "Haste", type: "Boost", passive: "At the start of conflict, gain Haste Tags equal to your Influence. (TRIGGER: Spend 1 at any time to immediately gain one additional action this turn).", active: "Grant the target Haste Tags equal to your Influence.", equipment: "You may make an additional action your turn utilizing this item." },
    "2.5": { name: "Slow", type: "Status", passive: "On a successful Basic Activation, you may grant the Slow Tag. (TRIGGER: At start of target's turn, reduce their actions by 1. Remove 1 Slow after).", active: "When part of a successful effect, grant the target the Slow Tag.", equipment: "On a successful hit, this item grants the Slow Tag." },
    "2.6": { name: "Snap", type: "Form", passive: "You can make reactions to any effect, including those with Snap.", active: "This effect cannot be responded to. Limited to a single strike/trigger regardless of other Keywords.", equipment: "This equipment can be used to react to any effect." },
    "2.7": { name: "Focus", type: "Modifier", passive: "You may add your chosen stat an additional time to a Basic Activation for 1 SP.", active: "You may apply another stat of your choice to the EV calculation (can duplicate the initial stat).", equipment: "Wielder may apply another stat of their choice to the EV calculation of its effects." },
    "2.8": { name: "Rapid", type: "Drive", passive: "You do not receive disadvantage when making a Blitz or Slam action.", active: "Strikes/triggers additional times equal to your Technique. Add Chosen Stat a second time instead of Level for extra hits.", equipment: "Strikes additional times equal to Expertise. Wielder adds Expertise a second time instead of Level." },
    "2.9": { name: "Reckless", type: "Unique", passive: "Toggle a reckless state: you are Exposed, but all of your own effects gain Advantage.", active: "If you are Locked On to the target, add your chosen stat to the EV an additional time.", equipment: "Add chosen stat to the EV an additional time when wielder is Locked On to the target." },

    // --- COLOR 3: GREEN [Stability / Resilience] ---
    "3.0": { name: "Hesitant", type: "Flaw", passive: "You have Disadvantage on all React Actions you take.", active: "When you take this Flaw, choose a Compensation Keyword. You may use its Active effect as if you knew it.", equipment: "Utilizing this gear takes a full turn instead of a single action." },
    "3.1": { name: "Sturdy", type: "Gift", passive: "Maneuvers targeting you gain Disadvantage. You cannot be forced to move or made prone.", active: "Add your Level to reactions against maneuvers.", equipment: "Wielder adds gear’s Level to their reactions made against Maneuver actions." },
    "3.2": { name: "Brawler", type: "Talent", passive: "You can make Maneuver actions without costing Stamina (SP).", active: "Apply to a Maneuver action to allow adding other known Keywords to it, up to your Technique.", equipment: "Utilizing this gear to perform a Maneuver action removes the SP cost." },
    "3.3": { name: "Stubborn", type: "Quirk", passive: "You can spend 1 SP to reroll any Effort Roll you make.", active: "If this effect is successfully reacted to by the target, spend 1 SP to immediately reroll your EV.", equipment: "Wielder can spend 1 SP to reroll an Effort Roll utilizing this gear." },
    "3.4": { name: "Ward", type: "Boost", passive: "At the start of conflict, gain Ward Tags equal to your Influence. (TRIGGER: Spend 1 to cause a single incoming effect targeting you to be completely ignored).", active: "Grant the target Ward Tags equal to your Influence.", equipment: "This item can be used to replace its wielder as the target for an effect as a reaction." },
    "3.5": { name: "Daze", type: "Status", passive: "On a successful Basic Activation, you may grant the Daze Tag. (TRIGGER: Target's next SR is reduced by the number of Daze Tags in pool. Remove 1 Daze after).", active: "When part of a successful effect, grant the target the Daze Tag.", equipment: "On a successful hit, this item grants the Daze Tag." },
    "3.6": { name: "Sculpt", type: "Form", passive: "As an action, change cosmetic appearance of an object/target. Spend 1 SP to increase/decrease a Barrier TN by 1.", active: "Creates or modifies a barrier. Created Barrier has TN = Technique and Clock = Level.", equipment: "Change shape of a target, or alter a barrier TN by the item's level for 1 SP." },
    "3.7": { name: "Defensive", type: "Modifier", passive: "You may add Keywords to a Block reaction up to your Technique Stat (EP costs must be paid).", active: "Add your Level to your resistance.", equipment: "When used in a block reaction, that reaction has no SP cost." },
    "3.8": { name: "Impact", type: "Drive", passive: "You ignore secondary Value Loss from striking or being struck by Impact effects.", active: "Forces target to move/be knocked down. If forced movement strikes an object, EV is rolled again against both.", equipment: "Effects from this item can force a target to move or be knocked down." },
    "3.9": { name: "Shift", type: "Unique", passive: "As part of an action, relocate stat points equal to your Technique. Can also change your form/appearance.", active: "This effect will change the target’s appearance and form.", equipment: "This item can change its appearance and form as part of an effect." },

    // --- COLOR 4: BLACK [Inevitability / Endurance] ---
    "4.0": { name: "Feeble", type: "Flaw", passive: "You have Disadvantage on any roll that uses a Body stat (Range, Alacrity, Brawn).", active: "When you take this Flaw, choose a Compensation Keyword. You may use its Active effect as if you knew it.", equipment: "Wielder has Disadvantage when applying a Body stat to effects made with this gear." },
    "4.1": { name: "Survivor", type: "Gift", passive: "All of your values (HP, SP, EP) must be zero for you to be downed.", active: "Reaction (1 SP): If an effect would reduce HP to 0, be reduced to 1 HP instead.", equipment: "As long as this item is not broken, wielder cannot be downed unless Stamina is zero." },
    "4.2": { name: "Stoic", type: "Talent", passive: "You may make a Setup Action as a single action instead of taking a full turn.", active: "When applied to an effect, the EV roll cannot have Disadvantage or Advantage applied.", equipment: "This gear may be used to perform a designated Setup Action as a single action." },
    "4.3": { name: "Ageless", type: "Quirk", passive: "Once you reach maturity, you no longer age and cannot die of natural causes.", active: "Effects with this Keyword are immune to the Growth Keyword.", equipment: "This item is immune to the Growth Keyword." },
    "4.4": { name: "Bless", type: "Boost", passive: "At the start of conflict, gain Bless Tags equal to your Influence. (TRIGGER: Spend 1 when a value is restored to +1 it, OR spend before rolling to gain Advantage).", active: "Grant the target Bless Tags equal to your Influence.", equipment: "Choose a value. When the wielder has that value restored, increase the amount by 1." },
    "4.5": { name: "Curse", type: "Status", passive: "On a successful Basic Activation, you may grant the Curse Tag. (TRIGGER: Target gains Disadvantage on next roll. Remove 1 Curse after).", active: "When part of a successful effect, grant the target the Curse Tag.", equipment: "On a successful hit, this item grants the Curse Tag." },
    "4.6": { name: "Piercing", type: "Form", passive: "You can set the origin point of an effect to anywhere within your current range.", active: "Hits everything in its path to maximum range, ignoring cover, resistance, and bypassing Ward.", equipment: "EV is fixed at 1. Bypasses resistance, cover, and Ward." },
    "4.7": { name: "Flux", type: "Modifier", passive: "As an action, spend any values to grant them to another target as a separate resource pool until end of turn.", active: "Spend a value to increase this effect's EV by the amount spent (max equal to Technique).", equipment: "Store and dispense values as part of an effect (storage max equal to item's level)." },
    "4.8": { name: "Siphon", type: "Drive", passive: "As an action, siphon values from willing targets (cannot exceed maximum).", active: "When this deals Value Loss, restore 1 point to one of your own Values.", equipment: "Stores targeted values up to item Level. Wielder can expend these stored points as their own." },
    "4.9": { name: "Animate", type: "Unique", passive: "Your bonded animations can exceed your total limit during a situation or part of a single action.", active: "Animate a non-living target into a temporary Animation under your control (Level cannot exceed yours minus 1).", equipment: "Has a specific animation bonded to it that doesn't count toward your limit." },

    // --- COLOR 5: ORANGE[Innovation / Creation] ---
    "5.0": { name: "Gremlins", type: "Flaw", passive: "A die result of 1 on any roll is a miss or failed effect.", active: "When you take this Flaw, choose a Compensation Keyword. You may use its Active effect as if you knew it.", equipment: "A die result of 1 when using this gear will break it and cause effect to miss/fail." },
    "5.1": { name: "Sensor", type: "Gift", passive: "Choose a Color. Permanently gain associated sense at range equal to Wit stat.", active: "Utilize a sense of your choice at full range in a radius around the target.", equipment: "Wielder gains access to the chosen sense type while equipped." },
    "5.2": { name: "Improvisor", type: "Talent", passive: "Change Innate Passive Keywords as an action instead of just during downtime.", active: "Add your Level to the EV of any effect created using improvised gear.", equipment: "Use your level instead of this item’s level when determining EV." },
    "5.3": { name: "Crafty", type: "Quirk", passive: "Create permanent effects without reducing your maximum SP.", active: "Create permanent effect/item with level up to Technique. May contain Keywords in close range.", equipment: "Reduces crafting time to a Full Action." },
    "5.4": { name: "Charge", type: "Boost", passive: "At the start of conflict, gain Charge Tags equal to your Influence. (TRIGGER: Spend 1 to pay 1 SP or 1 EP of a cost).", active: "Grant the target Charge Tags equal to your Influence.", equipment: "Reduce the total EP cost by 1 when utilized." },
    "5.5": { name: "Bind", type: "Status", passive: "On a successful Basic Activation, you may grant the Bind Tag. (TRIGGER: Target is Immobilized. Target must spend 1 SP and an Action to remove).", active: "When part of a successful effect, grant the target the Bind Tag.", equipment: "On a successful hit, this item grants the Bind Tag." },
    "5.6": { name: "Imbue", type: "Form", passive: "Grant a Keyword you know to a target as part of any action.", active: "Add a Keyword to the effect from a source within close range.", equipment: "Choose known Keyword at creation. Wielder gains access to it while equipped." },
    "5.7": { name: "Material", type: "Modifier", passive: "Consume objects to apply their Keywords to your effects (EP cost still paid).", active: "Consume object to increase EV by Expertise or consumed item's Level (whichever is higher).", equipment: "Reload Property: Consume ammo/item to increase EV and choose 1 Keyword from it to apply." },
    "5.8": { name: "Leverage", type: "Drive", passive: "When using equipment in an Effort Roll, add the item’s Level to the effort value.", active: "Maneuvers gain Advantage.", equipment: "Maneuvers or Effort rolls made using this gear gain Advantage." },
    "5.9": { name: "Manifest", type: "Unique", passive: "Manifest items that persist only while utilized. They have Keywords equal to Technique and level equal to yours.", active: "Create temporary item. Gains Keywords equal to Technique chosen from witnessed/assessed entities in Scene.", equipment: "Manifest temporary items with Keywords up to wielder's Technique." },

    // --- COLOR 6: WHITE [Purity / Order] ---
    "6.0": { name: "Vulnerable", type: "Flaw", passive: "Effects do not require Advantage to be a called shot when targeting you.", active: "When you take this Flaw, choose a Compensation Keyword. You may use its Active effect as if you knew it.", equipment: "Called Shots targeting this item will destroy it." },
    "6.1": { name: "Tolerant", type: "Gift", passive: "When you would remove a Status Tag, Remove 2 instead.", active: "As part of any action that uses this, you may remove a status Tag from your pool.", equipment: "As an action, use to remove Status Tags from wielder." },
    "6.2": { name: "Deadeye", type: "Talent", passive: "You know all weak points, flaws, and Status Tags on a target.", active: "Make a Called Shot with this effect without needing Advantage.", equipment: "When targeting an Exposed target, the effect is an automatic Critical." },
    "6.3": { name: "Immunized", type: "Quirk", passive: "Choose a single Status Tag. You can no longer gain that Tag.", active: "Removes the chosen Tag from the target.", equipment: "Removes all instances of one type of Tag from a target as an action." },
    "6.4": { name: "Cure", type: "Boost", passive: "At the start of conflict, gain Cure Tags equal to your Influence. (TRIGGER: Spend 1 to remove any one Status Tag from your pool).", active: "Grant the target Cure Tags equal to your Influence.", equipment: "As an action, grant wielder the Cure Tag." },
    "6.5": { name: "Weaken", type: "Status", passive: "On a successful Basic Activation, you may grant the Weaken Tag. (TRIGGER: Resistance reduced by 1 for each Weaken Tag for next incoming damage. Remove 1 Weaken after).", active: "When part of a successful effect, grant the target the Weaken Tag.", equipment: "On a successful hit, this item grants the Weaken Tag." },
    "6.6": { name: "Sticky", type: "Form", passive: "Cling to and climb any solid surface. Permanently connect two objects for 1 SP.", active: "Leaves persistent object on target; triggers again at the end of each of the target’s turns. Removed via Setup Action.", equipment: "Leaves object that triggers at end of target's turn; removed with Setup Action." },
    "6.7": { name: "Restore", type: "Modifier", passive: "As an action, repair cosmetic cuts/breaks or ease pain/nausea.", active: "Restores a target's value by an amount equal to your Technique.", equipment: "As an action, restores a target's value by an amount equal to Expertise." },
    "6.8": { name: "Exploit", type: "Drive", passive: "Gain Advantage on all effects targeting an enemy who currently has any Status Tag.", active: "Remove Status Tags from target to increase EV by that amount (up to Technique).", equipment: "Remove Status Tag from target to increase EV by Expertise." },
    "6.9": { name: "Growth", type: "Unique", passive: "Know target's Value maximums/current amounts, age, and Exhaustion status if in Range.", active: "Toggle target's Exhausted state OR increase/decrease their Ambient Stage by 1 (deals no Value Loss).", equipment: "Fixes the user to a set Ambient Stage determined at creation." },

    // --- COLOR 7: RED [Energy / Glory] ---
    "7.0": { name: "Limited", type: "Flaw", passive: "Choose one Value (HP, SP, or EP); its maximum is permanently reduced by 5.", active: "When you take this Flaw, choose a Compensation Keyword. You may use its Active effect as if you knew it.", equipment: "This item cannot be utilized when broken." },
    "7.1": { name: "Resilient", type: "Gift", passive: "Choose one Value (HP, SP, or EP); its maximum is permanently increased by 5.", active: "Add your Technique to your resistances.", equipment: "Does not suffer Disadvantage on effect rolls for being broken." },
    "7.2": { name: "Font", type: "Talent", passive: "You are not considered dead unless your Energy (EP) is 0.", active: "Pay any Keyword cost for this effect by spending any of your values instead of Energy.", equipment: "Wielder may use any of their values to pay for costs." },
    "7.3": { name: "Insulated", type: "Quirk", passive: "Unaffected by the negative effects of environmental changes.", active: "Effect is immune to being altered by ambient environmental conditions.", equipment: "Wielder and item are unaffected by environmental changes." },
    "7.4": { name: "Regen", type: "Boost", passive: "At the start of conflict, gain Regen Tags equal to your Influence. (TRIGGER: Spend 1 as part of an action to restore 1 point to a Value).", active: "Grant the target Regen Tags equal to your Influence.", equipment: "At the end of the wielder’s turn, restore the chosen value by 1." },
    "7.5": { name: "Blight", type: "Status", passive: "On a successful Basic Activation, you may grant the Blight Tag. (TRIGGER: Suffer 1 unavoidable Value Loss next time you act/react. Remove 1 Blight after).", active: "When part of a successful effect, grant the target the Blight Tag.", equipment: "On a successful hit, this item grants the Blight Tag." },
    "7.6": { name: "Area", type: "Form", passive: "Elect not to add Level to an effect to affect everything in a radius (1 range band per Technique).", active: "Targets everything in radius (1 range band per Technique). Do not add Level to EV.", equipment: "Targets everything in radius (1 range band per Expertise). Do not add Level to EV." },
    "7.7": { name: "Ranged", type: "Modifier", passive: "Origin point of effects can be set to any point you can see within normal range.", active: "Not penalized for being made at a range further than your Range Stat.", equipment: "Ranged effects suffer no penalties for targets further than melee." },
    "7.8": { name: "Multiply", type: "Drive", passive: "Your Teamwork effort action can target all allies within range.", active: "Strike additional targets equal to your Technique. Do not add Level to EV.", equipment: "Strike additional targets equal to Expertise. Do not add Level to EV." },
    "7.9": { name: "Split", type: "Unique", passive: "Full turn: split into copies (up to Force stat). Divide current HP/SP/EP among them. They share your Keywords/stats.", active: "Target splits into equal-level animations under your control (up to Technique). Values divided among them.", equipment: "Separates into smaller parts. Keywords divided among parts; number of Keywords sets part's level." },

    // --- COLOR 8: BLUE [Influence / Cooperation] ---
    "8.0": { name: "Awkward", type: "Flaw", passive: "You have Disadvantage on any roll that uses a Mind stat (Wit, Expertise, Technique).", active: "When you take this Flaw, choose a Compensation Keyword. You may use its Active effect as if you knew it.", equipment: "Requires two Interact actions instead of one to equip or stow." },
    "8.1": { name: "Charismatic", type: "Gift", passive: "Advantage on Social Effort Rolls regardless of Faction Reputation.", active: "Target has Disadvantage on Effort Rolls made to resist its social/intellectual influence.", equipment: "Advantage on Taunt and Social Effort Rolls while visibly equipped." },
    "8.2": { name: "Leader", type: "Talent", passive: "Increase the number of Animations you may have bound to you to 2.", active: "A willing Companion or Animation may apply one of its Keywords to your Effect.", equipment: "Bonded Companion/Animation does not require a Command action to use its Keywords." },
    "8.3": { name: "Insightful", type: "Quirk", passive: "Sense surface-level emotions, detect lies, and know the Motivational Trinity of assessed targets.", active: "Grants one free Clue from the Assess action on the target.", equipment: "Determine if a target is telling the truth as an Assess action." },
    "8.4": { name: "Enhance", type: "Boost", passive: "At the start of conflict, gain Enhance Tags equal to your Influence. (TRIGGER: Spend 1 after rolling to increase SR result by 1).", active: "Grant the target Enhance Tags equal to your Influence.", equipment: "Wielder may spend 1 SP as an action to grant themselves the Enhance Tag." },
    "8.5": { name: "Silence", type: "Status", passive: "On a successful Basic Activation, you may grant the Silence Tag. (TRIGGER: Forfeit application of Innate Keywords on next action. Remove 1 Silence after).", active: "When part of a successful effect, grant the target the Silence Tag.", equipment: "On a successful hit, this item grants the Silence Tag." },
    "8.6": { name: "Splash", type: "Form", passive: "When granting a Tag, choose one adjacent target to gain one instance of any Tag granted to primary.", active: "Hits primary and all adjacent targets. Secondary targets take 0 Value Loss, but gain a copy of all Tags applied.", equipment: "Splashes to an adjacent target, applying all of the effect's Tags to that secondary target." },
    "8.7": { name: "Lingering", type: "Modifier", passive: "If you would grant a target Tags, grant them an additional Tag of one of the types granted.", active: "When this effect successfully grants Tags, the total number of each Tag granted is doubled.", equipment: "If utilized to grant a Tag, grant an additional Tag of one of the types granted." },
    "8.8": { name: "Spread", type: "Drive", passive: "As an action, copy one Status Tag from a target to a second target in touch range.", active: "If successful, copy one of the target's Tags to another target within close range of original.", equipment: "If successful, copy one of the target's Status Tags to another target within close range." },
    "8.9": { name: "Potent", type: "Unique", passive: "On Activate action, deal 0 Value Loss to automatically grant the effect's Tags (Can still be Dodged/Parried).", active: "Automatically grants its Tags, ignoring target's Resistance. Deals no Value Loss.", equipment: "Effects automatically grant their Tags, ignoring Resistance. Deals no Value Loss." },

    // --- COLOR 9: PURPLE [Esotericism / Identity] ---
    "9.0": { name: "Mundane", type: "Flaw", passive: "You have Disadvantage on any roll that uses an Essence stat (Power, Influence, Force).", active: "When you take this Flaw, choose a Compensation Keyword. You may use its Active effect as if you knew it.", equipment: "Wielder cannot add their innate Keywords to effects made with this gear." },
    "9.1": { name: "Aware", type: "Gift", passive: "Passively sense the use of any Keyword within your Range (knowing Color and general location).", active: "On a successful hit, you are revealed all the Passively Slotted Keywords on the target.", equipment: "Use as an Assess action to sense and locate any use of a specific Keyword chosen at creation." },
    "9.2": { name: "Stealthy", type: "Talent", passive: "Advantage on all rolls made to hide, move silently, or conceal objects.", active: "Make a Hide action as part of this Effect Action.", equipment: "Attempts to find this item via the Assess action are made with Disadvantage." },
    "9.3": { name: "Trickster", type: "Quirk", passive: "As a Setup Action, manifest an Illusory Puzzle. Until resolved, you and allies gain Concealment from target.", active: "Actions or reactions made against effects with this Keyword are made with Disadvantage.", equipment: "Perform a Hide action as a single action, regardless of available cover." },
    "9.4": { name: "Obscure", type: "Boost", passive: "At the start of conflict, gain Obscure Tags equal to your Influence. (TRIGGER: Spend 1 to become undetectable by a single chosen sense until attacking).", active: "Grant a target Obscure Tags equal to your Influence.", equipment: "Wielder may spend 1 SP as an action to grant themselves the Obscure Tag." },
    "9.5": { name: "Nullify", type: "Status", passive: "On a successful Basic Activation, you may grant the Nullify Tag. (TRIGGER: Target's Passive Keywords rendered inactive. Removed when gaining priority in a round).", active: "When part of a successful effect, grant the target the Nullify Tag.", equipment: "On a successful hit, this item grants the Nullify Tag." },
    "9.6": { name: "Chain", type: "Form", passive: "Effects targeting willing allies can chain to additional willing allies, up to your Technique.", active: "After hitting primary target, may 'chain' to one adjacent enemy, dealing a fixed EV of 1.", equipment: "On a successful hit, effect may chain to an additional target within close range, dealing 1 Value Loss." },
    "9.7": { name: "Natural", type: "Modifier", passive: "Add any innate Keyword you know to a Gear effect at no extra EP cost (up to Technique).", active: "This effect can be used even if you are Silenced.", equipment: "Considered part of the wielder. Cannot be Disarmed; channels wielder’s Keywords at no extra EP cost." },
    "9.8": { name: "Ambience", type: "Drive", passive: "As an action, alter ambient environmental conditions by one step (persists with concentration).", active: "Modify one environmental hazard within range by a number of steps up to your Technique.", equipment: "Change a chosen environmental condition within a small radius up to wielder's Expertise." },
    "9.9": { name: "Channel", type: "Unique", passive: "Combine gear and innate passive pools into one unified pool. Capacity increased by 1 to slot this Keyword.", active: "Willing target gains the passive benefits of your slotted Keywords (up to Technique) until end of their next turn.", equipment: "Wielder can grant a passive from this item to a willing target as an action." }
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