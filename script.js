document.addEventListener('DOMContentLoaded', () => {

  // Navbar scroll effect
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Mobile menu toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
    });
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (link) {
        link.classList.toggle('active', scrollY >= top && scrollY < top + height);
      }
    });
  });

  // Menu category tabs + diet filters
  const tabs = document.querySelectorAll('.tab');
  const dietBtns = document.querySelectorAll('.diet-btn');
  const menuCards = document.querySelectorAll('.menu-card');

  let activeCategory = 'starters';
  let activeDiet = 'all';

  function filterMenu() {
    menuCards.forEach(card => {
      const matchesCategory = card.dataset.category === activeCategory;
      const matchesDiet = activeDiet === 'all' || card.dataset.diet === activeDiet;

      if (matchesCategory && matchesDiet) {
        card.style.display = '';
        card.classList.remove('fade-in');
        card.classList.add('visible');
        card.style.animation = 'none';
        card.offsetHeight;
        card.style.animation = 'fadeInUp 0.4s ease-out';
      } else {
        card.style.display = 'none';
      }
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      activeCategory = tab.dataset.category;
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Hide diet filters for all-veg categories
      const allVegCategories = ['southindian', 'ricebreads', 'desserts', 'drinks'];
      const dietFilters = document.getElementById('dietFilters');
      dietFilters.style.display = allVegCategories.includes(activeCategory) ? 'none' : 'flex';

      // Reset diet filter to 'all' when switching category
      activeDiet = 'all';
      dietBtns.forEach(b => b.classList.toggle('active', b.dataset.diet === 'all'));

      filterMenu();
    });
  });

  dietBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      activeDiet = btn.dataset.diet;
      dietBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterMenu();
    });
  });

  // Scroll-triggered fade-in animations
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll(
    '.about-text, .about-image, .special-card, .why-card, .testimonial-card, .contact-info, .contact-form-wrapper'
  ).forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });

  // Contact form handling
  const contactForm = document.getElementById('contactForm');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = 'Order Sent! ✓';
      btn.style.background = '#2E7D32';
      btn.style.borderColor = '#2E7D32';

      setTimeout(() => {
        contactForm.reset();
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.disabled = false;
      }, 2500);
    }, 1000);
  });

  // Smooth counter animation for stats
  const animateCounters = () => {
    document.querySelectorAll('.stat-number').forEach(stat => {
      const text = stat.textContent;
      const target = parseFloat(text);
      const suffix = text.replace(/[\d.]/g, '');
      const isDecimal = text.includes('.');
      const duration = 1500;
      const start = performance.now();

      const update = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = eased * target;

        stat.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      };

      requestAnimationFrame(update);
    });
  };

  const statsSection = document.querySelector('.about-stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounters();
        statsObserver.unobserve(statsSection);
      }
    }, { threshold: 0.5 });
    statsObserver.observe(statsSection);
  }
});
