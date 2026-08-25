const percent = document.getElementById("percent");
const bar = document.getElementById("bar");

const phase = document.getElementById("phase");
const scanText = document.getElementById("scanText");

const terminal = document.getElementById("terminal");

const finalScreen = document.getElementById("final");


/* =========================================
   اطلاعات واقعی قابل دسترسی مرورگر
========================================= */

const ua = navigator.userAgent;

let deviceName = "Unknown Device";

if (/SM-M325FV/i.test(ua)) {
    deviceName = "Samsung Galaxy";
} else if (/SM-/i.test(ua)) {
    deviceName = "Samsung Device";
} else if (/Redmi/i.test(ua)) {
    deviceName = "Xiaomi Redmi";
} else if (/Mi /i.test(ua)) {
    deviceName = "Xiaomi";
} else if (/iPhone/i.test(ua)) {
    deviceName = "Apple iPhone";
} else if (/Android/i.test(ua)) {
    deviceName = "Android Device";
}


let androidVersion = "Android";

const androidMatch = ua.match(/Android\s([0-9.]+)/i);

if (androidMatch) {
    androidVersion = "Android " + androidMatch[1];
}


let processor = "Unknown";

if (navigator.hardwareConcurrency) {
    processor = navigator.hardwareConcurrency + " Cores";
}


let ram = "Unknown";

if (navigator.deviceMemory) {
    ram = navigator.deviceMemory + " GB";
}


let storage = "Unknown";

if (navigator.storage && navigator.storage.estimate) {

    navigator.storage.estimate().then(data => {

        if (data.quota) {

            const gb =
                data.quota / 1024 / 1024 / 1024;

            storage = "~" + gb.toFixed(1) + " GB";

            document.getElementById("storage").textContent =
                storage;
        }

    });

}


document.getElementById("device").textContent =
    deviceName;

document.getElementById("android").textContent =
    androidVersion;

document.getElementById("processor").textContent =
    processor;

document.getElementById("ram").textContent =
    ram;

document.getElementById("storage").textContent =
    storage;


/* =========================================
   باتری
========================================= */

if (navigator.getBattery) {

    navigator.getBattery().then(battery => {

        function updateBattery() {

            const level =
                Math.round(battery.level * 100);

            document.getElementById("battery").textContent =
                level + "%";
        }

        updateBattery();

        battery.addEventListener(
            "levelchange",
            updateBattery
        );

    });

} else {

    document.getElementById("battery").textContent =
        "Protected";

}


/* =========================================
   متن‌های اسکن
========================================= */

const scanMessages = [

    "Initializing device scan...",
    "Reading device information...",
    "Analyzing system configuration...",
    "Checking processor...",
    "Checking memory...",
    "Analyzing storage...",
    "Checking system files...",
    "Scanning applications...",
    "Analyzing network configuration...",
    "Processing device data...",
    "Finalizing scan..."

];



const terminalMessages = [

    "[SYSTEM] Initializing...",
    "[DEVICE] Reading hardware...",
    "[RAM] Memory analysis started...",
    "[STORAGE] Checking storage...",
    "[NETWORK] Interface detected...",
    "[SYSTEM] Processing data...",
    "[SCAN] Analyzing information...",
    "[SCAN] ████████████████████"
];


/* =========================================
   ترمینال
========================================= */

let terminalIndex = 0;

function addTerminalLine() {

    if (terminalIndex >= terminalMessages.length) {
        terminalIndex = 0;
    }

    terminal.innerHTML +=
        terminalMessages[terminalIndex] + "<br>";

    terminalIndex++;

    if (terminal.children.length > 5) {
        terminal.removeChild(
            terminal.firstChild
        );
    }
}


/* =========================================
   صدا
========================================= */

let audioContext = null;


/*
   چند بوق دیجیتال برای اینکه
   صفحه کاملاً بی‌صدا نباشد
*/

function beep(
    frequency = 500,
    duration = 80
) {

    try {

        if (!audioContext) {

            audioContext =
                new (
                    window.AudioContext ||
                    window.webkitAudioContext
                )();

        }

        const oscillator =
            audioContext.createOscillator();

        const gain =
            audioContext.createGain();

        oscillator.type = "sine";

        oscillator.frequency.value =
            frequency;

        gain.gain.setValueAtTime(
            0.06,
            audioContext.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            audioContext.currentTime +
            duration / 1000
        );

        oscillator.connect(gain);

        gain.connect(
            audioContext.destination
        );

        oscillator.start();

        oscillator.stop(
            audioContext.currentTime +
            duration / 1000
        );

    } catch (e) {}

}


/* =========================================
   صدای جمله پایانی
========================================= */

function finalVoice() {

    if (!("speechSynthesis" in window)) {
        return;
    }

    speechSynthesis.cancel();

    const voice =
        new SpeechSynthesisUtterance(
            "نتلس مقشی بود"
        );

    voice.lang = "fa-IR";

    voice.rate = 0.65;

    voice.pitch = 0.45;

    voice.volume = 1;

    speechSynthesis.speak(voice);
}


/* =========================================
   شروع اسکن
========================================= */

let current = 0;

const duration = 16000;

const startTime = Date.now();


function scan() {

    const elapsed =
        Date.now() - startTime;

    current =
        Math.min(
            100,
            Math.floor(
                (elapsed / duration) * 100
            )
        );


    percent.textContent = current;

    bar.style.width =
        current + "%";


    /* تغییر متن */

    const messageIndex =
        Math.min(
            scanMessages.length - 1,
            Math.floor(
                current /
                (100 / scanMessages.length)
            )
        );

    scanText.textContent =
        scanMessages[messageIndex];


    phase.textContent =
        current < 100
            ? "SCANNING..."
            : "COMPLETE";


    /* بوق‌های اسکن */

    if (current % 7 === 0) {
        beep(
            400 + current * 4,
            45
        );
    }


    requestAnimationFrame(scan);


    /* پایان */

    if (current >= 100) {

        setTimeout(finish, 1000);

        return;
    }

}


function finish() {

    phase.textContent =
        "SCAN COMPLETE";

    scanText.textContent =
        "Analysis finished.";


    beep(800, 120);

    setTimeout(() => {

        beep(1100, 150);

    }, 150);


    setTimeout(() => {

        finalScreen.classList.add("show");

        finalVoice();

    }, 700);

}


/* =========================================
   اجرای اسکن
========================================= */

terminal.innerHTML = "";

setInterval(addTerminalLine, 900);

setTimeout(() => {

    beep(700, 100);

    scan();

}, 800);


/* =========================================
   فعال‌سازی صدا با اولین لمس
   برای محدودیت autoplay موبایل
========================================= */

function activateSound() {

    try {

        if (!audioContext) {

            audioContext =
                new (
                    window.AudioContext ||
                    window.webkitAudioContext
                )();

        }

        if (audioContext.state === "suspended") {
            audioContext.resume();
        }

        beep(700, 60);

    } catch (e) {}

}


document.addEventListener(
    "touchstart",
    activateSound,
    { once: true }
);

document.addEventListener(
    "click",
    activateSound,
    { once: true }
);
