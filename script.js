const terminal = document.getElementById("terminal");

const lines = [
    "[SYSTEM] Initializing...",
    "[NETWORK] Connection established",
    "[SECURITY] Checking system...",
    "[ACCESS] Processing...",
    "[SYSTEM] ████████████████████ 100%",
    "[WARNING] Unknown activity detected..."
];

let index = 0;

function terminalText() {
    if (index >= lines.length) return;

    terminal.innerHTML += lines[index] + "<br>";
    index++;

    setTimeout(terminalText, 600);
}

terminalText();


/* =========================================
   صدای مصنوعی
========================================= */

function playVoice() {

    if (!("speechSynthesis" in window)) {
        return;
    }

    speechSynthesis.cancel();

    const voice1 = new SpeechSynthesisUtterance("تلسیدی");
    voice1.lang = "fa-IR";
    voice1.rate = 0.72;
    voice1.pitch = 0.55;
    voice1.volume = 1;

    const voice2 = new SpeechSynthesisUtterance("نتلس مقشی بود");
    voice2.lang = "fa-IR";
    voice2.rate = 0.62;
    voice2.pitch = 0.5;
    voice2.volume = 1;

    voice1.onend = function () {

        setTimeout(() => {
            speechSynthesis.speak(voice2);
        }, 700);

    };

    speechSynthesis.speak(voice1);
}


/* =========================================
   تلاش برای پخش صدا
========================================= */

window.addEventListener("load", () => {

    setTimeout(() => {
        playVoice();
    }, 1200);

});


/* =========================================
   اگر مرورگر اجازه پخش خودکار نداد،
   با اولین لمس/کلیک صدا اجرا می‌شود
========================================= */

document.addEventListener("click", () => {
    playVoice();
}, { once: true });

document.addEventListener("touchstart", () => {
    playVoice();
}, { once: true });const timer = setInterval(update, 180);
