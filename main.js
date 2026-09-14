const year = document.querySelector("#year");
if (year) year.textContent = String(new Date().getFullYear());

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
