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

// Form Handling with Backend Integration
const setupForm = (formId, type) => {
  const form = document.getElementById(formId);
  
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerText;
      
      // Update button state
      submitBtn.innerText = 'SUBMITTING...';
      submitBtn.style.pointerEvents = 'none';
      submitBtn.style.opacity = '0.8';
      
      // Gather Data
      let payload = { formType: type };
      
      if (type === 'notify') {
        payload.email = document.getElementById('notify-email').value;
      } else if (type === 'distributor') {
        payload.company = document.getElementById('biz-name').value;
        payload.name = document.getElementById('contact-name').value;
        payload.email = document.getElementById('contact-email').value;
        payload.phone = document.getElementById('contact-phone').value;
        payload.website = document.getElementById('biz-website').value;
        payload.bizType = document.getElementById('biz-type').value;
        payload.message = document.getElementById('inquiry-message').value;
      }

      try {
        const response = await fetch('/api/submit-form', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        
        if (data.success) {
          window.location.href = 'thank-you.html';
        } else {
          alert('Something went wrong. Please try again.');
          submitBtn.innerText = originalText;
          submitBtn.style.pointerEvents = 'auto';
          submitBtn.style.opacity = '1';
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('An error occurred. Please check your connection and try again.');
        submitBtn.innerText = originalText;
        submitBtn.style.pointerEvents = 'auto';
        submitBtn.style.opacity = '1';
      }
    });
  }
};

setupForm('notify-form', 'notify');
setupForm('distributor-form', 'distributor');
