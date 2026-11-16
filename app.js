(function () {
"use strict";
/* cada página nueva empieza arriba; "atrás" del navegador sí conserva la posición */
try {
  var navType = (performance.getEntriesByType("navigation")[0] || {}).type;
  if (navType !== "back_forward") {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    var toTop = function () {
      window.scrollTo(0, 0);
      var t = document.getElementById("top") || document.body;
      try { t.scrollIntoView({ block: "start", behavior: "instant" }); } catch (e) {}
    };
    toTop();
    document.addEventListener("DOMContentLoaded", toTop);
    window.addEventListener("load", function () { toTop(); setTimeout(toTop, 150); });
  }
} catch (e) {}
var $ = function (s, c) { return (c || document).querySelector(s); };
var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var motion = { on: !reduce };
var hasGsap = !!(window.gsap && window.ScrollTrigger) && !reduce;
function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
function pad(n) { return (n < 10 ? "0" : "") + n; }

/* ───── DATOS ───── */
var ANTHROPIC = ["AI Fluency: AI Capabilities & Limitations", "AI Fluency: Framework & Foundations", "AI Fluency for Students", "AI Fluency for Educators", "AI Fluency for Nonprofits", "AI Fluency for K-12 Educators", "AI Fluency for Small Business", "AI Fluency for Builders", "AI Fluency for Creative Work", "Teaching the AI Fluency Framework", "Claude 101", "Claude Platform", "Introduction to Claude Cowork", "Introduction to Subagents", "Claude Code in Action", "Introduction to Agent Skills", "Introduction to Model Context Protocol"];
var FORM = [
  { t: "Técnico en Gestión Administrativa", s: "IES Pedro Mercedes · procesos administrativos y organización documental", d: "Jun 2024" },
  { t: "Administración y Finanzas", s: "IES Pedro Mercedes · grado superior de gestión empresarial", d: "Sep 2024 — Jul 2026" },
  { t: "Análisis de datos con Power BI", s: "CEOE · visualización y apoyo a proyectos", d: "2025" },
  { t: "Competencias digitales DigComp 2.2, nivel C2", s: "UCLM · el nivel máximo del marco europeo", d: "Oct 2026", link: ["assets/docs/digcomp-c2-uclm-2026.pdf", "Ver certificado"] },
  { t: "Grado en Relaciones Laborales y RR. HH.", s: "UCLM · Facultad de CC. Sociales de Cuenca", d: "En curso" },
  { t: "Anthropic Academy · 17 certificaciones", s: "IA generativa, Claude, Claude Code y MCP · verificables en Skilljar", d: "15 Jul — Oct 2026", open: ANTHROPIC }
];
var EXPE = [
  { t: "Obrescam · Administrativo", s: "Contratado tras las prácticas: gestión, organización y seguimiento documental", d: "Jun — Sep 2026" },
  { t: "Obrescam · Prácticas", s: "Apoyo administrativo y las dos automatizaciones en Python de la página de Desarrollo", d: "Abr — Jun 2026" },
  { t: "MRW · Prácticas", s: "Oficina de franquicia: correos, llamadas, rutas y herramientas digitales", d: "Abr — Jun 2024" }
];
var SOS_E = [
  { t: "Clima Cuenca SLU · Socorrista", s: "Vuelta a la empresa: vigilancia, atención al público e incidencias", d: "Jun — Sep 2026" },
  { t: "Clima Cuenca SLU · Socorrista", s: "Vigilancia de piscinas, control del material de rescate e instalaciones", d: "Jun — Sep 2025" },
  { t: "Virtual Cuenca · Monitor y desarrollo", s: "Sesiones de realidad virtual, soporte en sala y desarrollo de Skyrun", d: "Feb 2025 — Jun 2026" },
  { t: "Centro Ortega y Gasset · Monitor", s: "Planificación, seguridad y dinamización de juegos y grupos", d: "Jun — Jul 2024" }
];
var SOS_F = [
  { t: "Socorrista acuático", s: "Global Encesap · rescate, salvamento y protocolos de seguridad", d: "Nov 2024" },
  { t: "Tiempo libre infantil y juvenil", s: "Iworking · dinamización de actividades educativas", d: "Abr — Jul 2025" },
  { t: "Formación complementaria", s: "Primeros auxilios · coordinador de servicios acuáticos · mantenimiento de piscinas · prevención de riesgos laborales", d: "Certificadas" }
];
var SKILLS = ["Socorrismo acuático", "Primeros auxilios", "Atención a personas", "Dinamización", "Prevención de riesgos", "Supervisión", "Coordinación de servicios", "Calma"];
var TICK = ["Unity", "C#", "FishNet", "VR/XR", "Meta Quest", "Python", "Playwright", "Power BI", "Gestión documental", "Socorrismo acuático", "Primeros auxilios", "Monitoraje", "DigComp C2", "Anthropic Academy"];
var YEARS = [
  { y: "2023", i: [
    { k: "f", n: "Iworking", r: "Desarrollo de aplicaciones multimedia: C#, 3D, Unity, VR y AR", d: "Jul" },
    { k: "e", n: "Iworking", r: "Prácticas de programación en realidad virtual", d: "Jul — Ago" }] },
  { y: "2024", i: [
    { k: "e", n: "MRW", r: "Prácticas de oficina", d: "Abr — Jun" },
    { k: "f", n: "IES Pedro Mercedes", r: "Técnico en Gestión Administrativa", d: "Jun" },
    { k: "e", n: "Centro Ortega y Gasset", r: "Monitor de actividades", d: "Jun — Jul" },
    { k: "f", n: "IES Pedro Mercedes", r: "Administración y Finanzas (inicio)", d: "Sep" },
    { k: "f", n: "Global Encesap", r: "Socorrista acuático", d: "Nov" }] },
  { y: "2025", i: [
    { k: "e", n: "Virtual Cuenca", r: "Monitor de VR y desarrollo de Skyrun", d: "Feb →" },
    { k: "f", n: "Iworking", r: "Dinamización de tiempo libre", d: "Abr — Jul" },
    { k: "e", n: "Clima Cuenca SLU", r: "Socorrista acuático", d: "Jun — Sep" },
    { k: "f", n: "CEOE", r: "Análisis de datos con Power BI", d: "2025" }] },
  { y: "2026", i: [
    { k: "e", n: "Obrescam", r: "Prácticas administrativas y automatizaciones", d: "Abr — Jun" },
    { k: "e", n: "Virtual Cuenca", r: "Fin de la etapa como monitor y desarrollador", d: "→ Jun" },
    { k: "e", n: "Obrescam", r: "Administrativo con contrato", d: "Jun — Sep" },
    { k: "e", n: "Clima Cuenca SLU", r: "Socorrista acuático", d: "Jun — Sep" },
    { k: "f", n: "Anthropic Academy", r: "17 certificaciones de IA y Claude", d: "Jul — Oct" },
    { k: "f", n: "UCLM", r: "DigComp 2.2 nivel C2", d: "Oct" },
    { k: "f", n: "UCLM", r: "Grado en Relaciones Laborales y RR. HH.", d: "En curso" }] }
];

/* ───── RENDER ───── */
var ICO = {
  ne: '<svg viewBox="0 0 20 20"><path d="M5 15L15 5M7 5h8v8"/></svg>',
  plus: '<svg viewBox="0 0 20 20"><path d="M10 4v12M4 10h12"/></svg>'
};
function rowHTML(o, uid) {
  var more = "", extra = "";
  if (o.open) {
    more = '<div class="more" id="m' + uid + '"><div><ul class="certs">' + o.open.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("") + "</ul></div></div>";
  }
  if (o.link) { extra = '<div class="r-extra"><a class="lnk mono" href="' + o.link[0] + '" target="_blank" rel="noopener">' + o.link[1] + "</a></div>"; }
  var tag = o.open ? "button" : "div";
  var attrs = o.open ? ' type="button" aria-expanded="false" aria-controls="m' + uid + '"' : "";
  return '<li class="row' + (o.open ? " xp" : "") + '" data-cur><' + tag + ' class="r-in"' + attrs + '><span class="r-main"><span class="r-t">' + esc(o.t) + '</span><span class="r-s">' + esc(o.s) + '</span></span><span class="r-d mono">' + esc(o.d) + '</span><span class="r-a" aria-hidden="true">' + (o.open ? ICO.plus : ICO.ne) + "</span></" + tag + ">" + more + extra + "</li>";
}
function fill(id, arr, off) {
  var el = $(id); if (!el) return;
  el.innerHTML = arr.map(function (o, i) { return rowHTML(o, (off || "") + i); }).join("");
}
function rep(arr, n) { var h = ""; for (var i = 0; i < n; i++) { h += arr.map(function (t) { return "<span>" + esc(t) + "</span>"; }).join(""); } return h; }

fill("#rows-f", FORM, "f"); fill("#rows-e", EXPE, "e"); fill("#rows-s1", SOS_E, "s"); fill("#rows-s2", SOS_F, "t");
if ($("#hz-track")) {
  $("#hz-track").innerHTML = YEARS.map(function (y) {
    return '<article class="yr' + (y.i.length > 5 ? " wide" : "") + '"><h2 class="yr-n">' + y.y + "</h2><ul>" + y.i.map(function (it) {
      return '<li data-cur><span class="dot ' + it.k + '"></span><span><b>' + esc(it.n) + "</b><small>" + esc(it.r) + '</small></span><time class="mono">' + esc(it.d) + "</time></li>";
    }).join("") + "</ul></article>";
  }).join("") + '<div style="flex:none;width:max(var(--gut),6vw)"></div>';
}
if ($("#tk1")) $("#tk1").innerHTML = rep(TICK, 2);
if ($("#tk2")) $("#tk2").innerHTML = rep(SKILLS, 2);
if ($("#h-vigilar")) {
  var word = $("#h-vigilar").getAttribute("data-word") || "";
  $("#h-vigilar").innerHTML = word.split("").map(function (c, i) { return '<span style="--i:' + i + '">' + c + "</span>"; }).join("");
}

/* filas expandibles */
$$(".row.xp").forEach(function (li) {
  var b = $(".r-in", li);
  b.addEventListener("click", function () {
    var open = li.classList.toggle("open"); b.setAttribute("aria-expanded", open);
    setTimeout(function () { if (hasGsap) ScrollTrigger.refresh(); }, 500);
  });
});

/* texto de la portada: se lee palabra a palabra con el scroll */
var mani = $("#mani");
if (mani) {
  mani.innerHTML = mani.textContent.split(/(\s+)/).map(function (w) { return /^\s+$/.test(w) ? w : '<span class="w">' + esc(w) + "</span>"; }).join("");
}

/* copiar */
$$("[data-copy]").forEach(function (b) {
  b.addEventListener("click", function () {
    var v = b.getAttribute("data-copy"), old = b.textContent;
    function ok() { b.textContent = "Copiado"; setTimeout(function () { b.textContent = old; }, 1600); }
    function sel() {
      var r = document.createRange(); r.selectNodeContents(b.previousElementSibling);
      var s = getSelection(); s.removeAllRanges(); s.addRange(r);
      b.textContent = "Selecciónalo y copia"; setTimeout(function () { b.textContent = old; }, 2200);
    }
    try { navigator.clipboard.writeText(v).then(ok, sel); } catch (e) { sel(); }
  });
});

/* menú móvil */
var ov = $("#ov"), mb = $("#menu");
if (mb && ov) {
  mb.addEventListener("click", function () { var o = ov.classList.toggle("open"); mb.setAttribute("aria-expanded", o); mb.textContent = o ? "Cerrar" : "Índice"; });
}

/* vídeo de la demo */
var demo = $("#demo");
if (demo) {
  var vid = $("video", demo);
  var setPaused = function (p) { demo.classList.toggle("paused", p); $("#demo-t").textContent = p ? "Demo técnica · pulsa para reproducir" : "Demo técnica · Skyrun en 60 s"; };
  demo.addEventListener("click", function () { if (vid.paused) { vid.play().catch(function () {}); } else { vid.pause(); } });
  vid.addEventListener("play", function () { setPaused(false); });
  vid.addEventListener("pause", function () { setPaused(true); });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && e.intersectionRatio > 0.5) { vid.play().catch(function () {}); }
        else if (!e.isIntersecting) { vid.pause(); }
      });
    }, { threshold: [0, 0.5] }).observe(demo);
  }
  setPaused(true);
}

