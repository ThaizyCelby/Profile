// ============================================
// script.js - All JavaScript Functionality
// ============================================
(function () {
    'use strict';

    // ===== DOM ELEMENTS =====
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const navItems = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.page-section');
    const navbar = document.getElementById('navbar');
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const yearSpan = document.getElementById('year');

    // ===== INITIALIZE AOS ANIMATION =====
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 50,
        });
    }

    // ===== DYNAMIC YEAR =====
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // ===== MOBILE NAV TOGGLE =====
    if (navToggle) {
        navToggle.addEventListener('click', function () {
            navLinks.classList.toggle('open');
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }

    // ===== SECTION NAVIGATION =====
    function showSection(id) {
        sections.forEach((section) => {
            section.classList.remove('active');
        });
        const target = document.getElementById(id);
        if (target) {
            target.classList.add('active');
        }
        navItems.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === id) {
                link.classList.add('active');
            }
        });
        // Scroll to top of the page for the new section
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Re-trigger AOS animations for the new section
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }

    // ===== NAV LINK CLICK HANDLER =====
    navItems.forEach((link) => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-section');
            if (targetId) {
                showSection(targetId);
            }
            // Close mobile menu
            navLinks.classList.remove('open');
            const icon = navToggle.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
            // Update URL hash
            history.pushState(null, '', '#' + targetId);
        });
    });

    // ===== HASH ROUTING =====
    function handleHash() {
        const hash = window.location.hash.replace('#', '');
        if (hash && document.getElementById(hash)) {
            showSection(hash);
        } else {
            showSection('profile');
        }
    }

    window.addEventListener('hashchange', handleHash);

    // ===== NAVBAR SCROLL EFFECT =====
    window.addEventListener('scroll', function () {
        if (window.scrollY > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ===== ANIMATED COUNTERS =====
    function animateCounters() {
        const counters = document.querySelectorAll('[data-counter]');
        counters.forEach((counter) => {
            const target = parseInt(counter.getAttribute('data-counter'));
            const duration = 1500;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
                const currentValue = Math.round(target * eased);
                counter.textContent = currentValue;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + '+';
                }
            }
            requestAnimationFrame(updateCounter);
        });
    }

    // ===== ANIMATE SKILL PROGRESS BARS =====
    function animateSkillBars() {
        const fillBars = document.querySelectorAll('.progress-fill');
        fillBars.forEach((bar) => {
            const width = bar.getAttribute('data-width');
            // Reset to 0 first
            bar.style.width = '0';
            // Force reflow
            void bar.offsetWidth;
            // Animate to target width
            setTimeout(() => {
                bar.style.width = width;
            }, 200);
        });
    }

    // ===== FORM VALIDATION & SUBMISSION =====
    if (contactForm) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        const nameError = document.getElementById('nameError');
        const emailError = document.getElementById('emailError');
        const messageError = document.getElementById('messageError');
        const submitBtn = document.getElementById('submitBtn');

        // Real-time validation
        nameInput.addEventListener('input', function () {
            if (this.value.trim().length >= 2) {
                this.classList.remove('error');
                this.classList.add('success');
                nameError.textContent = '';
            } else {
                this.classList.add('error');
                this.classList.remove('success');
                nameError.textContent = 'Name must be at least 2 characters.';
            }
        });

        emailInput.addEventListener('input', function () {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(this.value.trim())) {
                this.classList.remove('error');
                this.classList.add('success');
                emailError.textContent = '';
            } else {
                this.classList.add('error');
                this.classList.remove('success');
                emailError.textContent = 'Please enter a valid email address.';
            }
        });

        messageInput.addEventListener('input', function () {
            if (this.value.trim().length >= 10) {
                this.classList.remove('error');
                this.classList.add('success');
                messageError.textContent = '';
            } else {
                this.classList.add('error');
                this.classList.remove('success');
                messageError.textContent = 'Message must be at least 10 characters.';
            }
        });

        // Form submission
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Validate all fields
            let isValid = true;

            if (nameInput.value.trim().length < 2) {
                nameInput.classList.add('error');
                nameError.textContent = 'Name must be at least 2 characters.';
                isValid = false;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                emailInput.classList.add('error');
                emailError.textContent = 'Please enter a valid email address.';
                isValid = false;
            }

            if (messageInput.value.trim().length < 10) {
                messageInput.classList.add('error');
                messageError.textContent = 'Message must be at least 10 characters.';
                isValid = false;
            }

            if (!isValid) {
                formStatus.textContent = 'Please fix the errors above.';
                formStatus.className = 'form-status error';
                return;
            }

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Sending...';
            formStatus.textContent = '';

            // Simulate sending (replace with actual fetch to your backend/Formspree)
            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                subject: document.getElementById('subject').value.trim(),
                message: messageInput.value.trim(),
            };

            // Using fetch to Formspree (replace with your actual Formspree ID)
            // fetch('https://formspree.io/f/yourFormID', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(formData)
            // })
            // .then(response => response.json())
            // .then(data => { ... })
            // .catch(error => { ... });

            // For demo purposes, simulate a successful send
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
                formStatus.textContent = '✓ Message sent successfully! I will get back to you soon.';
                formStatus.className = 'form-status success';

                // Reset form
                contactForm.reset();
                [nameInput, emailInput, messageInput].forEach((input) => {
                    input.classList.remove('success', 'error');
                });

                // Clear status after 5 seconds
                setTimeout(() => {
                    formStatus.textContent = '';
                    formStatus.className = 'form-status';
                }, 5000);
            }, 1500);
        });
    }

    // ===== PROJECT DETAILS (DEMO LINKS) =====
    document.querySelectorAll('.demo-link').forEach((link) => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const project = this.getAttribute('data-project');
            alert(
                'Project details for "' +
                    project +
                    '" will be available soon. Please check the GitHub repository for more information.'
            );
        });
    });

    // ===== INITIALIZE =====
    function init() {
        handleHash();
        animateCounters();

        // Animate skill bars after a short delay (when section is visible)
        setTimeout(animateSkillBars, 500);

        // Close mobile menu on resize
        window.addEventListener('resize', function () {
            if (window.innerWidth > 768) {
                navLinks.classList.remove('open');
                const icon = navToggle.querySelector('i');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        });

        // Handle browser back/forward
        window.addEventListener('popstate', handleHash);

        // Scroll to top button (optional enhancement)
        createScrollToTopButton();
    }

    // ===== SCROLL TO TOP BUTTON =====
    function createScrollToTopButton() {
        const btn = document.createElement('button');
        btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        btn.className = 'scroll-top-btn';
        btn.setAttribute('aria-label', 'Scroll to top');
        btn.style.cssText = `
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background: var(--accent);
                    color: #0b0e14;
                    border: none;
                    cursor: pointer;
                    font-size: 1.2rem;
                    display: none;
                    align-items: center;
                    justify-content: center;
                    z-index: 999;
                    box-shadow: 0 4px 20px rgba(59, 201, 230, 0.3);
                    transition: all 0.3s ease;
                `;

        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        btn.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-4px)';
            this.style.boxShadow = '0 8px 30px rgba(59, 201, 230, 0.5)';
        });

        btn.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 20px rgba(59, 201, 230, 0.3)';
        });

        document.body.appendChild(btn);

        window.addEventListener('scroll', function () {
            if (window.scrollY > 300) {
                btn.style.display = 'flex';
            } else {
                btn.style.display = 'none';
            }
        });
    }

    // ===== RUN INIT =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

