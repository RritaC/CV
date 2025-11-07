// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.05)';
    }

    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Section observer for smooth slide-up animations
const sectionObserverOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, sectionObserverOptions);

// Observe all cards and timeline items
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll(
        '.timeline-item, .experience-card, .achievement-card, .project-card, .cert-category, .skills-category, .competency-card, .gallery-item, .creative-card'
    );

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Observe all sections for slide-up animation
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Skills scroll-based stacking animation
    const skillsSection = document.getElementById('skills');
    const skillsCategories = document.querySelectorAll('.skills-category');

    if (skillsSection && skillsCategories.length > 0) {
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateSkillsStack(entry.target);
                }
            });
        }, {
            threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
            rootMargin: '-20% 0px -20% 0px'
        });

        skillsObserver.observe(skillsSection);

        function updateSkillsStack(section) {
            const rect = section.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const sectionTop = rect.top;
            const sectionHeight = rect.height;

            // Calculate how much of the section is visible
            const visibleTop = Math.max(0, viewportHeight - sectionTop);
            const visibleBottom = Math.min(sectionHeight, viewportHeight - (sectionTop - viewportHeight));
            const visibleHeight = visibleBottom - visibleTop;
            const scrollProgress = Math.max(0, Math.min(1, visibleTop / (sectionHeight * 0.6)));

            skillsCategories.forEach((category, index) => {
                const totalCategories = skillsCategories.length;
                const cardThreshold = index / totalCategories;
                const nextThreshold = (index + 1) / totalCategories;

                // Calculate progress for this specific card
                const cardProgress = Math.max(0, Math.min(1,
                    (scrollProgress - cardThreshold) / (nextThreshold - cardThreshold)
                ));

                if (scrollProgress >= cardThreshold && scrollProgress < nextThreshold) {
                    category.classList.add('active');
                    const scale = 0.98 + (cardProgress * 0.02);
                    const translateY = (1 - cardProgress) * 10;
                    category.style.transform = `scale(${scale}) translateY(${translateY}px)`;
                    category.style.opacity = 1;
                } else if (scrollProgress >= nextThreshold) {
                    category.classList.remove('active');
                    category.style.transform = 'scale(0.98) translateY(10px)';
                    category.style.opacity = 1;
                } else {
                    category.classList.remove('active');
                    category.style.transform = 'scale(0.98) translateY(10px)';
                    category.style.opacity = 1;
                }
            });
        }

        // Update on scroll
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (skillsSection) {
                        const rect = skillsSection.getBoundingClientRect();
                        const isInView = rect.top < window.innerHeight && rect.bottom > 0;
                        if (isInView) {
                            updateSkillsStack(skillsSection);
                        }
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    const galleryFrames = Array.from(document.querySelectorAll('.gallery-frame'));
    const lightbox = document.getElementById('gallery-lightbox');

    if (galleryFrames.length && lightbox) {
        const body = document.body;
        const lightboxMedia = lightbox.querySelector('.lightbox-media');
        const lightboxCaption = lightbox.querySelector('.lightbox-caption');
        const closeButtons = lightbox.querySelectorAll('[data-lightbox-close]');
        const prevButton = lightbox.querySelector('.lightbox-prev');
        const nextButton = lightbox.querySelector('.lightbox-next');
        const overlay = lightbox.querySelector('.lightbox-overlay');
        let currentIndex = 0;

        const getCaption = (frame, fallback) => {
            const img = frame.querySelector('img');
            if (img) {
                return img.alt || fallback;
            }
            return frame.dataset.label || fallback;
        };

        const renderMedia = (frame, index) => {
            if (!lightboxMedia) return;
            lightboxMedia.innerHTML = '';
            const img = frame.querySelector('img');

            if (img) {
                const clone = document.createElement('img');
                clone.src = img.currentSrc || img.src;
                clone.alt = img.alt || `Gallery photo ${index + 1}`;
                lightboxMedia.appendChild(clone);
            } else {
                const placeholder = document.createElement('div');
                placeholder.className = 'lightbox-placeholder';
                placeholder.textContent = frame.dataset.label || `Photo ${index + 1}`;
                lightboxMedia.appendChild(placeholder);
            }

            if (lightboxCaption) {
                lightboxCaption.textContent = getCaption(frame, `Photo ${index + 1}`);
            }
        };

        const openLightbox = (index) => {
            currentIndex = index;
            const frame = galleryFrames[currentIndex];
            if (!frame) return;
            renderMedia(frame, currentIndex);
            lightbox.classList.add('active');
            lightbox.setAttribute('aria-hidden', 'false');
            body.classList.add('no-scroll');
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
            body.classList.remove('no-scroll');
        };

        const showNext = () => {
            currentIndex = (currentIndex + 1) % galleryFrames.length;
            renderMedia(galleryFrames[currentIndex], currentIndex);
        };

        const showPrev = () => {
            currentIndex = (currentIndex - 1 + galleryFrames.length) % galleryFrames.length;
            renderMedia(galleryFrames[currentIndex], currentIndex);
        };

        galleryFrames.forEach((frame, index) => {
            frame.dataset.galleryIndex = frame.dataset.galleryIndex || index;
            if (!frame.dataset.label) {
                frame.dataset.label = getCaption(frame, `Photo ${index + 1}`);
            }
            frame.addEventListener('click', () => openLightbox(index));
        });

        closeButtons.forEach(button => {
            button.addEventListener('click', closeLightbox);
        });

        overlay?.addEventListener('click', closeLightbox);
        prevButton?.addEventListener('click', showPrev);
        nextButton?.addEventListener('click', showNext);

        document.addEventListener('keydown', (event) => {
            if (!lightbox.classList.contains('active')) return;
            if (event.key === 'Escape') {
                closeLightbox();
            }
            if (event.key === 'ArrowRight') {
                event.preventDefault();
                showNext();
            }
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                showPrev();
            }
        });
    }
});

// Active nav link highlighting
const sections = document.querySelectorAll('.section, .hero');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Smooth hero scroll - no parallax fade
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero && scrolled < window.innerHeight) {
        // Only slight movement, no fade
        hero.style.transform = `translateY(${scrolled * 0.2}px)`;
    } else if (hero) {
        hero.style.transform = 'translateY(0)';
    }
});

// Add hover effects to stat items
const statItems = document.querySelectorAll('.stat-item');
statItems.forEach(item => {
    item.addEventListener('mouseenter', function () {
        this.style.transform = 'scale(1.05)';
        this.style.transition = 'transform 0.3s ease';
    });

    item.addEventListener('mouseleave', function () {
        this.style.transform = 'scale(1)';
    });
});

// Add click animation to achievement cards
const achievementCards = document.querySelectorAll('.achievement-card');
achievementCards.forEach(card => {
    card.addEventListener('click', function () {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'translateY(-5px)';
        }, 150);
    });
});

// Console message
console.log('%c👋 Welcome to my CV Portfolio!', 'font-size: 20px; font-weight: bold; color: #6366f1;');
console.log('%cBuilt with passion and attention to detail.', 'font-size: 14px; color: #6b7280;');

