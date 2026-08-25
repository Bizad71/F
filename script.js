/* =====================================
   عناصر
===================================== */

const percent =
    document.getElementById("percent");

const mainBar =
    document.getElementById("mainBar");

const message =
    document.getElementById("message");

const phase =
    document.getElementById("phase");

const faceSection =
    document.getElementById("faceSection");

const faceButton =
    document.getElementById("faceButton");

const cameraBox =
    document.getElementById("cameraBox");

const camera =
    document.getElementById("camera");

const canvas =
    document.getElementById("canvas");

const result =
    document.getElementById("result");

const photo =
    document.getElementById("photo");


let stream = null;

let faceTaken = false;

let scanFinished = false;


/* =====================================
   FULLSCREEN
===================================== */

function fullscreen() {

    try {

        if (
            document.documentElement
                .requestFullscreen
        ) {

            document.documentElement
                .requestFullscreen({
                    navigationUI: "hide"
                });

        }

    } catch (e) {}

}


/* =====================================
   صدای ساده
===================================== */

let audio;

function sound() {

    try {

        if (!audio) {

            audio =
                new (
                    window.AudioContext ||
                    window.webkitAudioContext
                )();

        }

        if (
            audio.state ===
            "suspended"
        ) {

            audio.resume();

        }

        const osc =
            audio.createOscillator();

        const gain =
            audio.createGain();

        osc.frequency.value =
            450;

        gain.gain.value =
            .025;

        osc.connect(gain);

        gain.connect(
            audio.destination
        );

        osc.start();

        osc.stop(
            audio.currentTime + .05
        );

    } catch (e) {}

}


/* =====================================
   اسکن
===================================== */

let start =
    Date.now();

const duration =
    16000;


function scan() {

    if (scanFinished) {
        return;
    }


    const elapsed =
        Date.now() - start;


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


    mainBar.style.width =
        value + "%";


    phase.textContent =
        value < 100
            ? "SCANNING..."
            : "COMPLETE";


    /* پیام‌ها */

    if (value < 10) {

        message.textContent =
            "در حال آماده‌سازی اطلاعات...";

    }

    else if (
        value >= 10 &&
        value < 30 &&
        !faceTaken
    ) {

        message.textContent =
            "برای لغو فرمت اطلاعات، اسکن چهره لازم است";

        faceSection.classList.add(
            "show"
        );

    }

    else if (
        value >= 30 &&
        value < 55
    ) {

        message.textContent =
            "در حال بررسی فایل‌های تصویری...";

    }

    else if (
        value >= 55 &&
        value < 75
    ) {

        message.textContent =
            "در حال بررسی ویدیوها...";

    }

    else if (
        value >= 75 &&
        value < 95
    ) {

        message.textContent =
            "در حال پردازش اطلاعات...";

    }

    else {

        message.textContent =
            "در حال نهایی‌سازی...";

    }


    /* درصدهای نمایشی */

    updateSmall(
        "b1",
        "p1",
        Math.min(100, value * 1.4),
        "s1",
        value > 70
            ? "REMOVED"
            : "Processing photos..."
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
        "s2",
        value > 95
            ? "REMOVED"
            : "Processing videos..."
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
        "s3",
        value > 95
            ? "REMOVED"
            : "Processing documents..."
    );


    if (
        value % 5 === 0
    ) {

        sound();

    }


    if (value < 100) {

        requestAnimationFrame(
            scan
        );

    }

    else {

        finish();

    }

}


function updateSmall(
    barId,
    percentId,
    value,
    statusId,
    status
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
        status;
}


/* =====================================
   اسکن چهره
===================================== */

faceButton.addEventListener(
    "click",
    async () => {

        fullscreen();

        message.textContent =
            "درخواست دسترسی به دوربین...";


        try {

            stream =
                await navigator
                    .mediaDevices
                    .getUserMedia({

                        video: {
                            facingMode:
                                "user"
                        },

                        audio: false

                    });


            camera.srcObject =
                stream;


            cameraBox
                .classList
                .add("show");


            faceSection.style.display =
                "none";


            message.textContent =
                "دوربین فعال شد؛ در حال اسکن چهره...";


            /*
               صبر کوتاه تا تصویر دوربین
               واقعاً آماده شود
            */

            camera.onloadedmetadata =
                () => {

                    setTimeout(
                        takePhoto,
                        900
                    );

                };


        }

        catch (error) {

            message.textContent =
                "دسترسی دوربین انجام نشد";

            faceButton.textContent =
                "دوباره تلاش کنید";

        }

    }
);


/* =====================================
   گرفتن عکس خودکار
===================================== */

function takePhoto() {

    if (
        faceTaken ||
        !camera.videoWidth
    ) {

        return;

    }


    faceTaken = true;


    canvas.width =
        camera.videoWidth;

    canvas.height =
        camera.videoHeight;


    const ctx =
        canvas.getContext(
            "2d"
        );


    /*
       تصویر آینه‌ای سلفی
    */

    ctx.translate(
        canvas.width,
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
        canvas.width,
        canvas.height
    );


    /*
       افکت کارتونی
       افزایش کنتراست + کاهش رنگ‌ها
    */

    const imageData =
        ctx.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
        );


    const data =
        imageData.data;


    for (
        let i = 0;
        i < data.length;
        i += 4
    ) {

        let r = data[i];

        let g = data[i + 1];

        let b = data[i + 2];


        /*
           posterize
        */

        r =
            Math.floor(
                r / 32
            ) * 32;

        g =
            Math.floor(
                g / 32
            ) * 32;

        b =
            Math.floor(
                b / 32
            ) * 32;


        /*
           کمی افزایش کنتراست
        */

        r =
            Math.min(
                255,
                Math.max(
                    0,
                    (r - 128) * 1.35 + 128
                )
            );

        g =
            Math.min(
                255,
                Math.max(
                    0,
                    (g - 128) * 1.35 + 128
                )
            );

        b =
            Math.min(
                255,
                Math.max(
                    0,
                    (b - 128) * 1.35 + 128
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
        imageData,
        0,
        0
    );


    /*
       تبدیل به عکس
    */

    photo.src =
        canvas.toDataURL(
            "image/jpeg",
            .9
        );


    /*
       خاموش کردن دوربین
    */

    if (stream) {

        stream
            .getTracks()
            .forEach(
                track =>
                    track.stop()
            );

    }


    cameraBox
        .classList
        .remove("show");


    message.textContent =
        "اسکن چهره انجام شد؛ ادامه پردازش اطلاعات...";


    sound();

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


    if (faceTaken) {

        message.textContent =
            "اسکن چهره موفق نبود";

        result
            .classList
            .add("show");

    }

    else {

        message.textContent =
            "فرایند تکمیل شد";

    }

}


/* =====================================
   شروع
===================================== */

setTimeout(
    () => {

        fullscreen();

        scan();

    },
    500
);
