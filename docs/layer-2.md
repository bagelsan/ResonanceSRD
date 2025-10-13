# Layer 2: The Situation and Actions

This layer introduces your character's resources, the choices you can make, and the immediate structure of an encounter.

---

### 1.0: Your Character's Clocks (Resources)

You have three personal Clocks. You must prevent these from being depleted.

*   **(1.1) Health Points (HP):** Your physical durability. Starts at 10. Depleted by damage.
*   **(1.2) Stamina Points (SP):** Your physical exertion. Starts at 10. Depleted by strenuous actions.
*   **(1.3) Energy Points (EP):** Your inner power. Starts at 10. Depleted by using innate abilities.

---

### 2.0: Environmental Challenges (Micro-Clocks)

In addition to Entities (living beings with HP, SP, and EP Clocks), you will face three distinct types of Environmental Challenges.

*   **(2.1) Barrier:** A physical or magical obstruction that must be worn down or broken through.
    *   **(2.1.1) Mechanic:** A Barrier is defined by a Task Clock and a Target Number (TN). The TN is typically 10 + the Barrier's Level.
    *   **(2.1.2) Interaction:** Players use `Effort Rolls` to deplete the Barrier's Task Clock.
*   **(2.2) Puzzle:** A cerebral challenge that requires logic or insight. It is not depleted with repeated rolls.
    *   **(2.2.1) Mechanic:** A Puzzle is binary (solved or unsolved) and defined by a single, high Target Number (TN).
    *   **(2.2.2) Interaction:** Players overcome a Puzzle through roleplaying. The Curator may call for a single, decisive Effort Roll against the Puzzle's TN to see if their solution works.
*   **(2.3) Traps (Environmental Hazards):** An Item with keywords placed in the environment to create a hazard. A trap is defined by three components: The Payload, The Trigger, and The Challenge.
    *   **(2.3.1) The Payload (The Item):** The trap itself is an item that produces an effect. When triggered, it uses the Activate action to release its keywords.
    *   **(2.3.2) The Trigger (Narrative):** The narrative event that causes the Payload to Activate. This is set by the Curator (e.g., a pressure plate, a failed roll to disarm its mechanism).
    *   **(2.3.3) The Challenge (The Mechanics):** The challenge that players must overcome to prevent the trap from triggering. This is almost always a Barrier or a Puzzle.

---

### 3.0: The Situation Clock

An encounter or phase of a Scene is called a Situation. It is represented by a Situation Clock.

*   **(3.1) The Situation Clock's starting value is equal to the number of key Micro-Clocks (Entities, Barriers, Puzzles) within it.**
*   **(3.2) When you deplete any HP or Task Clock to 0, or solve a Puzzle, you deplete 1 point from the parent Situation Clock.**
*   **(3.3) Depleting a Situation Clock to 0 reduces the Scene Clock by 1.**

---

### 4.0: The Action Catalog

The following is a complete list of actions available to a character, organized by type.

*   **(4.1) A character begins with a set number of actions they can take on their turn (Alacrity Stat).** This number can be modified by keywords or other effects.
*   **(4.2) A character can never take more than 6 total actions on their turn.**

> #### Curator’s Tip: The Three Core Choices
>
> For faster play, especially with new players, you can boil down the entire Action Catalog into three core questions a player can ask on their turn. Almost every action falls into one of these categories.
>
> *   **“Do I want to CHANGE something?”**
>     This is an Activate action (attacking, using an ability) or an Effort Roll (overcoming a barrier). The goal is to directly affect an enemy or the environment.
> *   **“Do I want to CONTROL the battlefield?”**
>     This is a Maneuver (Shove, Taunt, Disarm). The goal isn’t to deal damage, but to change the tactical situation by moving enemies or applying conditions.
> *   **“Do I want to PREPARE for the future?”**
>     This is a Focus action (gaining Advantage, learning a Clue) or a Teamwork action (buffing an ally). The goal is to sacrifice this turn’s action for a bigger advantage on a future turn.
>
> By framing their turn with these three simple questions a player can quickly decide on their intent, which makes choosing a specific action from the catalog much faster and more intuitive.

