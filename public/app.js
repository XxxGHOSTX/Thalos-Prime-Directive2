'use strict';

// Application state management
const AppState = {
    initialized: false,
    observedElements: [],
    timestamp: Date.now(),
};

// Initialize application
function initialize() {
    if (AppState.initialized) {
        return;
    }

    console.log('Thalos Prime Directive 2 - Initializing...');

    // Setup smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }
        });
    });

    // Setup intersection observer for card animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                AppState.observedElements.push(entry.target);
            }
        });
    }, observerOptions);

    // Observe all principle cards
    document.querySelectorAll('[data-observe]').forEach((element) => {
        observer.observe(element);
    });

    AppState.initialized = true;
    console.log('Thalos Prime Directive 2 - System operational');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}

// Export state for observability
window.ThalosState = AppState;
