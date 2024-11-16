// Canvas Setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

// Game Variables
let hunger = 100;
let warmth = 100;
let timeLeft = 480; // 8 minutes in seconds
let player = { x: 400, y: 300, size: 20, color: "blue", speed: 5 };
let snowflakes = [];
let animals = [{ x: 200, y: 400, size: 15 }];
let lakes = [{ x: 600, y: 350, width: 50, height: 30 }];

// Timer
const timerElement = document.getElementById("timer");
const hungerElement = document.getElementById("hunger");
const warmthElement = document.getElementById("warmth");

// Keyboard Input
let keys = {};
window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

// Game Over
function gameOver(message) {
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  ctx.fillText(message, canvas.width / 2, canvas.height / 2);
  clearInterval(timerInterval);
  cancelAnimationFrame(animationId);
}

// Timer Countdown
const timerInterval = setInterval(() => {
  if (timeLeft > 0) {
    timeLeft--;
    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const seconds = String(timeLeft % 60).padStart(2, "0");
    timerElement.textContent = `${minutes}:${seconds}`;
  } else {
    gameOver("The Sun Exploded! You perished in the eternal snow...");
  }
}, 1000);

// Snowfall Effect
function createSnowflakes() {
  for (let i = 0; i < 100; i++) {
    snowflakes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 4 + 1,
      speed: Math.random() * 1 + 0.5,
    });
  }
}

function drawSnowflakes() {
  snowflakes.forEach((snowflake) => {
    ctx.beginPath();
    ctx.arc(snowflake.x, snowflake.y, snowflake.radius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
  });
}

function moveSnowflakes() {
  snowflakes.forEach((snowflake) => {
    snowflake.y += snowflake.speed;
    if (snowflake.y > canvas.height) {
      snowflake.y = 0;
      snowflake.x = Math.random() * canvas.width;
    }
  });
}

// Draw Player
function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.size, player.size);
}

// Draw Animals and Lakes
function drawObjects() {
  animals.forEach((animal) => {
    ctx.fillStyle = "brown";
    ctx.fillRect(animal.x, animal.y, animal.size, animal.size);
  });
  lakes.forEach((lake) => {
    ctx.fillStyle = "blue";
    ctx.fillRect(lake.x, lake.y, lake.width, lake.height);
  });
}

// Update Player Position
function updatePlayer() {
  if (keys["ArrowUp"] || keys["w"]) player.y -= player.speed;
  if (keys["ArrowDown"] || keys["s"]) player.y += player.speed;
  if (keys["ArrowLeft"] || keys["a"]) player.x -= player.speed;
  if (keys["ArrowRight"] || keys["d"]) player.x += player.speed;

  // Boundary Checks
  player.x = Math.max(0, Math.min(player.x, canvas.width - player.size));
  player.y = Math.max(0, Math.min(player.y, canvas.height - player.size));
}

// Player Actions
function hunt() {
  animals = animals.filter(
    (animal) =>
      !(
        player.x < animal.x + animal.size &&
        player.x + player.size > animal.x &&
        player.y < animal.y + animal.size &&
        player.y + player.size > animal.y
      )
  );
  hunger = Math.min(hunger + 20, 100);
}

function fish() {
  if (
    lakes.some(
      (lake) =>
        player.x < lake.x + lake.width &&
        player.x + player.size > lake.x &&
        player.y < lake.y + lake.height &&
        player.y + player.size > lake.y
    )
  ) {
    hunger = Math.min(hunger + 15, 100);
  }
}

// Update Game
function updateGame() {
  hunger = Math.max(hunger - 0.1, 0);
  warmth = Math.max(warmth - 0.05, 0);
  hungerElement.textContent = Math.floor(hunger);
  warmthElement.textContent = Math.floor(warmth);

  if (hunger <= 0 || warmth <= 0) {
    gameOver("You died! The snow consumed you...");
  }
}

// Game Loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawSnowflakes();
  moveSnowflakes();
  drawObjects();
  drawPlayer();
  updatePlayer();
  updateGame();

  animationId = requestAnimationFrame(gameLoop);
}

// Start Game
createSnowflakes();
let animationId = requestAnimationFrame(gameLoop);
