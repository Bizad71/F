const STORAGE_KEY = "english_detective_a1";

let state = loadState();

let currentStory = null;

let currentStep = 1;

let answers = {};

let selectedOrder = [];

/* =========================
STATE
========================= */

function createDefaultState() {

return {

xp: 0,

solved: [],

learnedWords: {},

streak: 0,

lastDate: null,

correct: 0,

wrong: 0

};

}

function loadState() {

try {

const saved =
JSON.parse(
localStorage.getItem(STORAGE_KEY)
);

return {

...createDefaultState(),

...(saved || {})

};

} catch {

return createDefaultState();

}

}

function saveState() {

localStorage.setItem(
STORAGE_KEY,
JSON.stringify(state)
);

}

/* =========================
HELPERS
========================= */

function $`(id) {

return document.getElementById(id);

}

function escapeHTML(text) {

return String(text)
.replaceAll("&", "&")
.replaceAll("<", "<")
.replaceAll(">", ">")
.replaceAll('"', """)
.replaceAll("'", "'");

}

/* =========================
LEVEL
========================= */

function getLevel() {

if (state.xp < 100) {

return {
level: 1,
name: "ROOKIE DETECTIVE",
current: state.xp,
next: 100
};

}

if (state.xp < 250) {

return {
level: 2,
name: "JUNIOR DETECTIVE",
current: state.xp - 100,
next: 150
};

}

if (state.xp < 450) {

return {
level: 3,
name: "SMART DETECTIVE",
current: state.xp - 250,
next: 200
};

}

if (state.xp < 700) {

return {
level: 4,
name: "CASE SOLVER",
current: state.xp - 450,
next: 250
};

}

if (state.xp < 1000) {

return {
level: 5,
name: "MASTER DETECTIVE",
current: state.xp - 700,
next: 300
};

}

return {

level: 6,

name: "ENGLISH DETECTIVE",

current: state.xp - 1000,

next: 500

};

}

/* =========================
DASHBOARD
========================= */

function updateDashboard() {

const level = getLevel();

`$("headerXP").textContent =
state.xp;

$`("statXP").textContent =
state.xp;

$("statCases").textContent ={STORIES.length}`;

$`("statWords").textContent =
Object.keys(state.learnedWords).length;

`$("statStreak").textContent =
state.streak;

{level.level}`;

$`("playerRank").textContent =
level.name;

const percent =
Math.min(
100,
(level.current / level.next) * 100
);

$("headerXPBar").style.width =${percent}%;

}

/* =========================
HOME
========================= */

function renderHome() {

`$("homeScreen")
.classList.remove("hidden");

$`("gameScreen")
.classList.add("hidden");

updateDashboard();

renderCases();

renderVocabulary();

}

/* =========================
CASES
========================= */

function renderCases() {

const container =
`$("casesGrid");

container.innerHTML = "";

STORIES.forEach((story, index) => {

const solved =
state.solved.includes(story.id);

const unlocked =
index === 0 ||
state.solved.includes(
STORIES[index - 1].id
);

const card =
document.createElement("div");

card.className =
"case-card" +
(!unlocked ? " locked" : "") +
(solved ? " solved" : "");

if (unlocked) {

card.onclick =
() => openStory(story.id);

}

card.innerHTML = `

<div class="case-number">
CASE $`{String(story.id).padStart(3, "0")}
</div>

<div class="case-icon">
`${story.icon}
</div>

<h3>
$`{escapeHTML(story.title)}
</h3>

<p>
`${escapeHTML(story.description)}
</p>

<div class="case-bottom">

<span class="case-xp">
A1 • $`{story.xp} XP
</span>

<span class="case-status">

`${
solved
? "✓ SOLVED"
: unlocked
? "▶ OPEN CASE"
: "🔒 LOCKED"
}

</span>

</div>

`;

container.appendChild(card);

});

}

/* =========================
VOCABULARY
========================= */

function renderVocabulary() {

const container =
$`("wordTags");

const words =
Object.entries(
state.learnedWords
);

$("wordCountLabel").textContent =${words.length} WORDS;

if (!words.length) {

container.innerHTML = `

<p class="empty-vocabulary">
Click words inside stories to save them here.
</p>

`;

return;

}

container.innerHTML =
words.map(
([word, meaning]) => `

<span class="word-tag">

${escapeHTML(word)} — ${escapeHTML(meaning)}

</span>

`
).join("");

}

