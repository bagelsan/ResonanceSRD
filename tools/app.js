/**
 * PSYCHROMATTICA: app.js
 * ROLE: The Skin (UI Controller)
 * DESCRIPTION: Connects the DOM (index.html) to the GameController.
 */

import { GameController } from './core/PsychroController.js';
import { PsychroEvents } from './core/PsychroEvents.js';
import { PsychroState } from './core/PsychroState.js';
import { KEYWORDS, COLORS, parseBuildString } from './core/PsychroEngine.js'
import { TTRPGEngine } from './engines/TTRPGEngine.js'

document.addEventListener('DOMContentLoaded', () => {

    // =======================================================================
    // 1. NAVIGATION LOGIC (Handling the Bottom Navbar)
    // =======================================================================
    const navButtons = document.querySelectorAll('.nav-button');
    const views = document.querySelectorAll('.tool-view');

    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class from all
            navButtons.forEach(b => b.classList.remove('active'));
            views.forEach(v => v.classList.remove('active'));
            
            // Add active class to target
            e.target.classList.add('active');
            const targetView = document.getElementById(e.target.dataset.target);
            if (targetView) targetView.classList.add('active');
        });
    });

    // =======================================================================
    // 2. DOM ELEMENTS (Caching for performance)
    // =======================================================================
    const uiInputString = document.getElementById('ui-build-string');
    const uiBtnLoad = document.getElementById('ui-btn-load');
    const uiConsoleLog = document.getElementById('ui-console-log');
    
// Sheet Elements
    const uiSheetName = document.getElementById('ui-sheet-name');
    const uiSheetLevel = document.getElementById('ui-sheet-level');
    const uiSheetKarma = document.getElementById('ui-sheet-karma');
    const uiSheetProfile = document.getElementById('ui-sheet-profile');
    const uiSheetStats = document.getElementById('ui-sheet-stats');
    const uiSheetRes = document.getElementById('ui-sheet-res');
    const uiSheetKeywords = document.getElementById('ui-sheet-keywords');
    const uiSheetFlaws = document.getElementById('ui-sheet-flaws');
    const uiSheetAttachments = document.getElementById('ui-sheet-attachments');

    // =======================================================================
    // 3. UI HELPER FUNCTIONS
    // =======================================================================
    function appendToConsole(text) {
        uiConsoleLog.innerHTML += `<div>> ${text}</div>`;
        uiConsoleLog.scrollTop = uiConsoleLog.scrollHeight; // Auto-scroll down
    }

function renderPips(containerId, current, max) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';
        for (let i = 0; i < max; i++) {
            const pip = document.createElement('div');
            pip.className = i < current ? 'pip active' : 'pip';
            container.appendChild(pip);
        }
    }

function bindSheetPips() {
        ['hp', 'sp', 'ep'].forEach(resource => {
            const container = document.getElementById(`ui-pips-${resource}`);
            if (!container) return;
            
            // Remove old listeners to prevent duplicates
            const newContainer = container.cloneNode(true);
            container.parentNode.replaceChild(newContainer, container);
            
            newContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('pip')) {
                    const pips = Array.from(newContainer.children);
                    const targetIndex = pips.indexOf(e.target);
                    const currentActive = pips.filter(p => p.classList.contains('active')).length;
                    
                    // Logic to toggle on/off exactly where clicked
                    let newValue = (currentActive === targetIndex + 1 && targetIndex === currentActive - 1) ? targetIndex : targetIndex + 1;
                    
                    // Update Central State and save to LocalStorage!
                    const state = PsychroState.getState();
                    state.resources[resource] = newValue;
                    PsychroState.update({ resources: state.resources });
                    
                    // Re-render visually
                    updateCharacterSheet(PsychroState.getState());
                }
            });
        });
    }

    function updateCharacterSheet(state) {
        if (!state || !state.parsedEntity) return;

        const char = state.parsedEntity.character;
        const res = state.resources;
        if (!char) return;

        // 1. Header
        uiSheetLevel.textContent = char.level;
        uiSheetKarma.textContent = res.karma;

        // 2. Profile
        if (char.profile) {
            const p = char.profile;
            const labels =['Goal', 'Method', 'Purpose', 'Ext. Con', 'Int. Con'];
            const vals =[p.goal, p.method, p.purpose, p.conflict1, p.conflict2];
            
            uiSheetProfile.innerHTML = '';
            vals.forEach((val, index) => {
                const colorHex = val !== null ? `var(--color-${Object.values(COLORS)[val]?.name.toLowerCase()})` : 'var(--color-silver)';
                const borderColor = index === 0 ? 'var(--color-null)' : (index > 2 ? 'var(--color-red)' : 'var(--color-silver)');
                
                uiSheetProfile.innerHTML += `
                    <div class="profile-box" style="border-color: ${borderColor}">
                        ${labels[index]}<br>
                        <span style="font-weight:normal; color:${colorHex};">${Object.values(COLORS)[val]?.name || '---'}</span>
                    </div>
                `;
            });
        }

        // 3. Stats & Resistance
        uiSheetStats.innerHTML = '';
        ['R','A','B','W','E','T','P','I','F'].forEach(stat => {
            uiSheetStats.innerHTML += `
                <div class="matrix-box">
                    <strong>${char.stats[stat]}</strong>
                    <span>${stat === 'R' ? 'Range' : stat === 'A' ? 'Alacrity' : stat === 'B' ? 'Brawn' : stat === 'W' ? 'Wit' : stat === 'E' ? 'Expertise' : stat === 'T' ? 'Technique' : stat === 'P' ? 'Power' : stat === 'I' ? 'Influence' : 'Force'}</span>
                </div>
            `;
        });
        
        // Calculate Resistance (Sum of 3 highest stats)
        const statValues = Object.values(char.stats).sort((a, b) => b - a);
        uiSheetRes.textContent = statValues[0] + statValues[1] + statValues[2];

        // 4. Clocks
        renderPips('ui-pips-hp', res.hp, res.maxHp);
        renderPips('ui-pips-sp', res.sp, res.maxSp);
        renderPips('ui-pips-ep', res.ep, res.maxEp);

        // 5. Keywords
        uiSheetKeywords.innerHTML = '';
        
        // Render Seed
        if (char.seed) {
            const isPassive = char.seed.isSlottedPassive ? 'active' : '';
            uiSheetKeywords.innerHTML += `
                <div class="kw-row">
                    <div class="kw-badge ${isPassive}">!</div>
                    <div class="kw-name" style="color: var(--color-${COLORS[char.seed.code[0]].name.toLowerCase()})">${char.seed.name}</div>
                    <div class="kw-level">Seed</div>
                </div>
            `;
        }

        // Render Learned
        const allKeywords =[...char.learnedKeywords, ...char.passiveKeywords];
        allKeywords.forEach((kw, index) => {
            const isPassive = kw.isSlottedPassive ? 'active' : '';
            // Rough calculation of which level they got it (3 at lvl 1, 2 per level after)
            let kwLevel = index < 3 ? 1 : Math.floor((index - 3) / 2) + 2;
            
            uiSheetKeywords.innerHTML += `
                <div class="kw-row">
                    <div class="kw-badge ${isPassive}">!</div>
                    <div class="kw-name" style="color: var(--color-${COLORS[kw.code[0]].name.toLowerCase()})">${kw.name}</div>
                    <div class="kw-level">Lvl ${kwLevel}</div>
                </div>
            `;
        });

        // 6. Flaw & Comp
        uiSheetFlaws.innerHTML = '';
        if (char.flaw) {
            uiSheetFlaws.innerHTML += `
                <div class="kw-row" style="border-left: 3px solid var(--color-red);">
                    <div class="kw-name">${char.flaw.penalty.name} <span style="color:var(--color-silver); font-size:9pt;">(Penalty)</span></div>
                </div>
                <div class="kw-row" style="border-left: 3px solid var(--color-green);">
                    <div class="kw-name">${char.flaw.compensation.name} <span style="color:var(--color-silver); font-size:9pt;">(Compensation)</span></div>
                </div>
            `;
        } else {
            uiSheetFlaws.innerHTML = `<div style="color:#666; font-style:italic; padding: 5px;">No Flaw Package selected.</div>`;
        }

// 7. Render Page 2 (Animations / Items)
        uiSheetAttachments.innerHTML = '';
        if (state.parsedEntity.animations && state.parsedEntity.animations.length > 0) {
            uiSheetAttachments.innerHTML += `<h3 style="margin-top: 15px;">Animations</h3>`;
            state.parsedEntity.animations.forEach((anim, i) => {
                uiSheetAttachments.innerHTML += `
                    <div class="section" style="border-left: 4px solid var(--color-yellow);">
                        <h4 style="color: var(--color-white); margin-bottom: 5px;">Animation ${i+1} (Level ${anim.level})</h4>
                        <div style="font-size: 9pt; color: var(--color-silver);">Keywords: ${anim.keywords.map(k=>k.name).join(', ')}</div>
                    </div>
                `;
            });
        }
        
        bindSheetPips();
    }

    // =======================================================================
    // 3.5 THE QUIZ LOGIC (UI Tool)
    // =======================================================================

