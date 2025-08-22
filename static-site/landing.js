// landing.js - Handle landing page interactions
document.addEventListener('DOMContentLoaded', function() {
    // Utility function to show user feedback
    function showUserFeedback(message, type = 'info') {
        // Remove existing feedback
        const existingFeedback = document.querySelector('.user-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }

        // Create feedback element
        const feedback = document.createElement('div');
        feedback.className = `user-feedback user-feedback-${type}`;
        feedback.textContent = message;
        
        // Style the feedback
        Object.assign(feedback.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            zIndex: '1000',
            opacity: '0',
            transform: 'translateY(-10px)',
            transition: 'all 0.3s ease'
        });

        // Set background color based on type
        const colors = {
            info: '#2563EB',
            success: '#059669',
            error: '#DC2626',
            warning: '#D97706'
        };
        feedback.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(feedback);

        // Animate in
        setTimeout(() => {
            feedback.style.opacity = '1';
            feedback.style.transform = 'translateY(0)';
        }, 10);

        // Remove after 3 seconds
        setTimeout(() => {
            feedback.style.opacity = '0';
            feedback.style.transform = 'translateY(-10px)';
            setTimeout(() => feedback.remove(), 300);
        }, 3000);
    }

    // Function to check if React app is available
    async function checkReactAppAvailability() {
        try {
            const response = await fetch('/app', { 
                method: 'HEAD',
                timeout: 5000 
            });
            return response.ok;
        } catch (error) {
            console.warn('React app availability check failed:', error);
            return false;
        }
    }

    // Handle Get Started button clicks
    const getStartedButtons = document.querySelectorAll('a[href="/app"], .cta-button');
    getStartedButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '/app') {
                // Allow natural navigation to /app route
                console.log('Navigating to web app');
                return; // Let the browser handle the navigation
            }
        });
    });

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
            showUserFeedback('This section will be implemented in the full application.', 'info');
        });
    });

    // Handle privacy link
    const privacyLink = document.querySelector('.privacy-link');
    if (privacyLink) {
        privacyLink.addEventListener('click', function(e) {
            e.preventDefault();
            showUserFeedback('Privacy Policy will be implemented in the full application.', 'info');
        });
    }

    // Add keyboard navigation for accessibility
    document.addEventListener('keydown', function(e) {
        // Enter or Space key on Get Started button
        if (e.target === getStartedButton && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            getStartedButton.click();
        }
    });

    // Log page load for debugging
    console.log('Landing page loaded successfully');
    console.log('Environment:', window.location.hostname);
    console.log('Get Started button found:', !!getStartedButton);
});
