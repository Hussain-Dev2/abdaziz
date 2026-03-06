/**
 * main.js
 * Core interactivity for Abaaziz Luxury Homepage
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- State & Selectors ---
    const body = document.body;
    const navbar = document.getElementById('navbar');
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // --- Sticky Navigation ---
    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on load
    handleScroll();

    // --- Mobile Menu Toggle ---
    const toggleMenu = () => {
        const isActive = mobileBtn.classList.contains('active');
        
        if (isActive) {
            mobileBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            body.style.overflow = '';
        } else {
            mobileBtn.classList.add('active');
            mobileMenu.classList.add('active');
            body.style.overflow = 'hidden'; // Prevent scrolling
        }
    };
    
    mobileBtn.addEventListener('click', toggleMenu);
    
    // Close menu when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu();
        });
    });

    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Animated Counters ---
    const statsContainer = document.getElementById('stats-container');
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;
    
    const animateCounters = () => {
        statNumbers.forEach(stat => {
            const target = +stat.getAttribute('data-target');
            const duration = 2000; // ms
            const stepTime = Math.abs(Math.floor(duration / target));
            
            let current = 0;
            const increment = target / (duration / 16); // 60fps
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    clearInterval(timer);
                    stat.innerText = target;
                } else {
                    stat.innerText = Math.ceil(current);
                }
            }, 16);
        });
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                animateCounters();
                countersAnimated = true;
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    if (statsContainer) {
        statsObserver.observe(statsContainer);
    }

    // --- Active Link Highlighting on Scroll ---
    const sections = document.querySelectorAll('section, header');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    }, { passive: true });

    // --- Lightbox Gallery ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const galleryItems = document.querySelectorAll('.gallery-overlay');
    
    const openLightbox = (src) => {
        lightboxImg.src = '';
        lightboxImg.classList.remove('loaded');
        lightbox.classList.add('active');
        body.style.overflow = 'hidden';
        
        // Simulating loading for effect, or real loading
        const img = new Image();
        img.onload = () => {
            lightboxImg.src = src;
            lightboxImg.classList.add('loaded');
        };
        img.src = src;
    };
    
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        body.style.overflow = '';
        setTimeout(() => {
            lightboxImg.src = '';
            lightboxImg.classList.remove('loaded');
        }, 400); // Wait for transition
    };

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const src = item.getAttribute('data-src');
            openLightbox(src);
        });
    });
    
    lightboxClose.addEventListener('click', closeLightbox);
    
    // Close lightbox on clicking outside image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
            closeLightbox();
        }
    });

    // Close lightbox on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    // --- Contact Form Validation ---
    const contactForm = document.getElementById('contact-form');
    const formName = document.getElementById('name');
    const formEmail = document.getElementById('email');
    const formMessage = document.getElementById('message');
    const successMsg = document.getElementById('submit-success');
    
    const showError = (input, show) => {
        const errorMsg = document.getElementById(`${input.id}-error`);
        if (show) {
            errorMsg.style.display = 'block';
            input.style.borderColor = '#ef4444';
        } else {
            errorMsg.style.display = 'none';
            input.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }
    };

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            
            // Validate Name
            if (formName.value.trim() === '') {
                showError(formName, true);
                isValid = false;
            } else {
                showError(formName, false);
            }
            
            // Validate Email
            if (!validateEmail(formEmail.value)) {
                showError(formEmail, true);
                isValid = false;
            } else {
                showError(formEmail, false);
            }
            
            // Validate Message
            if (formMessage.value.trim() === '') {
                showError(formMessage, true);
                isValid = false;
            } else {
                showError(formMessage, false);
            }
            
            if (isValid) {
                // Simulate form submission
                const btn = contactForm.querySelector('button[type="submit"]');
                const originalText = btn.innerText;
                btn.innerText = 'Sending...';
                btn.disabled = true;
                
                setTimeout(() => {
                    successMsg.style.display = 'block';
                    btn.innerText = originalText;
                    btn.disabled = false;
                    contactForm.reset();
                    
                    // Hide success message after 5 seconds
                    setTimeout(() => {
                        successMsg.style.display = 'none';
                    }, 5000);
                }, 1500);
            }
        });
        
        // Hide error on input
        [formName, formEmail, formMessage].forEach(input => {
            input.addEventListener('input', () => {
                showError(input, false);
            });
        });
    }

    // --- Dynamic Footer Year ---
    const currentYearEl = document.getElementById('current-year');
    if (currentYearEl) {
        currentYearEl.innerText = new Date().getFullYear();
    }
});
