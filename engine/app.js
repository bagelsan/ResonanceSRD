/**
 * app.js
 * PWA Visual Controller (Chunk 1 of 4)
 * 
 * Manages core imports, active runtime state, bottom nav view-switches,
 * and the 27-question Introspective Assessment quiz loop.
 */

// --- 1. CORE SYSTEM IMPORTS ---
import { 
  PCM_SYSTEM_METADATA, 
  PCM_COLORS, 
  PCM_STATUS_TAGS, 
  PCM_BOOST_TAGS, 
  PCM_ACTIONS_CATALOG, 
  PCM_KEYWORDS_DICTIONARY 
} from './PCM-definitions.js';

import { 
  StandardDiceRoller, 
  Character, 
  Animation, 
  Item, 
  Faction, 
  PsychromatticaParser 
} from './PCM-engine.js';

import { 
  ActionExecutor, 
  KEYWORD_HOOKS 
} from './PCM-actions-keywords.js';

import { 
  ItemRulesEngine, 
  AnimationRulesEngine, 
  FactionRulesEngine, 
  CampaignNode, 
  CampaignTimelineEngine 
} from './PCM-systems.js';

import { 
  InitiativeDeck, 
  ResonanceTracker, 
  DiscordanceTracker, 
  SocialChallengeCalculator, 
  ResuscitationCalculator, 
  ArchiveRunManager 
} from './PCM-session.js';

import { 
  ASSESSMENT_QUESTIONS, 
  AssessmentEvaluator 
} from './PCM-assessment.js';

// --- 2. GLOBAL APP STATE ---
const AppState = {
  activeCharacter: null,       // Currently loaded Player Character (Character)
  initiativeDeck: new InitiativeDeck(), // Active combat turn priority deck
  timeline: new CampaignTimelineEngine(), // Active campaign clock timeline
  archiveRun: new ArchiveRunManager(), // Active Roguelite directory tracker
  activeMode: "TTRPG",         // Active UI Resolution Mode
  quizAnswers: {},             // Temporarily caches quiz selections
  consoleLogs: []              // Caches system status console outputs
};

// --- 3. SYSTEM LOGGER UTILITY ---
function sysLog(message, isMath = false) {
  const timestamp = new Date().toLocaleTimeString();
  const formatted = `[${timestamp}] ${message}`;
  AppState.consoleLogs.push(formatted);
  
  // Keep logs at max 50 entries
  if (AppState.consoleLogs.length > 50) {
    AppState.consoleLogs.shift();
  }
  
  const consoleDisplay = document.getElementById("ui-console-log");
  if (consoleDisplay) {
    consoleDisplay.innerHTML = AppState.consoleLogs.join("\n");
    consoleDisplay.scrollTop = consoleDisplay.scrollHeight;
  }
}

// --- 4. VIEW / TAB NAVIGATION ---
document.addEventListener("DOMContentLoaded", () => {
  const navButtons = document.querySelectorAll(".nav-button");
  const views = document.querySelectorAll(".tool-view");

  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");

      // Set active nav button
      navButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // Show targeted view
      views.forEach(v => {
        if (v.id === targetId) {
          v.classList.add("active");
        } else {
          v.classList.remove("active");
        }
      });

      sysLog(`Switched view viewport target: ${targetId}`);
    });
  });

  // Initialize Quiz render on startup
  initQuiz();
  sysLog("System OS Initialized. Welcome to Psychromattica.");
});

