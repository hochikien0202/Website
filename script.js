// ====== Small helpers ======
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// Footer year
$("#year").textContent = new Date().getFullYear();

// ====== Mobile menu ======
const toggle = $(".nav__toggle");
const menu = $(".nav__menu");

toggle.addEventListener("click", () => {
  const open = menu.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(open));
});

$$(".nav__link").forEach((a) => {
  a.addEventListener("click", () => {
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  });
});

// Active nav on scroll (simple)
const sections = ["top", "about", "services", "resume", "portfolio", "blog", "contact"]
  .map((id) => (id === "top" ? document.body : document.getElementById(id)))
  .filter(Boolean);

function setActiveLink() {
  const scrollY = window.scrollY + 110;
  let current = "top";

  for (const sec of sections) {
    if (sec === document.body) continue;
    if (sec.offsetTop <= scrollY) current = sec.id;
  }
  $$(".nav__link").forEach((a) => a.classList.remove("is-active"));
  const target = current === "top" ? "#top" : `#${current}`;
  const link = $(`.nav__link[href="${target}"]`);
  if (link) link.classList.add("is-active");
}

window.addEventListener("scroll", setActiveLink);
setActiveLink();

// ====== Particles network background (Canvas) ======
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

let w = 0, h = 0, dpr = 1;
let points = [];
let mouse = { x: null, y: null };

function resize() {
  dpr = Math.max(1, window.devicePixelRatio || 1);
  w = canvas.clientWidth;
  h = canvas.clientHeight;
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  initPoints();
}

function initPoints() {
  const density = Math.max(60, Math.min(120, Math.floor((w * h) / 18000)));
  points = Array.from({ length: density }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.55,
    vy: (Math.random() - 0.5) * 0.55,
    r: Math.random() * 1.6 + 0.7
  }));
}

function draw() {
  ctx.clearRect(0, 0, w, h);

  // points
  for (const p of points) {
    p.x += p.vx;
    p.y += p.vy;

    // bounce
    if (p.x < 0 || p.x > w) p.vx *= -1;
    if (p.y < 0 || p.y > h) p.vy *= -1;

    // draw point
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.fill();
  }

  // lines
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const a = points[i], b = points[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.hypot(dx, dy);

      const maxDist = 140;
      if (dist < maxDist) {
        const alpha = 1 - dist / maxDist;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.22})`;
        ctx.lineWidth = 1;
        ctx.stroke();
