// landing.js - Handle landing page interactions
document.addEventListener('DOMContentLoaded', function() {
    // Handle Get Started button click
    const getStartedButton = document.querySelector('.cta-button');
    if (getStartedButton) {
        getStartedButton.addEventListener('click', function(e) {
            e.preventDefault();
            // Redirect to the main application
            window.location.href = '/app';
        });
    }

    // Handle navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Handle footer links
    const footerLinks = document.querySelectorAll('.footer-links a');
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // For demo purposes, show an alert
            alert('This section will be implemented in the full application.');
        });
    });

    // Handle privacy link
    const privacyLink = document.querySelector('.privacy-link');
    if (privacyLink) {
        privacyLink.addEventListener('click', function(e) {
            e.preventDefault();
            // For demo purposes, show an alert
            alert('Privacy Policy will be implemented in the full application.');
        });
    }
});
