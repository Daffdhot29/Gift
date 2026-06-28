const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let W, H, DPR;

const pinks = ["#FF69B4", "#FF85C1", "#FFB6C1", "#F78FB3", "#FF1493"];
const petalColors = ["#FFB6C1", "#FF85C1", "#FFD1DC", "#F78FB3"];

let stars = [];
let petals = [];

function isMobile() {
  return window.innerWidth < 600;
}

function resize() {
  DPR = window.devicePixelRatio || 1;

  W = window.innerWidth;
  H = window.innerHeight;

  canvas.width = W * DPR;
  canvas.height = H * DPR;

  canvas.style.width = `${W}px`;
  canvas.style.height = `${H}px`;

  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

  createParticles();
}

function createParticles() {
  const starCount = isMobile() ? 70 : 120;
  const petalCount = isMobile() ? 28 : 45;

  stars = Array.from({ length: starCount }, () => ({
    x: Math.random() * W,
    y: Math.random() * H * 0.52,
    r: Math.random() * 2 + 1,
    alpha: Math.random() * Math.PI * 2,
  }));

  petals = Array.from({ length: petalCount }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    size: Math.random() * (isMobile() ? 5 : 8) + (isMobile() ? 4 : 6),
    speed: Math.random() * 0.9 + 0.4,
    sway: Math.random() * 2 + 0.5,
    color: petalColors[Math.floor(Math.random() * petalColors.length)],
    angle: Math.random() * Math.PI * 2,
  }));
}

window.addEventListener("resize", resize);
resize();

function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, 0, H);
  gradient.addColorStop(0, "#FFF4FA");
  gradient.addColorStop(0.55, "#FFE3F0");
  gradient.addColorStop(1, "#FFD6E8");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);
}

function drawMoon() {
  const moonSize = isMobile() ? 28 : 45;
  const x = W - (isMobile() ? 58 : 120);
  const y = isMobile() ? 62 : 110;

  ctx.beginPath();
  ctx.fillStyle = "#FFE6A7";
  ctx.arc(x, y, moonSize, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = "#FFF4FA";
  ctx.arc(x + moonSize * 0.48, y - moonSize * 0.35, moonSize * 0.92, 0, Math.PI * 2);
  ctx.fill();
}

function drawStars() {
  stars.forEach((s) => {
    s.alpha += 0.025;
    const glow = Math.abs(Math.sin(s.alpha));

    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 255, 255, ${0.35 + glow * 0.65})`;
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawPetal(x, y, size, color, angle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = color;

  ctx.beginPath();
  ctx.ellipse(0, 0, size * 0.6, size, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawFlower(x, y, size, color, stemEndX, stemEndY) {
  ctx.strokeStyle = "#2E8B57";
  ctx.lineWidth = Math.max(2, size * 0.08);
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(
    (x + stemEndX) / 2,
    y + size * 1.8,
    stemEndX,
    stemEndY
  );
  ctx.stroke();

  for (let i = 0; i < 18; i++) {
    const angle = (Math.PI * 2 * i) / 18;
    const px = x + Math.cos(angle) * size * 0.48;
    const py = y + Math.sin(angle) * size * 0.48;

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(angle);

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.32, size * 0.72, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  ctx.beginPath();
  ctx.fillStyle = "#FFD54F";
  ctx.arc(x, y, size * 0.28, 0, Math.PI * 2);
  ctx.fill();
}

function getLayout() {
  const mobile = isMobile();

  return {
    cx: W / 2,
    bouquetY: mobile ? H * 0.23 : H * 0.32,
    wrapperY: mobile ? H * 0.43 : H * 0.53,
    scale: mobile ? Math.min(0.62, W / 430) : 1,
  };
}

function drawWrapper() {
  const { cx, wrapperY: cy, scale } = getLayout();

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  ctx.fillStyle = "#F8BBD0";
  ctx.beginPath();
  ctx.moveTo(-210, -120);
  ctx.lineTo(-90, 120);
  ctx.lineTo(0, 70);
  ctx.lineTo(90, 120);
  ctx.lineTo(210, -120);
  ctx.lineTo(120, 165);
  ctx.lineTo(0, 220);
  ctx.lineTo(-120, 165);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#F48FB1";
  ctx.beginPath();
  ctx.moveTo(-145, -80);
  ctx.lineTo(0, 70);
  ctx.lineTo(145, -80);
  ctx.lineTo(75, 160);
  ctx.lineTo(0, 190);
  ctx.lineTo(-75, 160);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "#D81B60";
  ctx.lineWidth = 12;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-120, 115);
  ctx.lineTo(120, 115);
  ctx.stroke();

  ctx.fillStyle = "#C2185B";
  ctx.beginPath();
  ctx.arc(0, 115, 18, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawBouquet() {
  const { cx, bouquetY: cy, wrapperY, scale } = getLayout();

  const stemEndX = cx;
  const stemEndY = wrapperY + 70 * scale;

  const flowers = [
    [-170, 80, 38],
    [-110, 30, 42],
    [-50, -5, 44],
    [0, -25, 48],
    [50, -5, 44],
    [110, 30, 42],
    [170, 80, 38],
    [-70, 95, 40],
    [70, 95, 40],
    [0, 75, 44],
  ];

  flowers.forEach((f, i) => {
    drawFlower(
      cx + f[0] * scale,
      cy + f[1] * scale,
      f[2] * scale,
      pinks[i % pinks.length],
      stemEndX,
      stemEndY
    );
  });
}

function animatePetals() {
  petals.forEach((p) => {
    p.y += p.speed;
    p.x += Math.sin(p.y * 0.02) * p.sway;
    p.angle += 0.015;

    if (p.y > H + 20) {
      p.y = -20;
      p.x = Math.random() * W;
    }

    drawPetal(p.x, p.y, p.size, p.color, p.angle);
  });
}

function animate() {
  ctx.clearRect(0, 0, W, H);

  drawBackground();
  drawMoon();
  drawStars();

  drawWrapper();
  drawBouquet();

  animatePetals();

  requestAnimationFrame(animate);
}

animate();