// --- 5. ASSESSMENT QUIZ CONTROLLER (view-quiz) ---
function initQuiz() {
  const form = document.getElementById("ui-quiz-form");
  const resultsContainer = document.getElementById("ui-quiz-results");
  const codeDisplay = document.getElementById("ui-quiz-final-code");
  const sendToBuilderBtn = document.getElementById("ui-btn-send-profile");

  if (!form) return;

  form.innerHTML = ""; // Clear form
  resultsContainer.style.display = "none";
  AppState.quizAnswers = {};

  // Dynamically render all 27 verbatim questions from assessment database
  ASSESSMENT_QUESTIONS.forEach(q => {
    const questionSec = document.createElement("div");
    questionSec.className = "section";
    questionSec.style.borderLeft = `3px solid ${q.section === 'A' ? 'var(--color-null)' : q.section === 'B' ? 'var(--color-yellow)' : 'var(--color-blue)'}`;
    
    questionSec.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 10px; color: var(--color-white);">
        Q${q.id}. ${q.text}
      </div>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <label style="display: flex; align-items: flex-start; gap: 10px; cursor: pointer; text-transform: none; color: #ccc;">
          <input type="radio" name="q-${q.id}" value="a" style="margin-top: 3px;">
          <span>${q.choices.a.text}</span>
        </label>
        <label style="display: flex; align-items: flex-start; gap: 10px; cursor: pointer; text-transform: none; color: #ccc;">
          <input type="radio" name="q-${q.id}" value="b" style="margin-top: 3px;">
          <span>${q.choices.b.text}</span>
        </label>
        <label style="display: flex; align-items: flex-start; gap: 10px; cursor: pointer; text-transform: none; color: #ccc;">
          <input type="radio" name="q-${q.id}" value="c" style="margin-top: 3px;">
          <span>${q.choices.c.text}</span>
        </label>
      </div>
    `;

    // Listen for choices to cache and check progress
    questionSec.querySelectorAll(`input[name="q-${q.id}"]`).forEach(radio => {
      radio.addEventListener("change", (e) => {
        AppState.quizAnswers[q.id] = e.target.value;
        evaluateQuizIfComplete();
      });
    });

    form.appendChild(questionSec);
  });

  function evaluateQuizIfComplete() {
    const totalAnswered = Object.keys(AppState.quizAnswers).length;
    
    // Once all 27 questions are answered, execute math evaluation
    if (totalAnswered === 27) {
      const evaluation = AssessmentEvaluator.evaluate(AppState.quizAnswers);
      
      if (evaluation.success) {
        codeDisplay.textContent = evaluation.hexCode;
        resultsContainer.style.display = "block";
        resultsContainer.scrollIntoView({ behavior: "smooth" });
        sysLog(`Assessment Complete. Profile evaluated to: ${evaluation.hexCode}`);
      }
    }
  }

  // Action button: sends assessment code to Builder and switches tab view
  sendToBuilderBtn.addEventListener("click", () => {
    const finalCode = codeDisplay.textContent;
    const buildStringBox = document.getElementById("ui-build-string");
    
    if (buildStringBox) {
      buildStringBox.value = `C:${finalCode}`;
      sysLog(`Profile Hex Code ${finalCode} pushed to Blueprint Compiler.`);
      
      // Navigate to the Builder tab visually
      const builderNavBtn = document.querySelector('.nav-button[data-target="view-builder"]');
      if (builderNavBtn) {
        builderNavBtn.click();
      }
    }
  });
}

// --- 6. BLUEPRINT COMPILER CONTROLLER (view-builder) ---
function initBuilder() {
  const goalSel = document.getElementById("sel-goal");
  const methodSel = document.getElementById("sel-method");
  const purposeSel = document.getElementById("sel-purpose");
  const conf1Sel = document.getElementById("sel-conf1");
  const conf2Sel = document.getElementById("sel-conf2");

  const seedSel = document.getElementById("sel-seed");
  const seedPassiveChk = document.getElementById("chk-seed-passive");
  const flawSel = document.getElementById("sel-flaw");
  const compSel = document.getElementById("sel-comp");

  const awkSelects = document.querySelectorAll(".sel-awk");
  const buildStringBox = document.getElementById("ui-build-string");

  const compileBtn = document.getElementById("ui-btn-compile");
  const loadBtn = document.getElementById("ui-btn-load");

  if (!goalSel) return;

  // Clear existing default options
  const selectsToReset = [goalSel, methodSel, purposeSel, conf1Sel, conf2Sel];
  selectsToReset.forEach(sel => {
    sel.innerHTML = `<option value="">${sel.id.replace("sel-", "").toUpperCase()}</option>`;
  });

  // 1. Populate Profile Selectors with 1-9 Color Options (Section 8.0)
  Object.keys(PCM_COLORS).forEach(colorIdx => {
    const idx = parseInt(colorIdx, 10);
    if (idx === 0) return; // Null exists outside the standard 1-9 grid (Appendix D)
    
    const color = PCM_COLORS[idx];
    selectsToReset.forEach(sel => {
      const option = document.createElement("option");
      option.value = idx;
      option.textContent = `${idx} - ${color.name}`;
      sel.appendChild(option);
    });
  });

  // 2. Populate Keyword Selectors with All 100 Keywords (Appendix A)
  const kwSelectors = [seedSel, flawSel, compSel, ...awkSelects];
  kwSelectors.forEach(sel => {
    if (!sel) return;
    const defaultText = sel.id ? sel.id.replace("sel-", "").toUpperCase() : "AWAKENING";
    sel.innerHTML = `<option value="">${defaultText}...</option>`;

    // Loop through sorted keys to populate options alphabetically/numerically
    Object.keys(PCM_KEYWORDS_DICTIONARY).sort().forEach(code => {
      const kw = PCM_KEYWORDS_DICTIONARY[code];
      const option = document.createElement("option");
      option.value = code;
      option.textContent = `${kw.name} (${code})`;
      sel.appendChild(option);
    });
  });

  // 3. Event Listener: Compile Form selections into a Unified Build String (Appendix I, Section 1.0)
  compileBtn.addEventListener("click", () => {
    const goal = goalSel.value;
    const method = methodSel.value;
    const purpose = purposeSel.value;
    const conf1 = conf1Sel.value;
    const conf2 = conf2Sel.value;

    if (!goal || !method || !purpose || !conf1 || !conf2) {
      alert("Verification Failed: Please fill in all five Motivational Profile selectors.");
      return;
    }

    // Default Scope to "N" (Internal) for character baseline creation (Appendix D)
    const scopeStr = "N"; 
    const hexCode = `#${goal}${method}${purpose}${conf1}${conf2}${scopeStr}`;

    // Flaw Package Check (Appendix I, Section 1.5)
    let flawPackageStr = "";
    const flawVal = flawSel.value;
    const compVal = compSel.value;
    if (flawVal && compVal) {
      // Remove dots from code to match syntax (+3058)
      const cleanFlaw = flawVal.replace(".", "");
      const cleanComp = compVal.replace(".", "");
      flawPackageStr = `+${cleanFlaw}${cleanComp}`;
    }

    // Seed Keyword Check (Append ! prefix if marked passive)
    const seedVal = seedSel.value;
    if (!seedVal) {
      alert("Verification Failed: An entity must have at least one Seed Keyword.");
      return;
    }
    const seedStr = seedPassiveChk.checked ? `!${seedVal.replace(".", "")}` : seedVal.replace(".", "");

    // Awakening Keywords
    const awkVals = Array.from(awkSelects).map(sel => sel.value.replace(".", ""));
    const isAwakeningEmpty = awkVals.some(v => v === "");
    const awkStr = isAwakeningEmpty ? "" : `-${awkVals.join(".")}`;

    // Compile into Unified Build String (Syntax: C:#[HexCode][+####]-##-##.##.##)
    const compiledString = `C:${hexCode}${flawPackageStr}-${seedStr}${awkStr}`;
    buildStringBox.value = compiledString;

    sysLog(`Unified Build String Compiled successfully: ${compiledString}`);
  });

  // 4. Event Listener: Sync compiled string to Active Character Core State
  loadBtn.addEventListener("click", () => {
    const rawString = buildStringBox.value.trim();
    if (!rawString) return;

    try {
      // Execute the parser (Step 2 Engine Parser)
      const parsedEcosystem = PsychromatticaParser.parse(rawString);

      if (parsedEcosystem.length > 0 && parsedEcosystem[0] instanceof Character) {
        AppState.activeCharacter = parsedEcosystem[0];
        
        sysLog(`Sync Successful! Loaded character: ${AppState.activeCharacter.name}`);
        sysLog(`Calculated Passive Resistance: ${AppState.activeCharacter.resistance}`, true);

        // Update the Character Sheet tab view dynamically (Triggers in Chunk 3)
        renderActiveCharacterSheet();
        
        // Navigate to the Sheet tab visually
        const sheetNavBtn = document.querySelector('.nav-button[data-target="view-sheet"]');
        if (sheetNavBtn) {
          sheetNavBtn.click();
        }
      } else {
        alert("Parser Error: String is not a valid Character node configuration.");
      }
    } catch (err) {
      alert(`Critical Parser Failure: ${err.message}`);
      sysLog(`Parser error trace: ${err.stack}`, true);
    }
  });
}

