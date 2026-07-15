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
