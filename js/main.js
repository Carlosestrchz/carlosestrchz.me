(() => {
    'use strict';

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const supportsObserver = 'IntersectionObserver' in window;
    const onLanguageChangedCallbacks = [];

    /* ---------- selector de idioma (es / en) ---------- */
    const translations = {
        es: {
            'meta.title': 'Blog de Carlos Estrada | Developer',
            'meta.description': 'Página personal de Carlos Estrada, desarrollador Java Full Stack Jr. con enfoque en IoT, backend y nube.',
            'hero.eyebrow': 'Hola, ¡Has llegado a mi página personal!',
            'hero.role': 'Desarrollador Java Jr | Apps multiplataforma.',
            'hero.lead': 'Experiencia en soluciones IoT y desarrollo web, con experiencia práctica en backend e infraestructura en la nube. Aquí encontrarás mi formación, proyectos y habilidades.',
            'hero.ctaProjects': 'Ver proyectos',
            'hero.ctaContact': 'Contactar',
            'about.title': 'Sobre mí',
            'about.p1': 'Estudiante de Ingeniería en Sistemas Computacionales a nada de titularse, y desarrollador Java full stack en formación. Estudié también Ingeniería en Electrónica, y por eso me atraen los proyectos donde el código se encuentra con el mundo físico: IoT y sistemas embebidos.',
            'about.p2': 'Me inspira entender cómo funcionan las cosas, desde las bases, hasta ser capaz de construir proyectos que apliquen dichos principios: la electrónica y el prototipado, la privacidad digital, la infraestructura propia y el software abierto. Me motiva pensar que lo que construyo llegue a representar una solución para los problemas de mi entorno.',
            'about.summaryTitle': 'En resumen:',
            'about.location': 'Monterrey, Nuevo León · Disponibilidad de reubicación',
            'about.english': 'Inglés (B2)',
            'about.linkedin': 'Ver en LinkedIn',
            'projects.title': 'Proyectos académicos y profesionales',
            'projects.moreInfo': 'Más información →',
            'projects.wattguard.meta': 'Hackathon Talent Land 2026 · Qualcomm Sustainable Power Cities',
            'projects.wattguard.text': 'Plataforma IoT con modelo de IA en el borde que monitorea el consumo eléctrico y lo ajusta de forma automática: apaga dispositivos en desuso o no prioritarios y puede desactivar nodos ante sobrecargas o exceso de temperatura. La app móvil está desarrollada con Dart y Flutter.',
            'projects.signet.meta': 'Hackathon Solana Builder 2026',
            'projects.signet.text': 'Protocolo distribuido que funciona sobre la blockchain de Solana para registrar y validar la propiedad de archivos digitales mediante su huella criptográfica SHA-256.',
            'projects.signet.tagCrypto': 'Criptografía',
            'projects.apex.meta': 'Bootcamp Generation México',
            'projects.apex.text': 'Plataforma e-commerce de productos electrónicos de consumo, componentes de cómputo (RAM, SSD, chasis y periféricos), computadoras portátiles y PCs armadas a medida.',
            'projects.ironcito.meta': 'Bootcamp Business AI Builder · Oracle Next Education',
            'projects.ironcito.text': 'Agente de IA integrado dentro de Apex Iron y potenciado con flujos de automatización en N8N que guía a usuarios sin conocimientos técnicos en la compra de componentes y periféricos: valida la compatibilidad con sus equipos de cómputo y sugiere alternativas compatibles dentro del catálogo disponible.',
            'infra.title': 'Infraestructura',
            'infra.intro': 'Apasionado por contenedorizar aplicaciones con Podman y administrar mi propia infraestructura de servicios autoalojados. Diseñar, desplegar y mantener este entorno me permite trabajar de primera mano con redes, proxies inversos, automatización y gestión de datos, aplicando buenas prácticas de aislamiento, reproducibilidad y control total sobre el stack. Aquí concentro los servicios desplegados bajo mi dominio.',
            'infra.n8nLabel': 'Abrir n8n en n8n.carlosestrchz.me',
            'infra.giteaLabel': 'Abrir Gitea en git.carlosestrchz.me',
            'infra.dbgateLabel': 'Abrir DbGate en dbmanager.carlosestrchz.me',
            'infra.seafileLabel': 'Abrir Seafile en drive.carlosestrchz.me',
            'contact.title': 'Hablemos',
            'contact.text': '¿Tienes una vacante o un proyecto en mente? Escríbeme.',
            'contact.avatarAlt': 'Avatar 3D de Carlos Estrada en traje formal con portafolio',
            'lang.ariaLabel': 'Selector de idioma',
            'nav.ariaLabel': 'Navegación principal',
            'nav.home': 'Inicio',
            'nav.about': 'Sobre mí',
            'nav.projects': 'Proyectos',
            'nav.infra': 'Infraestructura',
            'nav.contact': 'Contacto',
        },
        en: {
            'meta.title': "Carlos Estrada's Blog | Developer",
            'meta.description': 'Personal website of Carlos Estrada, Jr. Java Full Stack Developer focused on IoT, backend, and cloud.',
            'hero.eyebrow': 'Hi, welcome to my personal website!',
            'hero.role': 'Jr. Java Developer | Cross-platform Apps.',
            'hero.lead': 'Experience in IoT solutions and web development, with hands-on experience in backend and cloud infrastructure. Here you will find my background, projects, and skills.',
            'hero.ctaProjects': 'View projects',
            'hero.ctaContact': 'Contact',
            'about.title': 'About me',
            'about.p1': 'Computer Systems Engineering student about to graduate and aspiring Java Full Stack Developer. I also studied Electronics Engineering, which draws me to projects where code meets the physical world: IoT and embedded systems.',
            'about.p2': 'I am inspired by understanding how things work from the ground up until I can build projects applying those principles: electronics and prototyping, digital privacy, self-hosted infrastructure, and open-source software. What drives me is knowing that what I build can become a real solution to the problems around me.',
            'about.summaryTitle': 'In summary:',
            'about.location': 'Monterrey, Nuevo León · Open to relocation',
            'about.english': 'English (B2)',
            'about.linkedin': 'View on LinkedIn',
            'projects.title': 'Academic & Professional Projects',
            'projects.moreInfo': 'Learn more →',
            'projects.wattguard.meta': 'Talent Land 2026 Hackathon · Qualcomm Sustainable Power Cities',
            'projects.wattguard.text': 'IoT platform with an Edge AI model that monitors power consumption and automatically regulates it: turns off idle or non-priority devices and can shut down nodes during overloads or overheating. The mobile app is built with Dart and Flutter.',
            'projects.signet.meta': 'Solana Builder 2026 Hackathon',
            'projects.signet.text': 'Distributed protocol running on the Solana blockchain to register and verify digital file ownership through its SHA-256 cryptographic hash.',
            'projects.signet.tagCrypto': 'Cryptography',
            'projects.apex.meta': 'Generation México Bootcamp',
            'projects.apex.text': 'E-commerce platform for consumer electronics, computer hardware components (RAM, SSDs, cases, and peripherals), laptops, and custom-built PCs.',
            'projects.ironcito.meta': 'Business AI Builder Bootcamp · Oracle Next Education',
            'projects.ironcito.text': 'AI agent integrated into Apex Iron and powered by n8n automation workflows that guides non-technical users in buying computer components and peripherals: checks hardware compatibility with their systems and suggests compatible alternatives from the available catalog.',
            'infra.title': 'Infrastructure',
            'infra.intro': 'Passionate about containerizing applications with Podman and managing my own self-hosted infrastructure. Designing, deploying, and maintaining this environment lets me work hands-on with networking, reverse proxies, automation, and data management, applying best practices for isolation, reproducibility, and full control over the stack. Here I gather the services deployed under my domain.',
            'infra.n8nLabel': 'Open n8n at n8n.carlosestrchz.me',
            'infra.giteaLabel': 'Open Gitea at git.carlosestrchz.me',
            'infra.dbgateLabel': 'Open DbGate at dbmanager.carlosestrchz.me',
            'infra.seafileLabel': 'Open Seafile at drive.carlosestrchz.me',
            'contact.title': "Let's talk",
            'contact.text': 'Have a job opening or a project in mind? Write to me.',
            'contact.avatarAlt': '3D avatar of Carlos Estrada wearing a formal suit and holding a briefcase',
            'lang.ariaLabel': 'Language selector',
            'nav.ariaLabel': 'Main navigation',
            'nav.home': 'Home',
            'nav.about': 'About me',
            'nav.projects': 'Projects',
            'nav.infra': 'Infrastructure',
            'nav.contact': 'Contact',
        },
    };

    const langStorageKey = 'site-lang';
    const langSwitch = document.querySelector('[data-lang-switch]');
    const langButtons = langSwitch ? Array.from(langSwitch.querySelectorAll('[data-lang]')) : [];
    const metaDescription = document.querySelector('meta[name="description"]');

    const getStoredLanguage = () => {
        try {
            const saved = window.localStorage.getItem(langStorageKey);
            return saved && translations[saved] ? saved : 'es';
        } catch {
            return 'es';
        }
    };

    const saveLanguage = (lang) => {
        try {
            window.localStorage.setItem(langStorageKey, lang);
        } catch {
            // ignorar si el almacenamiento local no esta disponible
        }
    };

    const applyLanguage = (lang) => {
        const dict = translations[lang] || translations.es;
        document.documentElement.lang = lang;

        if (dict['meta.title']) {
            document.title = dict['meta.title'];
        }
        if (metaDescription && dict['meta.description']) {
            metaDescription.setAttribute('content', dict['meta.description']);
        }

        document.querySelectorAll('[data-i18n]').forEach((el) => {
            const key = el.getAttribute('data-i18n');
            if (key && dict[key]) {
                el.textContent = dict[key];
            }
        });

        document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
            const key = el.getAttribute('data-i18n-aria');
            if (key && dict[key]) {
                el.setAttribute('aria-label', dict[key]);
            }
        });

        document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
            const key = el.getAttribute('data-i18n-alt');
            if (key && dict[key]) {
                el.setAttribute('alt', dict[key]);
            }
        });

        langButtons.forEach((btn) => {
            const isSelected = btn.getAttribute('data-lang') === lang;
            btn.classList.toggle('is-active', isSelected);
            btn.setAttribute('aria-pressed', String(isSelected));
        });

        onLanguageChangedCallbacks.forEach((cb) => cb());
    };

    langButtons.forEach((btn) => {
        btn.addEventListener('click', (event) => {
            if (event.detail > 0) {
                btn.blur();
            }
            const nextLang = btn.getAttribute('data-lang');
            if (!nextLang || !translations[nextLang]) return;
            saveLanguage(nextLang);
            applyLanguage(nextLang);
        });
    });

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
            onLanguageChangedCallbacks.push(updateLoopWidth);
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

    /* ---------- utilidades compartidas para tokens y medidas ---------- */
    const readNumericToken = (el, tokenName, fallback) => {
        const raw = window.getComputedStyle(el).getPropertyValue(tokenName).trim();
        if (!raw) return fallback;
        const parsed = parseFloat(raw);
        if (!Number.isFinite(parsed)) return fallback;
        if (raw.endsWith('rem')) {
            const rootSize = parseFloat(window.getComputedStyle(document.documentElement).fontSize) || 16;
            return parsed * rootSize;
        }
        return parsed;
    };

    const readDurationMsToken = (el, tokenName, fallbackMs) => {
        const raw = window.getComputedStyle(el).getPropertyValue(tokenName).trim();
        if (!raw) return fallbackMs;
        const parsed = parseFloat(raw);
        if (!Number.isFinite(parsed) || parsed <= 0) return fallbackMs;
        return raw.endsWith('ms') ? parsed : parsed * 1000;
    };

    const getOffsetRelativeTo = (el, ancestor) => {
        let left = 0;
        let top = 0;
        let current = el;
        while (current && current !== ancestor) {
            left += current.offsetLeft;
            top += current.offsetTop;
            current = current.offsetParent;
        }
        return {
            left,
            top,
            width: el.offsetWidth,
            height: el.offsetHeight,
        };
    };

    /* ---------- astronauta flotante en el hero ([data-astronaut-stage]) ---------- */
    const astronautStage = document.querySelector('[data-astronaut-stage]');
    const astronautEl = astronautStage ? astronautStage.querySelector('[data-astronaut]') : null;
    const heroSection = astronautStage ? astronautStage.closest('.page-section') : null;

    if (astronautStage && astronautEl && heroSection && !reducedMotionQuery.matches) {
        const desktopAstronautQuery = window.matchMedia('(min-width: 768px)');
        const obstacleNodes = Array.from(heroSection.querySelectorAll('[data-astronaut-obstacle]'));
        const floatingNavRef = document.querySelector('[data-floating-nav]');
        const langSwitchRef = document.querySelector('[data-lang-switch]');

        let isHeroVisible = true;
        let astroRafId = null;
        let astroLastTime = 0;
        let astroMode = 'mobile';
        let astroBounds = { minX: 0, maxX: 0, minY: 0, maxY: 0 };
        let astroSize = { width: 0, height: 0 };
        let astroObstacles = [];
        let astroX = 0;
        let astroY = 0;
        let astroVx = 0;
        let astroVy = 0;
        let hasPlacedAstronaut = false;

        const rectOverlapsAny = (x, y, w, h, rects) => {
            for (let i = 0; i < rects.length; i += 1) {
                const r = rects[i];
                if (x < r.right && x + w > r.left && y < r.bottom && y + h > r.top) {
                    return r;
                }
            }
            return null;
        };

        const computeBottomUiClearance = () => {
            let clearance = readNumericToken(document.documentElement, '--floating-nav-clearance', 88);
            const vh = window.innerHeight;
            [floatingNavRef, langSwitchRef].forEach((node) => {
                if (!node) return;
                const rect = node.getBoundingClientRect();
                if (rect.height > 0 && rect.top < vh) {
                    clearance = Math.max(clearance, vh - rect.top + 12);
                }
            });
            return clearance;
        };

        const measureObstaclesAndBounds = () => {
            const stageW = astronautStage.clientWidth;
            const stageH = astronautStage.clientHeight;
            const stageRect = astronautStage.getBoundingClientRect();
            const scaleX = stageW > 0 && stageRect.width > 0 ? stageRect.width / stageW : 1;
            const scaleY = stageH > 0 && stageRect.height > 0 ? stageRect.height / stageH : 1;

            const exclusionMargin = readNumericToken(astronautStage, '--astronaut-exclusion-margin', 24);
            const edgePadding = readNumericToken(astronautStage, '--astronaut-edge-padding', 16);
            const bobPadY = readNumericToken(astronautStage, '--astronaut-bob-y', 10);

            const astroRect = astronautEl.getBoundingClientRect();
            const w = astroRect.width > 0 ? astroRect.width / scaleX : astronautEl.offsetWidth;
            const h = astroRect.height > 0 ? astroRect.height / scaleY : astronautEl.offsetHeight;
            const tiltPadX = Math.ceil(h * 0.04);

            const padX = exclusionMargin + tiltPadX;
            const padY = exclusionMargin + bobPadY;

            const obstacles = [];
            obstacleNodes.forEach((node) => {
                const r = node.getBoundingClientRect();
                if (r.width <= 0 || r.height <= 0) return;
                obstacles.push({
                    left: (r.left - stageRect.left) / scaleX - padX,
                    top: (r.top - stageRect.top) / scaleY - padY,
                    right: (r.right - stageRect.left) / scaleX + padX,
                    bottom: (r.bottom - stageRect.top) / scaleY + padY,
                });
            });

            const bottomClearance = computeBottomUiClearance();
            const minX = edgePadding + tiltPadX;
            const maxX = stageW - edgePadding - tiltPadX - w;
            const minY = edgePadding + bobPadY;
            const maxY = stageH - bottomClearance - bobPadY - h;

            return {
                w,
                h,
                obstacles,
                bounds: { minX, maxX, minY, maxY },
            };
        };

        const evaluateFreeSpace = (metrics) => {
            const { w, h, obstacles, bounds } = metrics;
            if (w <= 0 || h <= 0 || bounds.maxX < bounds.minX || bounds.maxY < bounds.minY) {
                return { canDrift: false, hasStaticSpot: false, bestSpot: null };
            }

            const cols = 24;
            const rows = 16;
            const spanX = bounds.maxX - bounds.minX;
            const spanY = bounds.maxY - bounds.minY;
            const validPoints = [];

            for (let iy = 0; iy <= rows; iy += 1) {
                const py = bounds.minY + (spanY * iy) / rows;
                for (let ix = 0; ix <= cols; ix += 1) {
                    const px = bounds.minX + (spanX * ix) / cols;
                    if (!rectOverlapsAny(px, py, w, h, obstacles)) {
                        validPoints.push({ x: px, y: py });
                    }
                }
            }

            if (!validPoints.length) {
                return { canDrift: false, hasStaticSpot: false, bestSpot: null };
            }

            // calcular holgura respecto a los obstaculos para elegir el mejor punto inicial
            const scorePoint = (pt) => {
                let minDist = Infinity;
                obstacles.forEach((r) => {
                    const dx = Math.max(r.left - (pt.x + w), pt.x - r.right, 0);
                    const dy = Math.max(r.top - (pt.y + h), pt.y - r.bottom, 0);
                    const dist = Math.hypot(dx, dy);
                    if (dist < minDist) minDist = dist;
                });
                const edgeDist = Math.min(
                    pt.x - bounds.minX,
                    bounds.maxX - pt.x,
                    pt.y - bounds.minY,
                    bounds.maxY - pt.y
                );
                return minDist + Math.min(edgeDist, 40) * 0.4;
            };

            let bestSpot = validPoints[0];
            let bestScore = -Infinity;
            validPoints.forEach((pt) => {
                const score = scorePoint(pt);
                if (score > bestScore) {
                    bestScore = score;
                    bestSpot = pt;
                }
            });

            // medir cuanto recorrido libre existe desde el mejor punto en ejes x e y
            const step = 8;
            let freeLeft = 0;
            while (
                bestSpot.x - freeLeft - step >= bounds.minX &&
                !rectOverlapsAny(bestSpot.x - freeLeft - step, bestSpot.y, w, h, obstacles)
            ) {
                freeLeft += step;
            }
            let freeRight = 0;
            while (
                bestSpot.x + freeRight + step <= bounds.maxX &&
                !rectOverlapsAny(bestSpot.x + freeRight + step, bestSpot.y, w, h, obstacles)
            ) {
                freeRight += step;
            }
            let freeUp = 0;
            while (
                bestSpot.y - freeUp - step >= bounds.minY &&
                !rectOverlapsAny(bestSpot.x, bestSpot.y - freeUp - step, w, h, obstacles)
            ) {
                freeUp += step;
            }
            let freeDown = 0;
            while (
                bestSpot.y + freeDown + step <= bounds.maxY &&
                !rectOverlapsAny(bestSpot.x, bestSpot.y + freeDown + step, w, h, obstacles)
            ) {
                freeDown += step;
            }

            const driftSpan = Math.max(freeLeft + freeRight, freeUp + freeDown);
            return {
                canDrift: driftSpan >= 32,
                hasStaticSpot: true,
                bestSpot,
            };
        };

        const renderAstronautPos = () => {
            astronautEl.style.setProperty('--astronaut-x', `${astroX.toFixed(2)}px`);
            astronautEl.style.setProperty('--astronaut-y', `${astroY.toFixed(2)}px`);
        };

        const stopAstronautLoop = () => {
            if (astroRafId !== null) {
                window.cancelAnimationFrame(astroRafId);
                astroRafId = null;
            }
        };

        const tickAstronaut = (now) => {
            if (!isHeroVisible || document.hidden || astroMode !== 'drift') {
                astroRafId = null;
                return;
            }

            const dt = astroLastTime > 0 ? Math.min(0.05, (now - astroLastTime) / 1000) : 0;
            astroLastTime = now;

            if (dt > 0) {
                // avanzar eje x y rebotar contra limites y zonas de exclusion
                const nextX = astroX + astroVx * dt;
                if (nextX <= astroBounds.minX) {
                    astroX = astroBounds.minX;
                    astroVx = Math.abs(astroVx);
                } else if (nextX >= astroBounds.maxX) {
                    astroX = astroBounds.maxX;
                    astroVx = -Math.abs(astroVx);
                } else {
                    const hitX = rectOverlapsAny(nextX, astroY, astroSize.width, astroSize.height, astroObstacles);
                    if (hitX) {
                        if (astroVx > 0) {
                            astroX = Math.max(astroBounds.minX, hitX.left - astroSize.width);
                            astroVx = -Math.abs(astroVx);
                        } else {
                            astroX = Math.min(astroBounds.maxX, hitX.right);
                            astroVx = Math.abs(astroVx);
                        }
                    } else {
                        astroX = nextX;
                    }
                }

                // avanzar eje y y rebotar contra limites y zonas de exclusion
                const nextY = astroY + astroVy * dt;
                if (nextY <= astroBounds.minY) {
                    astroY = astroBounds.minY;
                    astroVy = Math.abs(astroVy);
                } else if (nextY >= astroBounds.maxY) {
                    astroY = astroBounds.maxY;
                    astroVy = -Math.abs(astroVy);
                } else {
                    const hitY = rectOverlapsAny(astroX, nextY, astroSize.width, astroSize.height, astroObstacles);
                    if (hitY) {
                        if (astroVy > 0) {
                            astroY = Math.max(astroBounds.minY, hitY.top - astroSize.height);
                            astroVy = -Math.abs(astroVy);
                        } else {
                            astroY = Math.min(astroBounds.maxY, hitY.bottom);
                            astroVy = Math.abs(astroVy);
                        }
                    } else {
                        astroY = nextY;
                    }
                }

                renderAstronautPos();
            }

            astroRafId = window.requestAnimationFrame(tickAstronaut);
        };

        const syncAstronautPlayback = () => {
            const shouldPause = !isHeroVisible || document.hidden;
            astronautStage.classList.toggle('is-paused', shouldPause);

            if (shouldPause || astroMode !== 'drift') {
                stopAstronautLoop();
                return;
            }

            if (astroRafId === null) {
                astroLastTime = performance.now();
                astroRafId = window.requestAnimationFrame(tickAstronaut);
            }
        };

        const layoutAstronaut = () => {
            if (!desktopAstronautQuery.matches) {
                astroMode = 'mobile';
                hasPlacedAstronaut = false;
                stopAstronautLoop();
                astronautStage.classList.remove('has-js-astronaut');
                astronautEl.classList.remove('hero-astronaut--compact', 'is-hidden');
                astronautEl.style.removeProperty('--astronaut-x');
                astronautEl.style.removeProperty('--astronaut-y');
                syncAstronautPlayback();
                return;
            }

            astronautStage.classList.add('has-js-astronaut');
            astronautEl.classList.remove('hero-astronaut--compact', 'is-hidden');

            let metrics = measureObstaclesAndBounds();
            let evaluation = evaluateFreeSpace(metrics);

            // si a tamaño normal no cabe para flotar, intentar en tamaño compacto
            if (!evaluation.canDrift) {
                astronautEl.classList.add('hero-astronaut--compact');
                metrics = measureObstaclesAndBounds();
                evaluation = evaluateFreeSpace(metrics);
            }

            astroSize = { width: metrics.w, height: metrics.h };
            astroBounds = metrics.bounds;
            astroObstacles = metrics.obstacles;

            if (!evaluation.hasStaticSpot) {
                astroMode = 'hidden';
                astronautEl.classList.add('is-hidden');
                stopAstronautLoop();
                return;
            }

            astroMode = evaluation.canDrift ? 'drift' : 'static';

            const currentValid =
                hasPlacedAstronaut &&
                astroX >= astroBounds.minX &&
                astroX <= astroBounds.maxX &&
                astroY >= astroBounds.minY &&
                astroY <= astroBounds.maxY &&
                !rectOverlapsAny(astroX, astroY, astroSize.width, astroSize.height, astroObstacles);

            if (!currentValid) {
                astroX = evaluation.bestSpot.x;
                astroY = evaluation.bestSpot.y;
                hasPlacedAstronaut = true;
            }

            const speed = readNumericToken(astronautStage, '--astronaut-speed', 24);
            if (astroVx === 0 && astroVy === 0) {
                const angle = 0.62;
                astroVx = Math.cos(angle) * speed;
                astroVy = Math.sin(angle) * speed;
            } else {
                const mag = Math.hypot(astroVx, astroVy) || 1;
                astroVx = (astroVx / mag) * speed;
                astroVy = (astroVy / mag) * speed;
            }

            renderAstronautPos();
            syncAstronautPlayback();
        };

        if (supportsObserver) {
            const heroObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        isHeroVisible = entry.isIntersecting;
                        syncAstronautPlayback();
                    });
                },
                { threshold: 0.05 }
            );
            heroObserver.observe(heroSection);
        }

        document.addEventListener('visibilitychange', syncAstronautPlayback);

        let astroResizeFrame = null;
        const scheduleAstronautLayout = () => {
            if (astroResizeFrame !== null) return;
            astroResizeFrame = window.requestAnimationFrame(() => {
                astroResizeFrame = null;
                layoutAstronaut();
            });
        };

        window.addEventListener('resize', scheduleAstronautLayout, { passive: true });
        onLanguageChangedCallbacks.push(scheduleAstronautLayout);

        if ('ResizeObserver' in window) {
            const astroResizeObserver = new ResizeObserver(scheduleAstronautLayout);
            astroResizeObserver.observe(heroSection);
            const heroContent = heroSection.querySelector('.hero__content');
            if (heroContent) {
                astroResizeObserver.observe(heroContent);
            }
        }

        const astroImg = astronautEl.querySelector('.hero-astronaut__img');
        if (astroImg && !astroImg.complete) {
            astroImg.addEventListener('load', scheduleAstronautLayout, { once: true });
        }

        window.requestAnimationFrame(layoutAstronaut);
    }

    /* ---------- avatar que empuja la tarjeta en resumen ([data-about-push-section]) ---------- */
    const aboutPushSection = document.querySelector('[data-about-push-section]');
    const aboutPushCard = aboutPushSection ? aboutPushSection.querySelector('[data-about-push-card]') : null;
    const aboutPushStage = aboutPushSection ? aboutPushSection.querySelector('[data-about-push-stage]') : null;

    if (aboutPushSection && aboutPushCard && aboutPushStage && !reducedMotionQuery.matches && supportsObserver) {
        const pushAssetPath = 'img/webp/push.webp';
        const pushNativeW = 628;
        const pushNativeH = 706;
        const pushTotalFrames = 64;
        const pushLastFrame = pushTotalFrames - 1;
        const pushAspectRatio = pushNativeW / pushNativeH;

        let pushAvatarEl = null;
        let pushBytesPromise = null;
        let pushDecoder = null;
        let pushCanvasCtx = null;
        let pushUsingDecoder = false;
        let pushObjectUrl = null;
        let pushTriggered = false;
        let pushFinished = false;
        let pushAnimating = false;
        let pushSectionVisible = true;
        let pushRafId = null;
        let pushStartTime = 0;
        let pushPausedAt = 0;
        let pushRequestedFrame = -1;
        let pushDecodingFrame = false;
        let pushActiveMetrics = null;
        let pushObserver = null;
        let pushVisibilityObserver = null;

        const ensureAvatarWrapper = () => {
            if (pushAvatarEl) return pushAvatarEl;
            pushAvatarEl = document.createElement('div');
            pushAvatarEl.className = 'about-push__avatar';
            aboutPushStage.appendChild(pushAvatarEl);
            return pushAvatarEl;
        };

        // precargar solo los bytes del webp original sin iniciar ningun reloj de animacion
        const prefetchPushBytes = () => {
            if (pushBytesPromise || typeof window.fetch !== 'function') return pushBytesPromise;
            pushBytesPromise = window
                .fetch(pushAssetPath)
                .then((res) => (res.ok ? res.arrayBuffer() : null))
                .catch(() => null);
            return pushBytesPromise;
        };

        // renderiza un cuadro exacto (0..63) del webp original en el canvas nativo 730x716
        const renderDecoderFrame = (targetIndex) => {
            if (!pushDecoder || !pushCanvasCtx) return;
            const clamped = Math.max(0, Math.min(pushLastFrame, targetIndex));
            if (clamped === pushRequestedFrame) return;
            pushRequestedFrame = clamped;
            if (pushDecodingFrame) return;

            const flushDecode = async () => {
                pushDecodingFrame = true;
                let drawnIndex = -1;
                try {
                    while (pushDecoder && pushRequestedFrame !== drawnIndex) {
                        const idx = pushRequestedFrame;
                        const { image } = await pushDecoder.decode({ frameIndex: idx });
                        if (pushCanvasCtx) {
                            pushCanvasCtx.clearRect(0, 0, pushNativeW, pushNativeH);
                            pushCanvasCtx.drawImage(image, 0, 0, pushNativeW, pushNativeH);
                        }
                        image.close();
                        drawnIndex = idx;
                    }
                } catch {
                    // ignorar si el decodificador ya fue cerrado al finalizar
                } finally {
                    pushDecodingFrame = false;
                }
            };

            flushDecode();
        };

        const computePushMetrics = () => {
            const minBreakpoint = readNumericToken(aboutPushSection, '--push-min-breakpoint', 768);
            const sectionWidth = aboutPushSection.clientWidth;
            const sectionHeight = aboutPushSection.clientHeight;

            if (window.innerWidth < minBreakpoint || sectionWidth <= 0) {
                return { hasRoom: false };
            }

            const wrapper = ensureAvatarWrapper();
            const wasHidden = wrapper.classList.contains('is-hidden');
            if (wasHidden) wrapper.classList.remove('is-hidden');
            const avatarHeight = wrapper.offsetHeight;
            if (wasHidden) wrapper.classList.add('is-hidden');

            if (avatarHeight <= 0) {
                return { hasRoom: false };
            }

            const avatarWidth = avatarHeight * pushAspectRatio;
            const cardBox = getOffsetRelativeTo(aboutPushCard, aboutPushSection);
            const cardRight = cardBox.left + cardBox.width;
            const freeRightSpace = sectionWidth - cardRight;

            const contactOverlap = readNumericToken(aboutPushSection, '--push-contact-overlap', 8);
            const handInsetRatio = readNumericToken(aboutPushSection, '--push-hand-inset-ratio', 0.011);
            const bodyVisibleRatio = readNumericToken(aboutPushSection, '--push-body-visible-ratio', 0.828);
            const verticalAlign = readNumericToken(aboutPushSection, '--push-vertical-align', 0.96);
            const verticalOffset = readNumericToken(aboutPushSection, '--push-vertical-offset', 0);
            const overshoot = readNumericToken(aboutPushSection, '--push-overshoot', 6);
            const wobbleDeg = readNumericToken(aboutPushSection, '--push-wobble-deg', 3.2);
            const wobbleLift = readNumericToken(aboutPushSection, '--push-wobble-lift', 4);
            const edgeClearance = readNumericToken(aboutPushSection, '--push-edge-clearance', 10);
            const durationMs = readDurationMsToken(aboutPushSection, '--push-duration', 3008);

            const requiredVisibleWidth = avatarWidth * bodyVisibleRatio - contactOverlap;
            const hasRoom = freeRightSpace >= requiredVisibleWidth + edgeClearance;

            const avatarFinalLeft = cardRight - avatarWidth * handInsetRatio - contactOverlap;
            const rawTop = cardBox.top + (cardBox.height - avatarHeight) * verticalAlign + verticalOffset;
            const avatarTop = Math.max(8, Math.min(sectionHeight - avatarHeight - 8, rawTop));
            const startOffsetX = Math.max(sectionWidth - cardBox.left + 32, avatarWidth + 48);

            // tramo visible garantizando que las manos entren en cuadro para el empuje
            const avatarVisibleFinalLeft = avatarFinalLeft + avatarWidth * handInsetRatio;
            const rawOnScreenRunway = Math.max(40, sectionWidth - avatarVisibleFinalLeft - 24);
            const onScreenRunway = Math.min(startOffsetX, rawOnScreenRunway);
            const preEntryDist = Math.max(0, startOffsetX - onScreenRunway);

            return {
                hasRoom,
                avatarFinalLeft,
                avatarTop,
                startOffsetX,
                preEntryDist,
                onScreenRunway,
                overshoot,
                wobbleDeg,
                wobbleLift,
                durationMs,
            };
        };

        const setAvatarPosition = (x, y) => {
            if (!pushAvatarEl) return;
            pushAvatarEl.style.setProperty('--push-avatar-x', `${x.toFixed(2)}px`);
            pushAvatarEl.style.setProperty('--push-avatar-y', `${y.toFixed(2)}px`);
        };

        const clearCardPushTransform = () => {
            aboutPushCard.classList.remove('is-push-ready');
            aboutPushCard.style.removeProperty('--push-card-x');
            aboutPushCard.style.removeProperty('--push-card-y');
            aboutPushCard.style.removeProperty('--push-card-rot');
        };

        const finishPushAnimation = async () => {
            pushAnimating = false;
            pushFinished = true;
            if (pushRafId !== null) {
                window.cancelAnimationFrame(pushRafId);
                pushRafId = null;
            }
            if (pushVisibilityObserver) {
                pushVisibilityObserver.disconnect();
                pushVisibilityObserver = null;
            }
            clearCardPushTransform();

            // asegurar el ultimo cuadro exacto (63) en el canvas y liberar el decodificador
            if (pushDecoder && pushCanvasCtx) {
                const decoderRef = pushDecoder;
                pushDecoder = null;
                try {
                    const { image } = await decoderRef.decode({ frameIndex: pushLastFrame });
                    pushCanvasCtx.clearRect(0, 0, pushNativeW, pushNativeH);
                    pushCanvasCtx.drawImage(image, 0, 0, pushNativeW, pushNativeH);
                    image.close();
                } catch {
                    // conservar ultimo cuadro dibujado
                }
                try {
                    decoderRef.close();
                } catch {
                    // ignorar cierre duplicado
                }
            }

            const finalMetrics = computePushMetrics();
            if (pushAvatarEl) {
                pushAvatarEl.classList.add('is-settled');
                if (finalMetrics.hasRoom) {
                    pushAvatarEl.classList.remove('is-hidden');
                    setAvatarPosition(finalMetrics.avatarFinalLeft, finalMetrics.avatarTop);
                } else {
                    pushAvatarEl.classList.add('is-hidden');
                }
            }
        };

        const syncPushPlayback = () => {
            if (!pushAnimating) return;
            const shouldPause = document.hidden || !pushSectionVisible;
            if (shouldPause) {
                if (pushPausedAt === 0) {
                    pushPausedAt = performance.now();
                }
                if (pushRafId !== null) {
                    window.cancelAnimationFrame(pushRafId);
                    pushRafId = null;
                }
            } else {
                if (pushPausedAt > 0) {
                    pushStartTime += performance.now() - pushPausedAt;
                    pushPausedAt = 0;
                }
                if (pushRafId === null) {
                    pushRafId = window.requestAnimationFrame(stepPushAnimation);
                }
            }
        };

        // curva de paso: inicia suave al despegar el pie, acelera al estar a punto de pisar y frena justo al apoyar
        const evaluateStepDrive = (u) => {
            if (u <= 0) return 0;
            if (u >= 1) return 1;
            const smooth = u * u * (3 - 2 * u);
            return Math.pow(smooth, 1.35);
        };

        // tambaleo amortiguado de la tarjeta al recibir cada empujon desde la derecha
        const evaluatePushWobble = (u, amplitudeDeg, liftPx) => {
            if (u <= 0 || u >= 1) return { rot: 0, liftY: 0 };
            const fadeIn = Math.min(1, u / 0.12);
            const fadeOut = Math.min(1, (1 - u) / 0.16);
            const env = fadeIn * fadeOut * Math.exp(-2.1 * u);
            const rot = -amplitudeDeg * env * Math.sin(Math.PI * 2.5 * u);
            const liftPhase = Math.min(1, u / 0.5);
            const liftY = -liftPx * Math.sin(Math.PI * liftPhase) * Math.exp(-2.4 * u);
            return { rot, liftY };
        };

        // desplazamiento y tambaleo acoplados al cuadro exacto (0..63) de push.webp (628x706, 3008ms):
        // regla fisica: si el avatar tiene los dos pies en el suelo, el desplazamiento es 0 px;
        // cada empujon ocurre mientras da el paso y esta a punto de apoyar el pie en el piso
        // f00-f08: entrada inicial de la tarjeta (avatar aun fuera de pantalla)
        // f08-f10: ambos pies en el suelo (0 px)
        // f10-f17.5: paso 1 a punto de apoyar -> empujon 1 (36%), frena al plantar en f17.5
        // f17.5-f34: ambos pies en el suelo (0 px)
        // f34-f42.5: paso 2 a punto de apoyar en desplante -> empujon 2 (49%), frena al plantar en f42.5
        // f42.5-f54.5: ambos pies en el suelo (0 px)
        // f54.5-f62: paso 3 cerrando pie trasero -> empujon 3 final (15%), llega a 0 px al plantar en f62
        // f62-f63: ambos pies en el suelo en reposo definitivo (0 px)
        const computePushPose = (frameFloat, metrics, includePreEntry) => {
            const share1 = 0.36;
            const share2 = 0.49;
            const share3 = 0.15;

            let baseX = 0;
            if (includePreEntry && frameFloat <= 8) {
                const u = frameFloat / 8;
                const entryEase = 1 - Math.pow(1 - u, 2.5);
                baseX = metrics.startOffsetX - metrics.preEntryDist * entryEase;
            } else if (frameFloat < 10) {
                baseX = metrics.onScreenRunway;
            } else if (frameFloat <= 17.5) {
                const u = (frameFloat - 10) / (17.5 - 10);
                baseX = metrics.onScreenRunway * (1 - share1 * evaluateStepDrive(u));
            } else if (frameFloat < 34) {
                baseX = metrics.onScreenRunway * (1 - share1);
            } else if (frameFloat <= 42.5) {
                const u = (frameFloat - 34) / (42.5 - 34);
                baseX = metrics.onScreenRunway * (1 - share1 - share2 * evaluateStepDrive(u));
            } else if (frameFloat < 54.5) {
                baseX = metrics.onScreenRunway * (1 - share1 - share2);
            } else if (frameFloat <= 62) {
                const u = (frameFloat - 54.5) / (62 - 54.5);
                baseX = metrics.onScreenRunway * (1 - share1 - share2 - share3 * evaluateStepDrive(u));
            } else {
                baseX = 0;
            }

            // el tambaleo arranca al entrar el empujon y se amortigua unos cuadros mas al frenar la tarjeta
            let wobble = { rot: 0, liftY: 0 };
            if (includePreEntry && frameFloat > 0 && frameFloat < 8) {
                wobble = evaluatePushWobble(frameFloat / 8, metrics.wobbleDeg * 0.4, metrics.wobbleLift * 0.35);
            } else if (frameFloat >= 10.5 && frameFloat <= 22.5) {
                wobble = evaluatePushWobble((frameFloat - 10.5) / 12, metrics.wobbleDeg * 0.85, metrics.wobbleLift * 0.85);
            } else if (frameFloat >= 34.5 && frameFloat <= 48) {
                wobble = evaluatePushWobble((frameFloat - 34.5) / 13.5, metrics.wobbleDeg, metrics.wobbleLift);
            } else if (frameFloat >= 55 && frameFloat <= 62.9) {
                wobble = evaluatePushWobble((frameFloat - 55) / 7.9, metrics.wobbleDeg * 0.6, metrics.wobbleLift * 0.55);
            }

            return {
                baseX,
                rot: wobble.rot,
                liftY: wobble.liftY,
            };
        };

        const stepPushAnimation = (now) => {
            if (!pushAnimating || !pushActiveMetrics) return;
            if (document.hidden || !pushSectionVisible) {
                pushRafId = null;
                return;
            }

            const elapsed = now - pushStartTime;
            const progress = Math.min(1, Math.max(0, elapsed / pushActiveMetrics.durationMs));
            const frameFloat = progress * pushLastFrame;
            const frameIndex = Math.min(pushLastFrame, Math.floor(frameFloat));
            const pose = computePushPose(frameFloat, pushActiveMetrics, pushUsingDecoder);

            // pequeño asentamiento elastico de la tarjeta justo al culminar el paso 3 (f58.5-f61.8)
            let overshootX = 0;
            if (frameFloat > 58.5 && frameFloat < 61.8) {
                const s = (frameFloat - 58.5) / 3.3;
                const sinVal = Math.sin(Math.PI * s);
                overshootX = -pushActiveMetrics.overshoot * sinVal * sinVal;
            }

            if (pushUsingDecoder) {
                renderDecoderFrame(frameIndex);
            }

            const cardX = pose.baseX + overshootX;
            aboutPushCard.style.setProperty('--push-card-x', `${cardX.toFixed(2)}px`);
            aboutPushCard.style.setProperty('--push-card-y', `${pose.liftY.toFixed(2)}px`);
            aboutPushCard.style.setProperty('--push-card-rot', `${pose.rot.toFixed(2)}deg`);
            setAvatarPosition(pushActiveMetrics.avatarFinalLeft + pose.baseX, pushActiveMetrics.avatarTop);

            if (progress < 1) {
                pushRafId = window.requestAnimationFrame(stepPushAnimation);
            } else {
                finishPushAnimation();
            }
        };

        const startPushSequence = async () => {
            if (pushTriggered) return;
            pushTriggered = true;
            if (pushObserver) {
                pushObserver.disconnect();
                pushObserver = null;
            }

            const metrics = computePushMetrics();
            if (!metrics.hasRoom) {
                clearCardPushTransform();
                if (pushAvatarEl) pushAvatarEl.classList.add('is-hidden');
                pushFinished = true;
                return;
            }

            const wrapper = ensureAvatarWrapper();
            wrapper.classList.remove('is-hidden', 'is-settled');

            const bytes = await (prefetchPushBytes() || Promise.resolve(null));

            // ruta principal: decodificar push.webp original cuadro a cuadro en calidad nativa 730x716
            if (bytes && 'ImageDecoder' in window) {
                try {
                    const decoder = new window.ImageDecoder({ data: bytes.slice(0), type: 'image/webp' });
                    await decoder.tracks.ready;
                    const { image: firstFrame } = await decoder.decode({ frameIndex: 0 });

                    const canvas = document.createElement('canvas');
                    canvas.className = 'about-push__media';
                    canvas.width = pushNativeW;
                    canvas.height = pushNativeH;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.drawImage(firstFrame, 0, 0, pushNativeW, pushNativeH);
                        firstFrame.close();

                        const liveMetrics = computePushMetrics();
                        if (!liveMetrics.hasRoom) {
                            decoder.close();
                            clearCardPushTransform();
                            wrapper.classList.add('is-hidden');
                            pushFinished = true;
                            return;
                        }

                        pushDecoder = decoder;
                        pushCanvasCtx = ctx;
                        pushUsingDecoder = true;
                        pushRequestedFrame = 0;
                        pushActiveMetrics = liveMetrics;

                        aboutPushCard.classList.add('is-push-ready');
                        aboutPushCard.style.setProperty('--push-card-x', `${liveMetrics.startOffsetX.toFixed(2)}px`);
                        setAvatarPosition(liveMetrics.avatarFinalLeft + liveMetrics.startOffsetX, liveMetrics.avatarTop);

                        wrapper.textContent = '';
                        wrapper.appendChild(canvas);
                        wrapper.classList.add('is-visible');

                        pushAnimating = true;
                        pushSectionVisible = true;
                        pushPausedAt = 0;
                        pushVisibilityObserver = new IntersectionObserver(
                            (entries) => {
                                entries.forEach((entry) => {
                                    pushSectionVisible = entry.isIntersecting;
                                    syncPushPlayback();
                                });
                            },
                            { threshold: 0.05 }
                        );
                        pushVisibilityObserver.observe(aboutPushSection);
                        pushRafId = window.requestAnimationFrame((firstFrameTime) => {
                            pushStartTime = firstFrameTime;
                            stepPushAnimation(firstFrameTime);
                        });
                        return;
                    }
                    firstFrame.close();
                    decoder.close();
                } catch {
                    // continuar con respaldo de <img> si imagedecoder no puede decodificar webp
                }
            }

            // respaldo para navegadores sin imagedecoder o apertura en file://:
            // primero deslizar la tarjeta hasta que el avatar entre en pantalla y recien ahi montar push.webp
            pushUsingDecoder = false;
            aboutPushCard.classList.add('is-push-ready');
            aboutPushCard.style.setProperty('--push-card-x', `${metrics.startOffsetX.toFixed(2)}px`);
            setAvatarPosition(metrics.avatarFinalLeft + metrics.startOffsetX, metrics.avatarTop);

            if (metrics.preEntryDist > 1) {
                await new Promise((resolve) => {
                    const entryDurationMs = 700;
                    const entryStart = performance.now();
                    const tickEntry = (now) => {
                        const u = Math.min(1, (now - entryStart) / entryDurationMs);
                        const eased = 1 - Math.pow(1 - u, 3);
                        const x = metrics.startOffsetX - metrics.preEntryDist * eased;
                        aboutPushCard.style.setProperty('--push-card-x', `${x.toFixed(2)}px`);
                        setAvatarPosition(metrics.avatarFinalLeft + x, metrics.avatarTop);
                        if (u < 1) {
                            window.requestAnimationFrame(tickEntry);
                        } else {
                            resolve();
                        }
                    };
                    window.requestAnimationFrame(tickEntry);
                });
            }

            const liveMetrics = computePushMetrics();
            if (!liveMetrics.hasRoom) {
                clearCardPushTransform();
                wrapper.classList.add('is-hidden');
                pushFinished = true;
                return;
            }

            let resolvedUrl = `${pushAssetPath}?play=${Date.now()}`;
            if (bytes) {
                pushObjectUrl = URL.createObjectURL(new Blob([bytes], { type: 'image/webp' }));
                resolvedUrl = pushObjectUrl;
            }

            const img = document.createElement('img');
            img.className = 'about-push__media';
            img.alt = '';
            img.width = pushNativeW;
            img.height = pushNativeH;
            img.decoding = 'async';

            pushActiveMetrics = liveMetrics;
            aboutPushCard.style.setProperty('--push-card-x', `${liveMetrics.onScreenRunway.toFixed(2)}px`);
            setAvatarPosition(liveMetrics.avatarFinalLeft + liveMetrics.onScreenRunway, liveMetrics.avatarTop);
            wrapper.textContent = '';
            wrapper.appendChild(img);
            wrapper.classList.add('is-visible');

            // asignar src ya montado dentro del viewport para arrancar en el cuadro 0 sin adelanto ni pausa
            img.src = resolvedUrl;
            await new Promise((resolve) => {
                let settled = false;
                const done = () => {
                    if (settled) return;
                    settled = true;
                    resolve();
                };
                const fallbackTimer = window.setTimeout(done, 1000);
                const finish = () => {
                    window.clearTimeout(fallbackTimer);
                    done();
                };
                if (typeof img.decode === 'function') {
                    img.decode().then(finish).catch(finish);
                } else {
                    img.addEventListener('load', finish, { once: true });
                    img.addEventListener('error', finish, { once: true });
                }
            });

            pushAnimating = true;
            pushSectionVisible = true;
            pushPausedAt = 0;
            pushVisibilityObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        pushSectionVisible = entry.isIntersecting;
                        syncPushPlayback();
                    });
                },
                { threshold: 0.05 }
            );
            pushVisibilityObserver.observe(aboutPushSection);
            pushRafId = window.requestAnimationFrame((firstFrameTime) => {
                pushStartTime = firstFrameTime;
                stepPushAnimation(firstFrameTime);
            });
        };

        const syncPushLayout = () => {
            const metrics = computePushMetrics();

            if (pushFinished) {
                if (!pushAvatarEl) return;
                if (metrics.hasRoom) {
                    pushAvatarEl.classList.remove('is-hidden');
                    setAvatarPosition(metrics.avatarFinalLeft, metrics.avatarTop);
                } else {
                    pushAvatarEl.classList.add('is-hidden');
                }
                return;
            }

            if (pushAnimating) {
                if (!metrics.hasRoom) {
                    finishPushAnimation();
                } else {
                    pushActiveMetrics = metrics;
                }
                return;
            }

            // antes del disparo: preparar fuera de pantalla solo si hay espacio suficiente
            if (metrics.hasRoom) {
                prefetchPushBytes();
                aboutPushCard.classList.add('is-push-ready');
                aboutPushCard.style.setProperty('--push-card-x', `${metrics.startOffsetX.toFixed(2)}px`);
                setAvatarPosition(metrics.avatarFinalLeft + metrics.startOffsetX, metrics.avatarTop);
                if (!pushObserver) {
                    pushObserver = new IntersectionObserver(
                        (entries) => {
                            entries.forEach((entry) => {
                                if (entry.isIntersecting && !pushTriggered) {
                                    startPushSequence();
                                }
                            });
                        },
                        { threshold: 0.5 }
                    );
                    pushObserver.observe(aboutPushSection);
                }
            } else {
                clearCardPushTransform();
                if (pushAvatarEl) {
                    pushAvatarEl.classList.add('is-hidden');
                }
                if (pushObserver) {
                    pushObserver.disconnect();
                    pushObserver = null;
                }
            }
        };

        document.addEventListener('visibilitychange', syncPushPlayback);

        let pushResizeFrame = null;
        const schedulePushLayout = () => {
            if (pushResizeFrame !== null) return;
            pushResizeFrame = window.requestAnimationFrame(() => {
                pushResizeFrame = null;
                syncPushLayout();
            });
        };

        window.addEventListener('resize', schedulePushLayout, { passive: true });
        onLanguageChangedCallbacks.push(schedulePushLayout);
        window.requestAnimationFrame(syncPushLayout);
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

    onLanguageChangedCallbacks.push(() => {
        const active = sections.find(({ id }) => id === currentActiveId);
        if (active) positionIndicator(active.link);
    });

    // aplicar idioma guardado antes de medir el indicador inicial
    const initialLang = getStoredLanguage();
    if (initialLang !== 'es') {
        applyLanguage(initialLang);
    }

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
