// Hero demo: step through the extraction gates, highlighting what each one reads on the page.
(function () {
  const figure = document.querySelector(".extract");
  if (!figure) return;

  const stepped = figure.querySelectorAll("[data-step]");
  const rows = figure.querySelectorAll(".fields tbody tr");
  const replay = figure.querySelector(".replay");
  const steps = rows.length;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let timers = [];

  function setStep(step, on) {
    figure.querySelectorAll('[data-step="' + step + '"]').forEach(function (el) {
      el.classList.toggle("on", on);
    });
  }

  function showAll() {
    for (let i = 0; i < steps; i++) setStep(i, true);
  }

  function run() {
    timers.forEach(clearTimeout);
    timers = [];
    stepped.forEach(function (el) { el.classList.remove("on"); });
    replay.hidden = true;

    for (let i = 0; i < steps; i++) {
      timers.push(setTimeout(function () { setStep(i, true); }, 1100 + i * 1000));
    }
    timers.push(setTimeout(function () { replay.hidden = false; }, 1100 + steps * 1000));
  }

  if (reduceMotion) {
    showAll();
    return;
  }

  replay.addEventListener("click", run);
  run();
})();

// Theme toggle: flips between light and dark and remembers the choice.
(function () {
  const toggle = document.querySelector(".theme-toggle");
  if (!toggle) return;
  const root = document.documentElement;

  toggle.addEventListener("click", function () {
    const current = root.dataset.theme ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
  });
})();

// Scroll reveal for cards and sections, plus active nav link.
(function () {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }

  const revealer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  items.forEach(function (el) { revealer.observe(el); });
})();

// Active nav link. Picks the last section whose top has scrolled past the
// header. Experience and Toolkit share a row on wide screens, so a section
// that starts level with the one before it never takes over by scrolling;
// clicking its link still highlights it.
(function () {
  const links = Array.prototype.slice.call(document.querySelectorAll(".site-header nav a"));
  const sections = links.map(function (a) { return document.querySelector(a.getAttribute("href")); });
  let pinned = null;

  function highlight(id) {
    links.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + id); });
  }

  function update() {
    if (pinned) return highlight(pinned);

    const line = window.innerHeight * 0.35;
    let active = null;
    let activeTop = -Infinity;
    sections.forEach(function (el) {
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      if (top <= line && top > activeTop + 2) { active = el.id; activeTop = top; }
    });

    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (atBottom) active = sections[sections.length - 1].id;
    highlight(active);
  }

  links.forEach(function (a) {
    a.addEventListener("click", function () {
      pinned = a.getAttribute("href").slice(1);
      highlight(pinned);
    });
  });

  // A real scroll by the visitor releases a clicked link; the smooth scroll
  // the click itself starts does not.
  ["wheel", "touchmove", "keydown"].forEach(function (type) {
    window.addEventListener(type, function () { pinned = null; }, { passive: true });
  });

  window.addEventListener("scroll", update, { passive: true });
  update();
})();

// Copy email button.
(function () {
  const btn = document.querySelector(".copy");
  if (!btn || !navigator.clipboard) { if (btn) btn.hidden = true; return; }
  btn.addEventListener("click", function () {
    navigator.clipboard.writeText(btn.dataset.email).then(function () {
      btn.textContent = "Copied ✓";
      setTimeout(function () { btn.textContent = "Copy email"; }, 1800);
    });
  });
})();

// Footer clock in Bengaluru time.
(function () {
  const clock = document.querySelector(".clock");
  if (!clock) return;
  const fmt = new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata" });
  function tick() { clock.textContent = fmt.format(new Date()); }
  tick();
  setInterval(tick, 30000);
})();