#### (4.3) Effect Actions (Single Action)

1.  **Activate:** The primary action for causing an effect. The base roll for an Activate action is called an Effect Value (EV).
    *   The EV is calculated by adding a Standard Roll, The Character's Level, and the Character's Chosen Stat.
    *   Keyword Active Effects can be applied for a cost of one EP per keyword.
    *   The total EP cost is reduced by the character's Power Stat to a minimum of 0 before any other EP cost adjustments.
    *   If the EV does not exceed the target's Resistance, the Action has no effect unless a keyword states otherwise.
2.  **Called Shot:** You make a specialized Activate action with Disadvantage to target a specific weak point on an enemy Character or to target an item they are holding.
    *   **Targeting an Item:** A successful hit deals value loss to the item's Durability Clock instead of the wielder's HP. The wielder defends with their normal Resistance.
    *   **Targeting an Entity:** A successful Called Shot against an Entity is automatically a Critical Hit, even if doubles are not rolled, granting you the choice of its bonus effects. If this attack reduces the target's HP Clock to 0, they are killed instantly, bypassing the normal Unconscious state (unless a passive keyword or other effect prevents this).

#### (4.4) Move Actions (Single Action)

1.  **Move:** Travel up to a number of range bands equal to your Movement stat.
2.  **Mount:** Perform an Interact action to gain the Riding condition on a valid target.
3.  **Dismount:** Perform an Interact action to end the Riding condition.
4.  **Hide:** Make an `Effort Roll` (SR + Level + Stat) to become Hidden. The result is the TN to find you.

#### (4.5) Maneuver Actions (Single Action, costs 1 SP)

1.  **Shove:** Make an EV roll vs. target's Resistance to push them or knock them Prone.
2.  **Disarm:** Make an opposed EV roll to force a target to drop an item.
3.  **Restrain:** Make an EV roll to grant the Bind Tag to a target.
4.  **Lunge:** Make a melee strike that can target an enemy at Close range instead of Touch range.
5.  **Lock On:** Gain Advantage against a target, who also gains Advantage against you.
6.  **Taunt:** Make an opposed EV roll to force a target to use Lock On against you.
7.  **Improvise:** Use the environment or an item to apply a Status Tag without dealing value loss.
8.  **Multi-Attack:** When making an attack action, for an additional 1 SP, you may add the Level and one keyword from a second equipped item to your effect. You must pay the normal EP cost (if any) for the added keyword.
9.  **Feint:** Make an opposed EV roll to make the target Exposed.

#### (4.6) Focus & Assess Actions (Full Turn Action, costs 1 SP)

1.  **Recharge:** Restore SP equal to your Brawn stat. As this is a Focus action that costs 1 SP, it cannot be performed if you have 0 stamina.
2.  **Recover:** Remove a number of Tags of your choice equal to either Brawn, Wit, or Influence from your Tag pool.
3.  **Ready:** Add your Wit stat to your Resistance value until the start of your next turn.
4.  **Advantage:** Gain Advantage on the first SR you make on your next turn.
5.  **Reveal:** Make an Effort Roll against a Hidden target's Hide roll to locate and target them.
6.  **Clue:** Learn a number of facts about a target equal to your Technique stat.

#### (4.7) Effort & Team Actions (Single Action)

1.  **Effort Roll:** The primary action for targeting a Barrier's Task Clock or solving a Puzzle.
2.  **Teamwork:** Grant a stat of your choice as a bonus to an ally’s next Effort Roll.
3.  **Sabotage:** A target suffers Disadvantage on their next Effort Roll.

#### (4.8) Reaction Actions (Triggered outside your turn)

