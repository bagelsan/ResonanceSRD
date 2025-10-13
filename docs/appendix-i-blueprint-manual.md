# Appendix I: The Blueprint & NPC Design Manual

### Foreword: The Curator’s Toolkit

This appendix details the Resonance System’s complete toolset for creating and codifying content. It is designed for Curators who enjoy procedural generation or want a formal system for building everything from a single trap to a master villain.

This manual is divided into three parts:

1.  **The Core Blueprint Language:** A formal, coded language for rapidly generating thematically-coherent Scenes and the Situations within them.
2.  **Advanced NPC Design & The Codex:** A comprehensive methodology for designing the deep, mechanically sound, and narratively rich NPCs that form the heart of a campaign.
3.  **Master Example & Core Reference:** A complete, end-to-end demonstration of the design process and the essential reference tables.

---

## Part 1: The Core Blueprint Language

This language allows a Curator to generate a complete Scene: a thematically coherent location or block of time containing one or more challenges, from a single string.

### 1.0 The Blueprint Hierarchy

The language is built on a clear, top-down hierarchy:

> Saga > Episode > Scene > Situation > Package (Entity, Challenge, Item)

### 2.0 Core Components & Delimiters

*   `##`: A two-digit Keyword code.
*   `####`: A four-digit Flaw/Compensation pair code.
*   `#`: A single-digit code or a Level number.
*   `A-Z`: A Stat or Challenge abbreviation (X for Barrier, Y for Puzzle).
*   `*`: An operator that flags a Situation as a “Timed Phase.”
*   `!`: A prefix designating a keyword as Passive in an entity’s manifest.
*   `L#` or `L±#`: The Level or Level Offset block for a challenge or generic entity.
*   `()`: Parentheses for Scene Complexity override.
*   `-`: A primary component delimiter.
*   `.`: A secondary component delimiter.
*   `:`: Separates Scene Parameters from the Manifest.
*   `,`: Separates packages within a Manifest.
*   `|`: Separates Situations to form a multi-part Scene.
*   `||`: Separates Episodes to form a Saga.

### 3.0 Blueprint by Example: Deciphering a Full Scene

Let’s break down a complete blueprint for a multi-part scene:

` (3)72-2|*1|3:[B1:B[L+1]],[L+1.A7131],[P[L0],Item[L2-75.45.65]] `

1.  **Scene Structure:** A 3-Situation Scene (`(3)`) with an overall theme based on keyword 72 (Font).
2.  **Situation 1 (Combat):** `-2`. The manifest `[X1:X[L+1]]` contains one Barrier (identified as “X1”), one level higher than the scene anchor.
3.  **Situation 2 (Timed Boss):** `-*1`. The asterisk `*` marks this as a Timed Phase, activating the Threat Clock. The manifest `[L+1.A7131]` calls for a generic “Artisan-Striker” NPC who has progressed to one level higher than the party anchor.
4.  **Situation 3 (Puzzle):** `-3`. The manifest `[Y[L0],Item[L2-75.45.65]]` contains a standard Puzzle and a Level 2 Item. The Threat Clock becomes dormant again.
5.  **The Item Payload:** `Item[L2-75.45.65]` is a Level 2 Item holding three keywords: Blight(75), Curse(45), and Weaken(65). This could be loot, or the payload for a trap linked to the Puzzle.

### 4.0 Scene & Situation Generation

A Scene is generated from: `(Complexity)[Theme Code]-[Situation Code(s)]:[Manifest(s)]`

*   **Complexity:** An override `(1-5)` sets the total Situations. If absent, it defaults to `floor([First Digit of Theme] / 2) + 1`. For multi-part scenes using `|`, the override must match the number of parts.
*   **Ancillary Situations (for simple, non-| scenes):** Preludes derived from the digits of the Thematic String (Theme Code + Situation Code).
    *   **1-4:** Obstacle | **5-7:** Conflict | **8-9:** Interaction | **0:** Twist
*   **The Timed Phase Modifier (`*`):** Placing `*` before a Situation Code activates the Master Threat Clock rules for its duration.

### 5.0 The Manifest & Generation Packages

The Manifest `[...]` contains packages that generate the specific challenges for a Situation.

*   **Entity Package (`L±#.[Stat][Faction##][Seed##]`):** A shorthand for generating a generic NPC or Animation.
*   **The “Chaos Slot” Universal Rule:** In addition to the manifest, every Situation contains one extra, completely random Chaos Entity (d10 roll: 1-2 NPC, 3-6 Animation, 7-9 Item, 10 Level Variant).
*   **Challenge Packages:** `X[L±#]` for a Barrier, `Y[L±#]` for a Puzzle.
*   **Item/Gear Package (`Item`):** Defines loot and trap payloads. `Item[L#-KW##.KW##...]`.
*   **Environmental Traps:** A concept built from a narrative Trigger, a Disarm Mechanism (Barrier/Puzzle), and a Payload (Item).