// Append builder initialization to page startup
document.addEventListener("DOMContentLoaded", () => {
  initBuilder();
});

// --- 7. DIGITAL CHARACTER SHEET CONTROLLER (view-sheet) ---
export function renderActiveCharacterSheet() {
  const actor = AppState.activeCharacter;
  if (!actor) return;

  // 1. Sync Base Header (Name, Level, Karma)
  const nameInput = document.getElementById("ui-sheet-name");
  const levelDisplay = document.getElementById("ui-sheet-level");
  const karmaDisplay = document.getElementById("ui-sheet-karma");

  if (nameInput) {
    nameInput.value = actor.name;
    // Bind input listener to dynamically save name changes
    nameInput.oninput = (e) => {
      actor.name = e.target.value;
    };
  }
  if (levelDisplay) levelDisplay.textContent = actor.level;
  if (karmaDisplay) karmaDisplay.textContent = actor.karma || 0;

  // 2. Sync Profile Motivations Grid (Goal, Method, Purpose, Conflicts, Scope)
  const profileContainer = document.getElementById("ui-sheet-profile");
  if (profileContainer && actor.profile) {
    const p = actor.profile;
    profileContainer.innerHTML = `
      <div class="profile-box" style="border-top-color: ${PCM_COLORS[p.goal]?.hex || '#444'}">
        Goal<br><span style="font-weight:normal; color:#ccc;">${PCM_COLORS[p.goal]?.name || '---'}</span>
      </div>
      <div class="profile-box" style="border-top-color: ${PCM_COLORS[p.method]?.hex || '#444'}">
        Method<br><span style="font-weight:normal; color:#ccc;">${PCM_COLORS[p.method]?.name || '---'}</span>
      </div>
      <div class="profile-box" style="border-top-color: ${PCM_COLORS[p.purpose]?.hex || '#444'}">
        Purpose<br><span style="font-weight:normal; color:#ccc;">${PCM_COLORS[p.purpose]?.name || '---'}</span>
      </div>
      <div class="profile-box" style="border-top-color: ${PCM_COLORS[p.externalConflict]?.hex || '#444'}">
        Ext. Con<br><span style="font-weight:normal; color:#ccc;">${PCM_COLORS[p.externalConflict]?.name || '---'}</span>
      </div>
      <div class="profile-box" style="border-top-color: ${PCM_COLORS[p.internalConflict]?.hex || '#444'}">
        Int. Con<br><span style="font-weight:normal; color:#ccc;">${PCM_COLORS[p.internalConflict]?.name || '---'}</span>
      </div>
    `;
  }

  // 3. Sync 3x3 Stat Matrix
  const statsContainer = document.getElementById("ui-sheet-stats");
  if (statsContainer) {
    statsContainer.innerHTML = ""; // Clear existing
    const statKeys = ["Range", "Alacrity", "Brawn", "Wit", "Expertise", "Technique", "Power", "Influence", "Force"];
    
    statKeys.forEach(statName => {
      const statVal = actor.stats[statName] || 1;
      const matrixBox = document.createElement("div");
      matrixBox.className = "matrix-box";
      matrixBox.innerHTML = `
        <strong>${statVal}</strong>
        <span>${statName.substring(0, 3)}</span>
      `;
      statsContainer.appendChild(matrixBox);
    });
  }

  // Update Passive Resistance Display
  const resDisplay = document.getElementById("ui-sheet-res");
  if (resDisplay) {
    resDisplay.textContent = actor.resistance;
  }

  // 4. Sync Interactive Resource Clocks (Pips)
  renderClockPips("hp", "ui-pips-hp");
  renderClockPips("sp", "ui-pips-sp");
  renderClockPips("ep", "ui-pips-ep");

  // 5. Sync Keywords List with Slot Toggle Hooks (Force passive slot checks)
  renderKeywordsList();

  // 6. Sync Flaw Package
  renderFlawPackage();

  // 7. Sync Ecosystem Attachments (Page 2 - Drones, Items)
  renderAttachments();
}

