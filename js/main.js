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
        if (elements.header) {
            elements.header.classList.toggle('scrolled', window.scrollY > 50);
        }
        
        // Scroll to top button visibility
        if (elements.scrollTopBtn) {
            elements.scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
        }
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Optimized smooth scroll
    if (elements.scrollTopBtn) {
        elements.scrollTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

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

    // Professional Scroll Animations
    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger animation for the element itself
                if (entry.target.classList.contains('slide-in-left') || 
                    entry.target.classList.contains('slide-in-right') || 
                    entry.target.classList.contains('slide-in-bottom') || 
                    entry.target.classList.contains('slide-in-top') || 
                    entry.target.classList.contains('fade-in-scale')) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translate(0, 0)';
                }
                
                // Add staggered animations for child elements
                const animatedElements = entry.target.querySelectorAll('.slide-in-left, .slide-in-right, .slide-in-bottom, .slide-in-top, .fade-in-scale');
                animatedElements.forEach((el, index) => {
                    setTimeout(() => {
                        el.style.opacity = '1';
                        el.style.transform = 'translate(0, 0)';
                    }, index * 200); // Stagger by 200ms
                });
                
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
    
    // Observe ALL individual animated elements
    const allAnimatedElements = document.querySelectorAll('.slide-in-left, .slide-in-right, .slide-in-bottom, .slide-in-top, .fade-in-scale');
    allAnimatedElements.forEach(el => {
        // Set initial state
        el.style.opacity = '0';
        if (el.classList.contains('slide-in-left')) {
            el.style.transform = 'translateX(-80px)';
        } else if (el.classList.contains('slide-in-right')) {
            el.style.transform = 'translateX(80px)';
        } else if (el.classList.contains('slide-in-bottom')) {
            el.style.transform = 'translateY(80px)';
        } else if (el.classList.contains('slide-in-top')) {
            el.style.transform = 'translateY(-80px)';
        } else {
            el.style.transform = 'translateY(30px)';
        }
        
        // Observe each animated element individually
        observer.observe(el);
    });

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

    // Optimize videos - lazy load and pause when out of view
    const allVideos = document.querySelectorAll('video');
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            
            // Hero video and security hero video always play
            if (video.classList.contains('hero-video') || video.classList.contains('security-video')) {
                video.play().catch(err => console.log('Video autoplay prevented:', err));
                return;
            }
            
            if (entry.isIntersecting) {
                // Play video when in view
                video.play().catch(err => console.log('Video autoplay prevented:', err));
            } else {
                // Pause video when out of view to save resources
                video.pause();
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '100px'
    });

    allVideos.forEach(video => {
        videoObserver.observe(video);
        // Add error handling for videos
        video.addEventListener('error', () => {
            console.error('Video failed to load:', video.src);
        });
    });

    // Professional AI cards animation on scroll
    const aiCards = document.querySelectorAll('.ai-card');
    
    const aiCardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Get index of card in the grid for staggering
                const allCards = Array.from(aiCards);
                const cardIndex = allCards.indexOf(entry.target);
                
                // Stagger animation based on position in grid
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, (cardIndex % 4) * 80); // Stagger by row position
                
                aiCardObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    aiCards.forEach(card => {
        aiCardObserver.observe(card);
    });

    // Mobile menu functionality
    const navLeft = document.querySelector('.nav-left');
    const navLinks = document.querySelectorAll('.nav-link');
    const navTrigger = document.querySelector('.nav-mobile-trigger');

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navLeft.classList.remove('active');
            }
        });
    });

    // Toggle mobile menu
    if (navTrigger) {
        const toggleMenu = () => navLeft.classList.toggle('active');
        navTrigger.addEventListener('click', toggleMenu);
        navTrigger.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            }
        });
    }

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

    // Form handling
    const demoForm = document.getElementById('demo-form');
    const submitButton = demoForm?.querySelector('button[type="submit"]');
    const successMessage = document.getElementById('success-message');

    if (demoForm) {
        demoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Show loading state
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = '<span>Sending...</span>';
            }

            try {
                const response = await fetch(demoForm.action, {
                    method: 'POST',
                    body: new FormData(demoForm),
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    // Show success message
                    if (successMessage) {
                        successMessage.textContent = 'Form submitted successfully! Check your email for confirmation.';
                        successMessage.style.display = 'block';
                        successMessage.style.backgroundColor = 'rgba(34, 197, 94, 0.1)';
                        successMessage.style.color = '#22c55e';
                    }
                    demoForm.reset();
                    
                    // Log success for verification
                    console.log('Form submitted successfully', data);
                } else {
                    throw new Error(data.error || 'Form submission failed');
                }
            } catch (error) {
                console.error('Submission error:', error);
                // Show error message
                if (successMessage) {
                    successMessage.textContent = 'There was an error submitting the form. Please try again.';
                    successMessage.style.display = 'block';
                    successMessage.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                    successMessage.style.color = '#ef4444';
                }
            } finally {
                // Reset button state
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerHTML = '<span>Schedule Demo</span><i class="fas fa-calendar-check"></i>';
                }
            }
        });
    }
}); 