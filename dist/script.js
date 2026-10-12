const toggle = document.querySelector('.menu-toggle');

toggle?.addEventListener('click', () => {
  const open = document.body.classList.toggle('menu-open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.textContent = open ? 'Close' : 'Menu';
});

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => {
    document.body.classList.remove('menu-open');
    toggle?.setAttribute('aria-expanded', 'false');
    if (toggle) toggle.textContent = 'Menu';
  });
});

const contactForm = document.querySelector('#contact-form');
const status = document.querySelector('#form-status');

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    return;
  }

  const data = new FormData(contactForm);
  const subject = encodeURIComponent(`Paypertual inquiry — ${data.get('business')}`);
  const body = encodeURIComponent([
    `Name: ${data.get('name')}`,
    `Business: ${data.get('business')}`,
    `Email: ${data.get('email')}`,
    `Phone: ${data.get('phone') || 'Not provided'}`,
    `Industry: ${data.get('industry')}`,
    '',
    'How can Paypertual help?',
    data.get('message')
  ].join('\n'));

  if (status) status.textContent = 'Opening your email app with the details ready to send…';
  window.location.href = `mailto:hello@paypertual.com?subject=${subject}&body=${body}`;
});

document.querySelectorAll('[data-year]').forEach((element) => {
  element.textContent = new Date().getFullYear();
});
