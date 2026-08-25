/* =========================================
   FULLSCREEN
========================================= */

function enterFullscreen() {

    const el =
        document.documentElement;

    try {

        if (el.requestFullscreen) {

            el.requestFullscreen({
                navigationUI: "hide"
            });

        }

        else if (
            el.webkitRequestFullscreen
        ) {

            el.webkitRequestFullscreen();

        }

    } catch (e) {}

}


/* =========================================
   BACK
========================================= */

history.pushState(
    null,
    "",
    location.href
);

window.addEventListener(
    "popstate",
    () => {

        history.pushState(
            null,
            "",
            location.href
        );

    }
);


/* =========================================
   AUDIO
========================================= */

let audioContext = null;


function audioStart() {

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

    } catch (e) {}

}


function beep(
    frequency,
    duration
) {

    try {

        audioStart();

        const osc =
            audioContext.createOscillator();

        const gain =
            audioContext.createGain();


        osc.type =
            "sawtooth";


        osc.frequency.value =
            frequency;


        gain.gain.setValueAtTime(
            0.001,
            audioContext.currentTime
        );


        gain.gain.exponentialRampToValueAtTime(
            0.07,
            audioContext.currentTime + 0.02
        );


        gain.gain.exponentialRampToValueAtTime(
            0.001,
            audioContext.currentTime +
            duration / 1000
        );


        osc.connect(gain);

        gain.connect(
            audioContext.destination
        );


        osc.start();

        osc.stop(
            audioContext.currentTime +
            duration / 1000
        );

    } catch (e) {}

}


/* =========================================
   START SOUND
========================================= */

function startSound() {

    beep(180, 130);

    setTimeout(
        () => beep(260, 110),
        160
    );

    setTimeout(
        () => beep(390, 90),
        300
    );

}


/* =========================================
   FINAL VOICE
========================================= */

