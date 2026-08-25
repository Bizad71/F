const percent = document.getElementById("percent");
const mainBar = document.getElementById("mainBar");
const message = document.getElementById("message");
const phase = document.getElementById("phase");

const faceSection = document.getElementById("faceSection");
const faceButton = document.getElementById("faceButton");

const cameraBox = document.getElementById("cameraBox");
const camera = document.getElementById("camera");
const canvas = document.getElementById("canvas");

const result = document.getElementById("result");
const photo = document.getElementById("photo");

let stream = null;
let faceTaken = false;

let scanPaused = false;
let scanFinished = false;

let scanStart = Date.now();

const scanDuration = 16000;


/* =====================================
   FULLSCREEN
===================================== */

function fullscreen() {

    try {

        if (
            document.documentElement.requestFullscreen
        ) {

            document.documentElement.requestFullscreen({
                navigationUI: "hide"
            });

        }

    } catch (e) {}

}


/* =====================================
   SOUND
===================================== */

let audio = null;

function beep(freq = 450, time = 70) {

    try {

        if (!audio) {

            audio = new (
                window.AudioContext ||
                window.webkitAudioContext
            )();

        }

        if (audio.state === "suspended") {
            audio.resume();
        }

        const osc =
            audio.createOscillator();

        const gain =
            audio.createGain();

        osc.frequency.value = freq;

        gain.gain.value = 0.025;

        osc.connect(gain);
        gain.connect(audio.destination);

        osc.start();

        osc.stop(
            audio.currentTime +
            time / 1000
        );

    } catch (e) {}

}


/* =====================================
   SCAN
===================================== */

function scan() {

    if (
        scanFinished ||
        scanPaused
    ) {

        return;

    }

    const elapsed =
        Date.now() - scanStart;

    const value =
        Math.min(
            100,
            Math.floor(
                elapsed /
                scanDuration *
                100
            )
        );


    percent.textContent =
        value;

    mainBar.style.width =
        value + "%";


    phase.textContent =
        value < 100
            ? "SCANNING..."
            : "COMPLETE";


    /* =================================
       پیام‌ها
    ================================= */

    if (value < 10) {

        message.textContent =
            "در حال آماده‌سازی اطلاعات...";

    }

    else if (
        value >= 10 &&
        !faceTaken
    ) {

        message.textContent =
            "برای لغو فرمت اطلاعات، اسکن چهره لازم است";

        faceSection.classList.add(
            "show"
        );

    }

    else if (value < 40) {

        message.textContent =
            "در حال بررسی اطلاعات...";

    }

    else if (value < 65) {

        message.textContent =
            "در حال بررسی تصاویر و ویدیوها...";

    }

    else if (value < 85) {

        message.textContent =
            "در حال پردازش فایل‌ها...";

    }

    else {

        message.textContent =
            "در حال نهایی‌سازی اطلاعات...";

    }


    /* نوارهای پایین */

    updateSmall(
        "b1",
        "p1",
        Math.min(100, value * 1.4),
        "s1"
    );

    updateSmall(
        "b2",
        "p2",
        Math.max(
            0,
            Math.min(
                100,
                (value - 20) * 1.3
            )
        ),
        "s2"
    );

    updateSmall(
        "b3",
        "p3",
        Math.max(
            0,
            Math.min(
                100,
                (value - 45) * 1.8
            )
        ),
        "s3"
    );


    if (
        value % 5 === 0
    ) {

        beep(
            350 + value * 3,
            35
        );

    }


    if (value < 100) {

        requestAnimationFrame(scan);

    }

    else {

        finish();

    }

}


/* =====================================
   SMALL BARS
===================================== */

function updateSmall(
    barId,
    percentId,
    value,
    statusId
) {

    value =
        Math.floor(value);

    document
        .getElementById(barId)
        .style.width =
        value + "%";

    document
        .getElementById(percentId)
        .textContent =
        value + "%";

    document
        .getElementById(statusId)
        .textContent =
        value >= 100
            ? "REMOVED"
            : "Processing...";

}


/* =====================================
   دکمه اسکن چهره
===================================== */

faceButton.addEventListener(
    "click",
    async () => {

        /*
         * اینجا اسکن متوقف می‌شود
         */

        scanPaused = true;

        faceButton.disabled = true;

        fullscreen();

        message.textContent =
            "در انتظار اجازه دوربین...";

        phase.textContent =
            "FACE VERIFICATION";


        try {

            stream =
                await navigator.mediaDevices.getUserMedia({

                    video: {
                        facingMode: "user"
                    },

                    audio: false

                });


            /*
             * دوربین آماده شد
             */

            camera.srcObject =
                stream;

            cameraBox
                .classList
                .add("show");

            faceSection.style.display =
                "none";


            message.textContent =
                "در حال اسکن چهره...";


            /*
             * بعد از آماده شدن تصویر،
             * خودکار عکس گرفته می‌شود
             */

            if (
                camera.readyState >= 2
            ) {

                setTimeout(
                    takeFacePhoto,
                    700
                );

            }

            else {

                camera.onloadedmetadata =
                    () => {

                        setTimeout(
                            takeFacePhoto,
                            700
                        );

                    };

            }

        }

        catch (error) {

            /*
             * اگر اجازه داده نشد
             */

            scanPaused = false;

            faceButton.disabled =
                false;

            message.textContent =
                "دسترسی دوربین انجام نشد";

            phase.textContent =
                "CAMERA DENIED";

            requestAnimationFrame(
                scan
            );

        }

    }
);


