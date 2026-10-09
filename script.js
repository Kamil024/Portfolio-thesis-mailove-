document.getElementById('year').textContent = new Date().getFullYear();

const photoGallery = document.getElementById('photo-gallery');
if (photoGallery) {
  for (let i = 1; i <= 26; i += 1) {
    const card = document.createElement('div');
    card.className = 'showcase-card';

    const placeholder = document.createElement('div');
    placeholder.className = 'showcase-placeholder image-placeholder';

    const image = document.createElement('img');
    image.src = `Photos/${i}.png`;
    image.alt = `Portfolio photo ${i}`;

    placeholder.appendChild(image);
    card.appendChild(placeholder);
    photoGallery.appendChild(card);
  }
}

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
const galleryImages = () => Array.from(document.querySelectorAll('.showcase-placeholder img'));
let currentLightboxIndex = -1;

const openLightbox = (image) => {
  const images = galleryImages();
  currentLightboxIndex = images.indexOf(image);

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
  currentLightboxIndex = -1;
};

const navigateLightbox = (direction) => {
  if (!lightbox.classList.contains('visible')) return;

  const images = galleryImages();
  if (!images.length) return;

  if (currentLightboxIndex === -1) {
    currentLightboxIndex = 0;
  }

  const nextIndex = (currentLightboxIndex + direction + images.length) % images.length;
  currentLightboxIndex = nextIndex;
  openLightbox(images[nextIndex]);
};

const bindGalleryImages = () => {
  galleryImages().forEach((image) => {
    image.addEventListener('click', () => openLightbox(image));
  });
};

bindGalleryImages();

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeLightbox();
    return;
  }

  if (!lightbox.classList.contains('visible')) return;

  if (event.key === 'ArrowRight') {
    navigateLightbox(1);
  }

  if (event.key === 'ArrowLeft') {
    navigateLightbox(-1);
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
