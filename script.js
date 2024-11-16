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
    gameOver("The Sun Exploded! You perished in the eternal snow...");
  }
}, 1000);

// Update Stats
function updateStats() {
  hungerElement.textContent = hunger;
  warmthElement.textContent = warmth;

  if (hunger <= 0 || warmth <= 0) {
    gameOver("You died! The snow consumed you...");
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

// Game Over Logic
function gameOver(message) {
  document.body.innerHTML = `<h1>${message}</h1>`;
  clearInterval(timerInterval); // Stop the timer
}

// Snow Effect
const canvas = document.getElementById("snowCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let snowflakes = [];

function createSnowflakes() {
  snowflakes = []; // Reset snowflakes
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
