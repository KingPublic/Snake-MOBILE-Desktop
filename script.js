/* ============================================
   SNAKE GAME — Game Ular 2D
   Logika: Game Loop, Input, Collision, Skor
   ============================================ */

"use strict";

/* ---------- Konstanta & Konfigurasi ---------- */
const GRID_SIZE = 20;          // 20x20 kotak
const CELL_SIZE = 20;          // 20px per kotak (canvas 400x400)
const BASE_SPEED = 150;        // ms per tick (kecepatan awal)
const MIN_SPEED = 70;          // ms per tick (kecepatan maksimal)
const SPEED_STEP = 5;          // percepatan per makanan
const STORAGE_KEY = "snake-high-score";

/* ---------- Elemen DOM ---------- */
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const currentScoreEl = document.getElementById("current-score");
const highScoreEl = document.getElementById("high-score");
const overlayEl = document.getElementById("overlay");
const overlayTitleEl = document.getElementById("overlay-title");
const overlayTextEl = document.getElementById("overlay-text");
const overlayBtnEl = document.getElementById("overlay-btn");
const btnStart = document.getElementById("btn-start");
const btnPause = document.getElementById("btn-pause");
const btnRestart = document.getElementById("btn-restart");

/* ---------- State Game ---------- */
let snake = [];                // array koordinat [{x, y}, ...] — index 0 = kepala
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let food = { x: 0, y: 0 };
let score = 0;
let highScore = Number(localStorage.getItem(STORAGE_KEY)) || 0;
let gameTimer = null;
let speed = BASE_SPEED;
let gameState = "idle";        // idle | running | paused | over

/* ============================================
   INISIALISASI
   ============================================ */
function initGame() {
  // Ular awal: 3 segmen di tengah, menghadap kanan
  const centerX = Math.floor(GRID_SIZE / 2);
  const centerY = Math.floor(GRID_SIZE / 2);
  snake = [
    { x: centerX, y: centerY },
    { x: centerX - 1, y: centerY },
    { x: centerX - 2, y: centerY },
  ];
  direction = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };
  score = 0;
  speed = BASE_SPEED;
  placeFood();
  updateScoreboard();
  draw();
}

/* ============================================
   GAME LOOP
   ============================================ */
function startGame() {
  if (gameState === "running") return;

  if (gameState === "idle" || gameState === "over") {
    initGame();
  }

  gameState = "running";
  hideOverlay();
  scheduleTick();
}

function scheduleTick() {
  clearTimeout(gameTimer);
  gameTimer = setTimeout(() => {
    tick();
    if (gameState === "running") scheduleTick();
  }, speed);
}

function pauseGame() {
  if (gameState !== "running") return;
  gameState = "paused";
  clearTimeout(gameTimer);
  showOverlay("⏸ JEDA", "Permainan dijeda. Geser papan atau tekan tombol ▶ LANJUT untuk melanjutkan.", "▶ LANJUT", false);
}

function togglePause() {
  if (gameState === "running") pauseGame();
  else if (gameState === "paused") startGame();
}

function gameOver() {
  gameState = "over";
  clearTimeout(gameTimer);

  // Simpan high score jika memecahkan rekor
  if (score > highScore) {
    highScore = score;
    localStorage.setItem(STORAGE_KEY, String(highScore));
    updateScoreboard();
  }

  const isRecord = score > 0 && score === highScore;
  const resultText = isRecord
    ? `Skor kamu: ${score} — Rekor baru! 🏆`
    : `Skor kamu: ${score} • Rekor: ${highScore}`;

  showOverlay(
    "💀 GAME OVER",
    `${resultText} — geser papan atau tekan tombol untuk main lagi.`,
    "🔄 MAIN LAGI",
    true
  );
}

/* Satu langkah permainan */
function tick() {
  direction = nextDirection;

  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Deteksi tabrakan: dinding
  const hitWall = head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE;
  // Deteksi tabrakan: tubuh sendiri
  const hitSelf = snake.some((seg) => seg.x === head.x && seg.y === head.y);

  if (hitWall || hitSelf) {
    gameOver();
    return;
  }

  snake.unshift(head);

  // Cek makanan
  if (head.x === food.x && head.y === food.y) {
    score++;
    speed = Math.max(MIN_SPEED, speed - SPEED_STEP); // makin cepat
    placeFood();
    updateScoreboard();
  } else {
    snake.pop(); // hapus ekor (ular tetap panjang saat makan)
  }

  draw();
}

