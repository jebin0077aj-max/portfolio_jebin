const root = document.documentElement;
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const themeToggle = document.getElementById('themeToggle');

// Mobile navigation: open/close the menu and close it after choosing a section.
menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
  navLinks.classList.toggle('open', !isOpen);
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
  });
});

// Theme toggle. The chosen theme is kept for the current browser session.
themeToggle.addEventListener('click', () => {
  const lightOn = root.classList.toggle('light');
  themeToggle.textContent = lightOn ? '☾' : '☼';
  themeToggle.setAttribute('aria-label', lightOn ? 'Switch to dark theme' : 'Switch to light theme');
});

// Project filter buttons.
const filterButtons = document.querySelectorAll('.filter-button');
const projectCards = document.querySelectorAll('.project-card');
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(item => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    projectCards.forEach(card => {
      card.hidden = filter !== 'all' && card.dataset.category !== filter;
    });
  });
});

// Expand/collapse the learning notes on each project card.
document.querySelectorAll('.details-toggle').forEach(button => {
  button.addEventListener('click', () => {
    const details = button.nextElementSibling;
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    details.hidden = expanded;
    button.querySelector('span').textContent = expanded ? '＋' : '−';
  });
});

// Validate the demo contact form. This does not send or store messages.
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
contactForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    formStatus.textContent = 'Please complete all fields with a valid email address.';
    return;
  }
  const visitor = document.getElementById('visitorName').value.trim();
  formStatus.textContent = `Thanks, ${visitor}! Your form is valid. This demo has not sent a message.`;
  contactForm.reset();
});

// Current year in the footer.
document.getElementById('year').textContent = new Date().getFullYear();

// Highlight the navigation item for the visible section.
const sections = document.querySelectorAll('main section[id]');
const navItems = document.querySelectorAll('.nav-link');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navItems.forEach(link => {
          const active = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('active', active);
        });
      }
    });
  }, { rootMargin: '-35% 0px -55% 0px' });
  sections.forEach(section => observer.observe(section));
}
