// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Form submission handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const phone = this.querySelector('input[type="tel"]').value;
            const message = this.querySelector('textarea').value;
            
            // Simple validation
            if (!name || !email || !message) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            // Simulate form submission
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
            
            // Simulate API call delay
            setTimeout(() => {
                alert('Obrigado! Sua mensagem foi enviada com sucesso. Entraremos em contato em breve.');
                
                // Reset form
                this.reset();
                
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // Header scroll effect
    let lastScrollTop = 0;
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add background blur effect when scrolling
        if (scrollTop > 100) {
            header.style.background = 'linear-gradient(135deg, rgba(26,26,26,0.95) 0%, rgba(74,74,74,0.95) 100%)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)';
            header.style.backdropFilter = 'none';
        }
        
        lastScrollTop = scrollTop;
    });

    // Animate elements on scroll (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe gem cards for animation
    const gemCards = document.querySelectorAll('.gem-card');
    gemCards.forEach((card, index) => {
        // Initial state for animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease ${index * 0.2}s`;
        
        observer.observe(card);
    });

    // Stats counter animation
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalNumber = target.textContent;
                const isPercentage = finalNumber.includes('%');
                const isPlus = finalNumber.includes('+');
                const numericValue = parseInt(finalNumber.replace(/[^\d]/g, ''));
                
                animateNumber(target, 0, numericValue, 2000, isPercentage, isPlus);
                statsObserver.unobserve(target);
            }
        });
    }, observerOptions);

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });

    // Number animation function
    function animateNumber(element, start, end, duration, isPercentage = false, isPlus = false) {
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuad = 1 - (1 - progress) * (1 - progress);
            const current = Math.round(start + (end - start) * easeOutQuad);
            
            let displayValue = current.toString();
            if (isPlus) displayValue += '+';
            if (isPercentage) displayValue += '%';
            
            element.textContent = displayValue;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }

    // Mobile menu toggle (for future enhancement)
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    // Add floating gems animation
    function createFloatingGem() {
        const gems = ['💎', '🔮', '💚', '✨'];
        const gem = document.createElement('div');
        gem.textContent = gems[Math.floor(Math.random() * gems.length)];
        gem.style.cssText = `
            position: fixed;
            font-size: ${Math.random() * 20 + 10}px;
            opacity: 0.6;
            pointer-events: none;
            z-index: 1;
            left: ${Math.random() * window.innerWidth}px;
            top: ${window.innerHeight}px;
            animation: floatUp ${Math.random() * 3 + 2}s linear forwards;
        `;
        
        document.body.appendChild(gem);
        
        setTimeout(() => {
            gem.remove();
        }, 5000);
    }

    // Add CSS animation for floating gems
    if (!document.querySelector('#floating-gems-style')) {
        const style = document.createElement('style');
        style.id = 'floating-gems-style';
        style.textContent = `
            @keyframes floatUp {
                to {
                    transform: translateY(-${window.innerHeight + 100}px) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Create floating gems occasionally
    setInterval(createFloatingGem, 3000);

    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // ESC key to close any modals or overlays (for future features)
        if (e.key === 'Escape') {
            // Handle escape key
            console.log('Escape pressed');
        }
        
        // Enter key on CTA button
        if (e.key === 'Enter' && e.target.classList.contains('cta-button')) {
            e.target.click();
        }
    });

    // Performance optimization: Throttle scroll events
    let ticking = false;
    
    function updateOnScroll() {
        // Any scroll-dependent updates go here
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    });

    console.log('🚀 Luxo Gems website loaded successfully!');
});