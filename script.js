const siteHeader = document.querySelector(".site-header");

const revealTargets = document.querySelectorAll(
  ".section, .panel, .feature-copy, .video-showcase, .real-host-panel, .flow-node"
);

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

if (siteHeader) {
  const updateHeader = () => {
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 32);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

document.querySelectorAll(".profile-card").forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = `${(((event.clientX - rect.left) / rect.width) * 100).toFixed(1)}%`;
    const y = `${(((event.clientY - rect.top) / rect.height) * 100).toFixed(1)}%`;
    card.style.setProperty("--mx", x);
    card.style.setProperty("--my", y);
  });
});