/* movimiento sí / no */
var motBtn = $("#mot"), tweens = [];
function setMotion(on) {
  motion.on = on; document.documentElement.classList.toggle("still", !on);
  motBtn.textContent = "Movimiento: " + (on ? "sí" : "no"); motBtn.setAttribute("aria-pressed", String(!on));
  tweens.forEach(function (t) { on ? t.resume() : t.pause(); });
}
if (motBtn) {
  if (reduce) { motBtn.hidden = true; }
  motBtn.addEventListener("click", function () { setMotion(!motion.on); });
}

/* ───── CANVAS ───── */
function sizeCanvas(c) {
  var dpr = Math.min(window.devicePixelRatio || 1, 2), w = c.clientWidth, h = c.clientHeight;
  c.width = Math.max(1, Math.round(w * dpr)); c.height = Math.max(1, Math.round(h * dpr));
  var x = c.getContext("2d"); x.setTransform(dpr, 0, 0, dpr, 0, 0); return { x: x, w: w, h: h };
}
var mouse = { x: -9999, y: -9999, has: false };
window.addEventListener("pointermove", function (e) { mouse.x = e.clientX; mouse.y = e.clientY; mouse.has = e.pointerType !== "touch"; });
function onScreen(el) {
  var vis = true;
  if ("IntersectionObserver" in window) { new IntersectionObserver(function (es) { vis = es[0].isIntersecting; }).observe(el); }
  return function () { return vis; };
}
function loop(vis, fn) {
  var drawn = false;
  function f(ts) { requestAnimationFrame(f); if (!vis()) return; if (!motion.on && drawn) return; drawn = true; fn(ts); }
  requestAnimationFrame(f);
}
function canvasFx(id, setup) {
  var c = $(id); if (!c) return;
  var st = { c: c, S: null };
  function build() { st.S = sizeCanvas(c); if (st.rebuild) st.rebuild(); }
  setup(st);
  build(); window.addEventListener("resize", build);
  loop(onScreen(c), function (ts) { st.draw(ts); });
}

