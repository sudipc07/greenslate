document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    lucide.createIcons();

    // 2. Initialize Animate On Scroll (AOS)
    AOS.init({
        duration: 1000,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50
    });

    // 3. Header Scrolled State
    const header = document.querySelector('header');
    if(header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // 4. Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header ? header.offsetHeight : 0;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Count-Up Animation for Stats
    const bentoSection = document.querySelector('.bento-section');
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasCounted = false;

    if (bentoSection && statNumbers.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            const [entry] = entries;
            if (entry.isIntersecting && !hasCounted) {
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'), 10);
                    if (Number.isNaN(target)) {
                        return;
                    }
                    const duration = 2000;
                    const increment = target / (duration / 16);
                    let current = 0;

                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            stat.innerText = Math.ceil(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            stat.innerText = target;
                        }
                    };
                    updateCounter();
                });
                hasCounted = true;
            }
        }, { threshold: 0.2 });
        observer.observe(bentoSection);
    }

    // 6. Magnetic Mouse Tracking for Bento Cards (The "AI Age" effect)
    document.querySelectorAll('.bento-item').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // 7. Hero Parallax Grid Movement (Desktop & Mobile)
    const hero = document.querySelector('.hero');
    if (hero) {
        // Desktop: Mouse Move
        window.addEventListener('mousemove', e => {
            if (window.matchMedia('(pointer: fine)').matches) {
                const x = (window.innerWidth / 2 - e.clientX) / 20;
                const y = (window.innerHeight / 2 - e.clientY) / 20;
                hero.style.setProperty('--hero-x', x);
                hero.style.setProperty('--hero-y', y);
            }
        });

        // Mobile: Scroll-based Parallax fallback
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            if (scrolled < window.innerHeight) {
                hero.style.setProperty('--hero-y', scrolled / 15);
            }
        });

        // Mobile: Gyroscope (if available)
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', (e) => {
                // beta is front-to-back tilt (-180 to 180)
                // gamma is left-to-right tilt (-90 to 90)
                if (e.beta && e.gamma) {
                    const x = e.gamma / 2; 
                    const y = (e.beta - 45) / 2; // Subtracting ~45 for natural holding angle
                    hero.style.setProperty('--hero-x', x);
                    hero.style.setProperty('--hero-y', y);
                }
            }, true);
        }
    }

    // 8. Contact form async submit state
    const reportForm = document.getElementById('reportForm');
    const formSuccess = document.getElementById('formSuccess');
    const formFeedback = document.getElementById('formFeedback');
    const reportSubmit = document.getElementById('reportSubmit');

    if (reportForm && formSuccess && formFeedback && reportSubmit) {
        reportForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            reportSubmit.disabled = true;
            reportSubmit.textContent = 'Sending...';
            formFeedback.hidden = true;

            try {
                const response = await fetch(reportForm.action, {
                    method: reportForm.method,
                    body: new FormData(reportForm),
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Form submission failed');
                }

                reportForm.reset();
                reportForm.hidden = true;
                formSuccess.hidden = false;
            } catch (error) {
                reportSubmit.disabled = false;
                reportSubmit.textContent = 'Send Enquiry';
                formFeedback.hidden = false;
            }
        });
    }
});
