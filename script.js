const currentPage = document.body.dataset.page;

if (currentPage) {
  document
    .querySelector(`[data-nav="${currentPage}"]`)
    ?.classList.add("is-active");
}

const revealTargets = [
  ".site-header",
  ".page-intro",
  ".hero-copy",
  ".hero-panel",
  ".grid-section .card",
  ".content-grid .card",
  ".contact-grid .card",
  ".project-list > *"
];

revealTargets.forEach((selector) => {
  document.querySelectorAll(selector).forEach((element, index) => {
    element.setAttribute("data-reveal", "");
    if (selector === ".grid-section .card") {
      element.style.setProperty("--reveal-delay", "0ms");
    } else {
      element.style.setProperty("--reveal-delay", `${index * 90}ms`);
    }
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -8% 0px"
  }
);

document.querySelectorAll("[data-reveal]").forEach((element) => {
  observer.observe(element);
});

const tiltTargets = document.querySelectorAll("[data-tilt], .page-intro, .hero-copy, .hero-panel");

tiltTargets.forEach((element) => {
  element.addEventListener("pointermove", (event) => {
    const rect = element.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const diagonal = Math.hypot(rect.width, rect.height);
    const sizeFactor = Math.min(1.45, Math.max(0.85, 720 / diagonal));
    const maxTilt = 4 * sizeFactor;
    const rotateY = (px - 0.5) * maxTilt;
    const rotateX = (0.5 - py) * maxTilt;

    element.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    element.classList.add("tilt-active");
  });

  element.addEventListener("pointerleave", () => {
    element.style.removeProperty("transform");
    element.classList.remove("tilt-active");
  });
});

document.querySelectorAll('[data-img]').forEach(el => {
  el.style.backgroundImage = `url('${el.dataset.img}')`;
});

// Image modal functionality
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalClose = document.querySelector('.modal-close');
const modalPrev = document.getElementById('modalPrev');
const modalNext = document.getElementById('modalNext');

if (modal && modalImage && modalClose) {
  const thumbs = Array.from(document.querySelectorAll('.thumb'));
  let currentIndex = 0;

  // Open modal when thumbnail is clicked
  thumbs.forEach((thumb, index) => {
    thumb.style.cursor = 'pointer';
    thumb.addEventListener('click', () => {
      const imgSrc = thumb.dataset.img;
      if (imgSrc) {
        currentIndex = index;
        modalImage.src = imgSrc;
        modal.classList.add('is-visible');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Navigate to previous image
  modalPrev?.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + thumbs.length) % thumbs.length;
    const imgSrc = thumbs[currentIndex].dataset.img;
    if (imgSrc) {
      modalImage.src = imgSrc;
    }
  });

  // Navigate to next image
  modalNext?.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % thumbs.length;
    const imgSrc = thumbs[currentIndex].dataset.img;
    if (imgSrc) {
      modalImage.src = imgSrc;
    }
  });

  // Close modal when close button is clicked
  modalClose.addEventListener('click', () => {
    modal.classList.remove('is-visible');
    document.body.style.overflow = '';
  });

  // Close modal when clicking outside the image
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('is-visible');
      document.body.style.overflow = '';
    }
  });

  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-visible')) {
      modal.classList.remove('is-visible');
      document.body.style.overflow = '';
    }
    // Navigate with arrow keys
    if (modal.classList.contains('is-visible')) {
      if (e.key === 'ArrowLeft') {
        currentIndex = (currentIndex - 1 + thumbs.length) % thumbs.length;
        const imgSrc = thumbs[currentIndex].dataset.img;
        if (imgSrc) {
          modalImage.src = imgSrc;
        }
      }
      if (e.key === 'ArrowRight') {
        currentIndex = (currentIndex + 1) % thumbs.length;
        const imgSrc = thumbs[currentIndex].dataset.img;
        if (imgSrc) {
          modalImage.src = imgSrc;
        }
      }
    }
  });
}

const tooltip = document.createElement('div');
tooltip.className = 'marquee-tooltip';
document.body.appendChild(tooltip);

document.querySelectorAll('.marquee-item').forEach(item => {
  item.addEventListener('mouseenter', (e) => {
    tooltip.textContent = item.dataset.info;
    tooltip.classList.add('is-visible');
    positionTooltip(e);
  });
  item.addEventListener('mousemove', positionTooltip);
  item.addEventListener('mouseleave', () => {
    tooltip.classList.remove('is-visible');
  });
});

function positionTooltip(e) {
  const tw = tooltip.offsetWidth;
  const th = tooltip.offsetHeight;
  let x = e.clientX - tw / 2;
  let y = e.clientY - th - 12;
  x = Math.max(8, Math.min(x, window.innerWidth - tw - 8));
  tooltip.style.left = x + 'px';
  tooltip.style.top = y + 'px';
}