// Renders interactive clock checkbox pips for HP, SP, and EP
function renderClockPips(clockKey, containerId) {
  const container = document.getElementById(containerId);
  const actor = AppState.activeCharacter;
  if (!container || !actor) return;

  container.innerHTML = ""; // Clear
  const currentVal = actor.clocks[clockKey];
  const maxVal = actor.clocksMax[clockKey] || 10;

  for (let i = 0; i < maxVal; i++) {
    const pip = document.createElement("div");
    pip.className = "pip";
    if (i < currentVal) {
      pip.classList.add("active");
    }

    // Interactive Tap handler to deplete or restore pips
    pip.addEventListener("click", () => {
      if (currentVal === i + 1) {
        actor.clocks[clockKey] = i; // Deduct pip on re-click
      } else {
        actor.clocks[clockKey] = i + 1; // Fill pips up to clicked segment
      }
      renderClockPips(clockKey, containerId); // Redraw
      sysLog(`Updated clock [${clockKey.toUpperCase()}] to: ${actor.clocks[clockKey]}/${maxVal}`);
    });

    container.appendChild(pip);
  }
}

// Renders the keyword library and passive slots toggle checks
function renderKeywordsList() {
  const container = document.getElementById("ui-sheet-keywords");
  const actor = AppState.activeCharacter;
  if (!container || !actor) return;

  container.innerHTML = ""; // Clear

  // Deduplicate and filter any blank keywords
  const uniqueKeywords = [...new Set(actor.keywords)].filter(kw => kw !== "");

  if (uniqueKeywords.length === 0) {
    container.innerHTML = `<div style="color: var(--color-silver); font-style: italic; padding: 10px;">No keywords currently integrated.</div>`;
    return;
  }

  uniqueKeywords.forEach(kwCode => {
    const kw = PCM_KEYWORDS_DICTIONARY[kwCode];
    if (!kw) return;

    const row = document.createElement("div");
    row.className = "kw-row";

    // Passive Slot Limit Check (Innate limit = Force stat)
    const isSlotted = actor.passiveSlots.includes(kwCode);
    const forceLimit = actor.stats.Force || 1;

    row.innerHTML = `
      <div class="kw-badge ${isSlotted ? 'active' : ''}" style="cursor: pointer;" title="Toggle Passive Slot">
        ${isSlotted ? 'SLOTTED' : 'SLOT'}
      </div>
      <div class="kw-name">${kw.name}</div>
      <div class="kw-level">${kwCode}</div>
    `;

    // Click handler to toggle passive slots
    const badge = row.querySelector(".kw-badge");
    badge.addEventListener("click", () => {
      if (isSlotted) {
        // Unslot
        const idx = actor.passiveSlots.indexOf(kwCode);
        if (idx > -1) actor.passiveSlots.splice(idx, 1);
        sysLog(`Removed Keyword [${kw.name}] from Innate Passive Slots.`);
      } else {
        // Slot
        if (actor.passiveSlots.length >= forceLimit) {
          alert(`Innate Passives Limit Reached. Your Force stat restricts you to ${forceLimit} passive slots.`);
          return;
        }
        actor.passiveSlots.push(kwCode);
        sysLog(`Slotted Keyword [${kw.name}] into Active Passive Slots.`);
      }
      renderKeywordsList(); // Redraw
    });

    container.appendChild(row);
  });
}

// Renders the flaw package
function renderFlawPackage() {
  const container = document.getElementById("ui-sheet-flaws");
  const actor = AppState.activeCharacter;
  if (!container || !actor) return;

  container.innerHTML = ""; // Clear

  if (!actor.flawPackage) {
    container.innerHTML = `<div style="color: var(--color-silver); font-style: italic; padding: 10px;">No flaw package accepted.</div>`;
    return;
  }

  const { flawCode, compensationCode } = actor.flawPackage;
  const flawKw = PCM_KEYWORDS_DICTIONARY[flawCode];
  const compKw = PCM_KEYWORDS_DICTIONARY[compensationCode];

  if (!flawKw || !compKw) return;

  container.innerHTML = `
    <div class="kw-row" style="border-left: 3px solid var(--color-red);">
      <div class="kw-badge active" style="background-color: var(--color-red); color: white;">PENALTY</div>
      <div class="kw-name">${flawKw.name} <span style="font-size: 8pt; color: var(--color-silver);">${flawKw.intent}</span></div>
      <div class="kw-level">${flawCode}</div>
    </div>
    <div class="kw-row" style="border-left: 3px solid var(--color-green); margin-top: 5px;">
      <div class="kw-badge active" style="background-color: var(--color-green); color: black;">ABILITY</div>
      <div class="kw-name">${compKw.name} <span style="font-size: 8pt; color: var(--color-silver);">${compKw.intent}</span></div>
      <div class="kw-level">${compensationCode}</div>
    </div>
  `;
}