// ===== FORM VALIDATION & ACTION BUTTONS =====
if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');
    const formActions = document.getElementById('formActions');
    const whatsappBtn = document.getElementById('whatsappBtn');
    const emailBtn = document.getElementById('emailBtn');
    const formStatus = document.getElementById('formStatus');

    // Real-time validation and show/hide action buttons
    function validateField(input, errorEl, validator) {
        const value = input.value.trim();
        const isValid = validator(value);
        if (isValid) {
            input.classList.remove('error');
            input.classList.add('success');
            errorEl.textContent = '';
        } else {
            input.classList.add('error');
            input.classList.remove('success');
            errorEl.textContent = getErrorMessage(input.id);
        }
        return isValid;
    }

    function getErrorMessage(id) {
        switch (id) {
            case 'name':
                return 'Name must be at least 2 characters.';
            case 'email':
                return 'Please enter a valid email address.';
            case 'message':
                return 'Message must be at least 10 characters.';
            default:
                return '';
        }
    }

    const validators = {
        name: (val) => val.length >= 2,
        email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        message: (val) => val.length >= 10,
    };

    function updateFormActions() {
        const isNameValid = validators.name(nameInput.value.trim());
        const isEmailValid = validators.email(emailInput.value.trim());
        const isMessageValid = validators.message(messageInput.value.trim());
        const allValid = isNameValid && isEmailValid && isMessageValid;

        if (allValid) {
            formActions.style.display = 'flex';
            formStatus.textContent = '';
            formStatus.className = 'form-status';
        } else {
            formActions.style.display = 'none';
        }
    }

    // Attach real-time validation
    [nameInput, emailInput, messageInput].forEach((input) => {
        input.addEventListener('input', function () {
            const validator = validators[this.id];
            validateField(this, document.getElementById(this.id + 'Error'), validator);
            updateFormActions();
        });
    });

    // Build message content
    function buildMessage() {
        const subject = subjectInput.value.trim() || 'Portfolio Contact';
        const body = `Name: ${nameInput.value.trim()}\nEmail: ${emailInput.value.trim()}\n\n${messageInput.value.trim()}`;
        return { subject, body };
    }

    // WhatsApp button click
    whatsappBtn.addEventListener('click', function () {
        const { subject, body } = buildMessage();
        const fullMessage = `Subject: ${subject}\n${body}`;
        const encodedMessage = encodeURIComponent(fullMessage);
        const url = `https://wa.me/27728672014?text=${encodedMessage}`;
        window.open(url, '_blank');
    });

    // Email button click
    emailBtn.addEventListener('click', function () {
        const { subject, body } = buildMessage();
        const mailtoLink = `mailto:Givenyprincey2027@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
    });

    // Prevent form from actually submitting
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
    });
}