/**
 * Srinivas AI Studio - Affordable AI Content Creation
 * Main Application JavaScript
 */

// Video Protection - Add to window object for global access
window.VideoProtection = {
  init() {
    this.disableContextMenu();
    this.disableKeyboardShortcuts();
    this.disableDragAndDrop();
    this.disableTextSelection();
    this.addConsoleWarning();
    this.preventPrintScreen();
  },

  disableContextMenu() {
    document.addEventListener('contextmenu', (e) => {
      if (e.target.tagName === 'VIDEO' || 
          e.target.closest('.video-card') || 
          e.target.closest('.video-modal') ||
          e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
      }
    });
  },

  disableKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // F12 (DevTools)
      if (e.keyCode === 123) {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+I (DevTools)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault();
        return false;
      }
      // Ctrl+U (View Source)
      if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
        return false;
      }
      // Ctrl+S (Save Page)
      if (e.ctrlKey && e.keyCode === 83) {
        e.preventDefault();
        return false;
      }
      // Disable copying on protected content
      if (e.ctrlKey && (e.keyCode === 67 || e.keyCode === 65 || e.keyCode === 88)) {
        if (e.target.tagName === 'VIDEO' || 
            e.target.closest('.video-card') || 
            e.target.closest('.video-modal')) {
          e.preventDefault();
          return false;
        }
      }
    });
  },

  disableDragAndDrop() {
    document.addEventListener('dragstart', (e) => {
      if (e.target.tagName === 'VIDEO' || 
          e.target.tagName === 'IMG' ||
          e.target.closest('.video-card')) {
        e.preventDefault();
        return false;
      }
    });
  },

  disableTextSelection() {
    const style = document.createElement('style');
    style.textContent = `
      .video-card, .video-modal video, .video-thumbnail img {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
        -webkit-tap-highlight-color: transparent !important;
      }
    `;
    document.head.appendChild(style);
  },

  preventPrintScreen() {
    document.addEventListener('keyup', (e) => {
      if (e.keyCode === 44) { // Print Screen
        document.body.style.visibility = 'hidden';
        setTimeout(() => {
          document.body.style.visibility = 'visible';
        }, 100);
      }
    });
  },

  addConsoleWarning() {
    console.clear();
    console.log('%c⚠️ Content Protection Active', 'color: #ff6b6b; font-size: 20px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);');
    console.log('%cThis content is protected by digital rights management.', 'color: #ffa500; font-size: 14px; font-weight: bold;');
    console.log('%cUnauthorized downloading, copying, or distribution is prohibited.', 'color: #666; font-size: 12px;');
    console.log('%cContact srinivas.ai.studio@gmail.com for licensing inquiries.', 'color: #4a9eff; font-size: 12px;');
  }
};

class VideoPortfolio {
  constructor() {
    this.videos = [];
    this.testimonials = [];
    this.currentCategory = 'All';
    this.isLoaded = false;
    
    // Initialize the application
    this.init();
  }

