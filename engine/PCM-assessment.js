/**
 * PCM-assessment.js
 * Source of Truth: Questionnaire & Profile Evaluator
 * 
 * Implements the 27-question Psychromattic Assessment,
 * tallies motivation vectors, compiles the 3x3 Heat Map,
 * and generates 5-Point Psychological Profiles & Hex Codes.
 */

// Step 6.0: The Verbatim 27-Question Database (Appendix C, Part II)
export const ASSESSMENT_QUESTIONS = [
  // --- Section A: The Axis of Motivation (The Source) ---
  {
    id: 1,
    section: "A",
    axis: "Motivation",
    text: "A sudden, city-wide power outage plunges your neighborhood into darkness and confusion. What is your first, most immediate priority?",
    choices: {
      a: { text: "Securing the immediate area. I'll check on my neighbors, make sure everyone is physically safe, and assess any immediate dangers like downed lines or panicked drivers.", value: "Body" },
      b: { text: "Figuring out the system. I'll try to find a working radio, talk to officials, and understand the scope and cause of the outage to predict what happens next.", value: "Mind" },
      c: { text: "Establishing a principle. In a crisis, people's true character shows. My focus is on preventing panic and ensuring our small community acts with integrity, not fear.", value: "Essence" }
    }
  },
  {
    id: 2,
    section: "A",
    axis: "Motivation",
    text: "Looking back on a time you truly grew as a person, what was the most significant change?",
    choices: {
      a: { text: "I mastered a new skill or field of knowledge, allowing me to understand and interact with the world in a more effective, logical way.", value: "Mind" },
      b: { text: "I became more certain of who I am and what I stand for. My actions now align more closely with my core values, and I feel more authentic.", value: "Essence" },
      c: { text: "I became more in tune with my body and my instincts. I feel healthier, more aware of my surroundings, and I trust my gut feelings more than ever.", value: "Body" }
    }
  },
  {
    id: 3,
    section: "A",
    axis: "Motivation",
    text: "You've been offered two jobs for the same pay. Which do you choose?",
    choices: {
      a: { text: "The job that allows for the most personal expression and aligns with my life's purpose, even if the work itself is inconsistent or challenging.", value: "Essence" },
      b: { text: "The job with the best physical work environment ,good lighting, a comfortable chair, and a sense of safety and well-being.", value: "Body" },
      c: { text: "The job with a clear, logical structure and well-defined social dynamics, where I know exactly what is expected of me and my colleagues.", value: "Mind" }
    }
  },
  {
    id: 4,
    section: "A",
    axis: "Motivation",
    text: "You discover a friend has been telling people a \"white lie\" about you to make you look better. What bothers you the most about this?",
    choices: {
      a: { text: "The principle of the matter. My reputation should be built on truth, and they violated that fundamental ideal, regardless of their intentions.", value: "Essence" },
      b: { text: "The emotional fallout. This creates a web of false expectations and puts me in an awkward position with people who now have a skewed perception of me.", value: "Body" },
      c: { text: "The logical inconsistency. The story doesn't add up with the facts. Now I have to manage a flawed narrative and correct the bad data.", value: "Mind" }
    }
  },
  {
    id: 5,
    section: "A",
    axis: "Motivation",
    text: "If you had to solve all your future problems with a single tool, which would you choose?",
    choices: {
      a: { text: "A perfectly crafted multi-tool. A tangible, reliable instrument for physically building, breaking, or fixing whatever comes my way.", value: "Body" },
      b: { text: "An infinitely expanding encyclopedia. Access to all the world's information and the logic to apply it correctly.", value: "Mind" },
      c: { text: "A powerful, inspiring symbol. An icon that communicates my unshakeable will and rallies the right people to my side without a word.", value: "Essence" }
    }
  },
  {
    id: 6,
    section: "A",
    axis: "Motivation",
    text: "When collaborating on a project, which of these is most likely to frustrate you?",
    choices: {
      a: { text: "When someone bases their arguments on feelings or faulty information instead of sound logic and evidence.", value: "Mind" },
      b: { text: "When someone says one thing but does another, compromising the integrity of the team's mission.", value: "Essence" },
      c: { text: "When someone is physically clumsy or unaware, creating unnecessary risks or damaging equipment through carelessness.", value: "Body" }
    }
  },
  {
    id: 7,
    section: "A",
    axis: "Motivation",
    text: "Think about a time you felt truly happy and fulfilled. What were you doing?",
    choices: {
      a: { text: "I was fighting for something I believed in, feeling a deep, purposeful connection to a cause larger than myself.", value: "Essence" },
      b: { text: "I was engaged in a thrilling physical activity ,like sports, dancing, or exploring ,that made me feel completely alive in my own skin.", value: "Body" },
      c: { text: "I was completely absorbed in solving a complex puzzle or problem, and I finally had that \"eureka!\" moment where everything clicked into place.", value: "Mind" }
    }
  },
  {
    id: 8,
    section: "A",
    axis: "Motivation",
    text: "You're at a crossroads and have to make a major life decision. After weighing all the pros and cons, what is your final tie-breaker?",
    choices: {
      a: { text: "A deep, physical gut feeling. My body often knows the right path before my mind does.", value: "Body" },
      b: { text: "A final review of the data. The logical, most statistically sound option is usually the correct one.", value: "Mind" },
      c: { text: "My moral compass. I'll choose the path that aligns most closely with my core principles, even if it's the harder one.", value: "Essence" }
    }
  },
  {
    id: 9,
    section: "A",
    axis: "Motivation",
    text: "When your life's story is told, what do you hope is its central theme?",
    choices: {
      a: { text: "A story of intellectual achievement and the elegant, logical systems I helped design or improve.", value: "Mind" },
      b: { text: "A story of unwavering character and the profound, positive impact my will had on the world and the people I cared about.", value: "Essence" },
      c: { text: "A story of incredible adventures, rich sensory experiences, and amazing things I accomplished with my own two hands.", value: "Body" }
    }
  },

  // --- Section B: The Axis of Context (The Application) ---
  {
    id: 10,
    section: "B",
    axis: "Context",
    text: "A powerful and potentially dangerous new energy source is discovered. What should be the first priority?",
    choices: {
      a: { text: "We need to understand why it works. We must study its fundamental principles and the theories behind it before we can even think about using it.", value: "Foundation" },
      b: { text: "We need to control it. The source must be secured immediately, with strict protocols and access management to ensure it is handled safely and responsibly.", value: "Control" },
      c: { text: "We need to see what it does. The best way to learn is by doing. We should begin careful, practical experiments to test its capabilities right away.", value: "Execution" }
    }
  },
  {
    id: 11,
    section: "B",
    axis: "Context",
    text: "You're putting together a team for a critical mission. What's the most important element for success?",
    choices: {
      a: { text: "A clear and disciplined chain of command, with well-defined roles and rules of engagement so everyone knows their job and the operational flow is never in question.", value: "Control" },
      b: { text: "Recruiting the most skilled, hands-on operators and empowering them to execute their tasks with maximum autonomy and minimal red tape.", value: "Execution" },
      c: { text: "A powerful, shared mission statement. If everyone believes in the \"why\" and is committed to the same foundational vision, they'll overcome any obstacle.", value: "Foundation" }
    }
  },
  {
    id: 12,
    section: "B",
    axis: "Context",
    text: "Your small community is preparing for a devastating hurricane. What is the most critical preparation?",
    choices: {
      a: { text: "Immediate, tangible action. We need people boarding up windows, gathering supplies, and reinforcing the flood barriers right now.", value: "Execution" },
      b: { text: "Reminding everyone of our community's core values. We need to reinforce our social bonds and the \"why\" of our community to ensure we help each other and don't descend into panic.", value: "Foundation" },
      c: { text: "A meticulous resource management plan. We need to start rationing food and water, scheduling watch shifts, and monitoring our stockpiles to make them last.", value: "Control" }
    }
  },
  {
    id: 13,
    section: "B",
    axis: "Context",
    text: "How do you prefer to learn a new, complex skill like playing a musical instrument?",
    choices: {
      a: { text: "I want to start with music theory, learning the fundamental principles of scales, chords, and composition first.", value: "Foundation" },
      b: { text: "I prefer a structured practice regimen with a teacher who can manage my progress through disciplined drills and exercises.", value: "Control" },
      c: { text: "I'd rather just pick up the instrument and start experimenting, learning by doing and getting a feel for it through hands-on trial and error.", value: "Execution" }
    }
  },
  {
    id: 14,
    section: "B",
    axis: "Context",
    text: "You have to pass on your life's most important lesson to the next generation. How do you do it?",
    choices: {
      a: { text: "I would design a structured curriculum with clear lessons, exercises, and assessments to manage their learning and ensure they understand completely.", value: "Control" },
      b: { text: "I would take them on as a hands-on apprentice, teaching them by having them work and solve real-world problems alongside me.", value: "Execution" },
      c: { text: "I would write down my core philosophy ,the fundamental \"why\" behind my actions ,so they can understand my principles and find their own way.", value: "Foundation" }
    }
  },
  {
    id: 15,
    section: "B",
    axis: "Context",
    text: "A local volunteer group has fallen into disarray due to infighting. What's the best first step to fix it?",
    choices: {
      a: { text: "Get them working on a new, high-visibility project. A tangible, shared goal will force them to cooperate and build momentum through direct action.", value: "Execution" },
      b: { text: "Call a meeting to review their original charter. Reminding them of the foundational principles they all agreed to in the beginning is the only way to get back on track.", value: "Foundation" },
      c: { text: "Mediate the personal conflicts one by one. You have to manage the emotional state of the group and establish new rules of conduct before any real work can get done.", value: "Control" }
    }
  },
  {
    id: 16,
    section: "B",
    axis: "Context",
    text: "Which of these phrases best defines \"strength\"?",
    choices: {
      a: { text: "An unshakeable moral foundation.", value: "Foundation" },
      b: { text: "Disciplined self-control.", value: "Control" },
      c: { text: "Proven, effective action.", value: "Execution" }
    }
  },
  {
    id: 17,
    section: "B",
    axis: "Context",
    text: "Someone at a party starts aggressively challenging your deepest-held belief. What is your most likely response?",
    choices: {
      a: { text: "I'll try to de-escalate the situation and manage the emotional temperature of the room, preventing the argument from poisoning the entire social gathering.", value: "Control" },
      b: { text: "With a direct and immediate counter ,a sharp question, a witty comeback, or a challenge to their premise that puts them on the back foot.", value: "Execution" },
      c: { text: "I'll ignore the personal attack and instead defend the underlying principle itself, explaining calmly why that foundation is so important.", value: "Foundation" }
    }
  },
  {
    id: 18,
    section: "B",
    axis: "Context",
    text: "You are planning a month-long backpacking trip through a remote wilderness. What is the most critical part of your preparation?",
    choices: {
      a: { text: "Hitting the trail. The journey itself is the plan; you can't prepare for everything, so the best way to start is to start.", value: "Execution" },
      b: { text: "Understanding the \"why\" of the land. I'd research the history, ecology, and fundamental nature of the region I'll be in.", value: "Foundation" },
      c: { text: "Meticulous logistical planning. I'll have a detailed itinerary, perfectly managed supplies, and a sustainable pace planned out before I ever leave.", value: "Control" }
    }
  },

  // --- Section C: The Axis of Perspective (The Scope) ---
  {
    id: 19,
    section: "C",
    axis: "Perspective",
    text: "After years of practice, you've finally perfected a rare and difficult craft. What gives you the most satisfaction?",
    choices: {
      a: { text: "The quiet, personal fulfillment of knowing I have achieved true mastery and deepened my own understanding of the craft.", value: "Internal" },
      b: { text: "Finding a single, worthy apprentice and passing my knowledge on to them, ensuring the craft is preserved in another individual.", value: "External" },
      c: { text: "Forming a new guild with other masters to elevate the craft as a whole and create something together that none of us could do alone.", value: "Collaborative" }
    }
  },
  {
    id: 20,
    section: "C",
    axis: "Perspective",
    text: "You come into a significant amount of money. After taking care of your basic needs, what is your first impulse?",
    choices: {
      a: { text: "I'd immediately think of a specific person or a targeted charity that I know is in desperate need and give them a large portion of it.", value: "External" },
      b: { text: "I'd use the money to fund a community project ,like a new library or park ,that would benefit my entire team, town, or group.", value: "Collaborative" },
      c: { text: "I'd invest it in my own well-being and personal growth ,better tools for my craft, further education, or a journey of self-discovery.", value: "Internal" }
    }
  },
  {
    id: 21,
    section: "C",
    axis: "Perspective",
    text: "Ultimately, you believe your success in life should be measured by...",
    choices: {
      a: { text: "The strength and prosperity of the family, team, or community that you helped build and support.", value: "Collaborative" },
      b: { text: "The achievement of true self-mastery and a deep, honest understanding of your own character.", value: "Internal" },
      c: { text: "The tangible, positive impact you have made on the lives of other individuals.", value: "External" }
    }
  },
  {
    id: 22,
    section: "C",
    axis: "Perspective",
    text: "You see a stranger being harassed on the street. What is your first instinct?",
    choices: {
      a: { text: "To directly intervene on behalf of the individual ,getting between them, providing immediate aid, or confronting the one doing the harassing.", value: "External" },
      b: { text: "To rally other bystanders. A group response is safer and sends a stronger message that this behavior is not tolerated by the community.", value: "Collaborative" },
      c: { text: "To first check my own ability to handle the situation. I'll assess my personal safety and readiness before acting, ensuring I don't make things worse.", value: "Internal" }
    }
  },
  {
    id: 23,
    section: "C",
    axis: "Perspective",
    text: "When you're stuck on a truly difficult problem, who or what do you consult?",
    choices: {
      a: { text: "I turn inward. I need quiet solitude to reflect, listen to my own intuition, and untangle the problem in my own mind.", value: "Internal" },
      b: { text: "I seek out a single, trusted expert or mentor for a focused, one-on-one conversation to get their specific perspective.", value: "External" },
      c: { text: "I gather my inner circle or team for a brainstorming session. The best solutions come from the collision of many different viewpoints.", value: "Collaborative" }
    }
  },
  {
    id: 24,
    section: "C",
    axis: "Perspective",
    text: "If you were to write a bestselling book, what would its subject be?",
    choices: {
      a: { text: "The inspiring biography of a single, world-changing individual and the personal sacrifices they made.", value: "External" },
      b: { text: "The epic story of a small team or fellowship that trusted each other and accomplished the impossible together.", value: "Collaborative" },
      c: { text: "An introspective memoir about my own personal journey of self-discovery, failure, and inner growth.", value: "Internal" }
    }
  },
  {
    id: 25,
    section: "C",
    axis: "Perspective",
    text: "When all is said and done, your deepest loyalty is to...",
    choices: {
      a: { text: "My own conscience. I have to be able to live with my choices and my adherence to my personal principles.", value: "Internal" },
      b: { text: "A specific person, my partner, my child, my mentor ,whom I have sworn to protect and support above all others.", value: "External" },
      c: { text: "My people, my community, my \"crew,\" my chosen family ,the collective group that I am a part of.", value: "Collaborative" }
    }
  },
  {
    id: 26,
    section: "C",
    axis: "Perspective",
    text: "A team project you were leading ends in failure. What is your first, most honest internal question?",
    choices: {
      a: { text: "Did I fail to properly help or understand the needs of the other key individuals on the team?", value: "External" },
      b: { text: "How did our group dynamics and our communication as a team break down?", value: "Collaborative" },
      c: { text: "Where did I personally go wrong in this process? What was my mistake?", value: "Internal" }
    }
  },
  {
    id: 27,
    section: "C",
    axis: "Perspective",
    text: "Which of these social situations would leave you feeling the most energized and recharged?",
    choices: {
      a: { text: "A long, deep, and meaningful one-on-one conversation with a close friend.", value: "External" },
      b: { text: "A lively party or a collaborative game night with my entire group of friends.", value: "Collaborative" },
      c: { text: "A quiet evening alone with a good book or a personal project.", value: "Internal" }
    }
  }
];

