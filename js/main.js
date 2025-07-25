// Performance optimized initialization
document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements
    const elements = {
        scrollTopBtn: document.getElementById('scroll-top'),
        waitlistForm: document.getElementById('waitlist-form'),
        successMessage: document.getElementById('success-message'),
        header: document.querySelector('.header'),
        sections: document.querySelectorAll('section:not(#hero)'),
        anchors: document.querySelectorAll('a[href^="#"]'),
        lazyImages: document.querySelectorAll('img:not(.hero-logo)')
    };

    // Throttle function for performance
    const throttle = (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };

    // Scroll handler with throttling
    const handleScroll = throttle(() => {
        // Header shadow on scroll
        elements.header.classList.toggle('scrolled', window.scrollY > 50);
        
        // Scroll to top button visibility
        elements.scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Optimized smooth scroll
    elements.scrollTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Enhanced form submission with loading state
    elements.waitlistForm?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitButton = elements.waitlistForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        try {
            // Visual feedback
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            submitButton.classList.add('loading');

            const formData = new FormData(elements.waitlistForm);
            const response = await fetch(elements.waitlistForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Submission failed');

            // Success handling
            elements.successMessage.classList.add('visible');
            elements.waitlistForm.reset();
            
            // Auto-hide success message
            setTimeout(() => {
                elements.successMessage.classList.remove('visible');
            }, 5000);

        } catch (error) {
            console.error('Form submission error:', error);
            alert('Sorry, there was an error. Please try again.');
        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
        }
    });

    // Optimized smooth scroll for anchor links
    elements.anchors.forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Optimized Intersection Observer
    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe sections for animations
    elements.sections.forEach(section => observer.observe(section));

    // Optimize images
    elements.lazyImages.forEach(img => {
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
        // Add error handling for images
        img.addEventListener('error', () => {
            img.style.opacity = '0.5';
            img.style.filter = 'grayscale(1)';
        });
    });

    // Mobile menu functionality
    const navLeft = document.querySelector('.nav-left');
    const navLinks = document.querySelectorAll('.nav-link');

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navLeft.classList.remove('active');
            }
        });
    });

    // Add scroll class to header
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > lastScroll && currentScroll > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });
}); 