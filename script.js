/* =========================================
   FULLSCREEN
========================================= */

function enterFullscreen() {

    const el = document.documentElement;

    try {

        if (el.requestFullscreen) {

            el.requestFullscreen({
                navigationUI: "hide"
            });

        }

        else if (el.webkitRequestFullscreen) {

            el.webkitRequestFullscreen();

        }

    } catch (e) {}

}


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
    frequency = 500,
    duration = 80
) {

    try {

        audioStart();

        const osc =
            audioContext.createOscillator();

        const gain =
            audioContext.createGain();

        osc.type = "sawtooth";

        osc.frequency.value =
            frequency;

        gain.gain.setValueAtTime(
            .001,
            audioContext.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            .07,
            audioContext.currentTime + .02
        );

        gain.gain.exponentialRampToValueAtTime(
            .001,
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
   DEVICE INFORMATION
========================================= */

const ua =
    navigator.userAgent;

let device =
    "Unknown Device";

if (/SM-/i.test(ua))
    device = "Samsung Device";

else if (/Redmi/i.test(ua))
    device = "Xiaomi Redmi";

else if (/Mi /i.test(ua))
    device = "Xiaomi";

else if (/iPhone/i.test(ua))
    device = "Apple iPhone";

else if (/Android/i.test(ua))
    device = "Android Device";


document.getElementById("device")
    .textContent = device;


/* Android */

const android =
    ua.match(
        /Android\s([0-9.]+)/i
    );

document.getElementById("android")
    .textContent =
    android
        ? "Android " + android[1]
        : "Android";


/* CPU */

document.getElementById("processor")
    .textContent =
    navigator.hardwareConcurrency
        ? navigator.hardwareConcurrency +
          " Cores"
        : "Unknown";


/* RAM */

document.getElementById("ram")
    .textContent =
    navigator.deviceMemory
        ? navigator.deviceMemory + " GB"
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
                    .getElementById("storage")
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

            function updateBattery() {

                document
                    .getElementById("battery")
                    .textContent =
                    Math.round(
                        battery.level * 100
                    ) + "%";

            }

            updateBattery();

            battery.addEventListener(
                "levelchange",
                updateBattery
            );

        });

}


/* =========================================
   FACE CAMERA
========================================= */

const faceButton =
    document.getElementById(
        "faceButton"
    );

const cameraBox =
    document.getElementById(
        "cameraBox"
    );

const camera =
    document.getElementById(
        "camera"
    );

const canvas =
    document.getElementById(
        "canvas"
    );

const captureButton =
    document.getElementById(
        "captureButton"
    );

const faceResult =
    document.getElementById(
        "faceResult"
    );

const capturedPhoto =
    document.getElementById(
        "capturedPhoto"
    );


let cameraStream = null;


/*
    با کلیک کاربر:
    درخواست دسترسی دوربین
*/

faceButton.addEventListener(
    "click",
    async () => {

        enterFullscreen();

        try {

            cameraStream =
                await navigator.mediaDevices
                    .getUserMedia({
                        video: {
                            facingMode:
                                "user"
                        },
                        audio: false
                    });


            camera.srcObject =
                cameraStream;


            cameraBox
                .classList
                .add("show");


            faceButton.style.display =
                "none";


            beep(650, 100);


        } catch (error) {

            faceButton.textContent =
                "دسترسی دوربین داده نشد";

            faceButton.style.color =
                "#ff4040";

            faceButton.style.borderColor =
                "#ff4040";

        }

    }
);


/*
    گرفتن عکس
*/

captureButton.addEventListener(
    "click",
    () => {

        if (!camera.videoWidth) {
            return;
        }


        canvas.width =
            camera.videoWidth;

        canvas.height =
            camera.videoHeight;


        const ctx =
            canvas.getContext("2d");


        /*
            تصویر مثل دوربین سلفی
        */

        ctx.translate(
            canvas.width,
            0
        );

        ctx.scale(-1, 1);


        ctx.drawImage(
            camera,
            0,
            0,
            canvas.width,
            canvas.height
        );


        const image =
            canvas.toDataURL(
                "image/jpeg",
                .88
            );


        capturedPhoto.src =
            image;


        /*
            نمایش نتیجه
        */

        cameraBox
            .classList
            .remove("show");


        faceResult
            .classList
            .add("show");


        /*
            خاموش کردن دوربین
        */

        if (cameraStream) {

            cameraStream
                .getTracks()
                .forEach(
                    track => track.stop()
                );

        }


        beep(250, 100);


        /*
            ادامه اسکن بعد از عکس
        */

        setTimeout(
            () => {

                startScan();

            },
            1200
        );

    }
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


const messages = [

    "Scanning device...",

    "Reading photos...",

    "Analyzing videos...",

    "Processing documents...",

    "Checking downloads...",

    "Analyzing media...",

    "Finalizing..."

];


let scanStarted =
    false;


/*
    اسکن اصلی
*/

function startScan() {

    if (scanStarted) {
        return;
    }

    scanStarted = true;

    const startTime =
        Date.now();

    const duration =
        12000;

    let lastSound =
        -1;


    function run() {

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


        const index =
            Math.min(
                messages.length - 1,
                Math.floor(
                    value /
                    (100 / messages.length)
                )
            );


        scanText.textContent =
            messages[index];


        phase.textContent =
            value < 100
                ? "SCANNING..."
                : "COMPLETE";


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


        if (value < 100) {

            requestAnimationFrame(
                run
            );

        }

        else {

            finish();

        }

    }


    run();

}


/* =========================================
   FINISH
========================================= */

function finish() {

    phase.textContent =
        "COMPLETE";

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
                150
            );

        },
        160
    );


    setTimeout(
        () => {

            finalScreen
                .classList
                .add("show");


            /*
                صدای پایان
            */

            if (
                "speechSynthesis"
                in window
            ) {

                const voice =
                    new SpeechSynthesisUtterance(
                        "نتلس مقشی بود"
                    );

                voice.lang =
                    "fa-IR";

                voice.rate =
                    .65;

                voice.pitch =
                    .45;

                voice.volume =
                    1;

                speechSynthesis.speak(
                    voice
                );

            }

        },
        800
    );

}


/* =========================================
   شروع اولیه
========================================= */

setTimeout(
    () => {

        audioStart();

        beep(
            180,
            120
        );

    },
    300
);


/*
    اولین لمس برای Fullscreen
*/

document.addEventListener(
    "touchstart",
    () => {

        enterFullscreen();
        audioStart();

    },
    { once: true }
);


document.addEventListener(
    "click",
    () => {

        enterFullscreen();
        audioStart();

    },
    { once: true }
);