import { ASSESSMENT_QUESTIONS } from './PCM-assessment.js';

// Step 6.1: The Assessment Profile Evaluator Engine (Appendix C, Part III)
export class AssessmentEvaluator {
  /**
   * Evaluates a completed assessment survey to calculate motivational profiles verbatim to Appendix C.
   * @param {Object} answers - An object mapping question IDs (1 to 27) to selected choices ('a', 'b', or 'c')
   *                           Example: { 1: 'a', 2: 'c', ..., 27: 'b' }
   * @param {boolean} manualNullGoal - If true, manually overrides the Goal to "0" (Null/Discovery)
   * @returns {Object} The complete psychological profile report
   */
  static evaluate(answers, manualNullGoal = false) {
    // 1. Tally vector scores across the three core axes (Appendix C, Part III, Step 1)
    const tallies = {
      Motivation: { Body: 0, Mind: 0, Essence: 0 },
      Context: { Foundation: 0, Control: 0, Execution: 0 },
      Perspective: { Internal: 0, External: 0, Collaborative: 0 }
    };

    ASSESSMENT_QUESTIONS.forEach(q => {
      const choice = answers[q.id];
      if (choice && q.choices[choice]) {
        const val = q.choices[choice].value;
        tallies[q.axis][val]++;
      }
    });

    // 2. Compute the 3x3 Psychromattic Heat Map (Appendix C, Part III, Step 2)
    // Row value (Motivation) + Column value (Context)
    const heatMap = {
      1: tallies.Motivation.Body + tallies.Context.Control,       // 1. Silver
      2: tallies.Motivation.Body + tallies.Context.Execution,     // 2. Yellow
      3: tallies.Motivation.Body + tallies.Context.Foundation,    // 3. Green
      4: tallies.Motivation.Mind + tallies.Context.Control,       // 4. Black
      5: tallies.Motivation.Mind + tallies.Context.Execution,     // 5. Orange
      6: tallies.Motivation.Mind + tallies.Context.Foundation,    // 6. White
      7: tallies.Motivation.Essence + tallies.Context.Control,    // 7. Red
      8: tallies.Motivation.Essence + tallies.Context.Execution,  // 8. Blue
      9: tallies.Motivation.Essence + tallies.Context.Foundation  // 9. Purple
    };

    // 3. Rank the scores from highest to lowest to compile the 5-point profile (Step 3)
    const ranked = Object.keys(heatMap).map(colorKey => {
      const colorIndex = parseInt(colorKey, 10);
      return {
        color: colorIndex,
        score: heatMap[colorIndex]
      };
    }).sort((a, b) => {
      // Sort descending by score. On tie, default to smaller color index.
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.color - b.color;
    });

    // Extracted motivation variables (Step 3)
    let goal = manualNullGoal ? 0 : ranked[0].color; // 1st Place (Highest Score)
    const method = ranked[1].color;                  // 2nd Place
    const purpose = ranked[3].color === goal || ranked[2].color === goal ? ranked[3].color : ranked[2].color; // 3rd Place (safeguard duplicates)
    const externalConflict = ranked[7].color;        // 2nd Lowest Score
    const internalConflict = ranked[8].color;        // Lowest Score

    // 4. Determine Perspective Scope (Axis 3 - Step 4)
    // Map largest tally on Axis 3 to single character: Internal -> 'N', External -> 'X', Collaborative -> 'C'
    const scopeMap = { Internal: "N", External: "X", Collaborative: "C" };
    let scopeChar = "N";
    let maxCount = -1;

    Object.keys(tallies.Perspective).forEach(pKey => {
      if (tallies.Perspective[pKey] > maxCount) {
        maxCount = tallies.Perspective[pKey];
        scopeChar = scopeMap[pKey];
      }
    });

    // 5. Build official 6-character Psychromattic Hex Code (Step 4)
    const hexCode = `#${goal}${method}${purpose}${externalConflict}${internalConflict}${scopeChar}`;

    // Map color indices back to human-readable ideals
    const colorNames = {
      0: "Discovery (Null)",
      1: "Ambition (Silver)",
      2: "Freedom (Yellow)",
      3: "Security (Green)",
      4: "Legacy (Black)",
      5: "Innovation (Orange)",
      6: "Purity (White)",
      7: "Glory (Red)",
      8: "Influence (Blue)",
      9: "Faith (Purple)"
    };

    return {
      success: true,
      hexCode,
      tallies,
      heatMap,
      profile: {
        goal: { code: goal, name: colorNames[goal] },
        method: { code: method, name: colorNames[method] },
        purpose: { code: purpose, name: colorNames[purpose] },
        externalConflict: { code: externalConflict, name: colorNames[externalConflict] },
        internalConflict: { code: internalConflict, name: colorNames[internalConflict] },
        scope: scopeChar === "N" ? "Internal (Self)" : scopeChar === "X" ? "External (Individual)" : "Collaborative (Group)"
      }
    };
  }
}