const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let W, H;

const pinks = ["#FF69B4", "#FF85C1", "#FFB6C1", "#F78FB3", "#FF1493"];
const petalColors = ["#FFB6C1", "#FF85C1", "#FFD1DC", "#F78FB3"];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

window.addEventListener("resize", resize);
resize();

const stars = Array.from({ length: 120 }, () => ({
  x: Math.random() * W,
  y: Math.random() * H * 0.55,
  r: Math.random() * 2 + 1,
  alpha: Math.random(),
}));

const petals = Array.from({ length: 45 }, () => ({
  x: Math.random() * W,
  y: Math.random() * H,
  size: Math.random() * 8 + 6,
  speed: Math.random() * 1.2 + 0.5,
  sway: Math.random() * 2,
  color: petalColors[Math.floor(Math.random() * petalColors.length)],
}));

function drawMoon() {
  ctx.beginPath();
  ctx.fillStyle = "#FFE6A7";
  ctx.arc(W - 120, 110, 45, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = "#FFF4FA";
  ctx.arc(W - 98, 95, 42, 0, Math.PI * 2);
  ctx.fill();
}

function drawStars() {
  stars.forEach((s) => {
    s.alpha += 0.02;
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

function drawFlower(x, y, size, color) {
  ctx.strokeStyle = "#2E8B57";
  ctx.lineWidth = 4;

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(W / 2, H * 0.55);
  ctx.stroke();

  for (let i = 0; i < 18; i++) {
    const angle = (Math.PI * 2 * i) / 18;
    const px = x + Math.cos(angle) * size * 0.55;
    const py = y + Math.sin(angle) * size * 0.55;

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(angle);

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.35, size * 0.75, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  ctx.beginPath();
  ctx.fillStyle = "#FFD54F";
  ctx.arc(x, y, size * 0.28, 0, Math.PI * 2);
  ctx.fill();
}

function drawWrapper() {
  const cx = W / 2;
  const cy = H * 0.55;

  ctx.fillStyle = "#F8BBD0";
  ctx.beginPath();
  ctx.moveTo(cx - 210, cy - 120);
  ctx.lineTo(cx - 90, cy + 120);
  ctx.lineTo(cx, cy + 70);
  ctx.lineTo(cx + 90, cy + 120);
  ctx.lineTo(cx + 210, cy - 120);
  ctx.lineTo(cx + 120, cy + 165);
  ctx.lineTo(cx, cy + 220);
  ctx.lineTo(cx - 120, cy + 165);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#F48FB1";
  ctx.beginPath();
  ctx.moveTo(cx - 145, cy - 80);
  ctx.lineTo(cx, cy + 70);
  ctx.lineTo(cx + 145, cy - 80);
  ctx.lineTo(cx + 75, cy + 160);
  ctx.lineTo(cx, cy + 190);
  ctx.lineTo(cx - 75, cy + 160);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "#D81B60";
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.moveTo(cx - 120, cy + 115);
  ctx.lineTo(cx + 120, cy + 115);
  ctx.stroke();

  ctx.fillStyle = "#C2185B";
  ctx.beginPath();
  ctx.arc(cx, cy + 115, 18, 0, Math.PI * 2);
  ctx.fill();
}

function drawBouquet() {
  const cx = W / 2;
  const cy = H * 0.34;

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
    drawFlower(cx + f[0], cy + f[1], f[2], pinks[i % pinks.length]);
  });
}

function animate() {
  ctx.clearRect(0, 0, W, H);

  drawMoon();
  drawStars();
  drawWrapper();
  drawBouquet();

  petals.forEach((p) => {
    p.y += p.speed;
    p.x += Math.sin(p.y * 0.02) * p.sway;

    if (p.y > H + 20) {
      p.y = -20;
      p.x = Math.random() * W;
    }

    drawPetal(p.x, p.y, p.size, p.color, p.y * 0.02);
  });

  requestAnimationFrame(animate);
}

animate();