// Renders Page 2 attachments (Drones, Items)
function renderAttachments() {
  const container = document.getElementById("ui-sheet-attachments");
  const actor = AppState.activeCharacter;
  if (!container || !actor) return;

  container.innerHTML = ""; // Clear

  const totalAttachments = actor.attachedAnimations.length + actor.attachedItems.length;
  if (totalAttachments === 0) return;

  const header = document.createElement("h3");
  header.style.marginTop = "25px";
  header.textContent = "Page 2: Ecosystem Attachments";
  container.appendChild(header);

  // Render Attached Animations (Companions / Drones)
  actor.attachedAnimations.forEach(anim => {
    const card = document.createElement("div");
    card.className = "section";
    card.style.borderLeft = "4px solid var(--color-yellow)";
    card.style.marginTop = "10px";
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom: 8px;">
        <span class="highlight-title">Drone: ${anim.name} (Lvl ${anim.level})</span>
        <span class="highlight-kw">RES: ${anim.resistance}</span>
      </div>
      <div style="font-size: 10pt; color: var(--color-silver); margin-bottom: 5px;">
        Keywords: ${anim.keywords.map(k => PCM_KEYWORDS_DICTIONARY[k]?.name || k).join(", ")}
      </div>
      <div style="font-size: 10pt; color: var(--color-silver);">
        HP: ${anim.clocks.hp}/${anim.clocksMax.hp} | SP: ${anim.clocks.sp}/${anim.clocksMax.sp}
      </div>
    `;
    container.appendChild(card);
  });

  // Render Attached Items (Gear)
  actor.attachedItems.forEach(item => {
    const card = document.createElement("div");
    card.className = "section";
    card.style.borderLeft = "4px solid var(--color-blue)";
    card.style.marginTop = "10px";
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom: 8px;">
        <span class="highlight-title">Gear: ${item.name} (Lvl ${item.level})</span>
        <span style="font-weight: bold; color: ${item.isDestroyed ? 'var(--color-red)' : item.isBroken ? 'var(--color-orange)' : 'var(--color-green)'}">
          ${item.isDestroyed ? 'DESTROYED' : item.isBroken ? 'BROKEN' : 'UNDAMAGED'} (${item.durability}/2)
        </span>
      </div>
      <div style="font-size: 10pt; color: var(--color-silver);">
        Keywords: ${item.keywords.map(k => PCM_KEYWORDS_DICTIONARY[k]?.name || k).join(", ")}
      </div>
    `;
    container.appendChild(card);
  });
}

// --- 8. THE STANDARD ROLLER CONTROLLER (view-roller) ---
function initRoller() {
  const pullStatsBtn = document.getElementById("ui-btn-pull-stats");
  const levelInput = document.getElementById("ui-roller-level");
  const statInput = document.getElementById("ui-roller-stat");
  const twiceChk = document.getElementById("ui-roller-twice");
  const stressChk = document.getElementById("ui-roller-stress");
  const stressPanel = document.getElementById("ui-roller-stress-panel");
  const witInput = document.getElementById("ui-roller-wit");
  const kwsInput = document.getElementById("ui-roller-kws");
  const rollBtn = document.getElementById("ui-btn-roll");

  const display = document.getElementById("ui-roller-result-display");
  const statusBadge = document.getElementById("ui-roller-status");
  const superCritBox = document.getElementById("ui-roller-supercrit-box");
  const stressResultBox = document.getElementById("ui-roller-stress-result");
  const logDisplay = document.getElementById("ui-roller-log");

  if (!rollBtn) return;

  // Pull stats helper (grabs active character level & wit)
  pullStatsBtn.addEventListener("click", () => {
    const actor = AppState.activeCharacter;
    if (actor) {
      levelInput.value = actor.level;
      witInput.value = actor.stats.Wit || 2;
      kwsInput.value = actor.keywords.length || 4;
      sysLog("Active Character level/wit pulled successfully to Roller.");
    } else {
      alert("No Active Character loaded. Go to Builder or Quiz first.");
    }
  });

  // Toggle stress panel visually
  stressChk.addEventListener("change", (e) => {
    stressPanel.className = e.target.checked ? "stress-panel active" : "stress-panel";
  });

  rollBtn.addEventListener("click", () => {
    const lvl = parseInt(levelInput.value, 10) || 0;
    const stat = parseInt(statInput.value, 10) || 0;
    const applyTwice = twiceChk.checked;

    // Get selected Advantage radio option
    const advRadio = document.querySelector('input[name="ui-roller-adv"]:checked');
    const advVal = advRadio ? advRadio.value : "normal";
    const hasAdv = advVal === "advantage";
    const hasDis = advVal === "disadvantage";

    // 1. Execute engine standard roll calculation (StandardDiceRoller)
    const result = StandardDiceRoller.roll(hasAdv, hasDis);

    // 2. Compute final EV
    const finalStatContribution = applyTwice ? (stat * 2) : stat;
    const ev = result.isMiss ? 0 : (result.sr + lvl + finalStatContribution);

    // 3. Render Output Displays
    display.textContent = ev;
    
    // Status Badge UI
    statusBadge.style.display = "inline-block";
    statusBadge.className = "status-badge";
    if (result.isMiss) {
      statusBadge.classList.add("miss");
      statusBadge.textContent = "CATASTROPHIC MISS";
    } else if (result.isSuperCritical) {
      statusBadge.classList.add("super-crit");
      statusBadge.textContent = "SUPER CRITICAL";
    } else if (result.isCritical) {
      statusBadge.classList.add("crit");
      statusBadge.textContent = "CRITICAL";
    } else {
      statusBadge.style.display = "none";
    }

    // Toggle super critical bonus info (Section 1.8)
    superCritBox.style.display = result.isSuperCritical ? "block" : "none";

    // 4. Stress Roll Resolution check (Section 2.5)
    if (stressChk.checked && !result.isMiss) {
      const wit = parseInt(witInput.value, 10) || 2;
      const kws = parseInt(kwsInput.value, 10) || 4;
      const stressCheckScore = result.sr + wit;
      const isBreakthrough = stressCheckScore > kws;

      stressResultBox.style.display = "block";
      stressResultBox.style.backgroundColor = isBreakthrough ? "var(--color-green)" : "var(--color-red)";
      stressResultBox.style.color = isBreakthrough ? "black" : "white";
      stressResultBox.innerHTML = isBreakthrough
        ? `STRESS SUCCESS! Breakthrough achieved! Score (${stressCheckScore}) exceeded known Keywords (${kws}).`
        : `STRESS FAILED. Score (${stressCheckScore}) did not exceed known Keywords (${kws}).`;
    } else {
      stressResultBox.style.display = "none";
    }

    // 5. Append clean math roll to log
    logDisplay.innerHTML = `
      <span class="log-highlight">SR: ${result.sr}</span> <span class="log-math">(D10s: ${result.history.map(h => `${h.main},${h.crit}`).join(" | ")})</span><br>
      <span class="log-math">EV Calculation: SR (${result.sr}) + Lvl (${lvl}) + Stat (${finalStatContribution}) = ${ev}</span>
    `;
    sysLog(`Executed Roller Activation: Roll ${result.sr} -> Final EV ${ev}`);
  });
}