1.  **Avoid (Dodge) (1 SP):** Make an opposed EV roll to negate an incoming effect. If the EV is higher than the incoming EV, ignore the effect.
2.  **Resist (Block) (1 SP):** Add your Level to your Resistance against a single incoming effect.
3.  **Parry (3 SP):** Make an opposed EV roll to negate an incoming effect. If the EV is higher than the incoming EV, ignore the effect then immediately gain priority. If you have no remaining actions for the turn you may make 1 free action.
4.  **Clash (2 SP):** Use your own effect to intercept another; the loser takes the combined value loss.
5.  **Reflect (1 SP):** After a successful Avoid or Resist, redirect the original effect back at the attacker.
6.  **Counter (1 SP):** After a successful Avoid or Resist, make an immediate Basic Activate action.
7.  **Guard (1 SP, Ally Reaction):** Intercept an attack targeting an ally, become the target of the effect and allowing you to react if able. The ally must be within close proximity.
8.  **Combo (1 SP, Ally Reaction):** Add a stat of your choice and one of your known keywords to an ally’s effect.
9.  **Flank (1 SP, Ally Reaction):** If an ally attacks an enemy adjacent to you, grant that enemy Disadvantage on their next action.

#### (4.9) Setup & Command Actions (Single Action)

1.  **Reload:** Required by the `Material` keyword; consumes an item.
2.  **Assist:** Designate one target. All allies gain Advantage on their next action against that target.
3.  **Pass:** End your turn, ceding Priority.
4.  **Command:** Direct a Companion, Animation, or Mount under your control to act in place of your action.

---

### 5.0: Effort

Social challenges, skill challenges, and any non-combat challenge are resolved using Effort Rolls against a Target Number (TN) and a Clock.

*   **(5.3) Effort Roll Mechanics**
    *   Roll a Standard Roll (SR); use Advantage/Disadvantage if applicable.
    *   ER (Effort Roll) = SR + Chosen Stat + Level
    *   Keywords or other effects are then applied to the ER.
    *   Subtract TN from the ER and reduce the Clock by the amount if it is positive.
*   **(5.4) Social challenges are an Effort Roll Shaped by 3 Criteria**
    *   **(5.4.1) Faction Trust:** The social status of the character with the target’s associated faction or group determines advantage or disadvantage.
        *   Ally - Advantage
        *   Neutral - Standard Roll
        *   Enemy - Disadvantage
    *   **(5.4.2) Character Trust:** The personal level of trust and respect for the character from the target determines the TN.
        *   Trusting - TN 5
        *   Neutral - TN 8
        *   Doubting - TN 12
    *   **(5.4.3) Tension:** The urgency of the situation that merited the need for the Social Challenge.
        *   Calm - Clock = 3
        *   Neutral - Clock = 5
        *   Tense - Clock = 10
    *   **(5.4.4) Success of a social challenge is decided by reducing the clock to 0.**
*   **(5.5) Non-combat and non-social challenges follow the same core mechanic: Effort Roll vs. TN and Clock.**
    *   **(5.5.1) The TN and Clock are determined entirely by the narrative stakes and task complexity and are set by the Curator.**
    *   **(5.5.2) Success is measured by reducing the clock to 0 through accumulated effort and is based on the narrative the Curator has set.**
    *   **(5.5.3) Binary challenges do not use a clock and are successful as long as the ER exceeds the TN.**

---

### 6.0: Stat Application (Player's Choice)

Many actions and keywords in the Resonance system allow a character to add a stat to a roll.

*   **(6.1) The player always chooses which of their nine stats to apply to the roll.**
*   **(6.2) The player should briefly justify their choice based on their description of the action.**
*   **(6.3) Keywords and rules may require a specific stat instead of player choice and will specify as such.**
*   **(6.4) The Curator has the final say on the appropriateness of a stat, but the default assumption is always to empower the player's choice.**

---

### 7.0: Defeat, Death, and Resurrection

Managing your resource Clocks is key to survival. Allowing them to be fully depleted can have dire consequences.

*   **(7.1) When your primary Clock (HP) is reduced to 0, you are considered Downed.** You immediately suffer the associated Condition (Unconscious).
    *   **(7.1.1) A Downed character is not defeated and can still be restored or affected as normal.**
