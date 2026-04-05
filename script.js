const header = document.querySelector(".site-header");
const body = document.body;
const mobileMenu = document.querySelector(".mobile-menu");
const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
const mobileMenuClose = document.querySelector(".mobile-menu-close");
const mobileMenuLinks = document.querySelectorAll(".mobile-menu-panel a");
const heroPanels = document.querySelectorAll(".hero-media-panel");
const parallaxNodes = document.querySelectorAll(".visual, .team-portrait, .gallery-card-dark");
let heroRotationId = null;
let mobileMenuCloseId = null;

const closeMobileMenu = () => {
  if (!mobileMenu || !mobileMenuToggle) return;
  window.clearTimeout(mobileMenuCloseId);
  mobileMenu.classList.remove("is-open");
  mobileMenuToggle.setAttribute("aria-expanded", "false");
  body.classList.remove("menu-open");
  mobileMenuCloseId = window.setTimeout(() => {
    mobileMenu.hidden = true;
  }, 280);
};

const openMobileMenu = () => {
  if (!mobileMenu || !mobileMenuToggle) return;
  window.clearTimeout(mobileMenuCloseId);
  mobileMenu.hidden = false;
  requestAnimationFrame(() => {
    mobileMenu.classList.add("is-open");
  });
  mobileMenuToggle.setAttribute("aria-expanded", "true");
  body.classList.add("menu-open");
};

const updateHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

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

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMobileMenu();
  }
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
