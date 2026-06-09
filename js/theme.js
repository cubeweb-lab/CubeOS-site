// js/theme.js
document.addEventListener('DOMContentLoaded', function() {
    // === Тема ===
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
        const saved = localStorage.getItem('cubeos-theme') || 'dark';
        document.documentElement.setAttribute('data-theme', saved);
        updateThemeIcon(saved);
        
        toggle.addEventListener('click', function() {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('cubeos-theme', next);
            updateThemeIcon(next);
        });
        
        function updateThemeIcon(theme) {
            toggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
            toggle.title = theme === 'dark' ? 'Светлая тема' : 'Тёмная тема';
        }
    }
    
    // === Scroll-анимации (Intersection Observer) ===
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.animate, .animate-left, .animate-right, .animate-scale').forEach(el => {
        observer.observe(el);
    });
});
