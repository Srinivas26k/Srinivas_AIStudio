/**
 * Contact Form Handler for Business Landing Page
 * Handles simplified contact form with Topmate and Patreon integration
 */

class ContactFormHandler {
  constructor() {
    this.topmateURL = 'https://topmate.io/srinivas_nampalli';
    this.patreonURL = 'https://patreon.com/your-page'; // Placeholder - user needs to update
    this.init();
  }

  init() {
    this.setupContactForm();
    this.setupCTAButtons();
  }

  setupContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmission(form, status);
    });

    // Real-time validation
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        this.validateField(input);
      });
      
      input.addEventListener('input', () => {
        this.clearFieldError(input);
      });
    });
  }

  setupCTAButtons() {
    // Primary CTA - Topmate Demo
    const demoCTAs = document.querySelectorAll('[href*="topmate"]');
    demoCTAs.forEach(cta => {
      cta.addEventListener('click', (e) => {
        this.trackEvent('demo_cta_click', { source: 'hero' });
      });
    });

    // Secondary CTA - Scroll to contact
    const contactCTAs = document.querySelectorAll('a[href="#contact"]');
    contactCTAs.forEach(cta => {
      cta.addEventListener('click', (e) => {
        e.preventDefault();
        this.scrollToContact();
        this.trackEvent('contact_cta_click', { source: 'hero' });
      });
    });
  }

  async handleFormSubmission(form, statusElement) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    try {
      // Validate form
      const isValid = this.validateForm(form);
      if (!isValid) {
        throw new Error('Please fill in all required fields correctly.');
      }

      const formData = new FormData(form);
      
      // Extract form data
      const name = formData.get('name').trim();
      const email = formData.get('email').trim();
      const message = formData.get('message').trim();

      // Show success message
      this.showSuccessMessage(statusElement, name);
      
      // Clear form
      form.reset();
      
      // Track submission
      this.trackEvent('form_submission', {
        form_name: 'contact_form',
        has_name: !!name,
        has_email: !!email,
        has_message: !!message
      });

    } catch (error) {
      console.error('Form submission error:', error);
      this.showErrorMessage(statusElement, error.message);
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      
      // Clear status after 10 seconds
      setTimeout(() => {
        if (statusElement) {
          statusElement.innerHTML = '';
        }
      }, 10000);
    }
  }

  validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    let isValid = true;
    let errorMessage = '';

    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'This field is required.';
    }
    // Email validation
    else if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address.';
      }
    }
    // Name validation (minimum length)
    else if (field.name === 'name' && value && value.length < 2) {
      isValid = false;
      errorMessage = 'Name must be at least 2 characters long.';
    }
    // Message validation (minimum length)
    else if (field.name === 'message' && value && value.length < 10) {
      isValid = false;
      errorMessage = 'Message must be at least 10 characters long.';
    }

    this.showFieldError(field, isValid ? '' : errorMessage);
    return isValid;
  }

  showFieldError(field, message) {
    // Remove existing error
    this.clearFieldError(field);

    if (message) {
      field.classList.add('error');
      field.setAttribute('aria-invalid', 'true');
      
      const errorElement = document.createElement('div');
      errorElement.className = 'field-error';
      errorElement.textContent = message;
      errorElement.style.color = 'var(--error)';
      errorElement.style.fontSize = '0.875rem';
      errorElement.style.marginTop = 'var(--space-1)';
      
      field.parentNode.appendChild(errorElement);
    }
  }

  clearFieldError(field) {
    field.classList.remove('error');
    field.removeAttribute('aria-invalid');
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
      existingError.remove();
    }
  }

  showSuccessMessage(statusElement, name) {
    if (!statusElement) return;

    statusElement.innerHTML = `
      <div style="
        background: var(--glass);
        border: 1px solid var(--success);
        border-radius: var(--border-radius);
        padding: var(--space-6);
        text-align: center;
        margin-top: var(--space-6);
      ">
        <div style="color: var(--success); margin-bottom: var(--space-4);">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin: 0 auto;">
            <path d="M9 12l2 2 4-4"/>
            <circle cx="12" cy="12" r="9"/>
          </svg>
        </div>
        <h3 style="color: var(--success); margin-bottom: var(--space-3);">Thank you${name ? `, ${name}` : ''}!</h3>
        <p style="color: var(--text-muted); margin-bottom: var(--space-6);">
          Your message has been received. We'll get back to you within 24 hours.
        </p>
        <div class="contact-options">
          <a href="${this.topmateURL}" target="_blank" rel="noopener" class="btn btn-primary" aria-label="Schedule a free demo on Topmate">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: var(--space-2);">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Schedule Free Demo
          </a>
          <a href="${this.patreonURL}" target="_blank" rel="noopener" class="btn btn-secondary" aria-label="Support us on Patreon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: var(--space-2);">
              <circle cx="12" cy="12" r="10"/>
              <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
              <path d="M12 18V6"/>
            </svg>
            Support on Patreon
          </a>
        </div>
      </div>
    `;
  }

  showErrorMessage(statusElement, message) {
    if (!statusElement) return;

    statusElement.innerHTML = `
      <div style="
        background: var(--glass);
        border: 1px solid var(--error);
        border-radius: var(--border-radius);
        padding: var(--space-6);
        text-align: center;
        margin-top: var(--space-6);
        color: var(--error);
      ">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom: var(--space-2);">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
        <p>${message}</p>
      </div>
    `;
  }

  scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  trackEvent(eventName, properties = {}) {
    // Analytics tracking - can be extended with Google Analytics, Plausible, etc.
    console.log('Event tracked:', eventName, properties);
    
    // Example: Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, properties);
    }
    
    // Example: Plausible
    if (typeof plausible !== 'undefined') {
      plausible(eventName, { props: properties });
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ContactFormHandler();
});

// Smooth scrolling for anchor links (fallback)
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (link) {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ContactFormHandler;
}