/* campo de puntos de la portada */
canvasFx("#field", function (st) {
  var pts = [];
  st.rebuild = function () {
    var S = st.S, g = Math.max(26, Math.min(38, S.w / 38)); pts = [];
    for (var yy = g / 2; yy < S.h; yy += g) for (var xx = g / 2; xx < S.w; xx += g) pts.push([xx, yy]);
  };
  st.draw = function (ts) {
    var S = st.S, x = S.x, t = ts / 1000, r = st.c.getBoundingClientRect(), mx, my;
    if (mouse.has) { mx = mouse.x - r.left; my = mouse.y - r.top; } else { mx = S.w * (0.5 + 0.34 * Math.sin(t * 0.45)); my = S.h * (0.5 + 0.26 * Math.sin(t * 0.63 + 1)); }
    x.clearRect(0, 0, S.w, S.h);
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i], dx = p[0] - mx, dy = p[1] - my, d = Math.sqrt(dx * dx + dy * dy), f = Math.max(0, 1 - d / 240), f2 = f * f;
      var wv = Math.sin(p[0] * 0.011 + p[1] * 0.009 + t * 1.1);
      var ox = d > 0 ? dx / d * f2 * 38 : 0, oy = d > 0 ? dy / d * f2 * 38 : 0;
      var a = 0.16 + 0.08 * wv + f * 0.75, s = 1.1 + f2 * 3.4 + wv * 0.25;
      x.fillStyle = f > 0.28 ? "rgba(255,74,28," + Math.min(1, a + 0.1) + ")" : "rgba(236,235,229," + a + ")";
      x.fillRect(p[0] + ox - s / 2, p[1] + oy - s / 2, s, s);
    }
  };
});