/* ============================================
   MAKANAN
   ============================================ */
function placeFood() {
  let x, y;
  do {
    x = Math.floor(Math.random() * GRID_SIZE);
    y = Math.floor(Math.random() * GRID_SIZE);
  } while (snake.some((seg) => seg.x === x && seg.y === y)); // jangan di tubuh ular
  food = { x, y };
}

/* ============================================
   INPUT KEYBOARD
   ============================================ */
const KEY_MAP = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
  W: { x: 0, y: -1 },
  S: { x: 0, y: 1 },
  A: { x: -1, y: 0 },
  D: { x: 1, y: 0 },
};

function setDirection(newDir) {
  // Cegah berbalik arah 180° secara instan
  if (newDir.x === -direction.x && newDir.y === -direction.y) return;
  nextDirection = newDir;
}

document.addEventListener("keydown", (event) => {
  if (event.key === " ") {
    event.preventDefault();
    if (gameState === "idle" || gameState === "over") startGame();
    else togglePause();
    return;
  }

  if (event.key === "r" || event.key === "R") {
    event.preventDefault();
    startGame();
    return;
  }

  const dir = KEY_MAP[event.key];
  if (dir) {
    event.preventDefault();
    // Mulai otomatis jika belum berjalan
    if (gameState === "idle" || gameState === "over") startGame();
    setDirection(dir);
  }
});

/* ============================================
   D-PAD VIRTUAL (Sentuh)
   ============================================ */
const DPAD_MAP = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

document.querySelectorAll(".dpad-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const dir = DPAD_MAP[btn.dataset.direction];
    if (!dir) return;
    if (gameState === "idle" || gameState === "over") startGame();
    setDirection(dir);
  });
});

/* ============================================
   KONTROL SENTUH INTERAKTIF — GESER (SWIPE)
   Geser di area papan permainan ke atas / bawah /
   kiri / kanan untuk mengarahkan ular.
   Ketuk sekali di papan = Mulai / Lanjut.
   ============================================ */
const swipeArea = document.querySelector(".canvas-wrapper");
const SWIPE_MIN_DISTANCE = 24;   // px — geseran minimal agar dianggap swipe (bukan ketukan)
const SWIPE_MAX_DURATION = 800;  // ms — geseran yang lebih lambat dari ini diabaikan

let swipeStart = null;

function beginSwipe(x, y, pointerId) {
  swipeStart = { x, y, pointerId, time: performance.now() };
}

/* Selesaikan gesture: tentukan arah dari sumbu dominan */
function endSwipe(x, y, pointerId) {
  if (!swipeStart) return;
  if (pointerId !== undefined && swipeStart.pointerId !== pointerId) return;

  const dx = x - swipeStart.x;
  const dy = y - swipeStart.y;
  const duration = performance.now() - swipeStart.time;
  swipeStart = null;

  // Geseran terlalu lambat → abaikan (kemungkinan bukan swipe)
  if (duration > SWIPE_MAX_DURATION) return;

  const absX = Math.abs(dx);
  const absY = Math.abs(dy);

  // Ketukan (jarak di bawah ambang): mulai / lanjutkan permainan
  if (absX < SWIPE_MIN_DISTANCE && absY < SWIPE_MIN_DISTANCE) {
    if (gameState === "idle" || gameState === "over" || gameState === "paused") startGame();
    return;
  }

  // Ambil sumbu dominan: horizontal (kiri/kanan) atau vertikal (atas/bawah)
  const dir = absX > absY
    ? { x: Math.sign(dx), y: 0 }
    : { x: 0, y: Math.sign(dy) };

  // Mulai / lanjutkan permainan otomatis, lalu terapkan arah baru
  if (gameState === "idle" || gameState === "over" || gameState === "paused") startGame();
  setDirection(dir);
}

function cancelSwipe() {
  swipeStart = null;
}

