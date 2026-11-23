(() => {
    'use strict';

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const supportsObserver = 'IntersectionObserver' in window;

    /* ---------- Animación progresiva de aparición ([data-reveal]) ---------- */
    if (!reducedMotionQuery.matches && supportsObserver) {
        const revealObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            });
        });

        document.querySelectorAll('[data-reveal]').forEach((el) => {
            el.classList.add('reveal');
            revealObserver.observe(el);
        });
    }

    /* ---------- Barra de navegación flotante ([data-floating-nav]) ---------- */
    const floatingNav = document.querySelector('[data-floating-nav]');
    if (!floatingNav) return;

    const navList = floatingNav.querySelector('.floating-nav__list');
    const navLinks = Array.from(floatingNav.querySelectorAll('[data-nav-link]'));
    const sections = navLinks
        .map((link) => {
            const hash = link.getAttribute('href');
            const target = hash && hash.startsWith('#') ? document.querySelector(hash) : null;
            return target ? { id: target.id, link, target } : null;
        })
        .filter(Boolean);

    if (!sections.length) return;

    // Indicador deslizante para transiciones fluidas entre pestañas
    let indicator = null;
    if (navList) {
        indicator = document.createElement('li');
        indicator.className = 'floating-nav__indicator';
        indicator.setAttribute('aria-hidden', 'true');
        navList.prepend(indicator);
        floatingNav.classList.add('has-indicator');
    }

    let currentActiveId = null;

    const positionIndicator = (activeLink) => {
        if (!indicator || !activeLink) return;
        indicator.style.setProperty('--indicator-x', `${activeLink.offsetLeft}px`);
        indicator.style.setProperty('--indicator-w', `${activeLink.offsetWidth}px`);
    };

    const setActiveSection = (activeId) => {
        if (currentActiveId === activeId) return;
        currentActiveId = activeId;

        let activeLink = null;
        sections.forEach(({ id, link }) => {
            const isActive = id === activeId;
            link.classList.toggle('is-active', isActive);
            if (isActive) {
                link.setAttribute('aria-current', 'location');
                activeLink = link;
            } else {
                link.removeAttribute('aria-current');
            }
        });

        positionIndicator(activeLink);
    };

    const isAtPageBottom = () =>
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;

    const findCenterSectionId = () => {
        if (isAtPageBottom()) return sections[sections.length - 1].id;

        const viewportCenter = window.innerHeight / 2;
        let closestId = sections[0].id;
        let smallestDistance = Infinity;

        sections.forEach(({ id, target }) => {
            const rect = target.getBoundingClientRect();
            const containsCenter = rect.top <= viewportCenter && rect.bottom >= viewportCenter;
            const distance = containsCenter
                ? 0
                : Math.min(Math.abs(rect.top - viewportCenter), Math.abs(rect.bottom - viewportCenter));

            if (distance < smallestDistance) {
                smallestDistance = distance;
                closestId = id;
            }
        });

        return closestId;
    };

    // Control de scroll programático: evita activar secciones intermedias al saltar desde la navbar
    let isProgrammaticScroll = false;
    let scrollAnimationId = null;
    let bottomActive = isAtPageBottom();

    const easeInOutCubic = (t) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const getLayoutTop = (el) => {
        let top = 0;
        let current = el;
        while (current) {
            top += current.offsetTop;
            current = current.offsetParent;
        }
        return top;
    };

    const getTargetScrollY = (target) => {
        const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        if (target === sections[0].target) return 0;

        // Usar métricas de layout sin transformar (evita desfase por translateY/scale del scroll-driven)
        const sectionTop = getLayoutTop(target);
        const sectionHeight = target.offsetHeight;

        // Aterrizar centrado en la sección (o al inicio si la sección supera el alto del viewport)
        const rawY = sectionHeight > window.innerHeight
            ? sectionTop
            : sectionTop - (window.innerHeight - sectionHeight) / 2;

        return Math.max(0, Math.min(maxScroll, rawY));
    };

    const finishProgrammaticScroll = () => {
        isProgrammaticScroll = false;
        document.documentElement.classList.remove('is-scrolling-to-section');
        bottomActive = isAtPageBottom();
    };

    const cancelProgrammaticScroll = (syncAfterCancel) => {
        if (!isProgrammaticScroll) return;
        if (scrollAnimationId !== null) {
            window.cancelAnimationFrame(scrollAnimationId);
            scrollAnimationId = null;
        }
        finishProgrammaticScroll();
        if (syncAfterCancel) {
            setActiveSection(findCenterSectionId());
        }
    };

    const smoothScrollTo = (target) => {
        if (scrollAnimationId !== null) {
            window.cancelAnimationFrame(scrollAnimationId);
            scrollAnimationId = null;
        }

        const startY = window.scrollY;
        const targetY = getTargetScrollY(target);
        const delta = targetY - startY;

        if (reducedMotionQuery.matches || Math.abs(delta) < 1) {
            isProgrammaticScroll = true;
            document.documentElement.classList.add('is-scrolling-to-section');
            window.scrollTo({ top: targetY, left: 0, behavior: 'instant' });
            window.requestAnimationFrame(finishProgrammaticScroll);
            return;
        }

        const duration = Math.min(750, Math.max(450, Math.abs(delta) * 0.45));
        const startTime = performance.now();
        isProgrammaticScroll = true;
        document.documentElement.classList.add('is-scrolling-to-section');

        const step = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(1, elapsed / duration);
            const eased = easeInOutCubic(progress);

            window.scrollTo({ top: startY + delta * eased, left: 0, behavior: 'instant' });

            if (progress < 1) {
                scrollAnimationId = window.requestAnimationFrame(step);
            } else {
                scrollAnimationId = null;
                window.requestAnimationFrame(finishProgrammaticScroll);
            }
        };

        scrollAnimationId = window.requestAnimationFrame(step);
    };

    // Si el usuario interviene manualmente durante el desplazamiento, liberar el bloqueo al instante
    const scrollKeys = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ']);
    window.addEventListener('wheel', () => cancelProgrammaticScroll(true), { passive: true });
    window.addEventListener('touchstart', () => cancelProgrammaticScroll(true), { passive: true });
    window.addEventListener('keydown', (event) => {
        if (scrollKeys.has(event.key)) {
            cancelProgrammaticScroll(true);
        }
    });

    if (supportsObserver) {
        const visibleSections = new Set();

        const navObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        visibleSections.add(entry.target.id);
                    } else {
                        visibleSections.delete(entry.target.id);
                    }
                });

                if (isProgrammaticScroll) return;

                if (isAtPageBottom()) {
                    setActiveSection(sections[sections.length - 1].id);
                    return;
                }

                if (visibleSections.size === 1) {
                    const [onlyId] = visibleSections;
                    setActiveSection(onlyId);
                } else {
                    setActiveSection(findCenterSectionId());
                }
            },
            {
                rootMargin: '-40% 0px -40% 0px',
                threshold: 0,
            }
        );

        sections.forEach(({ target }) => navObserver.observe(target));

        window.addEventListener(
            'scroll',
            () => {
                if (isProgrammaticScroll) return;

                const atBottom = isAtPageBottom();
                if (atBottom && !bottomActive) {
                    bottomActive = true;
                    setActiveSection(sections[sections.length - 1].id);
                } else if (!atBottom && bottomActive) {
                    bottomActive = false;
                    setActiveSection(findCenterSectionId());
                }
            },
            { passive: true }
        );
    }

    sections.forEach(({ id, link, target }) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            if (event.detail > 0) {
                link.blur();
            }
            setActiveSection(id);
            smoothScrollTo(target);
            if (window.history && typeof window.history.replaceState === 'function') {
                window.history.replaceState(null, '', `#${id}`);
            }
        });
    });

    let resizeFrame = null;
    window.addEventListener(
        'resize',
        () => {
            if (resizeFrame !== null) return;
            resizeFrame = window.requestAnimationFrame(() => {
                resizeFrame = null;
                const active = sections.find(({ id }) => id === currentActiveId);
                if (active) positionIndicator(active.link);
            });
        },
        { passive: true }
    );

    // Posición inicial del indicador antes de activar su transición
    setActiveSection(findCenterSectionId());
    if (indicator) {
        window.requestAnimationFrame(() => {
            const active = sections.find(({ id }) => id === currentActiveId);
            if (active) positionIndicator(active.link);
            indicator.classList.add('is-ready');
        });
    }
})();
