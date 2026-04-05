const header = document.querySelector(".site-header");
const body = document.body;
const mobileMenu = document.querySelector(".mobile-menu");
const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
const mobileMenuClose = document.querySelector(".mobile-menu-close");
const mobileMenuLinks = document.querySelectorAll(".mobile-menu-panel a");
const revealItems = document.querySelectorAll(
  ".intro-block, .care-section, .experience-strip, .gallery-section, .team-section, .proof-band, .reviews-section, .visit-section, .site-footer",
);
const heroPanels = document.querySelectorAll(".hero-media-panel");
const parallaxNodes = document.querySelectorAll(".visual, .team-portrait, .gallery-card-dark");
let heroRotationId = null;

const closeMobileMenu = () => {
  if (!mobileMenu || !mobileMenuToggle) return;
  mobileMenu.hidden = true;
  mobileMenuToggle.setAttribute("aria-expanded", "false");
  body.classList.remove("menu-open");
};

const openMobileMenu = () => {
  if (!mobileMenu || !mobileMenuToggle) return;
  mobileMenu.hidden = false;
  mobileMenuToggle.setAttribute("aria-expanded", "true");
  body.classList.add("menu-open");
};

const updateHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.18 },
);

revealItems.forEach((item) => revealObserver.observe(item));

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });

const updateParallax = () => {
  const heroImage = document.querySelector(".hero-media-panel.is-active img") || heroPanels[0]?.querySelector("img");

  if (heroImage) {
    const offset = Math.min(window.scrollY * 0.06, 36);
    heroImage.style.transform = `scale(1.08) translateY(${offset}px)`;
  }

  parallaxNodes.forEach((node, index) => {
    const rect = node.getBoundingClientRect();
    const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
    const shift = Math.max(Math.min(progress * 18 - 9, 9), -9);
    const baseShift = node.classList.contains("visual-wide") ? 64 : 0;
    const direction = index % 2 === 0 ? 1 : -1;
    node.style.transform = `translateY(${baseShift + shift * direction}px)`;
  });
};

const setupHeroRotation = () => {
  if (heroRotationId) {
    window.clearInterval(heroRotationId);
    heroRotationId = null;
  }

  heroPanels.forEach((panel, index) => {
    panel.classList.toggle("is-active", index === 0);
  });

  if (window.innerWidth > 640 || heroPanels.length < 2) {
    return;
  }

  let activeIndex = 0;
  heroRotationId = window.setInterval(() => {
    heroPanels[activeIndex].classList.remove("is-active");
    activeIndex = (activeIndex + 1) % heroPanels.length;
    heroPanels[activeIndex].classList.add("is-active");
  }, 2000);
};

if (mobileMenuToggle) {
  mobileMenuToggle.addEventListener("click", () => {
    const isOpen = mobileMenuToggle.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      closeMobileMenu();
      return;
    }

    openMobileMenu();
  });
}

if (mobileMenuClose) {
  mobileMenuClose.addEventListener("click", closeMobileMenu);
}

mobileMenuLinks.forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

setupHeroRotation();
updateParallax();
window.addEventListener("scroll", updateParallax, { passive: true });
window.addEventListener("resize", () => {
  setupHeroRotation();

  if (window.innerWidth > 640) {
    closeMobileMenu();
  }
}, { passive: true });
