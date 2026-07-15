document.getElementById('year').textContent = new Date().getFullYear();

const loaderScreen = document.getElementById('loader-screen');
window.addEventListener('load', () => {
  setTimeout(() => {
    loaderScreen.classList.add('hidden');
  }, 1400);
});

const cursor = document.getElementById('cursor-dot');

window.addEventListener('mousemove', (event) => {
  cursor.style.left = `${event.clientX}px`;
  cursor.style.top = `${event.clientY}px`;
});

const hoverTargets = document.querySelectorAll('a, button, .brand-logo, .showcase-card, .btn');
hoverTargets.forEach((target) => {
  target.addEventListener('mouseenter', () => cursor.classList.add('is-hovering'));
  target.addEventListener('mouseleave', () => cursor.classList.remove('is-hovering'));
});

const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxClose = document.getElementById('lightbox-close');

const openLightbox = (image) => {
  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightbox.classList.add('visible');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lightbox-open');
  cursor.classList.add('is-lightbox');
};

const closeLightbox = () => {
  lightbox.classList.remove('visible');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lightbox-open');
  cursor.classList.remove('is-lightbox');
  cursor.classList.remove('is-hovering');
};

document.querySelectorAll('.showcase-placeholder img').forEach((image) => {
  image.addEventListener('click', () => openLightbox(image));
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeLightbox();
  }
});

const revealElements = document.querySelectorAll('.section, .hero-card, .info-card, .showcase-card, .contributors-block, .timeline-item');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
      }
    });
  },
  {
    threshold: 0.12,
  }
);

revealElements.forEach((element) => {
  element.classList.add('reveal');
  revealObserver.observe(element);
});