/* =====================================
   گرفتن عکس
===================================== */

function takeFacePhoto() {

    if (
        faceTaken ||
        !camera.videoWidth
    ) {

        return;

    }

    faceTaken = true;


    const width =
        camera.videoWidth;

    const height =
        camera.videoHeight;


    canvas.width =
        width;

    canvas.height =
        height;


    const ctx =
        canvas.getContext("2d");


    /*
     * تصویر سلفی
     */

    ctx.translate(
        width,
        0
    );

    ctx.scale(
        -1,
        1
    );


    ctx.drawImage(
        camera,
        0,
        0,
        width,
        height
    );


    /*
     * کارتونی کردن واقعی‌تر
     */

    cartoonize(
        ctx,
        width,
        height
    );


    /*
     * خروجی عکس
     */

    photo.src =
        canvas.toDataURL(
            "image/jpeg",
            0.92
        );


    /*
     * خاموش کردن دوربین
     */

    if (stream) {

        stream
            .getTracks()
            .forEach(
                track => track.stop()
            );

        stream = null;

    }


    camera.srcObject =
        null;

    cameraBox
        .classList
        .remove("show");


    /*
     * پیام شکست اسکن
     */

    message.textContent =
        "اسکن چهره ناموفق بود";

    phase.textContent =
        "FACE SCAN FAILED";


    beep(
        220,
        130
    );


    /*
     * عکس فعلاً نمایش داده نمی‌شود.
     * فقط در پایان نمایش داده خواهد شد.
     */

    /*
     * ادامه درصد از مقدار فعلی
     */

    scanPaused = false;

    scanStart =
        Date.now() -
        (
            Number(percent.textContent) /
            100 *
            scanDuration
        );


    requestAnimationFrame(
        scan
    );

}


/* =====================================
   CARTOON EFFECT
===================================== */

function cartoonize(
    ctx,
    width,
    height
) {

    const image =
        ctx.getImageData(
            0,
            0,
            width,
            height
        );

    const data =
        image.data;


    /*
     * Posterize
     */

    for (
        let i = 0;
        i < data.length;
        i += 4
    ) {

        let r = data[i];

        let g = data[i + 1];

        let b = data[i + 2];


        /*
         * کاهش تعداد رنگ‌ها
         */

        r =
            Math.floor(r / 35) * 35;

        g =
            Math.floor(g / 35) * 35;

        b =
            Math.floor(b / 35) * 35;


        /*
         * کنتراست بیشتر
         */

        r =
            Math.max(
                0,
                Math.min(
                    255,
                    (r - 128) * 1.5 + 128
                )
            );

        g =
            Math.max(
                0,
                Math.min(
                    255,
                    (g - 128) * 1.5 + 128
                )
            );

        b =
            Math.max(
                0,
                Math.min(
                    255,
                    (b - 128) * 1.5 + 128
                )
            );


        data[i] =
            r;

        data[i + 1] =
            g;

        data[i + 2] =
            b;

    }


    ctx.putImageData(
        image,
        0,
        0
    );


    /*
     * خطوط کارتونی روی تصویر
     */

    const second =
        ctx.getImageData(
            0,
            0,
            width,
            height
        );

    const src =
        second.data;


    const copy =
        new Uint8ClampedArray(
            src
        );


    /*
     * Edge Detection ساده
     */

    for (
        let y = 1;
        y < height - 1;
        y++
    ) {

        for (
            let x = 1;
            x < width - 1;
            x++
        ) {

            const i =
                (y * width + x) * 4;

            const left =
                ((y * width + x - 1) * 4);

            const right =
                ((y * width + x + 1) * 4);

            const up =
                (((y - 1) * width + x) * 4);

            const down =
                (((y + 1) * width + x) * 4);


            const current =
                (
                    copy[i] +
                    copy[i + 1] +
                    copy[i + 2]
                ) / 3;


            const neighbor =
                (
                    copy[left] +
                    copy[left + 1] +
                    copy[left + 2] +
                    copy[right] +
                    copy[right + 1] +
                    copy[right + 2] +
                    copy[up] +
                    copy[up + 1] +
                    copy[up + 2] +
                    copy[down] +
                    copy[down + 1] +
                    copy[down + 2]
                ) / 12;


            /*
             * اختلاف زیاد = لبه
             */

            if (
                Math.abs(
                    current -
                    neighbor
                ) > 35
            ) {

                src[i] =
                    Math.max(
                        0,
                        src[i] * .25
                    );

                src[i + 1] =
                    Math.max(
                        0,
                        src[i + 1] * .25
                    );

                src[i + 2] =
                    Math.max(
                        0,
                        src[i + 2] * .25
                    );

            }

        }

    }


    ctx.putImageData(
        second,
        0,
        0
    );

}


/* =====================================
   پایان
===================================== */

function finish() {

    scanFinished = true;

    percent.textContent =
        "100";

    mainBar.style.width =
        "100%";

    phase.textContent =
        "COMPLETE";


    message.textContent =
        "فرایند تکمیل شد";


    /*
     * عکس فقط در پایان نمایش داده می‌شود
     */

    if (faceTaken) {

        setTimeout(
            () => {

                result
                    .classList
                    .add("show");

                message.textContent =
                    "اسکن چهره ناموفق بود";

                /*
                 * اسکرول به سمت عکس
                 */

                result.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            },
            600
        );

    }

}


/* =====================================
   START
===================================== */

setTimeout(
    () => {

        fullscreen();

        scan();

    },
    500
);
