// Scene, Camera, Renderer
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.02); // Permanent darkness

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting (Dim Glow for Darkness)
const moonLight = new THREE.DirectionalLight(0x8888ff, 0.5);
moonLight.position.set(-10, 20, 10);
scene.add(moonLight);

const ambientLight = new THREE.AmbientLight(0x222244); // Weak ambient light
scene.add(ambientLight);

// Frozen Terrain
const terrainSize = 100;
const terrainGeometry = new THREE.PlaneGeometry(terrainSize, terrainSize, 100, 100);
terrainGeometry.rotateX(-Math.PI / 2);

// Add Perlin Noise for Snowy Terrain
terrainGeometry.vertices.forEach((v) => {
  v.y = Math.sin(v.x / 5) + Math.sin(v.z / 5) + (Math.random() * 0.5);
});

const terrainMaterial = new THREE.MeshLambertMaterial({ color: 0xeeeeee, wireframe: false });
const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
scene.add(terrain);

// Frozen Water
const waterGeometry = new THREE.PlaneGeometry(30, 30, 10, 10);
const waterMaterial = new THREE.MeshPhongMaterial({
  color: 0x1e90ff,
  opacity: 0.6,
  transparent: true,
});
const frozenLake = new THREE.Mesh(waterGeometry, waterMaterial);
frozenLake.position.y = 0.1;
frozenLake.rotation.x = -Math.PI / 2;
frozenLake.position.set(10, 0, -10);
scene.add(frozenLake);

// Snow-Covered Trees
function createTree(x, z) {
  const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 2);
  const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
  trunk.position.set(x, 1, z);

  const leavesGeometry = new THREE.ConeGeometry(1, 3, 8);
  const leavesMaterial = new THREE.MeshLambertMaterial({ color: 0x228b22 });
  const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
  leaves.position.set(x, 3, z);

  scene.add(trunk);
  scene.add(leaves);
}

for (let i = 0; i < 30; i++) {
  createTree((Math.random() - 0.5) * terrainSize, (Math.random() - 0.5) * terrainSize);
}

// Player Setup
const player = { x: 0, z: 0, speed: 0.2 };
const keys = {};
document.addEventListener("keydown", (e) => (keys[e.key] = true));
document.addEventListener("keyup", (e) => (keys[e.key] = false));

// Warmth and Hunger
let warmth = 100;
let hunger = 100;

function updateStats() {
  warmth -= 0.01; // Gradual loss
  hunger -= 0.02; // Gradual hunger

  document.getElementById("warmth").textContent = Math.floor(warmth);
  document.getElementById("hunger").textContent = Math.floor(hunger);

  if (warmth <= 0 || hunger <= 0) {
    alert("You froze or starved to death in the eternal night.");
    window.location.reload();
  }
}

// Player Movement
function movePlayer() {
  if (keys["w"] || keys["ArrowUp"]) player.z -= player.speed;
  if (keys["s"] || keys["ArrowDown"]) player.z += player.speed;
  if (keys["a"] || keys["ArrowLeft"]) player.x -= player.speed;
  if (keys["d"] || keys["ArrowRight"]) player.x += player.speed;

  camera.position.set(player.x, 5, player.z + 10);
  camera.lookAt(player.x, 0, player.z);
}

// Blizzards
let blizzardActive = false;

function triggerBlizzard() {
  blizzardActive = true;
  scene.fog.density = 0.05; // Increase fog for blizzard
  setTimeout(() => {
    blizzardActive = false;
    scene.fog.density = 0.02; // Reset fog
  }, 10000);
}

// Randomly trigger blizzards every 30-60 seconds
setInterval(() => {
  if (!blizzardActive) triggerBlizzard();
}, Math.random() * 30000 + 30000);

// Animation Loop
function animate() {
  movePlayer();
  updateStats();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

// Initialize Camera
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

// Start Game
animate();
