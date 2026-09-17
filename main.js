const year = document.querySelector("#year");
if (year) year.textContent = String(new Date().getFullYear());

const updateScrollProgress = () => {
  const available = document.documentElement.scrollHeight - window.innerHeight;
  const progress = available > 0 ? (window.scrollY / available) * 100 : 0;
  document.body.style.setProperty("--scroll-progress", `${Math.min(100, progress)}%`);
};

updateScrollProgress();
window.addEventListener("scroll", updateScrollProgress, { passive: true });

const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
const targets = navLinks
  .map((link) => ({ link, section: document.querySelector(link.getAttribute("href")) }))
  .filter((item) => item.section);

if ("IntersectionObserver" in window && targets.length) {
  const visible = new Map();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
      }
      const current = [...targets]
        .sort((a, b) => (visible.get(b.section.id) || 0) - (visible.get(a.section.id) || 0))[0];
      for (const { link, section } of targets) {
        if (current && visible.get(current.section.id) > 0 && section === current.section) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      }
    },
    { rootMargin: "-15% 0px -55% 0px", threshold: [0, 0.1, 0.25, 0.5, 1] }
  );
  for (const { section } of targets) observer.observe(section);
}

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = [...document.querySelectorAll(".project-card, .about-intro, .detail-block, .skill-group")];

if (!reducedMotion && "IntersectionObserver" in window) {
  document.body.classList.add("reveal-ready");
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -6%" }
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 3, 2) * 70}ms`;
    revealObserver.observe(item);
  });
}

for (const card of document.querySelectorAll(".project-card")) {
  card.addEventListener("pointermove", (event) => {
    const bounds = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${event.clientX - bounds.left}px`);
    card.style.setProperty("--my", `${event.clientY - bounds.top}px`);
  });
}
