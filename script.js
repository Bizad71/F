/* =========================================
   FULLSCREEN
========================================= */

function enterFullscreen() {

    const element =
        document.documentElement;

    try {

        if (element.requestFullscreen) {

            element.requestFullscreen({
                navigationUI: "hide"
            });

        }

        else if (
            element.webkitRequestFullscreen
        ) {

            element.webkitRequestFullscreen();

        }

        else if (
            element.msRequestFullscreen
        ) {

            element.msRequestFullscreen();

        }

    } catch (error) {}

}


/* =========================================
   تلاش برای مخفی کردن نوارهای مرورگر
========================================= */

function activateFullscreen() {

    enterFullscreen();

    if (
        screen.orientation &&
        screen.orientation.lock
    ) {

        screen.orientation
            .lock("portrait")
            .catch(() => {});

    }

}


/* =========================================
   فعال شدن با اولین لمس
========================================= */

document.addEventListener(
    "touchstart",
    activateFullscreen,
    { once: true }
);

document.addEventListener(
    "click",
    activateFullscreen,
    { once: true }
);


/* =========================================
   جلوگیری نسبی از Back
========================================= */

history.pushState(
    null,
    "",
    location.href
);

window.addEventListener(
    "popstate",
    function () {

        history.pushState(
            null,
            "",
            location.href
        );

    }
);


/* =========================================
   AUDIO ENGINE
========================================= */

let audioContext = null;


function createAudio() {

    try {

        if (!audioContext) {

            audioContext =
                new (
                    window.AudioContext ||
                    window.webkitAudioContext
                )();

        }

        if (
            audioContext.state ===
            "suspended"
        ) {

            audioContext.resume();

        }

    } catch (error) {}

}


/* =========================================
   DIGITAL SOUND
========================================= */