/* rejilla en perspectiva (Desarrollo) */
var gridBoost = 0;
canvasFx("#grid", function (st) {
  var off = 0, last = 0;
  st.draw = function (ts) {
    var S = st.S, dt = Math.min(0.05, (ts - last) / 1000 || 0.016); last = ts;
    gridBoost *= 0.94; off += dt * (0.14 + gridBoost);
    var x = S.x, w = S.w, h = S.h, hor = h * 0.62, vp = w * 0.5 + (mouse.has ? (mouse.x / innerWidth - 0.5) * 60 : 0);
    x.clearRect(0, 0, w, h);
    var N = 22, i, k;
    for (i = -N; i <= N; i++) {
      var bx = vp + i * (w * 0.115), a = 0.16 * (1 - Math.abs(i) / N);
      x.strokeStyle = i % 4 === 0 ? "rgba(255,74,28," + (a + 0.1) + ")" : "rgba(236,235,229," + a * 0.6 + ")"; x.lineWidth = 1;
      x.beginPath(); x.moveTo(vp + i * 6, hor); x.lineTo(bx, h); x.stroke();
    }
    var K = 18;
    for (k = 0; k < K; k++) {
      var z = ((k + (off % 1)) / K), y = hor + (h - hor) * Math.pow(z, 2.3), al = Math.pow(z, 1.2) * 0.3;
      x.strokeStyle = "rgba(236,235,229," + al + ")"; x.lineWidth = 1; x.beginPath(); x.moveTo(0, y); x.lineTo(w, y); x.stroke();
    }
    var hg = x.createLinearGradient(0, hor - 50, 0, hor + 50); hg.addColorStop(0, "rgba(255,74,28,0)"); hg.addColorStop(0.5, "rgba(255,74,28,.22)"); hg.addColorStop(1, "rgba(255,74,28,0)");
    x.fillStyle = hg; x.fillRect(0, hor - 50, w, 100);
    var fade = x.createLinearGradient(0, 0, 0, h); fade.addColorStop(0, "rgba(11,11,12,1)"); fade.addColorStop(0.42, "rgba(11,11,12,.96)"); fade.addColorStop(0.62, "rgba(11,11,12,0)");
    x.fillStyle = fade; x.fillRect(0, 0, w, h);
  };
  $$(".spec li").forEach(function (li) { li.addEventListener("mouseenter", function () { gridBoost = Math.min(1.6, gridBoost + 0.9); }); });
});

