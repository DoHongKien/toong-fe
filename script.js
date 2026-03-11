document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    const header = document.getElementById('header');

    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // Change icon based on state
        const icon = navLinks.classList.contains('active') ? 'x' : 'menu';
        mobileMenuBtn.innerHTML = `<i data-lucide="${icon}"></i>`;
        lucide.createIcons();
    });

    // Close mobile menu when clicking a normal link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Check if this is a dropdown toggle
            const isDropdownToggle = item.classList.contains('nav-link') && item.parentElement.classList.contains('has-dropdown') && item.getAttribute('href') === '#';
            
            if (window.innerWidth <= 992 && !isDropdownToggle) {
                navLinks.classList.remove('active');
                mobileMenuBtn.innerHTML = `<i data-lucide="menu"></i>`;
                lucide.createIcons();
            }
        });
    });

    // 2. Sticky Header with Scroll Event
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. Intersection Observer for Fade-In Effects
    const fadeInElements = document.querySelectorAll('.fade-in');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once it's visible
            }
        });
    }, observerOptions);

    fadeInElements.forEach(element => {
        observer.observe(element);
    });

    // 4. Accordion Logic
    const accordions = document.querySelectorAll('.accordion-item');
    accordions.forEach(acc => {
        const header = acc.querySelector('.accordion-header');
        const body = acc.querySelector('.accordion-body');
        
        // Init active state (calculate height)
        if(acc.classList.contains('active')) {
            body.style.maxHeight = body.scrollHeight + "px";
        }
        
        header.addEventListener('click', () => {
            const isActive = acc.classList.contains('active');
            
            // Close all
            accordions.forEach(a => {
                a.classList.remove('active');
                if (a.querySelector('.accordion-body')) {
                    a.querySelector('.accordion-body').style.maxHeight = null;
                }
            });
            
            // Open clicked if it wasn't active
            if (!isActive) {
                acc.classList.add('active');
                body.style.maxHeight = body.scrollHeight + "px";
            }
        });
    });

    // 5. Mobile Dropdown Toggle
    const dropdownToggles = document.querySelectorAll('.has-dropdown > .nav-link');
    dropdownToggles.forEach(drop => {
        drop.addEventListener('click', (e) => {
            if (window.innerWidth <= 992) {
                // Find parent .has-dropdown
                const parent = drop.parentElement;
                
                // Allow default link behavior if clicking it again when it's already active to actually navigate
                if (drop.getAttribute('href') !== '#' && !parent.classList.contains('active')) {
                   e.preventDefault();
                }

                if (drop.getAttribute('href') === '#') {
                    e.preventDefault();
                }

                parent.classList.toggle('active');
                
                // Close other dropdowns
                document.querySelectorAll('.has-dropdown').forEach(other => {
                    if(other !== parent) other.classList.remove('active');
                });
            }
        });
    });

    // 6. Dynamic Mega Menu Content
    const megaLinks = document.querySelectorAll('.mega-links a');
    megaLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            const megaMenu = this.closest('.mega-menu');
            if (megaMenu) {
                const imgEl = megaMenu.querySelector('.mega-img');
                const titleAccentEl = megaMenu.querySelector('.mega-desc-accent');
                const titleMainEl = megaMenu.querySelector('.mega-desc-main');
                const descEl = megaMenu.querySelector('.mega-description p');
                
                const newImg = this.getAttribute('data-image');
                const newTitle = this.getAttribute('data-title');
                const newDesc = this.getAttribute('data-desc');
                
                if (newImg && imgEl) {
                    imgEl.src = newImg;
                    imgEl.style.filter = 'none'; // Reset any grayscale from fallback
                    imgEl.style.objectFit = 'cover';
                    imgEl.style.width = '100%';
                    imgEl.style.height = '250px';
                    imgEl.style.borderRadius = '8px';
                }
                if (newTitle) {
                    if (titleAccentEl) titleAccentEl.textContent = newTitle;
                    if (titleMainEl) titleMainEl.textContent = newTitle;
                }
                if (newDesc && descEl) {
                    descEl.textContent = newDesc;
                }
            }
        });
    });
});