*   **(7.2) While you are at 0 HP (Unconscious), any further effect that would cause you to lose HP is lethal.** Your character is dead, unless a passive keyword or other effect states otherwise.
*   **(7.3) Bringing a character back from death is a monumental task.** It can be achieved in one of two ways:
    *   **(7.3.1) Miraculous Restoration:** An ally scores a Critical while using a Restore effect on your character during the same situation that caused the character to be Downed.
    *   **(7.3.2) Emergency Care:** A character can make a singular attempt to resuscitate a downed character with the following criteria:
        *   A dead character can only be attempted to be resurrected with emergency care once during the Scene they were downed.
        *   The roll is made as a SR + The acting character's Level.
        *   The TN of the roll is the Target’s maximum HP + the Number of rounds they have been Dead.
        *   A successful roll results in an alive but still Downed Character with all clocks set to 0.
        *   A failed roll results in the character requiring Downtime to be resurrected.
    *   **(7.3.3) Downtime:** The party performs a special activity during a Downtime phase, often requiring a significant Karma expenditure or the completion of a difficult side-quest, as determined by the Curator.

---

> ### SPARKS IN ACTION: THE AWAKENING
>
> After overcoming her first challenge, the Curator rules that Sparks has had her Awakening. This is a major narrative event that transforms her from a Level 0 "Seed" into a Level 1 hero.
>
> #### The Awakening (Level 1)
>
> *   **Level Up:** Sparks is now Level 1.
> *   **Stat Growth:** All nine of her stats increase from 1 to a new baseline of 2.
> *   **New Keywords:** She immediately learns three new keywords. To build on her "Attuned" theme of connection and utility, her player, Alex, chooses:
>     *   **Traveller (1.1):** Alex chooses Teleport as her movement type. She can now instantly relocate to a visible location.
>     *   **Insightful (8.3):** This allows her to sense emotions and detect lies, reinforcing her theme of perception and connection.
>     *   **Trickster (9.3):** This gives her the ability to create minor sensory illusions, a clever way to use her powers non-violently.
>
> #### Sparks' Level 1 Stats:
>
> *   **Level:** 1
> *   **Stats:** All stats are 2.
> *   **HP/SP/EP:** 10/10/10
> *   **Resistance:** 6 (sum of her three highest stats, which are all 2)
>
> #### Her First Situation
>
> Sparks enters a warehouse and finds two Level 1 Thugs (Animations) threatening a merchant. The Curator declares a Situation with a **Situation Clock of 2** (one for each Thug).
>
> *   **Rook's Turn:** Rook, Sparks' ally, defeats one Thug. The Situation Clock is now 1.
> *   **Sparks' Turn:** It's Sparks' turn, and she has 2 actions (from her Alacrity stat). The remaining Thug has a Resistance of 3.
>     *   **Action 1 (Activate):** Alex declares, "I want to use my Trickster ability to create the illusion of a guard dog barking behind the Thug to distract him." She will Activate this effect, targeting the Thug's EP (mental stamina).
>     *   **Keywords & Cost:** To make this work, she applies the **Trickster (9.3)** keyword. This costs 1 EP, which is then reduced by her Power stat of 2. The final cost is 0 EP (min 0).
>     *   **The Roll:** She rolls a 6 on her SR.
>     *   **The Calculation:** Alex chooses to use her Influence stat. Her Effect Value (EV) is `6 (SR) + 1 (Level) + 2 (Influence) = 9`.
>     *   **The Result:** Her EV of 9 easily beats the Thug's Resistance of 3. The Thug loses 6 EP and is visibly startled. Since the action was successful, Sparks can pass Priority to an ally, but she has another action.
>     *   **Action 2 (Move):** "While he's distracted," Alex says, "I'll use my Traveller (Teleport) ability. I'm going to use my Move action to teleport behind the merchant to get between him and the Thug." She instantly relocates, ending her turn and passing priority to the only remaining option, the Thug.
>
> The Thug elects to flee, a victory for our team!