// --- 9. PROCEDURAL SCENE GENERATOR CONTROLLER (view-generator) ---
function initGenerator() {
  const genBtn = document.getElementById("ui-btn-generate");
  const partyLvlInput = document.getElementById("ui-gen-level");
  const outputBox = document.getElementById("ui-gen-output");
  const copyBtn = document.getElementById("ui-btn-gen-copy");
  const sendBtn = document.getElementById("ui-btn-gen-send");
  const manifestDisplay = document.getElementById("ui-gen-manifest");

  if (!genBtn) return;

  genBtn.addEventListener("click", () => {
    const partyLvl = parseInt(partyLvlInput.value, 10) || 1;

    // Execute standard procedural blueprints generation (Appendix I, Section 4.0)
    const complexity = Math.floor(Math.random() * 3) + 1; // 1 to 3 Situations
    const themeCode = Object.keys(PCM_KEYWORDS_DICTIONARY)[Math.floor(Math.random() * 100)];
    const themeName = PCM_KEYWORDS_DICTIONARY[themeCode]?.name || "Void";

    const situations = [];
    const manifestsReadout = [];

    for (let i = 0; i < complexity; i++) {
      const typeRoll = Math.floor(Math.random() * 10) + 1;
      const isRace = Math.random() < 0.3; // 30% chance for Timed Race Situation (Section 1.2.2)
      
      let sitCode = "1"; // Default Conflict
      let typeLabel = "Conflict";
      if (typeRoll >= 3 && typeRoll <= 4) { sitCode = "2"; typeLabel = "Obstacle (Barrier)"; }
      else if (typeRoll >= 5 && typeRoll <= 6) { sitCode = "3"; typeLabel = "Interaction (Social)"; }
      else if (typeRoll >= 7 && typeRoll <= 8) { sitCode = "4"; typeLabel = "Exploration"; }
      else if (typeRoll >= 9) { sitCode = "5"; typeLabel = "Twist"; }

      situations.push(`${isRace ? '*' : ''}${sitCode}`);

      // Compile mock text manifest for display
      manifestsReadout.push(`
        <div style="margin-bottom: 10px; border-bottom: 1px dashed #333; padding-bottom: 5px;">
          <span class="highlight-type">Situation ${i+1}: ${typeLabel}</span> ${isRace ? '<span class="highlight-race">*[TIMED]*</span>' : ''}<br>
          - Primary Barrier Clock: ${typeLabel === 'Conflict' ? 'HP 10 (TN 8)' : 'Structure 6 (TN 10)'}<br>
          - Entities: Generic_L${partyLvl} (RES: ${8 + partyLvl})
        </div>
      `);
    }

    const compiledBlueprint = `(${complexity})[${themeCode}]-${situations.join("|")}:[X[L+0]]`;
    outputBox.value = compiledBlueprint;

    // Render Manifest readout
    manifestDisplay.innerHTML = `
      <div class="highlight-title">Theme Environment: <span class="highlight-kw">${themeName} (${themeCode})</span></div>
      <div style="margin-top: 10px;">${manifestsReadout.join("")}</div>
    `;

    sysLog(`Procedural Scene generated successfully: ${compiledBlueprint}`);
  });

  copyBtn.addEventListener("click", () => {
    outputBox.select();
    document.execCommand("copy");
    sysLog("Blueprint string copied to clipboard.");
  });

  sendBtn.addEventListener("click", () => {
    const blueprintValue = outputBox.value.trim();
    const dashBox = document.getElementById("ui-dash-blueprint");
    if (dashBox && blueprintValue !== "Awaiting execution...") {
      dashBox.value = blueprintValue;
      sysLog("Blueprint string pushed to Active Dashboard.");
      
      // Navigate to Dashboard tab
      const dashNavBtn = document.querySelector('.nav-button[data-target="view-dashboard"]');
      if (dashNavBtn) {
        dashNavBtn.click();
      }
    }
  });
}

