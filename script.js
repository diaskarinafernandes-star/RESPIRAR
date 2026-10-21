document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. DARK MODE
    // ==========================================
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
        themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    } else if (systemPrefersDark) {
        html.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️';
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        trackEvent('theme_change', { theme: newTheme });
    });

    // ==========================================
    // 2. CAPTURA DE UTM E INJEÇÃO NO WHATSAPP
    // ==========================================
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source') || 'organico';
    const utmMedium = urlParams.get('utm_medium') || 'nao_definido';
    
    if (utmSource !== 'organico') {
        localStorage.setItem('utm_source', utmSource);
        localStorage.setItem('utm_medium', utmMedium);
    }

    const storedSource = localStorage.getItem('utm_source') || 'organico';
    const waMessage = `Olá! Vim pelo ${storedSource} e gostaria de saber mais sobre o suporte.`;
    const encodedWaMessage = encodeURIComponent(waMessage);
    const waLink = `https://wa.me/5511980313428?text=${encodedWaMessage}`;

    // Atualiza TODOS os links com a classe 'wa-dynamic' (incluindo o botão flutuante)
    document.querySelectorAll('.wa-dynamic').forEach(link => {
        link.href = waLink;
    });

    // ==========================================
    // 3. HEADER GLASSMORPHISM AO ROLAR
    // ==========================================
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ==========================================
    // 4. MENU MOBILE
    // ==========================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    // ==========================================
    // 5. FAQ ACCORDION ANIMADO
    // ==========================================
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isActive = item.classList.contains('active');
            document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    // ==========================================
    // 6. FORMULÁRIO INTELIGENTE (SEM BACKEND)
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    const successModal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const modalWaLink = document.getElementById('modal-wa-link');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const message = document.getElementById('message').value;
        
        const finalWaMessage = `Olá, meu nome é *${name}*.\nTelefone: ${phone}\n\n${message}\n\n(Vim pelo site)`;
        const finalWaLink = `https://wa.me/5511980313428?text=${encodeURIComponent(finalWaMessage)}`;
        
        modalWaLink.href = finalWaLink;
        successModal.classList.remove('hidden');
        contactForm.reset();
        trackEvent('form_submission', { method: 'whatsapp_redirect' });
    });

    closeModalBtn.addEventListener('click', () => successModal.classList.add('hidden'));
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) successModal.classList.add('hidden');
    });

    // ==========================================
    // 7. LGPD COOKIE BANNER
    // ==========================================
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    if (!localStorage.getItem('cookies_accepted')) {
        setTimeout(() => cookieBanner.classList.remove('hidden'), 2000);
    }

    acceptCookiesBtn.addEventListener('click', () => {
        localStorage.setItem('cookies_accepted', 'true');
        cookieBanner.classList.add('hidden');
        trackEvent('cookie_consent', { status: 'accepted' });
    });

    // ==========================================
    // 8. FUNÇÃO DE RASTREAMENTO (Mock)
    // ==========================================
    function trackEvent(eventName, parameters = {}) {
        const hasConsent = localStorage.getItem('cookies_accepted') === 'true';
        if (hasConsent) {
            console.log(`[TRACKING] Evento: ${eventName}`, parameters);
            // Descomente e configure com seus IDs reais quando tiver:
            // if (typeof gtag !== 'undefined') gtag('event', eventName, parameters);
            // if (typeof fbq !== 'undefined') fbq('trackCustom', eventName, parameters);
        }
    }

    // ==========================================
    // 9. INTERSECTION OBSERVER (Animação ao rolar)
    // ==========================================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.card, .image-block, .text-block').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});