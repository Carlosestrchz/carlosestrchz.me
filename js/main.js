/**
 * main.js — Animación de aparición al hacer scroll.
 *
 * Uso: agrega el atributo data-reveal a cualquier elemento del HTML.
 * Este script le pone la clase .reveal (oculto) y, al entrar en pantalla,
 * la clase .is-visible (visible). Los estilos viven en css/components.css.
 *
 * Mejora progresiva: si JavaScript falla o el usuario prefiere menos
 * movimiento, el contenido simplemente se muestra sin animación.
 */
(() => {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target); // ya apareció, deja de observarlo
        });
    });

    document.querySelectorAll('[data-reveal]').forEach((el) => {
        el.classList.add('reveal');
        observer.observe(el);
    });
})();
