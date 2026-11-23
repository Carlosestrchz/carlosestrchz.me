(() => {
    'use strict';

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const supportsObserver = 'IntersectionObserver' in window;

    /* ---------- animacion progresiva de aparicion ([data-reveal]) ---------- */
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

    /* ---------- carrusel de proyectos: bucle continuo + arrastre manual ---------- */
    const projectsCarousel = document.querySelector('[data-projects-carousel]');
    if (projectsCarousel && !reducedMotionQuery.matches) {
        const track = projectsCarousel.querySelector('.projects-carousel__track');
        const firstGroup = projectsCarousel.querySelector('.projects-carousel__group');
        const mobileCarouselQuery = window.matchMedia('(max-width: 767.98px)');

        if (track && firstGroup) {
            projectsCarousel.classList.add('has-js-carousel');

            const cardCount = firstGroup.children.length;
            let loopWidth = firstGroup.offsetWidth;
            let offset = 0;
            let isInView = !supportsObserver;
            let isCardHovered = false;
            let isCardFocused = false;

            let activePointerId = null;
            let pointerStartX = 0;
            let dragStartOffset = 0;
            let dragStartCardIndex = 0;
            let isDragging = false;
            let suppressNextClick = false;
            let lastPointerX = 0;
            let lastPointerTime = 0;
            // velocidad de desplazamiento en px/ms
            let velocity = 0;

            // estado de ajuste por tarjeta completa en vista movil
            let snapStartOffset = 0;
            let snapDelta = 0;
            let snapStartTime = 0;
            let snapDuration = 0;
            let isSnapping = false;
            let mobileIdleMs = 0;
            const mobileAutoDelayMs = 4500;

            const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

            const getDurationSeconds = () => {
                const raw = window.getComputedStyle(projectsCarousel).getPropertyValue('--carousel-duration');
                const parsed = parseFloat(raw);
                return Number.isFinite(parsed) && parsed > 0 ? parsed : 38;
            };

            const wrapOffset = (value) => {
                if (loopWidth <= 0) return 0;
                let wrapped = value % loopWidth;
                if (wrapped > 0) wrapped -= loopWidth;
                return wrapped;
            };

            const getCardMetrics = () => {
                const step = cardCount > 0 ? loopWidth / cardCount : 0;
                const firstItem = firstGroup.children[0];
                const cardWidth = firstItem ? firstItem.offsetWidth : step;
                const gap = Math.max(0, step - cardWidth);
                const centerBias = Math.max(0, (projectsCarousel.clientWidth - cardWidth) / 2 - gap);
                return { step, centerBias };
            };

            const getCardSnapOffset = (index) => {
                const { step, centerBias } = getCardMetrics();
                if (step <= 0 || cardCount <= 0) return 0;
                const normalized = ((index % cardCount) + cardCount) % cardCount;
                return wrapOffset(centerBias - normalized * step);
            };

            const getShortestDelta = (from, to) => {
                if (loopWidth <= 0) return 0;
                let diff = wrapOffset(to) - wrapOffset(from);
                if (diff > loopWidth / 2) diff -= loopWidth;
                if (diff < -loopWidth / 2) diff += loopWidth;
                return diff;
            };

            const getNearestCardIndex = (currentOffset) => {
                if (cardCount <= 0) return 0;
                let bestIndex = 0;
                let bestDist = Infinity;
                for (let i = 0; i < cardCount; i += 1) {
                    const dist = Math.abs(getShortestDelta(currentOffset, getCardSnapOffset(i)));
                    if (dist < bestDist) {
                        bestDist = dist;
                        bestIndex = i;
                    }
                }
                return bestIndex;
            };

            const renderTrack = () => {
                track.style.setProperty('--carousel-x', `${offset}px`);
            };

            const snapToCard = (targetIndex, animate) => {
                const targetOffset = getCardSnapOffset(targetIndex);
                if (!animate) {
                    isSnapping = false;
                    offset = targetOffset;
                    renderTrack();
                    return;
                }
                snapStartOffset = offset;
                snapDelta = getShortestDelta(offset, targetOffset);
                if (Math.abs(snapDelta) < 0.5) {
                    isSnapping = false;
                    offset = targetOffset;
                    renderTrack();
                    return;
                }
                snapStartTime = performance.now();
                snapDuration = 360;
                isSnapping = true;
            };

            const updateLoopWidth = () => {
                loopWidth = firstGroup.offsetWidth;
                if (mobileCarouselQuery.matches) {
                    snapToCard(getNearestCardIndex(offset), false);
                } else {
                    isSnapping = false;
                    offset = wrapOffset(offset);
                    renderTrack();
                }
            };

            if (supportsObserver) {
                const carouselObserver = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((entry) => {
                            isInView = entry.isIntersecting;
                        });
                    },
                    { threshold: 0.1 }
                );
                carouselObserver.observe(projectsCarousel);
            }

            // pausa mientras el cursor o foco esta sobre cualquier tarjeta
            track.addEventListener('pointerover', (event) => {
                if (event.pointerType === 'touch') return;
                if (event.target.closest('.project-card')) {
                    isCardHovered = true;
                }
            });

            track.addEventListener('pointerout', (event) => {
                if (event.pointerType === 'touch') return;
                const related = event.relatedTarget;
                if (!related || !track.contains(related) || !related.closest('.project-card')) {
                    isCardHovered = false;
                }
            });

            track.addEventListener('focusin', (event) => {
                if (event.target.closest('.project-card')) {
                    isCardFocused = true;
                }
            });

            track.addEventListener('focusout', (event) => {
                const related = event.relatedTarget;
                if (!related || !track.contains(related) || !related.closest('.project-card')) {
                    isCardFocused = false;
                }
            });

            // evitar el arrastre nativo de imagenes/enlaces dentro del carrusel
            projectsCarousel.addEventListener('dragstart', (event) => {
                event.preventDefault();
            });

            // arrastre manual presionando cualquier tarjeta de proyecto
            projectsCarousel.addEventListener('pointerdown', (event) => {
                if (event.pointerType === 'mouse' && event.button !== 0) return;
                if (!event.target.closest('.project-card')) return;

                activePointerId = event.pointerId;
                pointerStartX = event.clientX;
                dragStartOffset = offset;
                dragStartCardIndex = getNearestCardIndex(offset);
                lastPointerX = event.clientX;
                lastPointerTime = performance.now();
                velocity = 0;
                isSnapping = false;
                mobileIdleMs = 0;
                isDragging = false;
                suppressNextClick = false;
            });

            projectsCarousel.addEventListener('pointermove', (event) => {
                if (event.pointerId !== activePointerId) return;

                const dx = event.clientX - pointerStartX;
                if (!isDragging && Math.abs(dx) > 5) {
                    isDragging = true;
                    suppressNextClick = true;
                    projectsCarousel.classList.add('is-dragging');
                    if (typeof projectsCarousel.setPointerCapture === 'function') {
                        projectsCarousel.setPointerCapture(event.pointerId);
                    }
                }

                if (!isDragging) return;

                const now = performance.now();
                const dt = now - lastPointerTime;
                if (dt > 0) {
                    velocity = (event.clientX - lastPointerX) / dt;
                    lastPointerX = event.clientX;
                    lastPointerTime = now;
                }

                offset = wrapOffset(dragStartOffset + dx);
                renderTrack();
            });

            const endDrag = (event) => {
                if (event.pointerId !== activePointerId) return;
                activePointerId = null;

                if (isDragging) {
                    const dx = event.clientX - pointerStartX;
                    isDragging = false;
                    projectsCarousel.classList.remove('is-dragging');
                    if (
                        typeof projectsCarousel.hasPointerCapture === 'function' &&
                        projectsCarousel.hasPointerCapture(event.pointerId)
                    ) {
                        projectsCarousel.releasePointerCapture(event.pointerId);
                    }
                    // si el usuario detuvo el puntero antes de soltar, no aplicar inercia residual
                    if (performance.now() - lastPointerTime > 80) {
                        velocity = 0;
                    }

                    // en vista movil encajar siempre a una tarjeta completa en la direccion del gesto
                    if (mobileCarouselQuery.matches && cardCount > 0) {
                        const { step } = getCardMetrics();
                        const swipeThreshold = Math.max(36, step * 0.14);
                        const flickVelocity = 0.25;
                        let stepDelta = 0;

                        if (Math.abs(dx) >= swipeThreshold || Math.abs(velocity) >= flickVelocity) {
                            const rawSteps = step > 0 ? -dx / step : 0;
                            if (Math.abs(rawSteps) >= 1) {
                                stepDelta = Math.round(rawSteps);
                            } else {
                                const moveNext = dx !== 0 ? dx < 0 : velocity < 0;
                                stepDelta = moveNext ? 1 : -1;
                            }
                        }

                        velocity = 0;
                        mobileIdleMs = 0;
                        snapToCard(dragStartCardIndex + stepDelta, true);
                    }

                    window.setTimeout(() => {
                        suppressNextClick = false;
                    }, 0);
                }
            };

            projectsCarousel.addEventListener('pointerup', endDrag);
            projectsCarousel.addEventListener('pointercancel', endDrag);

            // evita abrir enlaces al soltar despues de arrastrar
            projectsCarousel.addEventListener(
                'click',
                (event) => {
                    if (!suppressNextClick) return;
                    event.preventDefault();
                    event.stopPropagation();
                    suppressNextClick = false;
                },
                true
            );

            window.addEventListener('resize', updateLoopWidth, { passive: true });
            if (mobileCarouselQuery.matches) {
                snapToCard(0, false);
            } else {
                renderTrack();
            }

            let lastFrameTime = performance.now();
            const tickCarousel = (now) => {
                const dt = Math.min(0.05, (now - lastFrameTime) / 1000);
                lastFrameTime = now;

                if (loopWidth <= 0) {
                    loopWidth = firstGroup.offsetWidth;
                }

                if (!isDragging && loopWidth > 0) {
                    if (mobileCarouselQuery.matches) {
                        if (isSnapping) {
                            const progress = Math.min(1, (now - snapStartTime) / snapDuration);
                            offset = wrapOffset(snapStartOffset + snapDelta * easeOutCubic(progress));
                            renderTrack();
                            if (progress >= 1) {
                                isSnapping = false;
                            }
                        } else if (isInView && !isCardHovered && !isCardFocused) {
                            mobileIdleMs += dt * 1000;
                            if (mobileIdleMs >= mobileAutoDelayMs) {
                                mobileIdleMs = 0;
                                snapToCard(getNearestCardIndex(offset) + 1, true);
                            }
                        }
                    } else if (Math.abs(velocity) > 0.02) {
                        offset = wrapOffset(offset + velocity * (dt * 1000));
                        velocity *= Math.pow(0.92, dt * 60);
                        if (Math.abs(velocity) <= 0.02) velocity = 0;
                        renderTrack();
                    } else if (isInView && !isCardHovered && !isCardFocused) {
                        const speedPxPerSec = loopWidth / getDurationSeconds();
                        offset = wrapOffset(offset - speedPxPerSec * dt);
                        renderTrack();
                    }
                }

                window.requestAnimationFrame(tickCarousel);
            };

            window.requestAnimationFrame(tickCarousel);
        }
    }

    /* ---------- barra de navegacion flotante ([data-floating-nav]) ---------- */
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

    // indicador deslizante para transiciones fluidas entre pestañas
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

    // control de scroll programatico: evita activar secciones intermedias al saltar desde la navbar
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

        // usar metricas de layout sin transformar (evita desfase por translatey/scale del scroll-driven)
        const sectionTop = getLayoutTop(target);
        const sectionHeight = target.offsetHeight;

        // aterrizar centrado en la seccion (o al inicio si la seccion supera el alto del viewport)
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

    // si el usuario interviene manualmente durante el desplazamiento, liberar el bloqueo al instante
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

    // posicion inicial del indicador antes de activar su transicion
    setActiveSection(findCenterSectionId());
    if (indicator) {
        window.requestAnimationFrame(() => {
            const active = sections.find(({ id }) => id === currentActiveId);
            if (active) positionIndicator(active.link);
            indicator.classList.add('is-ready');
        });
    }
})();