// --- 10. THE ACTIVE GAME DASHBOARD CONTROLLER (view-dashboard) ---
function initDashboard() {
  const loadBtn = document.getElementById("ui-btn-dash-load");
  const clearBtn = document.getElementById("ui-btn-dash-clear");
  const blueprintInput = document.getElementById("ui-dash-blueprint");

  const startRoundBtn = document.getElementById("ui-btn-dash-start");
  const drawBtn = document.getElementById("ui-btn-dash-draw");
  const passBtn = document.getElementById("ui-btn-dash-pass");
  const seizeBtn = document.getElementById("ui-btn-dash-seize");

  const currentTurnDisplay = document.getElementById("ui-dash-current-turn");
  const roundDisplay = document.getElementById("ui-dash-round");
  const deckList = document.getElementById("ui-dash-deck-list");
  const discardList = document.getElementById("ui-dash-discard-list");

  const deckCount = document.getElementById("ui-dash-deck-count");
  const discardCount = document.getElementById("ui-dash-discard-count");

  const manualInput = document.getElementById("ui-dash-manual-name");
  const addDiscBtn = document.getElementById("ui-btn-dash-add-disc");
  const addMidBtn = document.getElementById("ui-btn-dash-add-mid");

  const barriersContainer = document.getElementById("ui-dash-barriers-container");
  const entitiesContainer = document.getElementById("ui-dash-entities-container");

  let activeCombatantsList = [];
  let roundCounter = 1;

  if (!loadBtn) return;

  // Clear dashboard state
  clearBtn.addEventListener("click", () => {
    blueprintInput.value = "";
    barriersContainer.innerHTML = "";
    entitiesContainer.innerHTML = "";
    activeCombatantsList = [];
    roundCounter = 1;
    roundDisplay.textContent = "1";
    currentTurnDisplay.textContent = "AWAITING ROUND";
    deckList.innerHTML = "";
    discardList.innerHTML = "";
    deckCount.textContent = "0";
    discardCount.textContent = "0";
    sysLog("Active Dashboard cleared and reset.");
  });

  // Action button: Parses blueprint and populates dashboard targets
  loadBtn.addEventListener("click", () => {
    const rawBlue = blueprintInput.value.trim();
    if (!rawBlue) return;

    try {
      // Clear containers
      barriersContainer.innerHTML = "";
      entitiesContainer.innerHTML = "";
      activeCombatantsList = [];

      // Draw basic interactive cards representing parsed items or generic slots
      const barrierCard = document.createElement("div");
      barrierCard.className = "dash-card dash-barrier-card";
      barrierCard.innerHTML = `
        <div class="dash-card-header">
          <input type="text" value="Outer Security Gate">
        </div>
        <div class="dash-barrier-meta">
          <span>TN: 10</span>
          <span>CLOCK: 6/6</span>
        </div>
        <button class="action-btn" style="background-color: var(--color-blue); padding: 5px;">Deplete Progress</button>
      `;
      barriersContainer.appendChild(barrierCard);

      // Populate combatants list with entities
      const activePC = AppState.activeCharacter || { name: "Subject_01", stats: { Alacrity: 2 } };
      
      activeCombatantsList = [
        { id: "PC", name: activePC.name, alacrity: activePC.stats.Alacrity },
        { id: "Sentry_01", name: "Sentry_01", alacrity: 2 }
      ];

      renderEntitiesUI();

      // Setup priority deck
      AppState.initiativeDeck.setupSituation(activeCombatantsList);
      updatePriorityUI();

      drawBtn.disabled = false;
      passBtn.disabled = false;
      seizeBtn.disabled = false;

      sysLog("Dashboard compilation completed. Combat states synced.");
    } catch (err) {
      alert(`Dashboard Load Failure: ${err.message}`);
    }
  });

  function renderEntitiesUI() {
    entitiesContainer.innerHTML = "";
    activeCombatantsList.forEach(c => {
      const eCard = document.createElement("div");
      eCard.className = "dash-card dash-entity-card";
      eCard.innerHTML = `
        <div class="dash-card-header">
          <input type="text" value="${c.name}">
        </div>
        <div class="dash-entity-grid">
          <div>HP: 10/10 | RES: 5</div>
          <div class="dash-action-pool">
            AP: <span id="pool-${c.id}">${c.alacrity}</span>
          </div>
        </div>
      `;
      entitiesContainer.appendChild(eCard);
    });
  }

  function updatePriorityUI() {
    deckList.innerHTML = "";
    discardList.innerHTML = "";

    AppState.initiativeDeck.deck.forEach(c => {
      const el = document.createElement("div");
      el.className = "initiative-card";
      el.textContent = `${c.name} (AP: ${AppState.initiativeDeck.actionPools[c.id]})`;
      deckList.appendChild(el);
    });

    AppState.initiativeDeck.discard.forEach(c => {
      const el = document.createElement("div");
      el.className = "initiative-card";
      el.style.opacity = "0.5";
      el.textContent = `${c.name} (AP: 0)`;
      discardList.appendChild(el);
    });

    deckCount.textContent = AppState.initiativeDeck.deck.length;
    discardCount.textContent = AppState.initiativeDeck.discard.length;

    if (AppState.initiativeDeck.activeCard) {
      const active = AppState.initiativeDeck.activeCard;
      currentTurnDisplay.textContent = active.name;
    } else {
      currentTurnDisplay.textContent = "AWAITING ROUND";
    }
  }

  // Draw card priority (Section 5.2)
  drawBtn.addEventListener("click", () => {
    const nextCard = AppState.initiativeDeck.drawNext();
    updatePriorityUI();
    if (nextCard) {
      sysLog(`Priority drawn: ${nextCard.name} has the active turn.`);
    }
  });

  // End turn / Pass card (Section 5.4.2)
  passBtn.addEventListener("click", () => {
    const nextCard = AppState.initiativeDeck.passActive();
    updatePriorityUI();
    if (nextCard) {
      sysLog(`Priority passed: Turn transitions to ${nextCard.name}.`);
    }
  });

  // Manual insertions mid-round (Section 5.5)
  addMidBtn.addEventListener("click", () => {
    const name = manualInput.value.trim() || "Reinforcement";
    const id = `manual_${Date.now()}`;
    const participant = { id, name, alacrity: 2 };
    
    AppState.initiativeDeck.addParticipantMidRound(participant);
    activeCombatantsList.push(participant);
    
    renderEntitiesUI();
    updatePriorityUI();
    manualInput.value = "";
    sysLog(`Ecosystem Shift: ${name} inserted Mid-Round.`);
  });
}