  async init() {
    try {
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.initializeApp());
      } else {
        this.initializeApp();
      }
    } catch (error) {
      console.error('Failed to initialize VEO3 App:', error);
    }
  }

  async initializeApp() {
    console.log('🎬 Initializing Video Portfolio with Protection...');
    
    // Initialize video protection first
    if (window.VideoProtection) {
      window.VideoProtection.init();
    }
    
    // Load data
    await this.loadData();
    
    // Initialize smooth scrolling
    this.initSmoothScroll();
    
    // Initialize GSAP animations
    this.initAnimations();
    
    // Initialize UI components
    this.initNavigation();
    this.initVideoModal();
    this.initContactForm();
    this.initMagneticButtons();
    this.initFloatingContact();
    
    // Render dynamic content
    this.renderVideoGrid();
    this.renderCategoryFilters();
    this.renderTestimonials();
    this.animateStats();
    
    // Initialize hero text animation
    this.initHeroAnimation();
    
    // Set loaded flag
    this.isLoaded = true;
    
    console.log('✅ Video Portfolio initialized with content protection');
  }

  async loadData() {
    try {
      const response = await fetch('data/videos.json');
      const data = await response.json();
      
      this.videos = data.videos || [];
      this.testimonials = data.testimonials || [];
      this.stats = data.stats || {};
      
      console.log(`📹 Loaded ${this.videos.length} videos and ${this.testimonials.length} testimonials`);
    } catch (error) {
      console.error('Failed to load data:', error);
      // Fallback data
      this.videos = [];
      this.testimonials = [];
      this.stats = {};
    }
  }

  initSmoothScroll() {
    // Initialize Lenis smooth scroll
    if (typeof Lenis !== 'undefined') {
      this.lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
      });

      // Animation frame loop
      const raf = (time) => {
        this.lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);

      // Integrate with GSAP ScrollTrigger
      if (typeof ScrollTrigger !== 'undefined') {
        this.lenis.on('scroll', ScrollTrigger.update);
      }
    }

    // Handle anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target && this.lenis) {
          this.lenis.scrollTo(target, { offset: -100 });
        }
      });
    });
  }

  initAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // Scroll progress bar
    gsap.to('.scroll-progress', {
      scaleX: 1,
      transformOrigin: 'left center',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      }
    });

    // Header background on scroll
    gsap.to('.header', {
      backgroundColor: 'rgba(11, 12, 16, 0.95)',
      backdropFilter: 'blur(20px)',
      scrollTrigger: {
        trigger: 'body',
        start: 'top -100px',
        end: 'top -100px',
        toggleActions: 'play none none reverse'
      }
    });

    // Section fade-in animations
    gsap.utils.toArray('.glass-card, .surface-card, .video-card, .timeline-item').forEach((element, index) => {
      gsap.from(element, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        delay: index * 0.1,
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
    });

    // Parallax effects
    gsap.utils.toArray('.hero-background').forEach(bg => {
      gsap.to(bg, {
        y: -100,
        scrollTrigger: {
          trigger: bg,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });

    console.log('✨ GSAP animations initialized');
  }

  initHeroAnimation() {
    if (typeof SplitType === 'undefined') return;

    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.getElementById('hero-subtitle');
    
    if (heroTitle) {
      const splitTitle = new SplitType(heroTitle, { types: 'words' });
      
      gsap.from(splitTitle.words, {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.5
      });
    }

    if (heroSubtitle) {
      gsap.from(heroSubtitle, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 1.2,
        ease: 'power2.out'
      });
    }

    // Hero CTA animation
    gsap.from('#hero-cta', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 1.5,
      ease: 'power2.out'
    });
  }

  initNavigation() {
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const header = document.querySelector('.header');

    if (mobileToggle && mobileMenu) {
      mobileToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        
        // Toggle hamburger icon
        const isOpen = mobileMenu.classList.contains('active');
        mobileToggle.innerHTML = isOpen ? 
          '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' :
          '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
      });

      // Close mobile menu when clicking links
      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          mobileMenu.classList.remove('active');
          mobileToggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
        });
      });
    }

    // Header scroll effect
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 100) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }
      
      lastScrollY = currentScrollY;
    });
  }

  renderCategoryFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    if (!filterTabs.length) return;

    // Add click handlers to existing filter tabs
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.currentCategory = tab.dataset.category;
        this.updateCategoryFilters();
        this.filterVideos();
      });
    });

    console.log(`🎯 Initialized ${filterTabs.length} category filters`);
  }

  updateCategoryFilters() {
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.category === this.currentCategory);
    });
  }

  renderVideoGrid() {
    const gridContainer = document.getElementById('video-grid');
    if (!gridContainer || !this.videos.length) return;

    gridContainer.innerHTML = this.videos.map(video => `
      <div class="video-card" data-category="${video.category}" data-video-id="${video.id}">
        <div class="video-thumbnail">
          <video class="video-preview" muted loop playsinline preload="metadata" draggable="false">
            <source src="${video.src}" type="video/mp4">
          </video>
          <div class="video-overlay">
            <div class="play-button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>
          </div>
          <div class="video-protection-overlay"></div>
        </div>
        <div class="video-info">
          <h3 class="video-title">${video.title}</h3>
          <p class="video-description">${video.description}</p>
          <div class="video-meta">
            <span class="video-category">${video.category}</span>
            <span class="video-duration">${video.duration}</span>
          </div>
        </div>
      </div>
    `).join('');

    // Add hover effects for video previews
    gridContainer.querySelectorAll('.video-card').forEach(card => {
      const video = card.querySelector('.video-preview');
      
      // Add loading state
      video.setAttribute('data-loading', 'true');
      
      // Remove loading state when video can play
      video.addEventListener('canplay', () => {
        video.removeAttribute('data-loading');
      });
      
      video.addEventListener('loadeddata', () => {
        video.removeAttribute('data-loading');
      });
      
      card.addEventListener('mouseenter', () => {
        video.play().catch(e => console.log('Preview play failed:', e));
      });
      
      card.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0;
      });
      
      card.addEventListener('click', () => {
        const videoId = card.dataset.videoId;
        const videoData = this.videos.find(v => v.id === videoId);
        if (videoData) {
          this.openVideoModal(videoData);
        }
      });
      
      // Disable right-click on cards
      card.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
      });
    });

    console.log(`🎬 Rendered ${this.videos.length} video cards with video previews and protection`);
  }

  filterVideos() {
    const cards = document.querySelectorAll('.video-card');
    
    cards.forEach(card => {
      const category = card.dataset.category;
      const shouldShow = this.currentCategory === 'All' || category === this.currentCategory;
      
      if (shouldShow) {
        card.style.display = '';
        gsap.from(card, { opacity: 0, y: 20, duration: 0.4 });
      } else {
        card.style.display = 'none';
      }
    });
  }

  initVideoModal() {
    const modal = document.getElementById('video-modal');
    const video = document.getElementById('modal-video');
    const closeBtn = document.getElementById('modal-close');

    if (!modal || !video || !closeBtn) return;

    const closeModal = () => {
      modal.classList.remove('active');
      video.pause();
      video.src = '';
      document.body.style.overflow = '';
      
      // Remove focus trap
      document.removeEventListener('keydown', this.handleModalKeydown);
    };

    closeBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // Keyboard navigation
    this.handleModalKeydown = (e) => {
      if (e.key === 'Escape') closeModal();
    };
  }

  openVideoModal(video) {
    const modal = document.getElementById('video-modal');
    const videoElement = document.getElementById('modal-video');
    
    if (!modal || !videoElement) return;

    // Clear any existing source
    videoElement.innerHTML = '';
    
    // Create source element for local video
    const source = document.createElement('source');
    source.src = video.src;  // Use the src directly from JSON
    source.type = 'video/mp4';
    videoElement.appendChild(source);
    
    // Add video protection attributes
    videoElement.controls = true;
    videoElement.controlsList = 'nodownload noremoteplayback';
    videoElement.disablePictureInPicture = true;
    videoElement.setAttribute('oncontextmenu', 'return false;');
    videoElement.preload = 'metadata';
    
    // Add watermark overlay
    let watermark = modal.querySelector('.video-watermark');
    if (!watermark) {
      watermark = document.createElement('div');
      watermark.className = 'video-watermark';
      modal.querySelector('.video-modal-content').appendChild(watermark);
    }
    watermark.textContent = 'Srinivas AI Studio • ' + video.title;
    
    // Load and show modal with animation
    videoElement.load();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Auto play when loaded
    videoElement.addEventListener('loadeddata', () => {
      videoElement.play().catch(e => console.log('Modal video autoplay failed:', e));
    });
    
    // Focus management
    document.addEventListener('keydown', this.handleModalKeydown);
    
    // Additional protection events
    videoElement.addEventListener('loadedmetadata', () => {
      // Disable picture-in-picture
      if ('pictureInPictureEnabled' in document) {
        videoElement.disablePictureInPicture = true;
      }
    });
    
    // Analytics (if implemented)
    this.trackEvent('video_view', { video_id: video.id, title: video.title });
    
    console.log(`🎥 Opened video modal for: ${video.title}`);
  }

  renderTestimonials() {
    const container = document.getElementById('testimonials-slider');
    if (!container || !this.testimonials.length) return;

    container.innerHTML = this.testimonials.map(testimonial => `
      <div class="testimonial-card">
        <blockquote class="testimonial-quote">"${testimonial.quote}"</blockquote>
        <div class="testimonial-author">
          <img src="${testimonial.avatar}" alt="${testimonial.author}" class="testimonial-avatar">
          <div class="testimonial-info">
            <h4>${testimonial.author}</h4>
            <p class="testimonial-role">${testimonial.role}, ${testimonial.company}</p>
          </div>
        </div>
      </div>
    `).join('');

    // Initialize Swiper if available
    if (typeof Swiper !== 'undefined') {
      new Swiper(container, {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        breakpoints: {
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          }
        }
      });
    }

    console.log(`💬 Rendered ${this.testimonials.length} testimonials`);
  }

  animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    
    if (!statNumbers.length) return;

    const animateNumber = (element) => {
      const target = parseInt(element.dataset.count);
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        element.textContent = Math.floor(current);
      }, 16);
    };

    // Intersection Observer for stats animation
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateNumber(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => observer.observe(stat));
  }

  initMagneticButtons() {
    const magneticButtons = document.querySelectorAll('.btn-magnetic');
    
    magneticButtons.forEach(button => {
      button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const distance = Math.sqrt(x * x + y * y);
        const maxDistance = 50;
        
        if (distance < maxDistance) {
          const strength = (maxDistance - distance) / maxDistance;
          const moveX = x * strength * 0.3;
          const moveY = y * strength * 0.3;
          
          gsap.to(button, {
            x: moveX,
            y: moveY,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      });

      button.addEventListener('mouseleave', () => {
        gsap.to(button, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.3)'
        });
      });

      // Click ripple effect
      button.addEventListener('click', (e) => {
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: scale(0);
          animation: ripple 600ms linear;
          left: ${x}px;
          top: ${y}px;
          width: ${size}px;
          height: ${size}px;
        `;
        
        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });

    // Add ripple keyframes
    if (!document.querySelector('#ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'ripple-styles';
      style.textContent = `
        @keyframes ripple {
          to { transform: scale(4); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  initContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      // Show loading state
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
      try {
        const formData = new FormData(form);
        
        // Honeypot check
        if (formData.get('_gotcha')) {
          throw new Error('Bot detected');
        }
        
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          status.innerHTML = '<p style="color: var(--success);">✓ Thank you! We\'ll get back to you within 24 hours.</p>';
          form.reset();
          
          // Analytics
          this.trackEvent('form_submission', {
            form_name: 'contact_form',
            project_type: formData.get('project-type'),
            budget: formData.get('budget')
          });
        } else {
          throw new Error('Network error');
        }
      } catch (error) {
        console.error('Form submission error:', error);
        status.innerHTML = '<p style="color: var(--error);">✗ Something went wrong. Please try again or email us directly.</p>';
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Clear status after 10 seconds
        setTimeout(() => {
          status.innerHTML = '';
        }, 10000);
      }
    });

    // Form validation
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        this.validateField(input);
      });
    });
  }

  validateField(field) {
    const isValid = field.checkValidity();
    field.style.borderColor = isValid ? 'var(--line)' : 'var(--error)';
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) existingError.remove();
    
    if (!isValid) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.style.cssText = 'color: var(--error); font-size: var(--font-size-sm); margin-top: var(--space-1);';
      errorDiv.textContent = field.validationMessage;
      field.parentNode.appendChild(errorDiv);
    }
  }

  initFloatingContact() {
    const floatingBtn = document.getElementById('floating-contact');
    if (!floatingBtn) return;

    floatingBtn.addEventListener('click', () => {
      const contactSection = document.getElementById('contact');
      if (contactSection && this.lenis) {
        this.lenis.scrollTo(contactSection, { offset: -100 });
      }
    });

    // Hide on contact section
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: '#contact',
        start: 'top bottom',
        end: 'bottom bottom',
        onEnter: () => gsap.to(floatingBtn, { opacity: 0, duration: 0.3 }),
        onLeave: () => gsap.to(floatingBtn, { opacity: 1, duration: 0.3 }),
        onEnterBack: () => gsap.to(floatingBtn, { opacity: 0, duration: 0.3 }),
        onLeaveBack: () => gsap.to(floatingBtn, { opacity: 1, duration: 0.3 })
      });
    }
  }

  // Analytics helper
  trackEvent(eventName, parameters = {}) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, parameters);
    }
    
    // Plausible Analytics
    if (typeof plausible !== 'undefined') {
      plausible(eventName, { props: parameters });
    }
    
    console.log('📊 Event tracked:', eventName, parameters);
  }

  // Performance monitoring
  measurePerformance() {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0];
        const metrics = {
          loadTime: perfData.loadEventEnd - perfData.fetchStart,
          domContentLoaded: perfData.domContentLoadedEventEnd - perfData.fetchStart,
          firstByte: perfData.responseStart - perfData.fetchStart
        };
        
        console.log('📈 Performance metrics:', metrics);
        this.trackEvent('performance', metrics);
      });
    }
  }

  // Accessibility helpers
  trapFocus(container) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    container.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
  }

  // Reduced motion handling
  handleReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
      // Disable GSAP animations
      if (typeof gsap !== 'undefined') {
        gsap.globalTimeline.timeScale(1000);
      }
      
      // Disable Lenis smooth scroll
      if (this.lenis) {
        this.lenis.destroy();
      }
      
      console.log('♿ Reduced motion preferences detected - animations disabled');
    }
  }
}

// Initialize the application
const videoPortfolioApp = new VideoPortfolio();

// Export for global access
window.VideoPortfolioApp = videoPortfolioApp;