/* olas (Socorrismo) */
var waveAmp = 1;
canvasFx("#waves", function (st) {
  var L = [{ c: "rgba(8,48,63,.55)", a: 0.55, f: 1.1, s: 0.5, y: 0.46 }, { c: "rgba(8,60,78,.6)", a: 0.7, f: 1.6, s: -0.7, y: 0.58 }, { c: "rgba(6,38,52,.9)", a: 0.6, f: 2.1, s: 0.9, y: 0.7 }, { c: "#04161f", a: 0.5, f: 2.8, s: -1.2, y: 0.84 }];
  st.draw = function (ts) {
    waveAmp += (1 - waveAmp) * 0.04;
    var S = st.S, x = S.x, w = S.w, h = S.h, t = ts / 1000, mx = mouse.has ? mouse.x / innerWidth : 0.5;
    x.fillStyle = "#0b0b0c"; x.fillRect(0, 0, w, h);
    for (var l = 0; l < L.length; l++) {
      var o = L[l], ys = []; x.beginPath(); x.moveTo(0, h);
      for (var px = 0; px <= w; px += 8) {
        var u = px / w, y = h * o.y + Math.sin(u * Math.PI * 2 * o.f + t * o.s + mx * 3) * h * 0.07 * o.a * waveAmp + Math.sin(u * Math.PI * 7 * o.f - t * o.s * 1.3) * h * 0.018 * waveAmp;
        ys.push(y); x.lineTo(px, y);
      }
      x.lineTo(w, h); x.closePath(); x.fillStyle = o.c; x.fill();
      if (l === L.length - 1) {
        x.beginPath(); for (var q = 0; q < ys.length; q++) { q ? x.lineTo(q * 8, ys[q]) : x.moveTo(0, ys[0]); }
        x.strokeStyle = "rgba(159,216,230,.5)"; x.lineWidth = 1.2; x.stroke();
      }
    }
  };
});

/* ───── GSAP ───── */
if (!hasGsap) return;
gsap.registerPlugin(ScrollTrigger);
document.documentElement.classList.add("gsap-ready");

var pct = $("#pct"), prog = $("#prog");
ScrollTrigger.create({ start: 0, end: "max", onUpdate: function (s) {
  if (pct) pct.textContent = pad(Math.round(s.progress * 100));
  if (prog) gsap.set(prog, { scaleX: s.progress });
} });

