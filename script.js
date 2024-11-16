const timerElement = document.getElementById("timer");
const hungerElement = document.getElementById("hunger");
const warmthElement = document.getElementById("warmth");

let hunger = 100;
let warmth = 100;
let timeLeft = 480; // 8 minutes in seconds

// Countdown Timer
setInterval(() => {
  if (timeLeft > 0) {
    timeLeft--;
    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const seconds = String(timeLeft % 60).padStart(2, "0");
    timerElement.textContent = `${minutes}:${seconds}`;
  } else {
    showEndMessage("The Sun Exploded! You perished in the eternal snow...");
  }
}, 1000);

// Display End Message
function showEndMessage(message) {
  const overlay = document.createElement("div");
  overlay.id = "endMessage";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  overlay.style.color = "white";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.fontSize = "2em";
  overlay.textContent = message;
  document.body.appendChild(overlay);
}

// Update Stats
function updateStats() {
  hunger = Math.max(0, Math.min(hunger, 100)); // Clamp between 0 and 100
  warmth = Math.max(0, Math.min(warmth, 100)); // Clamp between 0 and 100
  hungerElement.textContent = hunger;
  warmthElement.textContent = warmth;

  if (hunger <= 0 || warmth <= 0) {
    showEndMessage("You died! The snow consumed you...");
  }
}

// Actions
function hunt() {
  hunger = Math.min(hunger + 20, 100);
  warmth = Math.max(warmth - 10, 0);
  updateStats();
}

function fish() {
  hunger = Math.min(hunger + 15, 100);
  warmth = Math.max(warmth - 5, 0);
  updateStats();
}

function gatherWood() {
  warmth = Math.min(warmth + 25, 100);
  hunger = Math.max(hunger - 10, 0);
  updateStats();
}

// Snow Effect
const canvas = document.getElementById("snowCanvas");
const ctx = canvas.getContext("2d");

let snowflakes = [];

// Resize canvas dynamically
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function createSnowflakes() {
  snowflakes = [];
  for (let i = 0; i < 100; i++) {
    snowflakes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 4 + 1,
      speed: Math.random() * 1 + 0.5
    });
  }
}

function drawSnowflakes() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  snowflakes.forEach(snowflake => {
    ctx.beginPath();
    ctx.arc(snowflake.x, snowflake.y, snowflake.radius, 0, Math.PI * 2);
    ctx.fill();
  });
}

function moveSnowflakes() {
  snowflakes.forEach(snowflake => {
    snowflake.y += snowflake.speed;
    if (snowflake.y > canvas.height) {
      snowflake.y = 0;
      snowflake.x = Math.random() * canvas.width;
      snowflake.radius = Math.random() * 4 + 1;
      snowflake.speed = Math.random() * 1 + 0.5;
    }
  });
}

function animateSnow() {
  drawSnowflakes();
  moveSnowflakes();
  requestAnimationFrame(animateSnow);
}

createSnowflakes();
animateSnow();