// =======================================================================
    // 3.5 THE QUIZ LOGIC (UI Tool)
    // =======================================================================
    const uiQuizForm = document.getElementById('ui-quiz-form');
    const uiQuizResults = document.getElementById('ui-quiz-results');
    const uiQuizFinalCode = document.getElementById('ui-quiz-final-code');
    const uiBtnSendProfile = document.getElementById('ui-btn-send-profile');
    
    let generatedProfileString = "00000";

const QUESTIONS_DATA =[
        // Section A: Motivation (Body, Mind, Essence)
        { q: "A sudden power outage plunges your neighborhood into darkness. Immediate priority?", answers:[{ text: "Securing the area. Check physical dangers.", value: "Body" }, { text: "Figuring out the system and cause.", value: "Mind" }, { text: "Establishing principle. Prevent panic.", value: "Essence" }]},
        { q: "Looking back on a time you truly grew, what was the most significant change?", answers:[{ text: "Mastered a new skill/knowledge (logic).", value: "Mind" }, { text: "Became certain of what I stand for.", value: "Essence" }, { text: "Became in tune with my body/instincts.", value: "Body" }]},
        { q: "You've been offered two jobs for the same pay. Which do you choose?", answers:[{ text: "Aligns with my life's purpose.", value: "Essence" }, { text: "Best physical environment and safety.", value: "Body" }, { text: "Clear logical structure.", value: "Mind" }]},
        { q: "A friend tells a 'white lie' to make you look better. What bothers you most?", answers:[{ text: "The principle. Reputation should be truth.", value: "Essence" }, { text: "The emotional fallout and awkwardness.", value: "Body" }, { text: "The logical inconsistency/bad data.", value: "Mind" }]},
        { q: "Solve all future problems with a single tool. You choose:", answers:[{ text: "A perfectly crafted multi-tool.", value: "Body" }, { text: "An infinitely expanding encyclopedia.", value: "Mind" }, { text: "A powerful, inspiring symbol.", value: "Essence" }]},
        { q: "When collaborating, what frustrates you the most?", answers:[{ text: "Arguments based on feelings over logic.", value: "Mind" }, { text: "Saying one thing but doing another.", value: "Essence" }, { text: "Physical clumsiness creating risks.", value: "Body" }]},
        { q: "Think about a time you felt truly happy and fulfilled. What were you doing?", answers:[{ text: "Fighting for something I believed in.", value: "Essence" }, { text: "A thrilling physical activity/sport.", value: "Body" }, { text: "Solving a complex puzzle/problem.", value: "Mind" }]},
        { q: "At a crossroads making a major life decision. The tie-breaker is:", answers:[{ text: "A deep, physical gut feeling.", value: "Body" }, { text: "A final review of the data/logic.", value: "Mind" }, { text: "My moral compass/principles.", value: "Essence" }]},
        { q: "When your life's story is told, the central theme is:", answers:[{ text: "Intellectual achievement/elegant systems.", value: "Mind" }, { text: "Unwavering character and willpower.", value: "Essence" }, { text: "Incredible adventures and sensory experiences.", value: "Body" }]},

        // Section B: Context (Foundation, Control, Execution)
        { q: "A powerful new energy source is discovered. First priority?", answers:[{ text: "Understand *why* it works (Principles).", value: "Foundation" }, { text: "Control it with strict protocols.", value: "Control" }, { text: "See *what* it does (Practical experiments).", value: "Execution" }]},
        { q: "Putting together a team for a mission. Most important element?", answers:[{ text: "Clear and disciplined chain of command.", value: "Control" }, { text: "Skilled, hands-on operators with autonomy.", value: "Execution" }, { text: "A powerful, shared mission statement.", value: "Foundation" }]},
        { q: "Preparing for a hurricane, what is most critical?", answers:[{ text: "Immediate action (boarding windows).", value: "Execution" }, { text: "Reminding everyone of core values to stop panic.", value: "Foundation" }, { text: "Meticulous resource rationing.", value: "Control" }]},
        { q: "How do you prefer to learn a new, complex skill (like an instrument)?", answers:[{ text: "Start with theory and fundamental principles.", value: "Foundation" }, { text: "Structured practice regimen with a teacher.", value: "Control" }, { text: "Pick it up and experiment hands-on.", value: "Execution" }]},
        { q: "Passing on your life's most important lesson to the next generation:", answers:[{ text: "Design a structured curriculum.", value: "Control" }, { text: "Take them as a hands-on apprentice.", value: "Execution" }, { text: "Write down my core philosophy/principles.", value: "Foundation" }]},
        { q: "A volunteer group has fallen into disarray. First step to fix it?", answers:[{ text: "Get them working on a new, tangible project.", value: "Execution" }, { text: "Review their original charter/principles.", value: "Foundation" }, { text: "Mediate conflicts to manage emotional state.", value: "Control" }]},
        { q: "Which defines 'strength' best?", answers:[{ text: "An unshakeable moral foundation.", value: "Foundation" }, { text: "Disciplined self-control.", value: "Control" }, { text: "Proven, effective action.", value: "Execution" }]},
        { q: "Someone aggressively challenges your deepest belief. Response?", answers:[{ text: "De-escalate to manage the room's tension.", value: "Control" }, { text: "Direct, immediate counter/sharp comeback.", value: "Execution" }, { text: "Defend the underlying principle calmly.", value: "Foundation" }]},
        { q: "Planning a month-long wilderness trip. Most critical preparation?", answers:[{ text: "Hitting the trail. Learn by doing.", value: "Execution" }, { text: "Understanding the history/ecology (The 'Why').", value: "Foundation" }, { text: "Meticulous logistical planning.", value: "Control" }]},

        // Section C: Perspective (Internal, External, Collaborative)
        { q: "After perfecting a craft, what gives you most satisfaction?", answers:[{ text: "Personal fulfillment of true self-mastery.", value: "Internal" }, { text: "Passing knowledge to an apprentice.", value: "External" }, { text: "Forming a guild to elevate the craft.", value: "Collaborative" }]},
        { q: "You come into money. After basic needs, your first impulse?", answers:[{ text: "Give to a specific person/charity in need.", value: "External" }, { text: "Fund a community project for the group.", value: "Collaborative" }, { text: "Invest in personal growth/tools.", value: "Internal" }]},
        { q: "Success in life should be measured by...", answers:[{ text: "The strength of the community you built.", value: "Collaborative" }, { text: "The achievement of true self-mastery.", value: "Internal" }, { text: "Tangible impact on specific individuals.", value: "External" }]},
        { q: "You see a stranger being harassed. First instinct?", answers:[{ text: "Directly intervene for the individual.", value: "External" }, { text: "Rally bystanders for a group response.", value: "Collaborative" }, { text: "Assess my personal safety/readiness first.", value: "Internal" }]},
        { q: "Stuck on a truly difficult problem. Who do you consult?", answers:[{ text: "Turn inward for quiet solitude/reflection.", value: "Internal" }, { text: "Seek out a single trusted expert/mentor.", value: "External" }, { text: "Gather the team for brainstorming.", value: "Collaborative" }]},
        { q: "If you wrote a bestselling book, the subject would be:", answers:[{ text: "Inspiring biography of a single individual.", value: "External" }, { text: "Epic story of a team accomplishing the impossible.", value: "Collaborative" }, { text: "Introspective memoir of self-discovery.", value: "Internal" }]},
        { q: "Your deepest loyalty is to...", answers:[{ text: "My own conscience and principles.", value: "Internal" }, { text: "A specific person I swore to protect.", value: "External" }, { text: "My chosen family or community.", value: "Collaborative" }]},
        { q: "A team project you lead fails. First internal question?", answers:[{ text: "Did I fail to understand the needs of individuals?", value: "External" }, { text: "How did group dynamics break down?", value: "Collaborative" }, { text: "Where did *I* personally go wrong?", value: "Internal" }]},
        { q: "Which social situation leaves you most recharged?", answers:[{ text: "Deep one-on-one conversation.", value: "External" }, { text: "Lively party or game night with the group.", value: "Collaborative" }, { text: "Quiet evening alone with a personal project.", value: "Internal" }]}
    ];

    // Render Quiz
    if (uiQuizForm) {
        let quizHTML = "";
        QUESTIONS_DATA.forEach((data, index) => {
            quizHTML += `<div style="margin-bottom: 15px; border-bottom: 1px solid #444; padding-bottom: 10px;">`;
            quizHTML += `<p style="color: var(--color-silver); margin-bottom: 8px;"><strong>Q${index + 1}:</strong> ${data.q}</p>`;
            data.answers.forEach(answer => {
                quizHTML += `<label style="display: block; margin-bottom: 5px; cursor: pointer;">`;
                quizHTML += `<input type="radio" name="q${index}" value="${answer.value}" required> ${answer.text}</label>`;
            });
            quizHTML += `</div>`;
        });
        quizHTML += `<button type="submit" class="action-btn">Compile System Vector</button>`;
        uiQuizForm.innerHTML = quizHTML;

        // Process Quiz
        uiQuizForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(uiQuizForm);
            
            const scores = {
                motivation: { Body: 0, Mind: 0, Essence: 0 },
                context: { Foundation: 0, Control: 0, Execution: 0 },
                perspective: { Internal: 0, External: 0, Collaborative: 0 }
            };

// Tally Scores
            for (let i = 0; i < QUESTIONS_DATA.length; i++) {
                const val = formData.get(`q${i}`);
                if (i < 9) scores.motivation[val]++;
                else if (i < 18) scores.context[val]++;
                else scores.perspective[val]++;
            }

            // Find Dominant Traits (Axis Math)
            const domMot = Object.keys(scores.motivation).reduce((a, b) => scores.motivation[a] > scores.motivation[b] ? a : b);
            const domCon = Object.keys(scores.context).reduce((a, b) => scores.context[a] > scores.context[b] ? a : b);
            const domPersp = Object.keys(scores.perspective).reduce((a, b) => scores.perspective[a] > scores.perspective[b] ? a : b);

            // Step 3: Derive Primary Psychroma (Goal)
            let primaryGoal = '0';
            if (domMot === 'Body') {
                if (domCon === 'Control') primaryGoal = '1';       // Silver
                else if (domCon === 'Execution') primaryGoal = '2';// Yellow
                else if (domCon === 'Foundation') primaryGoal = '3';// Green
            } else if (domMot === 'Mind') {
                if (domCon === 'Control') primaryGoal = '4';       // Black
                else if (domCon === 'Execution') primaryGoal = '5';// Orange
                else if (domCon === 'Foundation') primaryGoal = '6';// White
            } else if (domMot === 'Essence') {
                if (domCon === 'Control') primaryGoal = '7';       // Red
                else if (domCon === 'Execution') primaryGoal = '8';// Blue
                else if (domCon === 'Foundation') primaryGoal = '9';// Purple
            }

            // Step 4: Map to the 9 Default 5-Point Profiles
            const profileStrings = {
                '1': '18736', // The Achiever
                '2': '29381', // The Liberator
                '3': '32674', // The Guardian
                '4': '47958', // The Chronicler
                '5': '56892', // The Creator
                '6': '63549', // The Judge
                '7': '71465', // The Champion
                '8': '85123', // The Diplomat
                '9': '94257'  // The Seeker
            };
            generatedProfileString = profileStrings[primaryGoal] || '00000';

            // Step 5: Map to the 27 Archetypes of Action
            const archetypes27 = {
                // BODY
                'Body_Foundation_Internal': 'The Athlete',
                'Body_Foundation_External': 'The Harvester',
                'Body_Foundation_Collaborative': 'The Builder',
                'Body_Control_Internal': 'The Martialist',
                'Body_Control_External': 'The Guardian',
                'Body_Control_Collaborative': 'The Sentinel',
                'Body_Execution_Internal': 'The Daredevil',
                'Body_Execution_External': 'The Striker',
                'Body_Execution_Collaborative': 'The Vanguard',
                // MIND
                'Mind_Foundation_Internal': 'The Student',
                'Mind_Foundation_External': 'The Researcher',
                'Mind_Foundation_Collaborative': 'The Architect',
                'Mind_Control_Internal': 'The Logician',
                'Mind_Control_External': 'The Analyst',
                'Mind_Control_Collaborative': 'The Strategist',
                'Mind_Execution_Internal': 'The Solver',
                'Mind_Execution_External': 'The Operator',
                'Mind_Execution_Collaborative': 'The Tactician',
                // ESSENCE
                'Essence_Foundation_Internal': 'The Ascetic',
                'Essence_Foundation_External': 'The Seeker',
                'Essence_Foundation_Collaborative': 'The Believer',
                'Essence_Control_Internal': 'The Stoic',
                'Essence_Control_External': 'The Judge',
                'Essence_Control_Collaborative': 'The Paragon',
                'Essence_Execution_Internal': 'The Zealot',
                'Essence_Execution_External': 'The Crusader',
                'Essence_Execution_Collaborative': 'The Exemplar'
            };

            const archetypeKey = `${domMot}_${domCon}_${domPersp}`;
            const archetypeResult = archetypes27[archetypeKey] || 'The Unknown';

            // Update UI
            uiQuizFinalCode.textContent = generatedProfileString;
            
            // Inject the true Archetype title above the code
            const resultsHeader = uiQuizResults.querySelector('h3');
            resultsHeader.innerHTML = `Assessment Complete<br><span style="color:var(--color-yellow); font-size:1.2em;">${archetypeResult}</span><br><span style="font-size:0.6em; color:var(--color-silver);">(${domMot} / ${domCon} / ${domPersp})</span>`;

            uiQuizResults.style.display = 'block';
            uiQuizResults.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Send the generated profile to the Builder
    if (uiBtnSendProfile) {
        uiBtnSendProfile.addEventListener('click', () => {
            PsychroEvents.publish('PROFILE_GENERATED', generatedProfileString);
            
            // Auto-switch to builder tab
            document.querySelector('[data-target="view-builder"]').click();
        });
    }

// =======================================================================
    // 3.6 THE BUILDER LOGIC (UI Tool)
    // =======================================================================
    
    // 1. Populate Dropdowns
    const profileSelects = document.querySelectorAll('#ui-profile-selects select');
    const kwSelects = document.querySelectorAll('.kw-select');

    // Populate Colors for Profile
    let colorOptions = "";
    Object.keys(COLORS).forEach(key => {
        colorOptions += `<option value="${key}">${key}: ${COLORS[key].name} (${COLORS[key].theme})</option>`;
    });
    profileSelects.forEach(sel => {
        const defaultText = sel.options[0].text;
        sel.innerHTML = `<option value="0">${defaultText}</option>` + colorOptions;
    });

    // Populate Keywords
    let kwOptions = "";
    Object.keys(KEYWORDS).forEach(key => {
        const kw = KEYWORDS[key];
        kwOptions += `<option value="${key}">${key} - ${kw.name}[${kw.type}]</option>`;
    });
    kwSelects.forEach(sel => {
        const defaultText = sel.options[0].text;
        sel.innerHTML = `<option value="">${defaultText}</option>` + kwOptions;
    });

    // 2. Compilation Function
    function compileBlueprint() {
        // Grab Profile
        const p1 = document.getElementById('sel-goal').value;
        const p2 = document.getElementById('sel-method').value;
        const p3 = document.getElementById('sel-purpose').value;
        const p4 = document.getElementById('sel-conf1').value;
        const p5 = document.getElementById('sel-conf2').value;
        const profileString = `${p1}${p2}${p3}${p4}${p5}`;

        // Grab Seed
        let seed = document.getElementById('sel-seed').value;
        if (seed) seed = seed.replace('.', ''); // Convert 1.2 to 12
        const isPassive = document.getElementById('chk-seed-passive').checked ? '!' : '';

   // Grab Flaw Package
        let flaw = document.getElementById('sel-flaw').value;
        let comp = document.getElementById('sel-comp').value;
        let flawString = "";
        if (flaw && comp) {
            flawString = `+${flaw.replace('.', '')}${comp.replace('.', '')}`;
        }

        // Grab Awakening Keywords
        const awkSelects = document.querySelectorAll('.sel-awk');
        let awkArr =[];
        awkSelects.forEach(sel => {
            if (sel.value) awkArr.push(sel.value.replace('.', ''));
        });

// Stitch it together
        let buildString = `[C:${profileString}${flawString}`;
        
        if (seed) {
            buildString += `-${isPassive}${seed}`;
            if (awkArr.length > 0) {
                buildString += `-${awkArr.join('.')}`;
            }
        } else {
            buildString += `-]`;
        }
        buildString += `]`;

        uiInputString.value = buildString;
        appendToConsole(`Compiled Blueprint: ${buildString}`);
    }

    // Attach to compile button
    const btnCompile = document.getElementById('ui-btn-compile');
    if (btnCompile) btnCompile.addEventListener('click', compileBlueprint);

// =======================================================================
    // 3.7 THE ROLLER LOGIC (UI Tool)
    // =======================================================================
    const uiBtnRoll = document.getElementById('ui-btn-roll');
    const uiBtnPullStats = document.getElementById('ui-btn-pull-stats');
    const uiRollerStress = document.getElementById('ui-roller-stress');
    const uiRollerStressPanel = document.getElementById('ui-roller-stress-panel');
    
    // Toggle Stress Panel
    if (uiRollerStress) {
        uiRollerStress.addEventListener('change', (e) => {
            if (e.target.checked) uiRollerStressPanel.classList.add('active');
            else uiRollerStressPanel.classList.remove('active');
        });
    }

    // Pull Stats from Active Memory
    if (uiBtnPullStats) {
        uiBtnPullStats.addEventListener('click', () => {
            const state = PsychroState.getState();
            if (state.parsedEntity && state.parsedEntity.character) {
                const char = state.parsedEntity.character;
                document.getElementById('ui-roller-level').value = char.level;
                document.getElementById('ui-roller-wit').value = char.stats.W || 1;
                document.getElementById('ui-roller-kws').value = 1 + char.learnedKeywords.length + char.passiveKeywords.length;
                appendToConsole("Roller: Pulled Level, Wit, and Keyword counts from active memory.");
            } else {
                alert("No active character loaded in Memory.");
            }
        });
    }

    // Execute Roll
    if (uiBtnRoll) {
        uiBtnRoll.addEventListener('click', () => {
            const level = parseInt(document.getElementById('ui-roller-level').value) || 0;
            const stat = parseInt(document.getElementById('ui-roller-stat').value) || 0;
            const advStatus = document.querySelector('input[name="ui-roller-adv"]:checked').value;
            const applyTwice = document.getElementById('ui-roller-twice').checked;
            
            const isStress = uiRollerStress.checked;
            const wit = parseInt(document.getElementById('ui-roller-wit').value) || 0;
            const knownKws = parseInt(document.getElementById('ui-roller-kws').value) || 0;

            const display = document.getElementById('ui-roller-result-display');
            const statusBadge = document.getElementById('ui-roller-status');
            const superBox = document.getElementById('ui-roller-supercrit-box');
            const stressRes = document.getElementById('ui-roller-stress-result');
            const logBox = document.getElementById('ui-roller-log');

            uiBtnRoll.disabled = true;
            statusBadge.style.display = 'none';
            superBox.style.display = 'none';
            stressRes.style.display = 'none';
            logBox.innerHTML = "Rolling...\n";

            // 1. Call the Shared TTRPG Math Engine
            const hasAdv = advStatus === 'advantage';
            const hasDis = advStatus === 'disadvantage';
            const rollData = TTRPGEngine.math.rollStandard(hasAdv, hasDis);
            
            let logHtml = `<span class="log-highlight">Standard Roll (SR) = ${rollData.total}</span>\n`;
            if (hasAdv) logHtml += `<span class="log-math">> Rolled with Advantage.</span>\n`;
            if (hasDis) logHtml += `<span class="log-math">> Rolled with Disadvantage.</span>\n`;
            if (rollData.isCritical) logHtml += `<span class="log-math">> Doubles Chained!</span>\n`;

            // 2. Calculate EV
            let finalEV = 0;
            if (rollData.isMiss) {
                logHtml += `<span style="color:var(--color-red); font-weight:bold;">> CATASTROPHIC MISS! (Rolled a 1 with Disadvantage)</span>\n`;
            } else {
                if (applyTwice) {
                    finalEV = rollData.total + stat + stat;
                    logHtml += `<span class="log-math">EV: ${rollData.total} (SR) + ${stat} (Stat) + ${stat} (Stat) = ${finalEV}</span>\n`;
                } else {
                    finalEV = rollData.total + level + stat;
                    logHtml += `<span class="log-math">EV: ${rollData.total} (SR) + ${level} (Lvl) + ${stat} (Stat) = ${finalEV}</span>\n`;
                }
            }

            // 3. The Scramble Animation
            const scrambleDuration = 600;
            const startTime = Date.now();
            
            const scrambleEffect = () => {
                const elapsed = Date.now() - startTime;
                if (elapsed >= scrambleDuration) {
                    // Animation complete, show true results
                    display.textContent = rollData.isMiss ? "0" : finalEV;
                    logBox.innerHTML = logHtml;
                    uiBtnRoll.disabled = false;

                    // Badges
                    if (rollData.isMiss) {
                        statusBadge.textContent = "MISS!";
                        statusBadge.className = 'status-badge miss';
                        statusBadge.style.display = 'inline-block';
                    } else if (rollData.isSuperCritical) {
                        statusBadge.textContent = "SUPER CRITICAL!";
                        statusBadge.className = 'status-badge super-crit';
                        statusBadge.style.display = 'inline-block';
                        superBox.style.display = 'block';
                    } else if (rollData.isCritical) {
                        statusBadge.textContent = "CRITICAL HIT!";
                        statusBadge.className = 'status-badge crit';
                        statusBadge.style.display = 'inline-block';
                    }

                    // Stress Roll UI Logic
                    if (isStress && !rollData.isMiss) {
                        const stressTotal = rollData.total + wit;
                        logBox.innerHTML += `\n<span class="log-highlight">Stress Check: ${rollData.total} (SR) + ${wit} (Wit) = ${stressTotal}</span> (Target: >${knownKws})\n`;
                        stressRes.style.display = 'block';
                        
                        if (stressTotal > knownKws) {
                            stressRes.textContent = `STRESS ROLL SUCCESS! (${stressTotal} > ${knownKws}) - You learn the Keyword!`;
                            stressRes.style.backgroundColor = 'rgba(104, 141, 76, 0.2)';
                            stressRes.style.color = 'var(--color-green)';
                            stressRes.style.border = '1px solid var(--color-green)';
                        } else {
                            stressRes.textContent = `STRESS ROLL FAILED. (${stressTotal} <= ${knownKws}) - The Keyword eludes you.`;
                            stressRes.style.backgroundColor = 'rgba(169, 91, 90, 0.2)';
                            stressRes.style.color = 'var(--color-red)';
                            stressRes.style.border = '1px solid var(--color-red)';
                        }
                    }
                    return;
                }
                
                display.textContent = Math.floor(Math.random() * 99);
                requestAnimationFrame(scrambleEffect);
            };
            
            requestAnimationFrame(scrambleEffect);
        });
    }

// =======================================================================
    // 3.8 THE GENERATOR LOGIC (UI Tool)
    // =======================================================================
    const uiBtnGenerate = document.getElementById('ui-btn-generate');
    const uiGenLevel = document.getElementById('ui-gen-level');
    const uiGenOutput = document.getElementById('ui-gen-output');
    const uiGenManifest = document.getElementById('ui-gen-manifest');
    const uiBtnGenCopy = document.getElementById('ui-btn-gen-copy');
    const uiBtnGenSend = document.getElementById('ui-btn-gen-send');

    const SITUATION_TYPES = {
        1: "Conflict", 2: "Obstacle", 3: "Interaction", 4: "Exploration", 5: "Twist", 0: "Hybrid/Choice"
    };

    // RNG Helpers
    const roll = (sides) => Math.floor(Math.random() * sides) + 1;
    const rollD100Str = () => {
        let res = String(roll(100) - 1);
        if (res.length === 1) res = `0.0`; // map 0 to 0.0
        else res = `${res[0]}.${res[1]}`;
        return res;
    };

    // Flaw Protocol
    function rollValidKeyword(flawState, excludeList =[]) {
        while (true) {
            let kw = rollD100Str();
            if (excludeList.includes(kw)) continue;
            
            // If it ends in .0, it's a Flaw
            if (kw.endsWith('.0')) {
                if (!flawState.hasFlaw) {
                    let comp;
                    do { comp = rollD100Str(); } while (comp.endsWith('.0'));
                    flawState.hasFlaw = true;
                    // Format flaw package e.g. +4015 (Flaw 4.0, Comp 1.5)
                    flawState.flawString = `+${kw.replace('.','')}${comp.replace('.','')}`;
                }
                continue; // Reroll the actual keyword slot
            }
            return kw;
        }
    }

    function getLevelMod(partyLevel) {
        const r = roll(10);
        let mod = 0;
        if (r <= 4) mod = -1;
        else if (r <= 8) mod = 0;
        else if (r === 9) mod = 1;
        else if (r === 10) mod = 2;
        return Math.max(0, partyLevel + mod);
    }

    function generateCharacter(level) {
        let flawState = { hasFlaw: false, flawString: "" };
        let kws = [];
        let stringBlocks =[];
        
        // Random Profile
        const profile = Array(5).fill(0).map(() => roll(10) - 1).join('');
        let buildString = `C:${profile}`;
        
        // Seed
        let seed = rollValidKeyword(flawState, kws);
        kws.push(seed);
        let seedBlock = `${seed.replace('.','')}`; // Remove decimal for string
        
        // Awakening
        if (level >= 1) {
            let awkKws =[];
            for(let i=0; i<3; i++) {
                let k = rollValidKeyword(flawState, kws);
                awkKws.push(k.replace('.','')); kws.push(k);
            }
            stringBlocks.push(`${awkKws.join('.')}`);
        }
        
        // Progression
        for (let i = 2; i <= level; i++) {
            let progKws =[];
            for(let j=0; j<2; j++) {
                let k = rollValidKeyword(flawState, kws);
                progKws.push(k.replace('.','')); kws.push(k);
            }
            stringBlocks.push(`${progKws.join('.')}`);
        }
        
        if (flawState.hasFlaw) {
            buildString += flawState.flawString;
        }
        
        buildString += `-${seedBlock}`;
        if (stringBlocks.length > 0) buildString += `-${stringBlocks.join('-')}`;
        
        let seedName = KEYWORDS[seed] ? KEYWORDS[seed].name : 'Unknown';
        let details = `  - Character (Level ${level})\n    > Seed: ${seedName} (${seed})\n`;
        if (flawState.hasFlaw) {
            let fCode = `${flawState.flawString[1]}.${flawState.flawString[2]}`;
            let cCode = `${flawState.flawString[3]}.${flawState.flawString[4]}`;
            details += `    > FLAW: ${KEYWORDS[fCode]?.name || 'Unknown'} / COMP: ${KEYWORDS[cCode]?.name || 'Unknown'}\n`;
        }
        return { blueprint: buildString, details: details };
    }

    function generateAnimation(level) {
        let flawState = { hasFlaw: false, flawString: "" };
        let kws =[];
        let numKws = level + 1;
        for (let i = 0; i < numKws; i++) { 
            kws.push(rollValidKeyword(flawState, kws).replace('.','')); 
        }
        
        let buildString = `A:L${level}-${kws.join('.')}`;
        if (flawState.hasFlaw) buildString += flawState.flawString;
        
        let seedKw = `${kws[0][0]}.${kws[0][1]}`;
        let seedName = KEYWORDS[seedKw] ? KEYWORDS[seedKw].name : 'Unknown';
        let details = `  - Animation Construct (Level ${level})\n    > Primary Trait: ${seedName} (${seedKw})\n`;
        return { blueprint: buildString, details: details };
    }

    function generateItem(level = -1) {
        let itemLevel = level >= 0 ? level : roll(10) - 1;
        let flawState = { hasFlaw: false, flawString: "" };
        let kws =[];
        let numKeywords = Math.max(1, Math.min(itemLevel, 5));
        
        for (let i = 0; i < numKeywords; i++) { 
            kws.push(rollValidKeyword(flawState, kws).replace('.','')); 
        }
        let buildString = `I:L${itemLevel}-${kws.join('.')}`;
        if (flawState.hasFlaw) buildString += flawState.flawString;
        
        let details = `  - Equipment Item (Level ${itemLevel})\n    > Keywords Embedded: ${kws.length}\n`;
        return { blueprint: buildString, details: details };
    }

    if (uiBtnGenerate) {
        uiBtnGenerate.addEventListener('click', () => {
            const partyLevel = parseInt(uiGenLevel.value) || 1;
            let finalSceneString = "";
            let manifestReadout = "";

            const complexity = Math.ceil(roll(10) / 2); // 1 to 5
            const themeCode = rollD100Str();
            const themeName = KEYWORDS[themeCode] ? KEYWORDS[themeCode].name : "Unknown";
            
            manifestReadout += `<span class="highlight-title">SCENE METADATA</span>\n`;
            manifestReadout += `Theme Aura: <span class="highlight-kw">${themeName}</span> (${themeCode})\n`;
            manifestReadout += `Total Situations: ${complexity}\n\n`;

            let sitCodes = [];
            let allManifests =[];

            for (let s = 0; s < complexity; s++) {
                const typeRoll = roll(10);
                let typeCode = 0;
                if(typeRoll <= 2) typeCode = 1; else if(typeRoll <= 4) typeCode = 2;
                else if(typeRoll <= 6) typeCode = 3; else if(typeRoll <= 8) typeCode = 4;
                else if(typeRoll === 9) typeCode = 5;

                const isRace = roll(10) <= 2;
                sitCodes.push(`${isRace ? '*' : ''}${typeCode}`);
                
                manifestReadout += `<span class="highlight-title">SITUATION ${s + 1}</span> `;
                manifestReadout += `<span class="highlight-type">[${SITUATION_TYPES[typeCode]}]</span> `;
                if (isRace) manifestReadout += `<span class="highlight-race">>> RACE SITUATION (THREAT CLOCK ACTIVE) <<</span>`;
                manifestReadout += `\n`;

                let numPackages = 0;
                if (typeCode === 1) numPackages = Math.floor(roll(10)/3) + 1; // Conflict
                else if ([0,2,3,4].includes(typeCode)) numPackages = Math.floor(roll(10)/3);
                else if (typeCode === 5) numPackages = 1; // Twist
                if (numPackages === 0 && typeCode !== 5) numPackages = 1;

                let situationEntities =[];
                for (let p = 0; p < numPackages; p++) {
                    const pkgRoll = roll(100);
                    const entityLevel = getLevelMod(partyLevel);
                    
                    if (pkgRoll <= 20) {
                        // Challenge
                        const isBarrier = roll(10) <= 5;
                        const levelModStr = `L${entityLevel >= partyLevel ? '+' : ''}${entityLevel - partyLevel}`;
                        situationEntities.push(`${isBarrier ? 'X' : 'Y'}[${levelModStr}]`);
                        manifestReadout += `  - ${isBarrier ? 'Barrier' : 'Puzzle'} Challenge (Target TN: ${10 + entityLevel})\n`;
                    } else if (pkgRoll <= 50) {
                        // Animation
                        const animData = generateAnimation(entityLevel);
                        situationEntities.push(`[${animData.blueprint}]`);
                        manifestReadout += animData.details;
                    } else if (pkgRoll <= 70) {
                        // Character
                        const charData = generateCharacter(entityLevel);
                        situationEntities.push(`[${charData.blueprint}]`);
                        manifestReadout += charData.details;
                    } else if (pkgRoll <= 85) {
                        // Item
                        const itemData = generateItem();
                        situationEntities.push(`[${itemData.blueprint}]`);
                        manifestReadout += itemData.details;
                    } else {
                        // Boss
                        const bossLevel = entityLevel + 1;
                        const charData = generateCharacter(bossLevel);
                        situationEntities.push(`[${charData.blueprint}]`);
                        manifestReadout += `  <span class="highlight-race">! HIGH THREAT !</span>\n` + charData.details;
                    }
                }
                allManifests.push(`[${situationEntities.join(',')}]`);
                manifestReadout += `\n`;
            }

            finalSceneString = `(${complexity})[${themeCode.replace('.','')}]-${sitCodes.join('|')}:${allManifests.join(',')}`;
            uiGenOutput.value = finalSceneString;
            uiGenManifest.innerHTML = manifestReadout;
            appendToConsole(`Generated new scene blueprint: ${finalSceneString}`);
        });
    }

    if (uiBtnGenCopy) {
        uiBtnGenCopy.addEventListener('click', () => {
            uiGenOutput.select();
            navigator.clipboard.writeText(uiGenOutput.value);
            appendToConsole("Blueprint copied to clipboard.");
        });
    }

    if (uiBtnGenSend) {
        uiBtnGenSend.addEventListener('click', () => {
            const bp = uiGenOutput.value;
            if (bp) {
                PsychroEvents.publish('LOAD_SCENE', bp);
                // In the next step, the Curator Dashboard will listen for this event!
                appendToConsole("Scene sent to Dashboard.");
            }
        });
    }

// =======================================================================
    // 3.9 THE CURATOR DASHBOARD LOGIC (UI Tool)
    // =======================================================================
    const uiDashBlueprint = document.getElementById('ui-dash-blueprint');
    const uiBtnDashLoad = document.getElementById('ui-btn-dash-load');
    const uiBtnDashClear = document.getElementById('ui-btn-dash-clear');
    
    // Initiative Tracker State
    let roundNumber = 1;
    let combatants = new Map(); // Stores name -> { isEntity, actions: {max, current}, domNode }
    let initiativeState = { deck:[], discard:[], current: null, selected: null };

    // --- REUSABLE DASHBOARD CLOCK LOGIC ---
    function setupDashClock(prefix, overrideMax = null) {
        const maxInput = document.getElementById(`ui-dash-${prefix}-max`);
        const pipsContainer = document.getElementById(`ui-dash-${prefix}-pips`);
        if (overrideMax !== null) maxInput.value = overrideMax;

        function redrawPips() {
            let max = parseInt(maxInput.value) || 0;
            let current = pipsContainer.querySelectorAll('.pip.active').length;
            pipsContainer.innerHTML = '';
            for (let i = 0; i < max; i++) {
                const pip = document.createElement('div');
                // Fill Threat clock from left to right, Situation clock starts empty
                pip.className = (prefix === 'threat' && i < current) || (prefix !== 'threat' && i < current) ? 'pip active' : 'pip';
                pip.dataset.index = i;
                pipsContainer.appendChild(pip);
            }
        }

        pipsContainer.addEventListener('click', e => {
            if (e.target.classList.contains('pip')) {
                const targetIndex = parseInt(e.target.dataset.index);
                const pips = Array.from(pipsContainer.children);
                const currentActive = pips.filter(p => p.classList.contains('active')).length;
                let newActive = (currentActive === targetIndex + 1 && targetIndex === currentActive - 1) ? targetIndex : targetIndex + 1;
                pips.forEach((pip, i) => pip.classList.toggle('active', i < newActive));
            }
        });
        
        maxInput.addEventListener('change', redrawPips);
        redrawPips();
    }

    setupDashClock('sit');
    setupDashClock('threat');

    // --- INITIATIVE LOGIC ---
    const btnDashStart = document.getElementById('ui-btn-dash-start');
    const btnDashDraw = document.getElementById('ui-btn-dash-draw');
    const btnDashPass = document.getElementById('ui-btn-dash-pass');
    const btnDashSeize = document.getElementById('ui-btn-dash-seize');

    function renderInitiative() {
        ['deck', 'discard'].forEach(pile => {
            const listEl = document.getElementById(`ui-dash-${pile}-list`);
            listEl.innerHTML = '';
            initiativeState[pile].forEach(name => {
                const card = document.createElement('div');
                card.className = name === initiativeState.selected ? 'initiative-card selected' : 'initiative-card';
                card.textContent = name;
                card.onclick = () => { initiativeState.selected = name; renderInitiative(); };
                listEl.appendChild(card);
            });
            document.getElementById(`ui-dash-${pile}-count`).textContent = initiativeState[pile].length;
        });
        
        document.getElementById('ui-dash-current-turn').textContent = initiativeState.current || '---';
        document.getElementById('ui-dash-round').textContent = roundNumber;
        
        const hasDeck = initiativeState.deck.length > 0;
        const inCombat = !!initiativeState.current || hasDeck || initiativeState.discard.length > 0;
        
        btnDashDraw.disabled = !hasDeck;
        btnDashPass.disabled = !initiativeState.current;
        btnDashSeize.disabled = !initiativeState.current || !initiativeState.selected;
        
        btnDashStart.disabled = hasDeck && inCombat;
        btnDashStart.textContent = (!hasDeck && inCombat) ? "Start Next Round" : "Start Round";
    }

    function shuffleArray(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] =[a[j], a[i]]; } }

    btnDashStart.addEventListener('click', () => {
        if (initiativeState.current || initiativeState.discard.length > 0) {
            roundNumber++;
            // Tick threat clock automatically
            const threatPips = Array.from(document.getElementById('ui-dash-threat-pips').children);
            const activeThreats = threatPips.filter(p => p.classList.contains('active'));
            if (activeThreats.length > 0) activeThreats[activeThreats.length - 1].classList.remove('active');
        }

        const allNames = Array.from(combatants.keys());
        if (initiativeState.current) initiativeState.discard.push(initiativeState.current);
        
        initiativeState.deck = allNames.filter(name => !initiativeState.discard.includes(name) && initiativeState.current !== name);
        initiativeState.deck.push(...initiativeState.discard);
        initiativeState.discard =[];
        initiativeState.current = null;
        initiativeState.selected = null;
        
        shuffleArray(initiativeState.deck);
        
        // Reset action pools for entities
        combatants.forEach((data, name) => { 
            if (data.isEntity) {
                data.actions.current = data.actions.max; 
                data.element.querySelector('.action-current').textContent = data.actions.current;
            }
        });
        renderInitiative();
    });

    btnDashDraw.addEventListener('click', () => {
        if (initiativeState.deck.length === 0) return;
        if (initiativeState.current) initiativeState.discard.push(initiativeState.current);
        initiativeState.current = initiativeState.deck.shift();
        renderInitiative();
    });

    btnDashPass.addEventListener('click', () => {
        if (!initiativeState.current) return;
        const combatant = combatants.get(initiativeState.current);
        const hasActions = combatant && combatant.isEntity && combatant.actions.current > 0;
        
        if (hasActions && initiativeState.deck.length > 0) {
            // Pass: Move to bottom of deck
            initiativeState.deck.push(initiativeState.current);
        } else {
            // End Turn: Move to discard
            initiativeState.discard.push(initiativeState.current);
        }
        initiativeState.current = null;
        renderInitiative();
    });

    btnDashSeize.addEventListener('click', () => {
        if (!initiativeState.selected || !initiativeState.current) return;
        initiativeState.deck.unshift(initiativeState.current);
        initiativeState.deck = initiativeState.deck.filter(c => c !== initiativeState.selected);
        initiativeState.discard = initiativeState.discard.filter(c => c !== initiativeState.selected);
        initiativeState.current = initiativeState.selected;
        initiativeState.selected = null;
        renderInitiative();
    });

    function addManualCombatant(midRound = false) {
        const nameInput = document.getElementById('ui-dash-manual-name');
        const name = nameInput.value.trim();
        if (!name || combatants.has(name)) return;

        if (midRound && initiativeState.deck.length > 0) {
            initiativeState.deck.push(name);
            shuffleArray(initiativeState.deck);
        } else {
            initiativeState.discard.push(name);
        }
        combatants.set(name, { isEntity: false, actions: { max: 0, current: 0 } });
        nameInput.value = '';
        renderInitiative();
    }
    
    document.getElementById('ui-btn-dash-add-disc').addEventListener('click', () => addManualCombatant(false));
    document.getElementById('ui-btn-dash-add-mid').addEventListener('click', () => addManualCombatant(true));

    // --- PARSER LOGIC FOR THE DASHBOARD ---
    let entityCounter = 0;
    let barrierCounter = 0;

    function createDashboardEntity(parsedData, rawString) {
        entityCounter++;
        const isAnim = rawString.startsWith('A:');
        const eName = `${isAnim ? 'Minion' : 'NPC'} ${entityCounter}`;
        const level = isAnim ? parsedData.animations[0].level : parsedData.character.level;
        
        // Calculate Resistance & Alacrity
        let resistance = 3;
        let alacrity = 1;
        if (!isAnim && parsedData.character) {
            const stats = Object.values(parsedData.character.stats).sort((a, b) => b - a);
            resistance = stats[0] + stats[1] + stats[2];
            alacrity = parsedData.character.stats.A || 1;
        } else if (isAnim) {
            // Rough approximation for animations
            resistance = 3 + level;
            alacrity = Math.max(1, Math.floor(level / 2));
        }

        const card = document.createElement('div');
        card.className = 'dash-card dash-entity-card';
        card.dataset.name = eName;

        card.innerHTML = `
            <div class="dash-card-header">
                <input type="text" value="${eName}" readonly>
                <button class="remove-button button-small rm-card">X</button>
            </div>
            <div class="dash-entity-grid">
                <div class="dash-entity-meta">
                    <span>Lvl: ${level}</span>
                    <span>Res: <strong style="color:var(--color-yellow)">${resistance}</strong></span>
                </div>
                <div>
                    <div style="text-align:center; font-size: 8pt; color: var(--color-silver);">ACTIONS</div>
                    <div class="dash-action-pool">
                        <button class="act-minus">-</button>
                        <span class="action-current">${alacrity}</span>/<span class="action-max">${alacrity}</span>
                        <button class="act-plus">+</button>
                    </div>
                </div>
            </div>
            <div class="clock-row"><div class="clock-label" style="font-size:10pt;">HP</div><div class="clock-pips hp-pips" id="dash-hp-${entityCounter}"></div></div>
        `;
        document.getElementById('ui-dash-entities-container').appendChild(card);
        
        // Setup internal clock pips for the card
        const hpContainer = card.querySelector('.hp-pips');
        for(let i=0; i<10; i++) {
            const pip = document.createElement('div');
            pip.className = 'pip active';
            pip.onclick = (e) => e.target.classList.toggle('active');
            hpContainer.appendChild(pip);
        }

        combatants.set(eName, { isEntity: true, element: card, actions: { max: alacrity, current: alacrity } });
        initiativeState.discard.push(eName);
    }

    function createDashboardBarrier(type, levelModStr) {
        barrierCounter++;
        const tName = `${type} ${barrierCounter}`;
        const modifier = parseInt(levelModStr.replace('L', '')) || 0;
        const tn = 10 + modifier;
        const clockSize = type === 'Barrier' ? 5 : 1;

        const card = document.createElement('div');
        card.className = 'dash-card dash-barrier-card';
        card.innerHTML = `
            <div class="dash-card-header">
                <input type="text" value="${tName}" readonly>
                <button class="remove-button button-small rm-card">X</button>
            </div>
            <div class="dash-barrier-meta">Target Number (TN): <span>${tn}</span></div>
            <div class="clock-row"><div class="clock-label" style="font-size:10pt;">Task</div><div class="clock-pips sp-pips" id="dash-bar-${barrierCounter}"></div></div>
        `;
        document.getElementById('ui-dash-barriers-container').appendChild(card);
        
        const taskContainer = card.querySelector('.sp-pips');
        for(let i=0; i<clockSize; i++) {
            const pip = document.createElement('div');
            pip.className = 'pip';
            pip.onclick = (e) => e.target.classList.toggle('active');
            taskContainer.appendChild(pip);
        }
    }

    function updateSitClockMax() {
        const count = document.getElementById('ui-dash-entities-container').children.length + document.getElementById('ui-dash-barriers-container').children.length;
        setupDashClock('sit', count);
    }

    // Load & Parse
    if (uiBtnDashLoad) {
        uiBtnDashLoad.addEventListener('click', () => {
            const rawString = uiDashBlueprint.value.trim();
            if (!rawString) return;
            
            // Check for Race Situation (Threat Clock)
            const sitCodesMatch = rawString.match(/\]-([0-9*|]+):/);
            if (sitCodesMatch && sitCodesMatch[1].includes('*')) {
                setupDashClock('threat', 15);
                // Fill threat pips
                const pips = document.getElementById('ui-dash-threat-pips').children;
                Array.from(pips).forEach(p => p.classList.add('active'));
            }

            // Parse Entities [C:...] or [A:...]
            const entityRegex = /([CA]:[^,\]]+)/g;
            let eMatch;
            while ((eMatch = entityRegex.exec(rawString)) !== null) {
                let cleanStr = `[${eMatch[1].replace(/[()]/g, '')}]`;
                try {
                    // We use the imported parser from GameController
                    const parsedData = parseBuildString(cleanStr);
                    createDashboardEntity(parsedData, eMatch[1]);
                } catch(err) { console.error("Dash Parse Error:", err); }
            }

            // Parse Challenges [X[L+0]]
            const challengeRegex = /([XY])\[(L[+-]\d+)\]/g;
            let cMatch;
            while ((cMatch = challengeRegex.exec(rawString)) !== null) {
                createDashboardBarrier(cMatch[1] === 'X' ? 'Barrier' : 'Puzzle', cMatch[2]);
            }

            updateSitClockMax();
            renderInitiative();
            appendToConsole("Dashboard populated with Scene data.");
        });
    }

    // Clear All
    if (uiBtnDashClear) {
        uiBtnDashClear.addEventListener('click', () => {
            document.getElementById('ui-dash-entities-container').innerHTML = '';
            document.getElementById('ui-dash-barriers-container').innerHTML = '';
            combatants.clear();
            initiativeState = { deck: [], discard:[], current: null, selected: null };
            roundNumber = 1;
            setupDashClock('sit', 0);
            setupDashClock('threat', 15);
            renderInitiative();
        });
    }

    // Delegate Card Clicks (Action Pools & Removes)
    document.body.addEventListener('click', e => {
        if (e.target.classList.contains('rm-card')) {
            const card = e.target.closest('.dash-card');
            const name = card.dataset.name;
            if (name) {
                combatants.delete(name);['deck', 'discard'].forEach(p => initiativeState[p] = initiativeState[p].filter(n => n !== name));
                if (initiativeState.current === name) initiativeState.current = null;
                renderInitiative();
            }
            card.remove();
            updateSitClockMax();
        }
        
        if (e.target.classList.contains('act-minus') || e.target.classList.contains('act-plus')) {
            const card = e.target.closest('.dash-card');
            const name = card.dataset.name;
            const combatant = combatants.get(name);
            if (combatant) {
                if (e.target.classList.contains('act-minus')) {
                    combatant.actions.current = Math.max(0, combatant.actions.current - 1);
                } else {
                    combatant.actions.current = Math.min(combatant.actions.max, combatant.actions.current + 1);
                }
                card.querySelector('.action-current').textContent = combatant.actions.current;
            }
        }
    });

    // 3. LISTEN FOR GENERATOR EVENT
    PsychroEvents.subscribe('LOAD_SCENE', (sceneString) => {
        uiDashBlueprint.value = sceneString;
        uiBtnDashLoad.click();
    });

