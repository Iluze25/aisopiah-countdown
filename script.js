/* ==========================================================================
   Konfigurasi Tanggal Ulang Tahun
   ========================================================================== */
const BIRTHDAY_CONFIG = {
  // Format: YYYY-MM-DDTHH:mm:ss
  targetDate: new Date("2026-08-23T21:15:00"),
}; 

/* Elemen DOM */
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

const mainCard = document.getElementById("main-card");
const countdownGrid = document.getElementById("countdown-grid");
const countdownView = document.getElementById("countdown-view");
const celebrationView = document.getElementById("celebration-view");
const particleContainer = document.getElementById("particle-container");

let previousTime = {
  days: null,
  hours: null,
  minutes: null,
  seconds: null,
};

let countdownTimer = null;

/* ==========================================================================
   Logika Countdown Timer
   ========================================================================== */
function calculateTimeRemaining() {
  const diff = BIRTHDAY_CONFIG.targetDate.getTime() - new Date().getTime();

  if (diff <= 0) {
    return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    total: diff,
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function updateCountdown() {
  const time = calculateTimeRemaining();

  if (time.total <= 0) {
    clearInterval(countdownTimer);
    triggerCelebration();
    return;
  }

  const strDays = String(time.days).padStart(2, "0");
  const strHours = String(time.hours).padStart(2, "0");
  const strMins = String(time.minutes).padStart(2, "0");
  const strSecs = String(time.seconds).padStart(2, "0");

  if (previousTime.seconds !== strSecs) {
    secondsEl.textContent = strSecs;
    triggerNumberAnimation(secondsEl, "scale-pulse");
    previousTime.seconds = strSecs;
  }

  if (previousTime.minutes !== strMins) {
    minutesEl.textContent = strMins;
    if (previousTime.minutes !== null)
      triggerNumberAnimation(minutesEl, "strong-pulse");
    previousTime.minutes = strMins;
  }

  if (previousTime.hours !== strHours) {
    hoursEl.textContent = strHours;
    if (previousTime.hours !== null)
      triggerNumberAnimation(hoursEl, "strong-pulse");
    previousTime.hours = strHours;
  }

  if (previousTime.days !== strDays) {
    daysEl.textContent = strDays;
    if (previousTime.days !== null)
      triggerNumberAnimation(daysEl, "strong-pulse");
    previousTime.days = strDays;
  }
}

function triggerNumberAnimation(element, animationClass) {
  element.classList.remove("scale-pulse", "strong-pulse");
  void element.offsetWidth;
  element.classList.add(animationClass);
}

function triggerCelebration() {
  countdownView.classList.add("hidden");
  celebrationView.classList.remove("hidden");

  for (let i = 0; i < 80; i++) {
    setTimeout(createConfetti, i * 50);
  }
}

/* ==========================================================================
   Canvas 1: Balon Layar Penuh (Tepat 4 Balon)
   ========================================================================== */
const balloonCanvas = document.getElementById("balloon-canvas");
const bCtx = balloonCanvas.getContext("2d");

let bWidth = (balloonCanvas.width = window.innerWidth);
let bHeight = (balloonCanvas.height = window.innerHeight);

const BALLOON_PALETTES = [
  { light: "#ffb8cb", base: "#ff91ae", stroke: "rgba(230, 110, 145, 0.45)" }, // Pink
  { light: "#bfe5ff", base: "#8ec8f6", stroke: "rgba(100, 165, 225, 0.45)" }, // Baby Blue
  { light: "#dfcbff", base: "#be9eff", stroke: "rgba(155, 120, 225, 0.45)" }, // Lavender
  { light: "#ffd8be", base: "#ffb488", stroke: "rgba(235, 140, 95, 0.45)" }, // Peach
];

let balloons = [];

function initBalloons() {
  balloons = [];

  // Tepat 4 Balon
  const balloonPositions = [
    { xRel: 0.08, yRel: 0.32, r: 29, paletteIdx: 0, speed: 0.0016 },
    { xRel: 0.12, yRel: 0.68, r: 26, paletteIdx: 1, speed: 0.0021 },
    { xRel: 0.92, yRel: 0.3, r: 28, paletteIdx: 2, speed: 0.0018 },
    { xRel: 0.88, yRel: 0.66, r: 27, paletteIdx: 3, speed: 0.0022 },
  ];

  balloonPositions.forEach((pos, idx) => {
    balloons.push({
      baseX: pos.xRel * bWidth,
      baseY: pos.yRel * bHeight,
      radius: pos.r,
      palette: BALLOON_PALETTES[pos.paletteIdx],
      speed: pos.speed,
      phaseX: idx * 1.5,
      phaseY: idx * 1.0,
      phaseRot: idx * 1.8,
      ampX: 10 + (idx % 2) * 3,
      ampY: 12 + (idx % 2) * 4,
      ampRot: 0.07 + (idx % 2) * 0.02,
      stringLength: 52 + (idx % 2) * 15,
    });
  });
}

function drawBalloon(b, time) {
  const currentX = b.baseX + Math.sin(time * b.speed + b.phaseX) * b.ampX;
  const currentY =
    b.baseY + Math.cos(time * (b.speed * 1.2) + b.phaseY) * b.ampY;
  const currentRot = Math.sin(time * (b.speed * 0.9) + b.phaseRot) * b.ampRot;

  bCtx.save();
  bCtx.translate(currentX, currentY);
  bCtx.rotate(currentRot);

  const r = b.radius;

  // 1. Tali Balon
  bCtx.beginPath();
  bCtx.moveTo(0, r * 1.15);
  const wave = Math.sin(time * 0.0025 + b.phaseX) * 6;
  bCtx.quadraticCurveTo(
    wave,
    r * 1.15 + b.stringLength * 0.5,
    wave * 0.4,
    r * 1.15 + b.stringLength,
  );
  bCtx.strokeStyle = "rgba(170, 140, 165, 0.4)";
  bCtx.lineWidth = 1.4;
  bCtx.stroke();

  // 2. Simpul Bawah Balon
  bCtx.beginPath();
  bCtx.moveTo(-4, r * 1.15);
  bCtx.lineTo(4, r * 1.15);
  bCtx.lineTo(0, r * 1.05);
  bCtx.closePath();
  bCtx.fillStyle = b.palette.base;
  bCtx.fill();
  bCtx.strokeStyle = b.palette.stroke;
  bCtx.lineWidth = 1.2;
  bCtx.stroke();

  // 3. Badan Balon
  bCtx.beginPath();
  bCtx.moveTo(0, -r * 1.15);
  bCtx.bezierCurveTo(r * 1.15, -r * 1.15, r * 1.1, r * 0.7, 0, r * 1.1);
  bCtx.bezierCurveTo(-r * 1.1, r * 0.7, -r * 1.15, -r * 1.15, 0, -r * 1.15);
  bCtx.closePath();

  const grad = bCtx.createLinearGradient(-r * 0.5, -r * 0.8, r * 0.5, r * 0.9);
  grad.addColorStop(0, b.palette.light);
  grad.addColorStop(1, b.palette.base);
  bCtx.fillStyle = grad;
  bCtx.fill();

  bCtx.strokeStyle = b.palette.stroke;
  bCtx.lineWidth = 1.6;
  bCtx.stroke();

  // 4. Kilau Glossy
  bCtx.beginPath();
  bCtx.ellipse(
    -r * 0.35,
    -r * 0.45,
    r * 0.22,
    r * 0.1,
    Math.PI / 3.8,
    0,
    Math.PI * 2,
  );
  bCtx.fillStyle = "rgba(255, 255, 255, 0.72)";
  bCtx.fill();

  bCtx.beginPath();
  bCtx.arc(-r * 0.18, -r * 0.65, r * 0.07, 0, Math.PI * 2);
  bCtx.fillStyle = "rgba(255, 255, 255, 0.6)";
  bCtx.fill();

  bCtx.restore();
}

/* ==========================================================================
   Canvas 2: Love di Sekitar Kotak Countdown (Ikut Terskrol)
   ========================================================================== */
const heartCanvas = document.getElementById("heart-canvas");
const hCtx = heartCanvas.getContext("2d");

const HEART_PALETTES = [
  { light: "#ffc2d4", base: "#ff8da9", stroke: "rgba(235, 105, 140, 0.5)" }, // Sweet Pink
  { light: "#ffe0eb", base: "#ffaec9", stroke: "rgba(240, 120, 160, 0.5)" }, // Blush
  { light: "#e8d7ff", base: "#c9a6ff", stroke: "rgba(165, 125, 235, 0.5)" }, // Lilac Rose
  { light: "#ffd1dc", base: "#ff9fb2", stroke: "rgba(230, 115, 140, 0.5)" }, // Soft Berry
];

let loveHearts = [];

function initLoveHearts() {
  const rect = mainCard.getBoundingClientRect();
  heartCanvas.width = rect.width;
  heartCanvas.height = rect.height;

  loveHearts = [];

  const gridRect = countdownGrid.getBoundingClientRect();
  const cardRect = mainCard.getBoundingClientRect();

  const relLeft = gridRect.left - cardRect.left;
  const relRight = gridRect.right - cardRect.left;
  const relTop = gridRect.top - cardRect.top;
  const relBottom = gridRect.bottom - cardRect.top;
  const relWidth = gridRect.width;

  const heartAnchors = [
    { x: relLeft - 8, y: relTop - 12, r: 16, paletteIdx: 0 },
    { x: relLeft + relWidth * 0.5, y: relTop - 16, r: 14, paletteIdx: 1 },
    { x: relRight + 8, y: relTop - 8, r: 17, paletteIdx: 2 },
    {
      x: relLeft - 18,
      y: relTop + (relBottom - relTop) * 0.55,
      r: 15,
      paletteIdx: 3,
    },
    {
      x: relRight + 18,
      y: relTop + (relBottom - relTop) * 0.6,
      r: 16,
      paletteIdx: 0,
    },
    { x: relLeft + relWidth * 0.75, y: relBottom + 12, r: 14, paletteIdx: 2 },
  ];

  heartAnchors.forEach((pos, idx) => {
    loveHearts.push({
      baseX: pos.x,
      baseY: pos.y,
      radius: pos.r,
      palette: HEART_PALETTES[pos.paletteIdx],
      speed: 0.0018 + (idx % 3) * 0.0003,
      phaseX: idx * 1.5,
      phaseY: idx * 1.1 + 0.8,
      phaseRot: idx * 1.3,
      ampX: 5 + (idx % 2) * 2,
      ampY: 6 + (idx % 2) * 3,
      ampRot: 0.08 + (idx % 2) * 0.02,
    });
  });
}

function drawLoveHeart(h, time) {
  const currentX = h.baseX + Math.sin(time * h.speed + h.phaseX) * h.ampX;
  const currentY =
    h.baseY + Math.cos(time * (h.speed * 1.2) + h.phaseY) * h.ampY;
  const currentRot = Math.sin(time * (h.speed * 0.95) + h.phaseRot) * h.ampRot;

  hCtx.save();
  hCtx.translate(currentX, currentY);
  hCtx.rotate(currentRot);

  const r = h.radius;

  // Bentuk Badan Hati
  hCtx.beginPath();
  const topY = -r * 0.4;
  hCtx.moveTo(0, topY + r * 0.35);
  hCtx.bezierCurveTo(
    -r * 0.05,
    topY - r * 0.55,
    -r * 1.1,
    topY - r * 0.5,
    -r * 1.1,
    topY + r * 0.25,
  );
  hCtx.bezierCurveTo(
    -r * 1.1,
    topY + r * 0.85,
    -r * 0.35,
    topY + r * 1.25,
    0,
    topY + r * 1.55,
  );
  hCtx.bezierCurveTo(
    r * 0.35,
    topY + r * 1.25,
    r * 1.1,
    topY + r * 0.85,
    r * 1.1,
    topY + r * 0.25,
  );
  hCtx.bezierCurveTo(
    r * 1.1,
    topY - r * 0.5,
    r * 0.05,
    topY - r * 0.55,
    0,
    topY + r * 0.35,
  );
  hCtx.closePath();

  const grad = hCtx.createLinearGradient(-r * 0.6, -r * 0.8, r * 0.6, r * 0.9);
  grad.addColorStop(0, h.palette.light);
  grad.addColorStop(1, h.palette.base);
  hCtx.fillStyle = grad;
  hCtx.fill();

  hCtx.strokeStyle = h.palette.stroke;
  hCtx.lineWidth = 1.5;
  hCtx.stroke();

  // Kilau Glossy
  hCtx.beginPath();
  hCtx.ellipse(
    -r * 0.52,
    topY - r * 0.05,
    r * 0.24,
    r * 0.1,
    -Math.PI / 4,
    0,
    Math.PI * 2,
  );
  hCtx.fillStyle = "rgba(255, 255, 255, 0.72)";
  hCtx.fill();

  hCtx.beginPath();
  hCtx.arc(-r * 0.28, topY - r * 0.28, r * 0.07, 0, Math.PI * 2);
  hCtx.fillStyle = "rgba(255, 255, 255, 0.6)";
  hCtx.fill();

  hCtx.restore();
}

/* ==========================================================================
   Loop Animasi
   ========================================================================== */
function animateAll(timestamp) {
  bCtx.clearRect(0, 0, bWidth, bHeight);
  for (let i = 0; i < balloons.length; i++) {
    drawBalloon(balloons[i], timestamp);
  }

  hCtx.clearRect(0, 0, heartCanvas.width, heartCanvas.height);
  for (let i = 0; i < loveHearts.length; i++) {
    drawLoveHeart(loveHearts[i], timestamp);
  }

  requestAnimationFrame(animateAll);
}

window.addEventListener("resize", () => {
  bWidth = balloonCanvas.width = window.innerWidth;
  bHeight = balloonCanvas.height = window.innerHeight;
  initBalloons();
  initLoveHearts();
});

/* ==========================================================================
   Partikel Bintang & Confetti
   ========================================================================== */
const confettiColors = [
  "#ff9aa2",
  "#ffb7b2",
  "#ffdac1",
  "#e2f0cb",
  "#b5ead7",
  "#c7ceea",
];

function createStar() {
  const star = document.createElement("div");
  star.className = "twinkle-star";
  star.textContent = "✦";
  star.style.left = `${Math.random() * 92 + 4}vw`;
  star.style.top = `${Math.random() * 88 + 6}vh`;

  particleContainer.appendChild(star);
  setTimeout(() => star.remove(), 2000);
}

function createConfetti() {
  const confetti = document.createElement("div");
  confetti.className = "confetti-piece";
  confetti.style.left = `${Math.random() * 100}vw`;
  confetti.style.top = "-10px";
  confetti.style.backgroundColor =
    confettiColors[Math.floor(Math.random() * confettiColors.length)];
  confetti.style.width = `${Math.random() * 8 + 6}px`;
  confetti.style.height = `${Math.random() * 12 + 8}px`;

  const duration = Math.random() * 3 + 3;
  confetti.style.animationDuration = `${duration}s`;

  particleContainer.appendChild(confetti);
  setTimeout(() => confetti.remove(), duration * 1000);
}

/* ==========================================================================
   Inisialisasi
   ========================================================================== */
function init() {
  initBalloons();
  initLoveHearts();
  requestAnimationFrame(animateAll);

  updateCountdown();
  countdownTimer = setInterval(updateCountdown, 1000);

  setInterval(createStar, 1500);
}

document.addEventListener("DOMContentLoaded", init);