---

## Part 2: Advanced NPC Design & The Codex

### 6.0 The Design Philosophy: Chart Progression, Don’t Assign Power

Create an NPC by first mapping their entire journey of growth. Design their **Mechanical Chassis**, a blueprint for their potential. And from this, you can derive a version of the character at any point in their life story. An entity’s Level is extrapolated from the total number of keywords in their design string; it is not a declared value.

### 7.0 The Mechanical Chassis (The Design String)

This is the human-readable source code for an NPC, defining their identity and their entire potential path of mastery. The string begins with the Seed keyword(s) and charts the path of acquisition.

*   **Standard Chassis Format:** `[Seed ##(Z)] - Awakening - MRP1 - MRP2 ...`
*   **Flawed Seed Chassis Format:** `[Flawed Seed ####.##(Z)] - Awakening - MRP1 - MRP2 ...`
*   **Archetype Vector `<Color | Domain Function>`:** Defines the character’s core identity by referencing the 3x3 Stat Grid.
*   **Specification Suffix `##(Z)`:** Encodes a required choice for certain keywords (e.g., `71(1)` for Resilient-HP).

### 8.0 The Codex Blueprint: Charting an Entity’s Progression

An entity’s Level is earned by acquiring keywords. A character’s build path is determined by their origin: The Standard Path or the Flawed Seed Path.

#### 8.1 The Flaw/Compensation Protocol (The `####` Syntax)

This is the master rule for all flawed characters.

1.  **The Pair Code:** A Flaw is never taken alone. It is mechanically represented as a four-digit `####` code, where the first two digits are the Flaw keyword and the last two digits are its Compensation keyword. Example: `5018` represents the `50` Gremlins Flaw paired with the `18` Brutal Compensation.
2.  **The Flawed Container Rule:** A block containing a `####` pair gains one additional keyword slot. This is the mechanical trade-off for the Flaw’s penalty.
    *   **Flawed Seed:** A character with a Flawed Seed begins with the `####` pair and one additional keyword. Example: `4067.41`. This character starts with 2 keywords.
    *   **Flawed Level-Up:** A level-up block containing a Flaw is a three-keyword acquisition. Example: `5018.82.83.T`.

#### 8.2 The Law of Progression

All characters begin at Level 0 with all nine stats at a baseline of 1. Their path to Level 1 is the **Awakening** (A Narrative Event). Upon learning their Awakening package, they reach Level 1, and all nine of their stats are raised to a new baseline of 2.

*   **The Standard Path:** Begins with one Seed keyword (`##`). Their Awakening is a 3-keyword package. They reach Level 1 with 4 total keywords.
*   **The Flawed Seed Path:** Begins with a two-keyword Flawed Seed package (`####.##`). Their Awakening is a 3-keyword package. They reach Level 1 with 5 total keywords.

After Level 1, a new level and stat points are gained for every two keywords learned.

#### 8.3 Official Progression Table (PC & NPC)

| Level | Total Keywords (Standard Path) | Total Keywords (Flawed Seed Path) | Stat Gain This Level | Total Stat Points Gained (Cumulative) |
| :--- | :--- | :--- | :--- | :--- |
| 0 | 1 | 2 | All stats at 1 | 0 |
| 1 | 4 | 5 | All stats become 2 | 0 |
| 2 | 6 | 7 | +1 Stat Point | 1 |
| 3 | 8 | 9 | +1 Stat Point | 2 |
| 4 | 10 | 11 | +1 Stat Point | 3 |
| 5 | 12 | 13 | +1 Stat Point | 4 |
| 6 | 14 | 15 | +2 Stat Points | 6 |
| 7 | 16 | 17 | +2 Stat Points | 8 |
| 8 | 18 | 19 | +2 Stat Points | 10 |
| 9 | 20 | 21 | +2 Stat Points | 12 |

#### 8.4 Writing the Codex String

The final string is a pure-code representation of the character’s growth, with no spaces.

*   **Seed:** `##` or `####.##`
*   **Awakening:** `-#x3` (shorthand for `#1.#2.#3`) or a custom `-##.##.##` package.
*   **Standard Level-Up:** `-##.##.S`
*   **Flawed Level-Up:** `-##.####.##.S`

**Example Codex Strings:**
*   Standard L4: `01(1)-1x3-11(1).19.M-92.94.A-17.21.T`
*   Flawed Seed L4: `4067.41-4x3-49.48.P-97.03.F-92.71(1).P`
*   Flaw at L2: `01(5)-5x3-5018.82.83.T-32.62.B-58.05.A`

