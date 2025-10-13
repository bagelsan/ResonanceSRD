# Layer 4: The Strategic Game

This layer reveals the full game structure and the rules for resolving different types of situations.

---

### 1.0: Scene Clock & Situation Types

The outcome of an entire Scene is determined by the party's ability to deplete the **Scene Clock**, which represents completing their primary objective through a series of situations, travel, and rest periods.

*   **(1.1) The Scene Clock:** This clock tracks progress towards the players' goal. It starts with a value based on the Scene's complexity (typically 8-15 points). It is depleted by 1 when Situation Clocks are resolved, Travel occurs, or a Rest is taken.
*   **(1.2) Scenes are resolved using the standard Situation system.** However, a Race Situation introduces a hard time limit via the Threat Clock.
    *   **(1.2.1) Standard Situation (Combat, Exploration, Social)**
        *   **Mechanic:** Threat is managed through narrative consequences.
        *   **Success:** The Situation Clock is reduced to 0.
        *   **Failure Consequence:** When a Situation is failed, the scene is not ended. The Curator may introduce a Complication (e.g., more enemies arrive, the objective becomes harder, an ally is put in danger).
        *   **Resolution:** The Scene is a Success if the Scene Clock is depleted. It is a Failure if the players are defeated or retreat.
    *   **(1.2.2) Race Situation (Timed, High-Stakes)**
        *   **Mechanic:** This special situation type introduces the **Threat Clock**, turning the scene into a direct race against time.
        *   **Success:** The Situation Clock is depleted to 0.
        *   **Partial Success:** The Scene ends prematurely, and the Scene Clock has fewer points remaining than the Threat Clock.
        *   **Failure:** The Threat Clock is depleted to 0, or the Scene ends with the Threat Clock having fewer or equal points remaining than the Scene Clock.
*   **(1.3) The Threat Clock:** This mechanic is only used during a Race situation. Its size is determined by a simple lookup table, providing a "threat budget" based on the scene's difficulty.
    *   **(1.3.1) When a Timed Situation begins, the Curator determines its Difficulty Category based on its Level Modifier.** They then consult the table below, cross-referencing the Situation Level with the Difficulty Category to find the Threat Clock's starting value. This value is set for the entire scene.

| Difficulty Category | Level Modifier | Description                               |
| :------------------ | :------------- | :---------------------------------------- |
| Hard                | L+1 or L+2     | A tight race with little room for error.  |
| Normal              | L+0            | A standard challenge with a fair buffer.  |
| Easy                | L-1 or L-2     | A forgiving situation with ample time.    |

*   **(1.3.2) Threat Budget Table:**

| Situation Level | Hard | Normal | Easy |
| :-------------- | :--- | :----- | :--- |
| 1-3             | 8    | 15     | 20   |
| 4-6             | 12   | 20     | 30   |
| 7-9             | 16   | 25     | 40   |

*   **(1.3.3) Depleting the Clock (The Cost of Action & Time):**
    1.  **Action Cost:** Whenever a player makes an Effort Roll against a Barrier or Puzzle, the Threat Clock is immediately depleted by 1 point.
    2.  **Time Cost:** At the end of every Round during a combat or other time-sensitive conflict within the Race, the Threat Clock is depleted by 1 point.

---

> ### SPARKS IN ACTION: RACING THE CLOCK
>
> Sparks and Rook are now Level 3. They are in a Race Situation. A bomb is set to go off in a power conduit.
>
> *   **Curator Setup:** "This is a Race Situation. The **Scene Clock** starts at 5. You need to get through two Barriers (an outer and inner door) and defeat a final 'Boss' Sentry Turret to reach the bomb. Your main objective is the **Situation Clock**, which starts at 3 (for the three challenges)."
> *   **The Threat:** "Because this is a Race, I am also activating the **Threat Clock**. Based on the difficulty, it starts at 15. It will tick down every round and every time you make an Effort Roll. If it reaches 0 before the Situation Clock, you fail."
> *   **The Race Begins:**
>     *   **Barrier 1:** Rook uses Effort Rolls to break down the first door. Each time he makes an Effort Roll, the Curator announces, "Okay, the Threat Clock ticks down by 1." The door is tough, and it takes him a full round. The Curator says, "End of the round. The Threat Clock ticks down by 1 again." The Threat Clock is now at 13.
>     *   **Barrier 2:** Sparks takes over on the second door, which is a complex electronic lock (a Puzzle). She uses her Technique stat for her Effort Rolls. She succeeds, depleting the second clock. The Situation Clock is now at 2. The Threat clock is now at 12.
>     *   **The Boss:** They face the Sentry Turret. It's a tough fight that lasts two rounds. The Situation Clock is now at 0, and the Threat Clock is now at 10.
>
> They successfully finish the situation with time to spare!