function finalVoice() {

    if (
        !("speechSynthesis" in window)
    ) return;


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
   DEVICE INFO
========================================= */

const ua =
    navigator.userAgent;


let device =
    "Unknown Device";


if (/SM-/i.test(ua))
    device =
        "Samsung Device";

else if (/Redmi/i.test(ua))
    device =
        "Xiaomi Redmi";

else if (/Mi /i.test(ua))
    device =
        "Xiaomi";

else if (/iPhone/i.test(ua))
    device =
        "Apple iPhone";

else if (/Android/i.test(ua))
    device =
        "Android Device";


document
    .getElementById("device")
    .textContent =
    device;


/* Android */

const android =
    ua.match(
        /Android\s([0-9.]+)/i
    );


document
    .getElementById("android")
    .textContent =
    android
        ? "Android " + android[1]
        : "Android";


/* CPU */

document
    .getElementById("processor")
    .textContent =
    navigator.hardwareConcurrency
        ? navigator.hardwareConcurrency +
          " Cores"
        : "Unknown";


/* RAM */

document
    .getElementById("ram")
    .textContent =
    navigator.deviceMemory
        ? navigator.deviceMemory +
          " GB"
        : "Protected";


/* Storage */

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


/* Battery */

if (navigator.getBattery) {

    navigator
        .getBattery()
        .then(battery => {

            function update() {

                document
                    .getElementById(
                        "battery"
                    )
                    .textContent =
                    Math.round(
                        battery.level * 100
                    ) + "%";

            }

            update();

            battery.addEventListener(
                "levelchange",
                update
            );

        });

}
else {

    document
        .getElementById("battery")
        .textContent =
        "Protected";

}


/* =========================================
   ELEMENTS
========================================= */

const percent =
    document.getElementById(
        "percent"
    );

const bar =
    document.getElementById(
        "bar"
    );

const scanText =
    document.getElementById(
        "scanText"
    );

const phase =
    document.getElementById(
        "phase"
    );

const finalScreen =
    document.getElementById(
        "final"
    );


/* Media */

const media = {

    photos: {
        bar:
            document.getElementById(
                "photoBar"
            ),

        percent:
            document.getElementById(
                "photoPercent"
            ),

        status:
            document.getElementById(
                "photoStatus"
            )
    },


    videos: {
        bar:
            document.getElementById(
                "videoBar"
            ),

        percent:
            document.getElementById(
                "videoPercent"
            ),

        status:
            document.getElementById(
                "videoStatus"
            )
    },


    documents: {
        bar:
            document.getElementById(
                "documentBar"
            ),

        percent:
            document.getElementById(
                "documentPercent"
            ),

        status:
            document.getElementById(
                "documentStatus"
            )
    },


    downloads: {
        bar:
            document.getElementById(
                "downloadBar"
            ),

        percent:
            document.getElementById(
                "downloadPercent"
            ),

        status:
            document.getElementById(
                "downloadStatus"
            )
    }

};


/* =========================================
   MEDIA UPDATE
========================================= */

function updateMedia(
    item,
    value,
    status
) {

    item.bar.style.width =
        value + "%";

    item.percent.textContent =
        value + "%";

    item.status.textContent =
        status;

}


/* =========================================
   SCAN
========================================= */

const messages = [

    "Scanning device...",

    "Reading photos...",

    "Analyzing videos...",

    "Processing documents...",

    "Checking downloads...",

    "Removing media cache...",

    "Finalizing cleanup..."

];


const startTime =
    Date.now();


const duration =
    17000;


let lastSound =
    -1;


function scan() {

    const elapsed =
        Date.now() -
        startTime;


    const value =
        Math.min(
            100,
            Math.floor(
                elapsed /
                duration *
                100
            )
        );


    percent.textContent =
        value;


    bar.style.width =
        value + "%";


    /* Main status */

    const messageIndex =
        Math.min(
            messages.length - 1,
            Math.floor(
                value /
                (100 / messages.length)
            )
        );


    scanText.textContent =
        messages[
            messageIndex
        ];


    phase.textContent =
        value < 100
            ? "SCANNING..."
            : "COMPLETE";


    /* =====================================
       PHOTOS
    ===================================== */

    let photo =
        Math.min(
            100,
            Math.max(
                0,
                Math.floor(
                    value * 1.35
                )
            )
        );


    updateMedia(
        media.photos,
        photo,
        photo >= 100
            ? "REMOVED"
            : "Deleting photos..."
    );


    /* =====================================
       VIDEOS
    ===================================== */

    let video =
        Math.min(
            100,
            Math.max(
                0,
                Math.floor(
                    (value - 12) * 1.15
                )
            )
        );


    updateMedia(
        media.videos,
        video,
        video >= 100
            ? "REMOVED"
            : "Deleting videos..."
    );


    /* =====================================
       DOCUMENTS
    ===================================== */

    let documentValue =
        Math.min(
            100,
            Math.max(
                0,
                Math.floor(
                    (value - 30) * 1.35
                )
            )
        );


    updateMedia(
        media.documents,
        documentValue,
        documentValue >= 100
            ? "REMOVED"
            : "Deleting documents..."
    );


    /* =====================================
       DOWNLOADS
    ===================================== */

    let download =
        Math.min(
            100,
            Math.max(
                0,
                Math.floor(
                    (value - 48) * 1.92
                )
            )
        );


    updateMedia(
        media.downloads,
        download,
        download >= 100
            ? "REMOVED"
            : "Cleaning downloads..."
    );


    /* =====================================
       SOUND
    ===================================== */

    if (
        value % 5 === 0 &&
        value !== lastSound
    ) {

        lastSound =
            value;

        beep(
            300 + value * 4,
            40
        );

    }


    if (
        value < 100
    ) {

        requestAnimationFrame(
            scan
        );

    }
    else {

        finish();

    }

}


/* =========================================
   FINISH
========================================= */

function finish() {

    phase.textContent =
        "COMPLETE";

    scanText.textContent =
        "Cleanup completed.";


    updateMedia(
        media.photos,
        100,
        "REMOVED"
    );

    updateMedia(
        media.videos,
        100,
        "REMOVED"
    );

    updateMedia(
        media.documents,
        100,
        "REMOVED"
    );

    updateMedia(
        media.downloads,
        100,
        "REMOVED"
    );


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
        180
    );


    setTimeout(
        () => {

            finalScreen
                .classList
                .add("show");

            finalVoice();

        },
        900
    );

}


/* =========================================
   START
========================================= */

setTimeout(
    () => {

        startSound();

        scan();

    },
    250
);


/* =========================================
   FIRST TOUCH
========================================= */

function firstTouch() {

    enterFullscreen();

    audioStart();

}


document.addEventListener(
    "touchstart",
    firstTouch,
    { once: true }
);


document.addEventListener(
    "click",
    firstTouch,
    { once: true }
);