// --- 11. SEARCHABLE CODEX & ACTIONS REFERENCE (view-companion) ---
function initCodex() {
  const actionsTab = document.getElementById("comp-actions");
  const kwSearch = document.getElementById("ui-comp-kw-search");
  const kwList = document.getElementById("ui-comp-kw-list");

  if (!actionsTab) return;

  // 1. Render all Action Catalog categories dynamically
  actionsTab.innerHTML = "";
  Object.keys(PCM_ACTIONS_CATALOG).forEach(catKey => {
    if (catKey.startsWith("_")) return; // skip structural metadata
    const category = PCM_ACTIONS_CATALOG[catKey];

    const det = document.createElement("details");
    det.className = "action-cat";
    det.innerHTML = `<summary>${catKey.replace("Actions", "")} Actions</summary>`;

    const listContainer = document.createElement("div");
    listContainer.style.padding = "0 15px 15px 15px";

    Object.keys(category).forEach(actionName => {
      const act = category[actionName];
      const item = document.createElement("div");
      item.className = "action-item";
      item.innerHTML = `
        <h4>${act.name}</h4>
        <div class="action-cost">AP Cost: ${act.cost.ap || 0} | SP Cost: ${act.cost.sp || 0} | EP Cost: ${act.cost.ep || 0}</div>
        <p style="font-size: 10pt; color: #ccc;">${act.description}</p>
      `;
      listContainer.appendChild(item);
    });

    det.appendChild(listContainer);
    actionsTab.appendChild(det);
  });

  // 2. Render Searchable Keywords List
  function filterKeywords(query = "") {
    kwList.innerHTML = "";
    const cleanQuery = query.toLowerCase().trim();

    Object.keys(PCM_KEYWORDS_DICTIONARY).forEach(code => {
      const kw = PCM_KEYWORDS_DICTIONARY[code];
      const colorName = PCM_COLORS[kw.color]?.name || "Null";

      // Search match filter check
      const matchesQuery = 
        kw.name.toLowerCase().includes(cleanQuery) || 
        code.includes(cleanQuery) || 
        colorName.toLowerCase().includes(cleanQuery);

      if (cleanQuery === "" || matchesQuery) {
        const item = document.createElement("li");
        item.className = "comp-kw-card";
        item.style.borderLeftColor = PCM_COLORS[kw.color]?.hex || "var(--color-silver)";
        item.innerHTML = `
          <div class="comp-kw-header">
            <span class="comp-kw-name">${kw.name}</span>
            <span class="comp-kw-code" style="color: ${PCM_COLORS[kw.color]?.hex}">${code} (${colorName})</span>
          </div>
          <div class="comp-kw-effect"><strong>Intent:</strong> ${kw.intent}</div>
          <div class="comp-kw-effect" style="margin-top: 5px;"><strong>Passive:</strong> ${kw.passive}</div>
          <div class="comp-kw-effect" style="margin-top: 5px;"><strong>Active:</strong> ${kw.active}</div>
          <div class="comp-kw-effect" style="margin-top: 5px;"><strong>Gear:</strong> ${kw.equipment}</div>
        `;
        kwList.appendChild(item);
      }
    });
  }

  // Bind keyup event listener to trigger filters
  kwSearch.addEventListener("keyup", (e) => {
    filterKeywords(e.target.value);
  });

  // Run initial population
  filterKeywords();

  // Implement companion tab button views-switches
  const compTabs = document.querySelectorAll(".comp-tab-btn");
  const compContents = document.querySelectorAll(".comp-tab-content");

  compTabs.forEach(btn => {
    btn.addEventListener("click", () => {
      compTabs.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const targetTabId = btn.getAttribute("data-tab");
      compContents.forEach(c => {
        if (c.id === targetTabId) {
          c.classList.add("active");
        } else {
          c.classList.remove("active");
        }
      });
    });
  });
}

// Initializing the remaining components on page load
document.addEventListener("DOMContentLoaded", () => {
  initRoller();
  initGenerator();
  initDashboard();
  initCodex();
});