### 9.0 Design Patterns: Mechanical Role Packages (MRP)

MRPs are pre-defined, synergistic bundles of four keywords that form a recognizable combat role. They are a design tool for filling the keyword packages described above.

| MRP Code | Role | Core Keywords |
| :--- | :--- | :--- |
| 01 | Striker | Brutal (18), Reckless (29), Condense (27), Impact (38) |
| 02 | Engineer | Specialist (02), Leverage (58), Stubborn (33), Material (57) |
| 03 | Conduit | Adaptive (07), Siphon (48), Flux (47), Multiply (78) |
| 04 | Aegis | Restore (67), Ward (34), Chain (96), Defensive (37) |
| 05 | Controller | Potent (89), Lingering (87), Splash (86), Spread (88) |
| 06 | Skirmisher | Haste (24), Acrobatic (21), Snap (26), Charge (54) |
| 07 | Bastion | Sturdy (31), Survivor (41), Defensive (37), Charismatic (81) |
| 08 | Storm | Area (76), Impact (38), Flux (47), Sculpt (36) |
| 09 | Tactician | Martial (12), Reactive (16), Brawler (32), Resilient (71) |
| 10 | Overlord | Animate (49), Leader (82), Manifest (59), Chain (96) |

---

## Part 3: Special Protocols & Core Reference

### 10.0 Special Protocols & Shorthand

#### 10.1 The Collapse Protocol (Multiple Flaws)

A blueprint with two or more Flaw keywords is unstable and will **Collapse**. A four-digit `####` code counts as a single Flaw for this purpose. A character cannot have two `####` codes in their design string.

*   **Item:** Creates a **Dead Slot**. The Flaw keywords are consumed, and for each Flaw beyond the first, one keyword slot on the item becomes permanently unusable.
*   **Animation:** **Inject chaos**. The first Flaw is kept. Subsequent Flaws are discarded and replaced by a new, randomly generated keyword.
*   **NPC:** **Demotes** the blueprint to an Animation of the same final Level. Keywords are transcribed sequentially from the original NPC string. Subsequent Flaws are discarded, and the next valid, non-Flaw keyword in the sequence is taken instead.
*   **PC Exception:** Player Characters cannot have more than one Flaw. The Collapse Protocol does not apply to them.

#### 10.2 Special Situation Rules

*   `*0` **(Twist):** Interrupts the current Scene with a new, randomly generated Scene.
*   `5` **(Rest):** Allows players a free recovery or prep action.
*   `*1` **(Boss):** The first entity in this Situation’s manifest automatically gains the L+2 (Boss) Tier and its benefits.

#### 10.3 “Color Mastery” (x9) Shorthand

*   **Syntax:** `[Seed KW ##]-#x9`
*   **Function:** A shortcut to create a Level 4 “Boss” NPC who knows its Seed and all nine non-Flaw keywords of the specified Color.

### 11.0 Master Example: From Chassis to Character

1.  **The Mechanical Chassis:**
    > Jet - Flawed Seed - 4067.41 - Awakening - Overlord (Partial) - Conduit (Partial) - Tactician (Partial)

2.  **The Final Numerical String:**
    > `4067.41-42.43.49-48.97.P-03.92.F-71(1).82.P`

3.  **The Character Made Manifest (Stat Block):**
    This character has 11 keywords, making them Level 4 on the Flawed Seed Path. They have 3 stat points to allocate beyond the baseline of 2.

    #### Name: Jet
    *   **Level:** 4
    *   **Stat Grid (Force/Power Focus, Floor 2):**
        *   Body: M 2, A 2, B 2
        *   Mind: W 2, E 2, T 2
        *   Essence: P 3, I 2, F 4
        *(Distribution of 3 points: +2 Force, +1 Power)*
    *   **Core Stats:**
        *   HP/SP/EP: 10/10/10 | Resistance: 9 (Force 4 + Power 3 + M/A/W/E/T/I 2)
    *   **Keyword Architecture (11 Total from Codex String):**
        *   **Passive Slot Limit:** Level (4) + Force (4) = 8 Slots.
        *   **Origin (Flawed Seed):**
            *   `40` Feeble (Flaw)
            *   `67` Restore (Compensation)
            *   `!41` Survivor
        *   **Identity (Awakening):**
            *   `42` Stoic
            *   `!43` Ageless
            *   `49` Animate
        *   **Progression:**
            *   L2: `!48` Siphon, `!97` Natural
            *   L3: `!03` Alert, `!92` Stealthy
            *   L4: `!71` Resilient, `!82` Leader
    *Note: `!` denotes a slotted passive keyword.*