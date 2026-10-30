(function () {
  const root = document.documentElement;

  // Theme is set early in <head>; this just handles the toggle
  document.getElementById("themeToggle").addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  // Mobile menu
  const menuBtn = document.getElementById("menuToggle");
  const links = document.querySelector(".nav-links");
  menuBtn.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      links.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    })
  );

  // Nav border on scroll
  const nav = document.querySelector(".nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Reveal on scroll
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
      }),
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("visible"));
  }

  // Highlight active nav link
  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll(".nav-links a")];
  if ("IntersectionObserver" in window) {
    const so = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          navLinks.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id));
        }
      }),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => so.observe(s));
  }

  // Skills filter
  const chips = document.querySelectorAll(".chip-btn");
  const cards = document.querySelectorAll(".skill-card");
  chips.forEach((chip) =>
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.toggle("active", c === chip));
      const f = chip.dataset.filter;
      cards.forEach((card) => card.classList.toggle("hidden", f !== "all" && card.dataset.cat !== f));
    })
  );

  // Show more / less on long job cards
  document.querySelectorAll(".toggle-more").forEach((btn) =>
    btn.addEventListener("click", () => {
      const card = btn.closest(".job-card");
      const expanded = card.classList.toggle("expanded");
      btn.textContent = expanded ? "Show less" : "Show more";
      btn.setAttribute("aria-expanded", String(expanded));
    })
  );

  // Count-up stats
  const nums = document.querySelectorAll(".stats .num[data-count]");
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && "IntersectionObserver" in window) {
    const co = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target, target = +el.dataset.count, start = performance.now(), dur = 900;
      const tick = (t) => {
        const p = Math.min(1, (t - start) / dur);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      co.unobserve(el);
    }), { threshold: 0.6 });
    nums.forEach((n) => co.observe(n));
  }

  document.getElementById("year").textContent = new Date().getFullYear();
})();