function beep(
    frequency = 500,
    duration = 80
) {

    try {

        createAudio();

        if (!audioContext) {
            return;
        }


        const oscillator =
            audioContext
                .createOscillator();


        const gain =
            audioContext
                .createGain();


        oscillator.type =
            "sawtooth";


        oscillator.frequency.setValueAtTime(
            frequency,
            audioContext.currentTime
        );


        gain.gain.setValueAtTime(
            0.001,
            audioContext.currentTime
        );


        gain.gain.exponentialRampToValueAtTime(
            0.08,
            audioContext.currentTime + 0.02
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

    } catch (error) {}

}


/* =========================================
   STARTUP SOUND
========================================= */

function startupSound() {

    createAudio();

    beep(180, 150);

    setTimeout(
        () => beep(260, 120),
        170
    );

    setTimeout(
        () => beep(420, 100),
        320
    );

}


/* =========================================
   FINAL VOICE
========================================= */

function finalVoice() {

    if (
        !("speechSynthesis" in window)
    ) {

        return;

    }


    speechSynthesis.cancel();


    const voice =
        new SpeechSynthesisUtterance(
            "نتلس مقشی بود"
        );


    voice.lang =
        "fa-IR";


    voice.rate =
        0.65;


    voice.pitch =
        0.45;


    voice.volume =
        1;


    speechSynthesis.speak(
        voice
    );

}


/* =========================================
   DEVICE INFORMATION
========================================= */

const ua =
    navigator.userAgent;


let deviceName =
    "Unknown Device";


if (/SM-/i.test(ua)) {

    deviceName =
        "Samsung Device";

}

else if (/Redmi/i.test(ua)) {

    deviceName =
        "Xiaomi Redmi";

}

else if (/Mi /i.test(ua)) {

    deviceName =
        "Xiaomi";

}

else if (/iPhone/i.test(ua)) {

    deviceName =
        "Apple iPhone";

}

else if (/Android/i.test(ua)) {

    deviceName =
        "Android Device";

}


document
    .getElementById("device")
    .textContent =
    deviceName;


/* =========================================
   ANDROID
========================================= */

const androidMatch =
    ua.match(
        /Android\s([0-9.]+)/i
    );


document
    .getElementById("android")
    .textContent =
    androidMatch
        ? "Android " +
          androidMatch[1]
        : "Android";


/* =========================================
   CPU
========================================= */

document
    .getElementById("processor")
    .textContent =
    navigator.hardwareConcurrency
        ? navigator.hardwareConcurrency +
          " Cores"
        : "Unknown";


/* =========================================
   RAM
========================================= */

document
    .getElementById("ram")
    .textContent =
    navigator.deviceMemory
        ? navigator.deviceMemory +
          " GB"
        : "Protected";


/* =========================================
   STORAGE
========================================= */

if (
    navigator.storage &&
    navigator.storage.estimate
) {

    navigator.storage
        .estimate()
        .then(data => {

            if (data.quota) {

                const gb =
                    data.quota /
                    1024 /
                    1024 /
                    1024;


                document
                    .getElementById(
                        "storage"
                    )
                    .textContent =
                    "~" +
                    gb.toFixed(1) +
                    " GB";

            }

        });

}


/* =========================================
   BATTERY
========================================= */

if (navigator.getBattery) {

    navigator
        .getBattery()
        .then(battery => {


            function updateBattery() {

                document
                    .getElementById(
                        "battery"
                    )
                    .textContent =
                    Math.round(
                        battery.level *
                        100
                    ) + "%";

            }


            updateBattery();


            battery.addEventListener(
                "levelchange",
                updateBattery
            );

        });

}

else {

    document
        .getElementById(
            "battery"
        )
        .textContent =
        "Protected";

}


/* =========================================
   SCAN TEXT
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


/* =========================================
   TERMINAL
========================================= */

const terminal =
    document.getElementById(
        "terminal"
    );


const terminalMessages = [

    "[SYSTEM] Initializing...",

    "[DEVICE] Reading hardware...",

    "[RAM] Memory analysis started...",

    "[STORAGE] Checking storage...",

    "[NETWORK] Interface detected...",

    "[SCAN] Analyzing information...",

    "[SYSTEM] Processing data..."

];


let terminalIndex = 0;


function terminalLine() {

    terminal.innerHTML +=
        terminalMessages[
            terminalIndex
        ] + "<br>";


    terminalIndex++;


    if (
        terminalIndex >=
        terminalMessages.length
    ) {

        terminalIndex = 0;

    }


    const lines =
        terminal.innerHTML
            .split("<br>");


    if (
        lines.length > 6
    ) {

        terminal.innerHTML =
            lines
                .slice(-6)
                .join("<br>");

    }

}


setInterval(
    terminalLine,
    650
);


/* =========================================
   SCAN
========================================= */

const percent =
    document.getElementById(
        "percent"
    );


const bar =
    document.getElementById(
        "bar"
    );


const phase =
    document.getElementById(
        "phase"
    );


const scanText =
    document.getElementById(
        "scanText"
    );


const finalScreen =
    document.getElementById(
        "final"
    );


let current =
    0;


const duration =
    15000;


const startTime =
    Date.now();


let lastBeep =
    -1;


function scan() {

    const elapsed =
        Date.now() -
        startTime;


    current =
        Math.min(
            100,
            Math.floor(
                elapsed /
                duration *
                100
            )
        );


    percent.textContent =
        current;


    bar.style.width =
        current + "%";


    const messageIndex =
        Math.min(
            scanMessages.length - 1,

            Math.floor(
                current /
                (
                    100 /
                    scanMessages.length
                )
            )
        );


    scanText.textContent =
        scanMessages[
            messageIndex
        ];


    phase.textContent =
        current < 100
            ? "SCANNING..."
            : "COMPLETE";


    /* صدا هنگام بالا رفتن درصد */

    if (
        current % 5 === 0 &&
        current !== lastBeep
    ) {

        lastBeep =
            current;


        beep(
            300 +
            current * 5,
            45
        );

    }


    if (
        current < 100
    ) {

        requestAnimationFrame(
            scan
        );

    }

    else {

        setTimeout(
            finish,
            1000
        );

    }

}


/* =========================================
   FINISH
========================================= */

function finish() {

    phase.textContent =
        "SCAN COMPLETE";


    scanText.textContent =
        "Analysis finished.";


    beep(
        800,
        120
    );


    setTimeout(
        () => {

            beep(
                1100,
                160
            );

        },
        160
    );


    setTimeout(
        () => {

            finalScreen
                .classList
                .add("show");


            finalVoice();

        },
        700
    );

}


/* =========================================
   START
========================================= */

setTimeout(
    () => {

        startupSound();

        scan();

    },
    300
);


/* =========================================
   اگر مرورگر اجازه صدا نداد،
   اولین لمس آن را فعال می‌کند
========================================= */

document.addEventListener(
    "touchstart",
    () => {

        createAudio();

        enterFullscreen();

    },
    { once: true }
);


document.addEventListener(
    "click",
    () => {

        createAudio();

        enterFullscreen();

    },
    { once: true }
);