if (swipeArea) {
  if (window.PointerEvent) {
    // Pointer Events: menangani sentuh, stylus, dan mouse sekaligus
    swipeArea.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      beginSwipe(event.clientX, event.clientY, event.pointerId);
    });

    swipeArea.addEventListener("pointerup", (event) => {
      endSwipe(event.clientX, event.clientY, event.pointerId);
    });

    swipeArea.addEventListener("pointercancel", cancelSwipe);
  } else {
    // Fallback browser lama tanpa Pointer Events
    swipeArea.addEventListener(
      "touchstart",
      (event) => {
        const touch = event.changedTouches[0];
        beginSwipe(touch.clientX, touch.clientY);
      },
      { passive: true }
    );

    swipeArea.addEventListener(
      "touchend",
      (event) => {
        const touch = event.changedTouches[0];
        endSwipe(touch.clientX, touch.clientY);
      },
      { passive: true }
    );

    swipeArea.addEventListener("touchcancel", cancelSwipe, { passive: true });
  }
}

/* Jeda otomatis saat tab / aplikasi ditinggalkan (perilaku khas mobile) */
document.addEventListener("visibilitychange", () => {
  if (document.hidden) pauseGame();
});

/* Deteksi perangkat sentuh: swipe jadi kontrol utama, D-Pad disembunyikan */
if (navigator.maxTouchPoints > 0 || "ontouchstart" in window) {
  document.documentElement.classList.add("touch-device");
}

/* ============================================
   TOMBOL UI
   ============================================ */
btnStart.addEventListener("click", startGame);
btnPause.addEventListener("click", togglePause);
btnRestart.addEventListener("click", startGame);

overlayBtnEl.addEventListener("click", () => {
  if (gameState === "paused") startGame();
  else startGame();
});

/* ============================================
   SKOR & OVERLAY
   ============================================ */
function updateScoreboard() {
  currentScoreEl.textContent = String(score);
  highScoreEl.textContent = String(highScore);
}

function showOverlay(title, text, btnLabel, isDanger) {
  overlayTitleEl.textContent = title;
  overlayTitleEl.classList.toggle("danger", isDanger);
  overlayTextEl.textContent = text;
  overlayBtnEl.textContent = btnLabel;
  overlayEl.classList.remove("hidden");
}

function hideOverlay() {
  overlayEl.classList.add("hidden");
}

/* ============================================
   RENDER (Menggambar ke Canvas)
   ============================================ */
function draw() {
  // Latar belakang
  ctx.fillStyle = "#16213e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Garis grid halus
  ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
  ctx.lineWidth = 1;
  for (let i = 1; i < GRID_SIZE; i++) {
    ctx.beginPath();
    ctx.moveTo(i * CELL_SIZE, 0);
    ctx.lineTo(i * CELL_SIZE, canvas.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * CELL_SIZE);
    ctx.lineTo(canvas.width, i * CELL_SIZE);
    ctx.stroke();
  }

  // Makanan (apel merah menyala)
  ctx.fillStyle = "#ff4757";
  ctx.shadowColor = "rgba(255, 71, 87, 0.8)";
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(
    food.x * CELL_SIZE + CELL_SIZE / 2,
    food.y * CELL_SIZE + CELL_SIZE / 2,
    CELL_SIZE / 2 - 3,
    0,
    Math.PI * 2
  );
  ctx.fill();
  ctx.shadowBlur = 0;

  // Ular (hijau neon, kepala lebih terang)
  snake.forEach((seg, index) => {
    const isHead = index === 0;
    ctx.fillStyle = isHead ? "#7dffb0" : "#00ff88";
    ctx.shadowColor = "rgba(0, 255, 136, 0.5)";
    ctx.shadowBlur = isHead ? 14 : 6;

    const pad = isHead ? 1 : 2;
    const radius = isHead ? 6 : 4;
    roundRect(
      seg.x * CELL_SIZE + pad,
      seg.y * CELL_SIZE + pad,
      CELL_SIZE - pad * 2,
      CELL_SIZE - pad * 2,
      radius
    );
    ctx.fill();
  });
  ctx.shadowBlur = 0;
}

/* Utilitas: kotak dengan sudut membulat */
function roundRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/* ============================================
   MULAI
   ============================================ */
initGame();
