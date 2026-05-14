const revealTargets = document.querySelectorAll(".section, .panel, .feature-copy");

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  },
  {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px",
  }
);

revealTargets.forEach((element, index) => {
  if (element.closest(".page-hero") || element.closest(".hero-home")) return;
  element.classList.add("reveal");
  element.style.transitionDelay = `${Math.min(index * 30, 180)}ms`;
  observer.observe(element);
});