// =======================================================================
    // 3.10 THE COMPANION LOGIC (UI Tool)
    // =======================================================================
    const compTabs = document.querySelectorAll('.comp-tab-btn');
    const compContents = document.querySelectorAll('.comp-tab-content');
    const uiCompActions = document.getElementById('comp-actions');
    const uiCompKwList = document.getElementById('ui-comp-kw-list');
    const uiCompKwSearch = document.getElementById('ui-comp-kw-search');

    // Companion Tab Switching
    compTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            compTabs.forEach(t => t.classList.remove('active'));
            compContents.forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });

    // Populate Action Catalog
    if (uiCompActions) {
      const ACTIONS_DATA = {
            "Effect Actions (1 Action)":[
                { name: "Activate", cost: "1 Action", desc: "Roll EV vs Resistance. Apply Keywords for 1 EP each (reduced by Power stat)." },
                { name: "Called Shot", cost: "1 Action", desc: "Activate with Disadvantage. Targets items to reduce Durability, or auto-crits an Entity." },
                { name: "Rush", cost: "1 Action", desc: "Make a free Move Action + an Activate Action. The Activate is made with Disadvantage." },
                { name: "Blitz", cost: "1 Action", desc: "Make TWO Basic Activations (no Active Keywords). Both are made with Disadvantage." },
                { name: "Slam", cost: "1 Action", desc: "Make a Basic Activation with Disadvantage, but add your Chosen Stat to the EV an additional time." }
            ],
            "Move Actions (1 Action)":[
                { name: "Move", cost: "1 Action", desc: "Travel up to a number of range bands equal to your Range stat." },
                { name: "Mount/Dismount", cost: "1 Action", desc: "Interact with a valid target to gain or end the Riding condition." },
                { name: "Hide", cost: "1 Action", desc: "Effort Roll (SR + Level + Stat). The result becomes the TN for enemies to find you." }
            ],
            "Maneuver Actions (1 Action + 1 SP)":[
                { name: "Shove", cost: "1 Action + 1 SP", desc: "EV vs Res. Push target or knock them Prone." },
                { name: "Disarm", cost: "1 Action + 1 SP", desc: "Opposed EV. Force target to drop an item." },
                { name: "Restrain", cost: "1 Action + 1 SP", desc: "EV vs Res. Apply the Bind Tag to target." },
                { name: "Lunge", cost: "1 Action + 1 SP", desc: "Make a melee strike that can target an enemy at Close range instead of Touch." },
                { name: "Lock On", cost: "1 Action + 1 SP", desc: "Gain Advantage on target; target gains Advantage on you." },
                { name: "Taunt", cost: "1 Action + 1 SP", desc: "Opposed EV. Force target to use Lock On against you." },
                { name: "Improvise", cost: "1 Action + 1 SP", desc: "Use environment/item to apply a Status Tag without dealing Value Loss." },
                { name: "Combined Strike", cost: "1 Action + 1 SP", desc: "When Activating, add Level & 1 Keyword from a second equipped item." },
                { name: "Feint", cost: "1 Action + 1 SP", desc: "Opposed EV. Make the target Exposed." }
            ],
            "Setup & Assess (Consumes Full Turn + 1 SP)":[
                { name: "Recharge", cost: "Full Turn + 1 SP", desc: "Restore SP equal to Brawn, OR EP equal to Wit." },
                { name: "Recover", cost: "Full Turn + 1 SP", desc: "Remove Status Tags equal to Brawn, Wit, or Influence." },
                { name: "Ready", cost: "Full Turn + 1 SP", desc: "Add your Wit stat to your Resistance until the start of your next turn." },
                { name: "Advantage", cost: "Full Turn + 1 SP", desc: "Gain Advantage on the first SR you make on your next turn." },
                { name: "Reveal", cost: "Full Turn + 1 SP", desc: "Effort Roll vs a Hidden target's Hide TN to locate them." },
                { name: "Clue", cost: "Full Turn + 1 SP", desc: "Learn facts about a target equal to your Technique." }
            ],
            "Effort & Team Actions (1 Action)":[
                { name: "Effort Roll", cost: "1 Action", desc: "SR + Level + Stat vs Target Number (TN). Depletes Barrier/Puzzle Clocks." },
                { name: "Teamwork", cost: "1 Action", desc: "Grant a stat of your choice as a bonus to an ally's next Effort Roll." },
                { name: "Sabotage", cost: "1 Action", desc: "Target suffers Disadvantage on their next Effort Roll." }
            ],
            "Reactions (Triggered Off-Turn)":[
                { name: "Avoid (Dodge)", cost: "Reaction + 1 SP", desc: "Opposed EV. If higher, negate incoming attack." },
                { name: "Resist (Block)", cost: "Reaction + 1 SP", desc: "Add your Level to Resistance against one hit." },
                { name: "Parry", cost: "Reaction + 3 SP", desc: "Opposed EV. If higher, negate attack AND seize priority (take your turn now)." },
                { name: "Clash", cost: "Reaction + 2 SP", desc: "Intercept attack with your own. Loser takes combined Value Loss." },
                { name: "Reflect", cost: "Reaction + 1 SP", desc: "After successful Avoid/Resist, redirect original effect back at attacker." },
                { name: "Counter", cost: "Reaction + 1 SP", desc: "After successful Avoid/Resist, make an immediate Basic Activate action." },
                { name: "Guard", cost: "Reaction + 1 SP", desc: "Intercept attack meant for adjacent ally. You become the target." },
                { name: "Combo", cost: "Reaction + 1 SP", desc: "Add a stat and one known Keyword to an ally's effect." },
                { name: "Flank", cost: "Reaction + 1 SP", desc: "If ally attacks enemy adjacent to you, enemy has Disadv. on their reaction." }
            ],
            "Misc. Actions (1 Action)":[
                { name: "Reload", cost: "1 Action", desc: "Consume an item/ammo to trigger the Material Keyword." },
                { name: "Assist", cost: "1 Action", desc: "Designate a target. All allies gain Advantage on their next action against it." },
                { name: "Pass", cost: "1 Action", desc: "End turn. If actions remain, move to bottom of initiative. If 0 remain, discard." },
                { name: "Command", cost: "1 Action", desc: "Direct a Companion, Animation, or Mount to act in place of your action." }
            ],
            "Downtime Actions (Meta & Progression)":[
                { name: "Rest", cost: "0/1 Karma", desc: "Restore all Values to Max (0 Karma). OR spend 1 Karma in-situation for 1 HP." },
                { name: "Restore", cost: "1 Karma", desc: "Remove the Injured Condition (Downtime). OR purge Status Tags (Situation)." },
                { name: "Recharge", cost: "1 Karma", desc: "Upgrade gear to your level (Downtime). OR restore EP via Wit (Situation)." },
                { name: "Learn", cost: "1 Karma", desc: "Gain Surprise for next situation (Downtime). OR gain Advantage on next roll (Situation)." },
                { name: "Grow", cost: "Lvl ÷ 2 Karma", desc: "Add a new Innate Keyword (Downtime). OR add a Keyword to an Activate (1 Karma, Situation)." },
                { name: "Create", cost: "1 Karma", desc: "Grant Faction a Keyword (Downtime). OR manifest temporary item equal to level (Situation)." },
                { name: "Inspire", cost: "1 Karma", desc: "Grant Faction a Civil System (Downtime). OR grant Boost Tags equal to Wit (Situation)." },
                { name: "Mentor", cost: "1 Karma", desc: "Bond with an Animation (Downtime). OR allow Animation free Keyword use (Situation)." },
                { name: "Amplify", cost: "1 Karma", desc: "Create permanent Trap/Effect (Downtime). OR force next roll to be a Critical (Situation)." },
                { name: "Crafting", cost: "Time/SP", desc: "Craft item/effect up to your Level. Reduces max SP by 1 until next Downtime." }
            ]
        };

        let actionHtml = "";
        Object.entries(ACTIONS_DATA).forEach(([cat, acts]) => {
            actionHtml += `<details class="action-cat"><summary>${cat}</summary>`;
            acts.forEach(a => {
                actionHtml += `<div class="action-item"><h4>${a.name}</h4><div class="action-cost">${a.cost}</div><p>${a.desc}</p></div>`;
            });
            actionHtml += `</details>`;
        });
        uiCompActions.innerHTML = actionHtml;
    }

    // Populate Keyword Codex
    if (uiCompKwList && uiCompKwSearch) {
        function renderKeywords(filter = '') {
            uiCompKwList.innerHTML = '';
            const lowerFilter = filter.toLowerCase();
            
            Object.entries(KEYWORDS).forEach(([code, data]) => {
                const colorIndex = parseInt(code.charAt(0));
                const colorObj = COLORS[colorIndex];
                const colorName = colorObj ? colorObj.name : 'Unknown';
                
                // Search by name, code, or color name
                if (data.name.toLowerCase().includes(lowerFilter) || code.includes(filter) || colorName.toLowerCase().includes(lowerFilter)) {
       uiCompKwList.innerHTML += `
                        <li class="comp-kw-card" style="border-left-color: var(--color-${colorName.toLowerCase()})">
                            <div class="comp-kw-header">
                                <span class="comp-kw-name">${data.name} <span style="font-size: 0.8em; color: #888;">[${data.type}]</span></span>
                                <span class="comp-kw-code">${code} (${colorName})</span>
                            </div>
                            <div class="comp-kw-effect" style="font-size: 0.9em; line-height: 1.4; margin-top: 8px;">
                                <div style="margin-bottom: 6px; padding-bottom: 6px; border-bottom: 1px dashed #444;"><strong style="color: var(--color-silver);">Passive:</strong> ${data.passive || data.effect}</div>
                                <div style="margin-bottom: 6px; padding-bottom: 6px; border-bottom: 1px dashed #444;"><strong style="color: var(--color-yellow);">Active:</strong> ${data.active || ''}</div>
                                <div><strong style="color: var(--color-null);">Equipment:</strong> ${data.equipment || ''}</div>
                            </div>
                        </li>
                    `;
                }
            });
        }

        uiCompKwSearch.addEventListener('input', e => renderKeywords(e.target.value));
        renderKeywords(); // Initial render
    }

    // =======================================================================
    // 4. BINDING USER INPUTS TO THE CONTROLLER
    // =======================================================================

    // Load Build String
    uiBtnLoad.addEventListener('click', () => {
        const buildString = uiInputString.value.trim();
        if (buildString) {
            appendToConsole(`Parsing string: ${buildString}`);
            GameController.loadEntity(buildString);
        } else {
            appendToConsole("Error: Please enter a Build String.");
        }
    });

    // Mode Switching (Startup Overrides)
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetMode = e.target.dataset.mode;
            appendToConsole(`Initiating Startup Override: ${targetMode}`);
            GameController.switchMode(targetMode);
        });
    });

    // =======================================================================
    // 5. SUBSCRIBING TO SYSTEM EVENTS (The Reactive Loop)
    // =======================================================================

    PsychroEvents.subscribe('SYSTEM_READY', (state) => {
        appendToConsole("System booted successfully.");
        updateCharacterSheet(state);
    });

    PsychroEvents.subscribe('ENTITY_LOADED', (data) => {
        appendToConsole("DNA parsed successfully. Architecture loaded into memory.");
    });

    PsychroEvents.subscribe('MODE_CHANGED', (state) => {
        appendToConsole(`Scale Filter applied. Current Mode: ${state.currentMode}`);
        updateCharacterSheet(state);
    });

    PsychroEvents.subscribe('ACTION_RESOLVED', (result) => {
        // Output all the logs from the engine/middleware to our UI console
        result.logs.forEach(log => appendToConsole(`[SYS] ${log}`));
        
        // Update the sheet visually to reflect the new state (e.g., changes in HP/Karma)
        updateCharacterSheet(PsychroState.getState());
    });

    PsychroEvents.subscribe('ERROR', (err) => {
        appendToConsole(`<span style="color: red;">ERROR: ${err.message}</span>`);
    });

PsychroEvents.subscribe('PROFILE_GENERATED', (profileString) => {
        appendToConsole(`Profile generated:[${profileString}]. Populating Builder.`);
        
        // Auto-select the dropdown values in the Builder Tab
        document.getElementById('sel-goal').value = profileString[0];
        document.getElementById('sel-method').value = profileString[1];
        document.getElementById('sel-purpose').value = profileString[2];
        document.getElementById('sel-conf1').value = profileString[3];
        document.getElementById('sel-conf2').value = profileString[4];

        // Automatically trigger the compile button to lock the string in
        document.getElementById('ui-btn-compile').click();
    });

    // =======================================================================
    // 6. BOOT THE SYSTEM
    // =======================================================================
    GameController.init();
});