/* cursor */
var cur = $("#cur");
if (cur && matchMedia("(hover:hover) and (pointer:fine)").matches) {
  var qx = gsap.quickTo(cur, "x", { duration: 0.15, ease: "power3" }), qy = gsap.quickTo(cur, "y", { duration: 0.15, ease: "power3" });
  window.addEventListener("pointermove", function (e) {
    if (e.pointerType === "touch") return;
    document.documentElement.classList.add("has-cur");
    cur.classList.add("on"); qx(e.clientX); qy(e.clientY);
  });
  document.addEventListener("pointerover", function (e) { cur.classList.toggle("big", !!(e.target.closest && e.target.closest("[data-cur],a,button"))); });
  document.addEventListener("pointerleave", function () { cur.classList.remove("on"); });
}

/* portada: entrada única */
if ($(".name")) {
  gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.1 })
    .to(".name .in", { y: 0, yPercent: 0, duration: 0.9, stagger: 0.08 }, 0)
    .to(".hero-top", { opacity: 1, duration: 0.7 }, 0.35)
    .to(".hero-foot", { opacity: 1, duration: 0.8 }, 0.5)
    .to(".ticker", { opacity: 1, duration: 0.8 }, 0.65)
    .from("#field", { opacity: 0, duration: 1.4 }, 0);
}
if ($("#tk1")) tweens.push(gsap.to("#tk1", { xPercent: -50, ease: "none", duration: 38, repeat: -1 }));
if ($("#tk2")) tweens.push(gsap.to("#tk2", { xPercent: -50, ease: "none", duration: 46, repeat: -1 }));

/* portada: lectura palabra a palabra */
if (mani) gsap.to("#mani .w", { opacity: 1, ease: "none", stagger: 0.12, scrollTrigger: { trigger: "#mani", start: "top 82%", end: "bottom 52%", scrub: true } });

/* títulos que se rellenan */
$$(".mega .f").forEach(function (f) {
  gsap.to(f, { clipPath: "inset(0 0% 0 0)", ease: "none", scrollTrigger: { trigger: f.parentNode, start: "top 88%", end: "bottom 38%", scrub: 0.4 } });
});
/* títulos con máscara */
$$(".mega.mk").forEach(function (el) {
  gsap.to($$(".mask>span", el), { y: 0, yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: el, start: "top 92%", once: true } });
});

/* rejilla y agua reaccionan a la velocidad del scroll */
if ($("#grid")) ScrollTrigger.create({ start: 0, end: "max", onUpdate: function (s) { gridBoost = Math.min(2.2, Math.max(gridBoost, Math.abs(s.getVelocity()) / 1800)); } });
if ($("#waves")) ScrollTrigger.create({ start: 0, end: "max", onUpdate: function (s) { waveAmp = Math.min(2.4, Math.max(waveAmp, 1 + Math.abs(s.getVelocity()) / 1400)); } });

/* medidor de profundidad */
if ($("#gauge")) {
  var gauge = $("#gauge"), depth = $("#depth"), buoy = $("#buoy");
  ScrollTrigger.create({ trigger: ".sos-grid", start: "top 45%", end: "bottom bottom",
    onToggle: function (s) { gauge.classList.toggle("on", s.isActive); },
    onUpdate: function (s) {
      depth.textContent = (s.progress * 3).toFixed(1).replace(".", ",") + " m";
      buoy.style.top = (s.progress * 100) + "%";
    } });
}

/* trayectoria: horizontal en escritorio, vertical en móvil */
if ($("#hz")) {
  var mm = gsap.matchMedia();
  mm.add("(min-width: 901px)", function () {
    var wrap = $("#hz-wrap"), hz = $("#hz"), track = $("#hz-track"), bar2 = $("#hz-prog i");
    var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
    var setH = function () { wrap.style.height = (hz.offsetHeight + dist()) + "px"; };
    setH();
    ScrollTrigger.addEventListener("refreshInit", setH);
    gsap.to(track, { x: function () { return -dist(); }, ease: "none", scrollTrigger: { trigger: wrap, start: "top top+=70", end: function () { return "+=" + dist(); }, scrub: 0.6, invalidateOnRefresh: true,
      onUpdate: function (s) { gsap.set(bar2, { scaleX: s.progress }); } } });
    return function () { ScrollTrigger.removeEventListener("refreshInit", setH); wrap.style.height = ""; };
  });
}

if (window.ResizeObserver && $(".tray-h")) {
  var rt;
  new ResizeObserver(function () { clearTimeout(rt); rt = setTimeout(function () { ScrollTrigger.refresh(); }, 200); }).observe($(".tray-h"));
}
if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