/* =========================
OPEN STORY
========================= */

function openStory(id) {

const story =
STORIES.find(
item => item.id === id
);

if (!story) return;

const index =
STORIES.indexOf(story);

if (
index > 0 &&
!state.solved.includes(
STORIES[index - 1].id
)
) {

showToast(
"Solve the previous case first."
);

return;

}

currentStory = story;

currentStep = 1;

answers = {};

selectedOrder = [];

`$("homeScreen")
.classList.add("hidden");

$`("gameScreen")
.classList.remove("hidden");

renderGame();

window.scrollTo({
top: 0,
behavior: "smooth"
});

}

/* =========================
GAME
========================= */

function renderGame() {

`$("gameCaseName").textContent =
currentStory.title.toUpperCase();

{currentStep} / 4`
: "CASE COMPLETE";

{Math.min(
100,
(currentStep / 4) * 100
)}%`;

if (currentStep === 1) {

renderStory();

}

else if (currentStep === 2) {

renderQuestions();

}

else if (currentStep === 3) {

renderOrderPuzzle();

}

else if (currentStep === 4) {

renderCodePuzzle();

}

else {

renderResult();

}

}

/* =========================
CLICKABLE WORDS
========================= */

function makeClickableText(text) {

return text
.split(/(\s+)/)
.map(part => {

const clean =
part
.replace(/[^A-Za-z'-]/g, "")
.toLowerCase();

if (
clean &&
currentStory.vocabulary[clean]
) {

return `

<span
class="story-word"
onclick="showWord(
event,
'{escapeHTML(part)}
</span>

`;

}

return escapeHTML(part);

})
.join("");

}

/* =========================
STORY PAGE
========================= */

function renderStory() {

$("gameContent").innerHTML =

<div class="story-card">

<div class="story-header">

<div>

<div class="story-number">

CASE
`${String(
currentStory.id
).padStart(3, "0")}

</div>

<h1>

$`{currentStory.icon}

`${escapeHTML(
currentStory.title
)}

</h1>

</div>

<span class="level-badge">
A1 LEVEL
</span>

</div>

<div class="story-text">

${currentStory.story .map( line =&gt;

<div class="story-line">

`${makeClickableText(line)}

</div>

`
)
.join("")}

</div>

</div>

<div class="clue">

<strong>CLUE:</strong>

$`{escapeHTML(
currentStory.clue
)}

</div>

<div class="puzzle-card">

<div class="puzzle-label">
INVESTIGATION
</div>

<h2>
Read carefully.
</h2>

<p class="puzzle-description">

Click the blue-underlined words
to see their Persian meaning.
Try to understand the whole story.

</p>

<div class="actions">

<button
class="primary-button"
onclick="nextStep()"
>
I UNDERSTAND →
</button>

</div>

</div>

`;

}

/* =========================
WORD POPUP
========================= */

function showWord(event, word) {

event.stopPropagation();

const popup =
`$("wordPopup");

const meaning =
currentStory.vocabulary[word];

popup.innerHTML = `

<strong>
$`{escapeHTML(word)}
</strong>

<p>
`${escapeHTML(meaning)}
</p>

<small>
Click this box to save the word.
</small>

`;

popup.classList.add("show");

const x =
Math.min(
event.clientX,
window.innerWidth - 220
);

const y =
Math.min(
event.clientY + 12,
window.innerHeight - 120
);

popup.style.left =
${Math.max(10, x)}px`;

popup.style.top =
``${Math.max(10, y)}px`;

popup.onclick = function () {

state.learnedWords[word] =
meaning;

saveState();

popup.classList.remove("show");

renderVocabulary();

updateDashboard();

showToast(
Saved: ${word}`
);

};

}

