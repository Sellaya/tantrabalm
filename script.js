// Add loaded class for initial animations
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 100);
});

// Advanced scroll reveal
const observerOptions = {
  root: null,
  rootMargin: '0px 0px -100px 0px',
  threshold: 0.15
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Optional: stop observing after it's visible once
      // observer.unobserve(entry.target); 
    }
  });
}, observerOptions);

document.querySelectorAll('.reveal, .reveal-scale').forEach(el => observer.observe(el));

// Nav scroll effect
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const targetId = a.getAttribute('href');
    if(targetId === '#') {
      e.preventDefault();
      return;
    }
    
    // Only smooth scroll if the link is an anchor on the same page
    if(targetId.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(targetId);
      if (target) {
        const navHeight = nav.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY;
        
        window.scrollTo({
          top: targetPosition - navHeight,
          behavior: 'smooth'
        });
      }
    }
  });
});

// Form Handling
const handleFormSubmit = (formId, buttonId) => {
  const form = document.getElementById(formId);
  const button = document.getElementById(buttonId);
  
  if (form && button) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Save original text
      const originalText = button.innerText;
      
      // Update button state
      button.innerText = 'SUBMITTING...';
      button.style.pointerEvents = 'none';
      button.style.opacity = '0.8';
      
      // Simulate network request
      setTimeout(() => {
        window.location.href = 'thank-you.html';
      }, 1200);
    });
  }
};

handleFormSubmit('notify-form', 'notify-submit');
handleFormSubmit('distributor-form', 'distributor-submit');
