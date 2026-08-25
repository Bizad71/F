const progress = document.getElementById("progress");
const percent = document.getElementById("percent");
const status = document.getElementById("status");
const logs = document.getElementById("logs");
const final = document.getElementById("final");

const messages = [
    "Initializing secure connection...",
    "Scanning network interface...",
    "Analyzing device information...",
    "Checking system services...",
    "Searching available resources...",
    "Establishing encrypted tunnel...",
    "Processing system data...",
    "Analyzing security configuration...",
    "Checking active processes...",
    "Decrypting system information...",
    "Access request sent...",
    "Verifying connection...",
    "Finalizing operation..."
];

let value = 0;
let messageIndex = 0;

function addLog(text) {

    const line = document.createElement("div");

    line.className = "log";

    line.textContent = text;

    logs.appendChild(line);

    logs.scrollTop = logs.scrollHeight;
}

function update() {

    value += Math.floor(Math.random() * 4) + 1;

    if (value > 100) {
        value = 100;
    }

    progress.style.width = value + "%";

    percent.textContent = value + "%";

    if (
        messageIndex < messages.length &&
        value >= (messageIndex + 1) * 7
    ) {

        addLog(messages[messageIndex]);

        messageIndex++;
    }

    if (value < 30) {

        status.textContent =
            "Establishing connection...";

    } else if (value < 60) {

        status.textContent =
            "Analyzing system...";

    } else if (value < 90) {

        status.textContent =
            "Processing information...";

    } else {

        status.textContent =
            "Finalizing access...";
    }

    if (value >= 100) {

        clearInterval(timer);

        addLog("ACCESS GRANTED");

        setTimeout(() => {

            final.classList.remove("hidden");

        }, 800);
    }
}

for (let i = 0; i < 3; i++) {

    setTimeout(() => {

        addLog(
            messages[messageIndex++]
        );

    }, i * 500);

}

const timer = setInterval(update, 180);