document.addEventListener(
"click",
function () {

`$("wordPopup")
.classList.remove("show");

}
);

/* =========================
QUESTIONS
========================= */

function renderQuestions() {

$("gameContent").innerHTML =

<div class="puzzle-card">

<div class="puzzle-label">
PUZZLE 01 — UNDERSTANDING
</div>

<h2>
What did you read?
</h2>

<p class="puzzle-description">

Choose the correct answer
from the story.

</p>

${currentStory.questions .map( (question, index) =&gt;

<div class="question">

<div class="question-title">

<b>
$`{index + 1}.
</b>

`${escapeHTML(
question.q
)}

</div>

<div class="options">

${question.options .map( (option, optionIndex) =&gt;

<button
class="option ${ answers[index] === optionIndex ? "selected" : "" }" id="q${index}_${optionIndex}" onclick=" selectAnswer( ${index},
`${optionIndex}
)
"
>

$`{String.fromCharCode(
65 + optionIndex
)}.

`${escapeHTML(option)}

</button>

`
)
.join("")}

</div>

<div
id="feedback$`{index}"
class="feedback"
></div>

</div>

`
)
.join("")}

<div class="actions">

<button
class="back-button"
onclick="previousStep()"
>
← STORY
</button>

<button
class="primary-button"
onclick="checkQuestions()"
>
CHECK ANSWERS
</button>

</div>

</div>

`;

}

/* =========================
SELECT ANSWER
========================= */

function selectAnswer(
questionIndex,
optionIndex
) {

answers[questionIndex] =
optionIndex;

document
.querySelectorAll(
[id^="q${questionIndex}_"]`
)
.forEach(button => {

button.classList.remove(
"selected"
);

});

const button =
{questionIndex}_${optionIndex}
);

if (button) {

button.classList.add(
"selected"
);

}

}

/* =========================
CHECK QUESTIONS
========================= */

function checkQuestions() {

if (
Object.keys(answers).length !==
currentStory.questions.length
) {

showToast(
"Answer all questions first."
);

return;

}

let score = 0;

currentStory.questions.forEach(
(question, index) => {

const selected =
answers[index];

const correct =
question.answer;

document
.querySelectorAll(
[id^="q${index}_"]`
)
.forEach(
button => {

button.disabled = true;

}
);

if (selected === correct) {

score++;

state.correct++;

{index}_${correct}
)
.classList.add(
"correct"
);

const feedback =
$(feedback${index}
);

feedback.className =
"feedback show good";

feedback.textContent =
"✓ " +
question.explain;

}

else {

state.wrong++;

$(qlatex
{index}_

{selected}`
)
.classList.add(
"wrong"
);

{index}_${correct}
)
.classList.add(
"correct"
);

const feedback =
$(feedback${index}
);

feedback.className =
"feedback show bad";

feedback.textContent =
"✗ " +
question.explain;

}

}
);

addXP(score * 10);

saveState();

setTimeout(
() => {

currentStep = 3;

renderGame();

window.scrollTo({
top: 0,
behavior: "smooth"
});

},

900
);

}

/* =========================
ORDER PUZZLE
========================= */

function renderOrderPuzzle() {

const shuffled =
[...currentStory.order]
.sort(
() => Math.random() - 0.5
);

selectedOrder = [];

$("gameContent").innerHTML =

<div class="puzzle-card">

<div class="puzzle-label">
PUZZLE 02 — TIMELINE
</div>

<h2>
Put the story in order.
</h2>

<p class="puzzle-description">

Click the sentences in the order
they happen in the story.

</p>

<div class="order-list">

${shuffled .map( sentence =&gt;

<div
class="order-item"
data-text="`${escapeHTML(
sentence
)}"
onclick="selectOrder(this)"
>

$`{escapeHTML(
sentence
)}

</div>

`
)
.join("")}

