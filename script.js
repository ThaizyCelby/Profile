// ============================================
// script.js - All JavaScript Functionality
// ============================================
(function () {
    'use strict';

    // ===== DOM ELEMENTS =====
    const navToggle = document.getElementById('navToggle');
    const navLinks  = document.getElementById('navLinks');
    const navItems  = document.querySelectorAll('.nav-links a');
    const sections  = document.querySelectorAll('.page-section');
    const navbar    = document.getElementById('navbar');
    const yearSpan  = document.getElementById('year');

    // ===== INIT AOS =====
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 50,
        });
    }

    // ===== DYNAMIC YEAR =====
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // ===== MOBILE NAV TOGGLE =====
    function closeMobileMenu() {
        if (!navLinks) return;
        navLinks.classList.remove('open');
        if (navToggle) {
            navToggle.setAttribute('aria-expanded', 'false');
            const icon = navToggle.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        }
    }

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            const isOpen = navLinks.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            const icon = navToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars', !isOpen);
                icon.classList.toggle('fa-times', isOpen);
            }
        });
    }

    // ===== SECTION NAVIGATION =====
    function showSection(id) {
        sections.forEach((s) => s.classList.remove('active'));
        const target = document.getElementById(id);
        if (target) target.classList.add('active');

        navItems.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('data-section') === id);
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (typeof AOS !== 'undefined') AOS.refresh();

        // Re-animate section-specific visuals
        if (id === 'skills')  setTimeout(animateSkillBars, 250);
        if (id === 'profile') setTimeout(animateCounters, 250);
    }

    // ===== NAV LINK CLICK HANDLER =====
    navItems.forEach((link) => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-section');
            if (targetId) {
                showSection(targetId);
                history.pushState(null, '', '#' + targetId);
            }
            closeMobileMenu();
        });
    });

    // ===== HERO / OTHER [data-section] BUTTONS =====
    document.querySelectorAll('[data-section]').forEach((el) => {
        if (el.closest('.nav-links')) return; // already handled above
        el.addEventListener('click', function (e) {
            const targetId = this.getAttribute('data-section');
            if (!targetId) return;
            e.preventDefault();
            showSection(targetId);
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
    window.addEventListener('popstate', handleHash);

    // ===== NAVBAR SCROLL EFFECT =====
    window.addEventListener('scroll', function () {
        if (window.scrollY > 30) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    }, { passive: true });

    // ===== ANIMATED COUNTERS =====
    function animateCounters() {
        const counters = document.querySelectorAll('[data-counter]');
        counters.forEach((counter) => {
            const target = parseInt(counter.getAttribute('data-counter'), 10) || 0;
            const duration = 1500;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                counter.textContent = Math.round(target * eased);

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + '+';
                }
            }
            requestAnimationFrame(updateCounter);
        });
    }

    // ===== SKILL PROGRESS BARS =====
    function animateSkillBars() {
        const fillBars = document.querySelectorAll('.progress-fill');
        fillBars.forEach((bar) => {
            const width = bar.getAttribute('data-width');
            bar.style.width = '0';
            void bar.offsetWidth; // force reflow
            setTimeout(() => { bar.style.width = width; }, 200);
        });
    }

    // ===== CONTACT FORM =====
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const nameInput    = document.getElementById('name');
        const emailInput   = document.getElementById('email');
        const subjectInput = document.getElementById('subject');
        const messageInput = document.getElementById('message');
        const nameError    = document.getElementById('nameError');
        const emailError   = document.getElementById('emailError');
        const messageError = document.getElementById('messageError');
        const formActions  = document.getElementById('formActions');
        const formHint     = document.getElementById('formHint');
        const whatsappBtn  = document.getElementById('whatsappBtn');
        const emailBtn     = document.getElementById('emailBtn');
        const formStatus   = document.getElementById('formStatus');

        const validators = {
            name:    (v) => v.trim().length >= 2,
            email:   (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
            message: (v) => v.trim().length >= 10,
        };

        const errorMessages = {
            name:    'Name must be at least 2 characters.',
            email:   'Please enter a valid email address.',
            message: 'Message must be at least 10 characters.',
        };

        function validateField(input, errorEl) {
            const validator = validators[input.id];
            if (!validator) return true;
            const ok = validator(input.value);

            if (ok) {
                input.classList.remove('error');
                input.classList.add('success');
                if (errorEl) errorEl.textContent = '';
            } else {
                input.classList.add('error');
                input.classList.remove('success');
                if (errorEl) errorEl.textContent = errorMessages[input.id] || '';
            }
            return ok;
        }

        function updateFormActions() {
            const allValid =
                validators.name(nameInput.value) &&
                validators.email(emailInput.value) &&
                validators.message(messageInput.value);

            if (allValid) {
                formActions.hidden = false;
                if (formHint) formHint.hidden = true;
            } else {
                formActions.hidden = true;
                if (formHint) formHint.hidden = false;
            }
        }

        [nameInput, emailInput, messageInput].forEach((input) => {
            if (!input) return;
            const errEl = document.getElementById(input.id + 'Error');
            input.addEventListener('input', () => {
                validateField(input, errEl);
                updateFormActions();
            });
            input.addEventListener('blur', () => validateField(input, errEl));
        });

        function buildMessage() {
            const subject = (subjectInput && subjectInput.value.trim()) || 'Portfolio Contact';
            const body =
                'Name: '    + nameInput.value.trim()    + '\n' +
                'Email: '   + emailInput.value.trim()   + '\n\n' +
                messageInput.value.trim();
            return { subject, body };
        }

        let statusTimer;
        function showStatus(text, type) {
            if (!formStatus) return;
            formStatus.textContent = text;
            formStatus.className = 'form-status ' + (type || '');
            clearTimeout(statusTimer);
            statusTimer = setTimeout(() => {
                formStatus.textContent = '';
                formStatus.className = 'form-status';
            }, 6000);
        }

        if (whatsappBtn) {
            whatsappBtn.addEventListener('click', function () {
                const { subject, body } = buildMessage();
                const full = 'Subject: ' + subject + '\n' + body;
                const url = 'https://wa.me/27728672014?text=' + encodeURIComponent(full);
                window.open(url, '_blank', 'noopener');
                showStatus('✓ Opening WhatsApp… Please send the pre-filled message.', 'success');
            });
        }

        if (emailBtn) {
            emailBtn.addEventListener('click', function () {
                const { subject, body } = buildMessage();
                const link = 'mailto:Givenyprincey2027@gmail.com' +
                    '?subject=' + encodeURIComponent(subject) +
                    '&body='    + encodeURIComponent(body);
                window.location.href = link;
                showStatus('✓ Opening your email client…', 'success');
            });
        }

        // Prevent native submit; validate & reveal actions if needed.
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const okName    = validateField(nameInput, nameError);
            const okEmail   = validateField(emailInput, emailError);
            const okMessage = validateField(messageInput, messageError);

            if (!okName || !okEmail || !okMessage) {
                showStatus('Please fix the highlighted fields.', 'error');
                return;
            }
            updateFormActions();
        });
    }

    // ===== SCROLL TO TOP BUTTON =====
    function createScrollToTopButton() {
        const btn = document.createElement('button');
        btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        btn.className = 'scroll-top-btn';
        btn.setAttribute('aria-label', 'Scroll to top');

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        document.body.appendChild(btn);

        window.addEventListener('scroll', function () {
            if (window.scrollY > 300) btn.classList.add('visible');
            else btn.classList.remove('visible');
        }, { passive: true });
    }

    // ===== INIT =====
    function init() {
        handleHash();
        setTimeout(animateCounters, 500);
        setTimeout(animateSkillBars, 700);

        window.addEventListener('resize', function () {
            if (window.innerWidth > 768) closeMobileMenu();
        });

        createScrollToTopButton();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