</div>

<div
id="selectedOrder"
class="selected-list"
>
Selected: —
</div>

<div class="actions">

<button
class="back-button"
onclick="previousStep()"
>
← QUESTIONS
</button>

<button
class="primary-button"
onclick="checkOrder()"
>
CHECK ORDER
</button>

</div>

</div>

`;

}

/* =========================
SELECT ORDER
========================= */

function selectOrder(element) {

if (
element.classList.contains(
"selected"
)
) {

return;

}

element.classList.add(
"selected"
);

selectedOrder.push(
element.dataset.text
);

updateSelectedOrder();

}

/* =========================
UPDATE ORDER
========================= */

function updateSelectedOrder() {

`$("selectedOrder").innerHTML =

"<b>Selected:</b><br>" +

selectedOrder
.map(
(text, index) =>

${index + 1}. ${ escapeHTML(text) }
)
.join("<br>");

}

/* =========================
CHECK ORDER
========================= */

function checkOrder() {

if (
selectedOrder.length !==
currentStory.order.length
) {

showToast(
"Select all five events."
);

return;

}

const correct =
JSON.stringify(
selectedOrder
) ===
JSON.stringify(
currentStory.order
);

if (correct) {

state.correct++;

addXP(30);

saveState();

document
.querySelectorAll(
".order-item"
)
.forEach(
element => {

element.classList.add(
"correct"
);

}
);

showToast("+30 XP");

setTimeout(
() => {

currentStep = 4;

renderGame();

window.scrollTo({
top: 0,
behavior: "smooth"
});

},

800
);

}

else {

state.wrong++;

saveState();

selectedOrder = [];

document
.querySelectorAll(
".order-item"
)
.forEach(
element => {

element.classList.remove(
"selected"
);

}
);

$`("selectedOrder")
.textContent =
"Selected: —";

showToast(
"Wrong order. Try again."
);

}

}

/* =========================
CODE PUZZLE
========================= */

function renderCodePuzzle() {

$("gameContent").innerHTML =

<div class="puzzle-card">

<div class="puzzle-label">
FINAL PUZZLE — SECRET CODE
</div>

<h2>
Unlock the case.
</h2>

<p class="puzzle-description">

Enter the three-digit secret code.

The code comes from the positions
of the correct answers.

</p>

<div class="clue">

<strong>CODE RULE:</strong>

A = 0,
B = 1,
C = 2,
D = 3.

</div>

<div class="code-box">

<input
id="code0"
class="code-input"
maxlength="1"
inputmode="numeric"
>

<input
id="code1"
class="code-input"
maxlength="1"
inputmode="numeric"
>

<input
id="code2"
class="code-input"
maxlength="1"
inputmode="numeric"
>

</div>

<div
id="codeFeedback"
style="
margin-top:12px;
font-size:10px;
"
></div>

<div class="actions">

<button
class="back-button"
onclick="previousStep()"
>
← TIMELINE
</button>

<button
class="primary-button"
onclick="checkCode()"
>
UNLOCK CASE
</button>

</div>

</div>

`;

["code0", "code1", "code2"]
.forEach(
(id, index) => {

$`(id).addEventListener(
"input",
event => {

event.target.value =
event.target.value
.replace(/\D/g, "");

if (
event.target.value &&
index < 2
) {

$(code${index + 1}
).focus();

}

}
);

}
);

`$("code0").focus();

}

/* =========================
CHECK CODE
========================= */

function checkCode() {

const code =
["code0", "code1", "code2"]
.map(
id => $`(id).value
)
.join("");

const correctCode =
currentStory.questions
.map(
question =>
question.answer
)
.join("");

const feedback =
`$("codeFeedback");

if (code === correctCode) {

feedback.textContent =
"✓ ACCESS GRANTED";

feedback.style.color =
"#86efac";

setTimeout(
completeCase,
600
);

}

else {

feedback.textContent =
"✗ Wrong code. Check the three answers again.";

feedback.style.color =
"#fca5a5";

state.wrong++;

saveState();

}

}

/* =========================
COMPLETE CASE
========================= */

function completeCase() {

if (
!state.solved.includes(
currentStory.id
)
) {

state.solved.push(
currentStory.id
);

addXP(
currentStory.xp
);

updateStreak();

saveState();

}

currentStep = 5;

renderGame();

}

/* =========================
RESULT
========================= */

function renderResult() {

const allSolved =
state.solved.length ===
STORIES.length;

$("gameContent").innerHTML =

<div class="result-card">

<div class="result-icon">
🏆
</div>

<h2>
CASE SOLVED
</h2>

<p>

You read the story,
found the clues
and solved the mystery.

</p>

<div class="reward">

+`${currentStory.xp} XP

</div>

<p>

$`{
allSolved

? "All five A1 cases are solved!"

: "The next case is now unlocked."

}

</p>

<div
class="actions"
style="justify-content:center"
>

<button
class="back-button"
onclick="goHome()"
>
CASE FILES
</button>

`${
!allSolved

? `

<button
class="primary-button"
onclick="openNextCase()"
>
NEXT CASE →
</button>

`

: ""

}

</div>

</div>

`;

}

/* =========================
NEXT CASE
========================= */

function openNextCase() {

const next =
STORIES.find(
story =>
!state.solved.includes(
story.id
)
);

if (next) {

openStory(next.id);

}

}

/* =========================
NAVIGATION
========================= */

function nextStep() {

currentStep++;

renderGame();

window.scrollTo({
top: 0,
behavior: "smooth"
});

}

function previousStep() {

currentStep =
Math.max(
1,
currentStep - 1
);

renderGame();

window.scrollTo({
top: 0,
behavior: "smooth"
});

}

function goHome() {

currentStory = null;

$`("gameScreen")
.classList.add("hidden");

`$("homeScreen")
.classList.remove("hidden");

renderHome();

window.scrollTo({
top: 0,
behavior: "smooth"
});

}

/* =========================
XP
========================= */

function addXP(amount) {

state.xp += amount;

saveState();

updateDashboard();

}

/* =========================
STREAK
========================= */

function updateStreak() {

const today =
new Date()
.toISOString()
.slice(0, 10);

if (!state.lastDate) {

state.streak = 1;

state.lastDate = today;

saveState();

return;

}

if (
state.lastDate === today
) {

return;

}

const difference =
Math.floor(
(
new Date(today) -
new Date(state.lastDate)
) /
86400000
);

if (difference === 1) {

state.streak++;

}

else {

state.streak = 1;

}

state.lastDate = today;

saveState();

}

/* =========================
SETTINGS
========================= */

function openSettings() {

$`("settingsModal")
.classList.add("show");

}

function closeSettings() {

`$("settingsModal")
.classList.remove("show");

}

function confirmReset() {

closeSettings();

$`("resetModal")
.classList.add("show");

}

function closeReset() {

`$("resetModal")
.classList.remove("show");

}

function resetAll() {

localStorage.removeItem(
STORAGE_KEY
);

state =
createDefaultState();

closeReset();

goHome();

showToast(
"Progress reset."
);

}

/* =========================
TOAST
========================= */

function showToast(message) {

const toast =
$("toast");

toast.textContent =
message;

toast.classList.add(
"show"
);

clearTimeout(
window.toastTimer
);

window.toastTimer =
setTimeout(
() => {

toast.classList.remove(
"show"
);

},

2200
);

}

/* =========================
START
========================= */

document.addEventListener(
"DOMContentLoaded",
() => {

updateStreak();

renderHome();

}
);