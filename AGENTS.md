# AGENTS.md

Guía de contexto, convenciones y reglas para agentes de IA que colaboren en este repositorio.

---

## 1. Propósito del proyecto

Sitio web personal de **Carlos Estrada** (`carloestrchz.me`) implementado como una **single-page estática** en español (`lang="es"`), orientada a **reclutadores de empleo**.

### Secciones actuales
- **Fondo animado aurora (`<div class="bg-aurora" aria-hidden="true">`):** capa fija detrás de toda la página con 4 manchas difuminadas animadas solo por CSS (`transform`/`opacity`) con duraciones primas desfasadas, reemplazando el antiguo resplandor estático del hero.
- **Hero (`<header id="inicio" class="hero">`):** presentación, rol profesional, resumen breve y accesos rápidos (`#proyectos`, `#contacto`).
- **Sobre mí (`#sobre-mi`):** perfil personal/académico y tarjeta resumen con ubicación, idioma, tecnologías principales y enlace a LinkedIn.
- **Proyectos (`#proyectos`):** tarjetas de proyectos alojados en GitHub (actualmente *WattGuard* y *Signet*).
- **Contacto (`#contacto`):** pie de página con llamado a la acción y correo electrónico.
- **Navegación flotante (`<nav class="floating-nav">`):** barra fija inferior tipo píldora con iconos SVG inline y etiquetas hacia `#inicio`, `#sobre-mi`, `#proyectos` y `#contacto`, sincronizada con la sección visible.

### Evolución prevista
- Incorporar en esta misma página única una sección dedicada a **servicios de infraestructura autoalojados** (por ejemplo: **Gitea, Seafile, n8n, DbGate**, entre otros) para demostrar experiencia práctica en infraestructura, despliegue y administración de servicios a reclutadores, reutilizando las rejillas flexibles y tarjetas de Bootstrap 5 (`row row-cols-1 row-cols-md-2` / `row-cols-lg-3`, `.card.glass-card.h-100`).

---

## 2. Tecnologías utilizadas

El sitio funciona como **contenido estático directo, sin herramientas de build ni npm**:

- **HTML5 semántico:** documento único (`index.html`, `<html lang="es" data-bs-theme="dark">`) con landmarks (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<nav>`) y atributos ARIA (`aria-labelledby`, `aria-label`, `aria-current`, `aria-hidden`).
- **Bootstrap 5.3.8 vía CDN (jsDelivr con integridad SRI):** aporta el sistema de rejilla responsivo (`.container`, `.row`, `.row-cols-*`, `.col-*`), utilidades Flexbox/espaciado (`d-flex`, `flex-column`, `flex-wrap`, `flex-grow-1`, `gap-*`, `h-100`) y base de componentes (`.card`, `.btn`, `.badge`), además de `bootstrap.bundle.min.js` (cargado con `defer`) para futuros componentes interactivos.
- **CSS3 modular propio:** 4 hojas cargadas **después** de Bootstrap para mantener la identidad visual (*dark mode* *glassmorphism* con acentos índigo/púrpura) mediante Custom Properties (`:root` y `[data-bs-theme="dark"]`) y estilos de impresión (`@media print`). Sin preprocesadores.
- **JavaScript puro (Vanilla ES6+):** un único script (`js/main.js`) cargado con `defer`, encapsulado en una IIFE con `'use strict'`, que utiliza `IntersectionObserver` y `matchMedia('(prefers-reduced-motion: reduce)')` para animaciones progresivas de aparición (`[data-reveal]`) y seguimiento de sección activa + scroll suave en la barra flotante (`[data-floating-nav]`).

---

## 3. Estructura de archivos

```text
.
├── AGENTS.md                       # Instrucciones y convenciones del proyecto (este archivo)
├── index.html                      # Single-page principal (carga Bootstrap 5 vía CDN + hojas propias)
├── css/
│   ├── tokens.css                  # Design tokens (:root / [data-bs-theme="dark"]) y mapeo a variables --bs-*
│   ├── base.css                    # Ajustes base de elementos HTML sobre Bootstrap Reboot + base @media print
│   ├── layout.css                  # Contenedor máximo (.page-container) y ritmo vertical (.page-main, .stack-xl)
│   └── components.css              # Tema glassmorphism, fondo .bg-aurora, skins sobre .card/.btn/.badge, .hero, .site-footer, .floating-nav, .reveal y @media print
├── js/
│   └── main.js                     # Animaciones [data-reveal] y navegación activa/scroll suave de [data-floating-nav] con IntersectionObserver
├── img/
│   ├── WattGuard.png               # Logo del proyecto WattGuard
│   └── signet-logo-white-trim.jpeg # Logo del proyecto Signet
└── .gitignore                      # Reglas de exclusión de Git
```

---

## 4. Convenciones de estilo actuales

### 4.1 Arquitectura y orden de carga CSS
En `index.html`, las hojas se cargan estrictamente en este orden:
1. **Bootstrap 5.3.8 CSS** vía CDN de jsDelivr (con `integrity` y `crossorigin="anonymous"`).
2. `css/tokens.css` — variables CSS en `:root, [data-bs-theme="dark"]` y mapeo a `--bs-*`.
3. `css/base.css` — reglas base por etiqueta (`html`, `body`, `::selection`, `a`, `prefers-reduced-motion`, base `@media print`). No definir clases aquí.
4. `css/layout.css` — estructura macro (`.page-container`, `.page-main`, `.stack-xl`).
5. `css/components.css` — skins sobre componentes de Bootstrap, componentes propios, estados de animación y reglas de impresión.

No usar estilos inline en HTML; usar utilidades de Bootstrap para layout/flex y clases propias en `css/components.css` consumiendo los tokens de `css/tokens.css` para la estética visual.

### 4.2 Paleta de colores (`css/tokens.css`)
Tema oscuro (*dark mode*) con superficies tipo *glassmorphism* y acentos índigo/púrpura:

| Categoría | Token | Valor | Uso principal |
| :--- | :--- | :--- | :--- |
| **Base** | `--color-bg` | `#0a0a0a` | Fondo principal (`--bs-body-bg`) |
| | `--color-text` | `#f8fafc` | Texto principal (`--bs-body-color`) |
| | `--color-text-muted` | `#9ca3af` | Párrafos y descripciones (`--bs-secondary-color`) |
| | `--color-text-subtle` | `#4b5563` | Textos secundarios tenues |
| | `--color-white` | `#ffffff` | Botón primario, fondos de logo |
| | `--color-black` | `#000000` | Texto sobre botón blanco |
| | `--color-neutral-200` | `#e5e7eb` | Hover de `.btn-cta--primary` |
| **Acentos** | `--color-accent` | `#6366f1` | Selección de texto, `--bs-primary` e inicio de gradiente |
| | `--color-accent-light` | `#818cf8` | Eyebrow y enlaces `.link-accent` (`--bs-link-color`) |
| | `--color-accent-lighter` | `#a5b4fc` | Rol, metadatos y texto de `.tech-badge` |
| | `--color-purple` | `#a855f7` | Fin del gradiente de acento |
| | `--gradient-accent` | `linear-gradient(90deg, var(--color-accent), var(--color-purple))` | `.gradient-text` |
| **Glass / Bordes** | `--color-surface` | `rgba(255, 255, 255, 0.03)` | Fondo de `.glass-card` (`--bs-card-bg`) |
| | `--color-surface-elevated` | `rgba(255, 255, 255, 0.05)` | Fondo translúcido de `.floating-nav` |
| | `--color-border` | `rgba(255, 255, 255, 0.1)` | Borde de `.glass-card`, `.site-footer` y `.floating-nav` (`--bs-border-color`) |
| | `--color-border-strong` | `rgba(255, 255, 255, 0.2)` | Borde de `.btn-cta--outline` |
| | `--color-overlay-hover` | `rgba(255, 255, 255, 0.1)` | Hover de `.btn-cta--outline` |
| **Acentos alfa** | `--color-accent-glow` | `rgba(99, 102, 241, 0.2)` | Gradientes de `.bg-aurora__blob` |
| | `--color-accent-tint` | `rgba(99, 102, 241, 0.1)` | Fondo de `.tech-badge` |
| | `--color-accent-border` | `rgba(99, 102, 241, 0.2)` | Borde de `.tech-badge` |
| | `--color-accent-border-hover` | `rgba(99, 102, 241, 0.5)` | Hover de `.project-card` |
| **Fondo aurora** | `--z-bg-aurora` | `-1` | Capa fija detrás de todo el contenido |
| | `--blur-aurora` | `96px` | Desenfoque estático de `.bg-aurora__blob` |
| | `--aurora-opacity-1..4` | `0.26`, `0.22`, `0.2`, `0.18` | Opacidades base de las 4 manchas |
| | `--aurora-duration-1..4` | `37s`, `53s`, `71s`, `89s` | Duraciones primas para movimiento orgánico no repetitivo |
| | `--aurora-delay-1..4` | `-11s`, `-29s`, `-43s`, `-61s` | Desfases negativos iniciales de las 4 manchas |
| **Navegación flotante** | `--shadow-floating` | `0 8px 32px rgba(0, 0, 0, 0.45)` | Sombra suave de `.floating-nav` |
| | `--blur-floating` | `16px` | `backdrop-filter` de `.floating-nav` |
| | `--opacity-nav-inactive` | `0.6` | Opacidad de enlaces inactivos |
| | `--opacity-nav-hover` | `0.85` | Opacidad de enlaces al hover/focus |
| | `--z-floating-nav` | `1030` | Nivel de apilamiento fijo de `.floating-nav` |
| | `--floating-nav-offset` | `var(--space-4)` | Separación desde el borde inferior (`+ safe-area-inset-bottom`) |
| | `--floating-nav-clearance` | `6.5rem` | Espacio inferior en `.site-footer` para no solapar contenido |

### 4.3 Tipografía
- **Familia única (fuentes del sistema, cero descargas externas):**
  `--font-sans: ui-sans-serif, system-ui, -apple-system, sans-serif;` (asignada también a `--bs-body-font-family`).
- **Jerarquía de tamaños:**
  - `.hero__title`: `3rem` (móvil) / `5rem` (`>= 768px`), peso `700`, `line-height: 1.25`.
  - `.section-title`: `2.25rem` (`line-height: 2.5rem`), peso `700`.
  - `.about__title`: `1.875rem` (`line-height: 2.25rem`), peso `700`.
  - `.project-card__title` / `.site-footer__title`: `1.5rem` (`line-height: 2rem`), peso `600` / `700`.
  - `.glass-card__title` / `.hero__role`: `1.25rem`, peso `600` / `500`.
  - `.hero__lead`: `1.125rem` (móvil) / `1.25rem` (`>= 768px`).
  - `.about__text`: `1.125rem`, `line-height: 1.625`.
  - `.hero__eyebrow`, `.tech-badge`, `.project-card__meta`: `0.875rem`.

### 4.4 Escalas de diseño (`css/tokens.css`)
- **Espaciado (`rem`, base 4px):** `--space-1` (`0.25rem`), `--space-2` (`0.5rem`), `--space-3` (`0.75rem`), `--space-4` (`1rem`), `--space-6` (`1.5rem`), `--space-8` (`2rem`), `--space-10` (`2.5rem`), `--space-12` (`3rem`), `--space-20` (`5rem`), `--space-32` (`8rem`).
- **Radios:** `--radius-md` (`0.5rem`), `--radius-lg` (`0.75rem`), `--radius-xl` (`1rem`), `--radius-2xl` (`1.5rem`), `--radius-full` (`9999px`).
- **Contenedores:** `--container-md` (`36rem`), `--container-3xl` (`48rem`), `--container-6xl` (`72rem`).
- **Movimiento:** `--ease: cubic-bezier(0.4, 0, 0.2, 1)`, `--ease-nav: cubic-bezier(0.22, 1, 0.36, 1)`, `--transition-fast: 150ms var(--ease)`, `--transition-nav: 320ms var(--ease-nav)`, `--transition-reveal: 700ms var(--ease)`.

### 4.5 Convenciones de nombres (Bootstrap + BEM)
- **Layout y componentes base:** clases nativas de Bootstrap 5 (`.container`, `.row`, `.row-cols-*`, `.col-*`, `.card`, `.card-body`, `.card-title`, `.card-text`, `.btn`, `.rounded-pill`, `.badge`, utilidades flex `d-flex`, `flex-column`, `flex-grow-1`, `gap-*`, `h-100`).
- **Skins y componentes propios en BEM (`kebab-case`, inglés):**
  - Bloques: `.bg-aurora`, `.hero`, `.btn-cta`, `.glass-card`, `.tech-badge`, `.project-card`, `.site-footer`, `.floating-nav`.
  - Elementos (`__`): `.bg-aurora__blob`, `.hero__content`, `.hero__eyebrow`, `.hero__title`, `.hero__role`, `.hero__lead`, `.glass-card__title`, `.glass-card__text`, `.about__title`, `.about__text`, `.project-card__icon`, `.project-card__logo`, `.project-card__title`, `.project-card__meta`, `.project-card__text`, `.site-footer__title`, `.site-footer__text`, `.floating-nav__list`, `.floating-nav__indicator`, `.floating-nav__link`, `.floating-nav__icon`, `.floating-nav__label`.
  - Modificadores (`--`): `.bg-aurora__blob--1..4`, `.btn-cta--primary`, `.btn-cta--outline`, `.btn-cta--invert-hover`, `.btn-cta--sm`, `.glass-card--lg`, `.glass-card--md`, `.project-card__icon--1`, `.project-card__icon--2`.
- **Hooks y estados de JavaScript:**
  - Atributos `data-*` en HTML para comportamiento (`data-reveal`, `data-floating-nav`, `data-nav-link`) sin acoplar JS a clases de presentación.
  - Clases de estado con prefijo `is-*` / `has-*` (`.reveal.is-visible`, `.floating-nav__link.is-active`, `.floating-nav__indicator.is-ready`, `.floating-nav.has-indicator`).
- **IDs de secciones y anclas ARIA:** en español y `kebab-case` (`#inicio`, `#sobre-mi`, `#sobre-mi-titulo`, `#proyectos`, `#proyectos-titulo`, `#contacto`).
- **Formato de código:** indentación de 4 espacios en HTML, CSS y JS; comentarios descriptivos en español.

### 4.6 Responsive, accesibilidad y mejora progresiva
- **Mobile-first** usando el sistema de breakpoints de Bootstrap 5 (`sm` = `576px` para mostrar etiquetas inactivas en `.floating-nav`, `md` = `768px`, `lg` = `992px`, etc.).
- **Reducción de movimiento:** respetada en CSS (`scroll-behavior: auto`, sin animaciones en `.bg-aurora__blob` y sin transiciones en `.floating-nav__link`/`.floating-nav__indicator`) y en JS (`prefers-reduced-motion: reduce` desactiva `.reveal` y usa scroll instantáneo).
- **Mejora progresiva:** la clase `.reveal` solo la añade `js/main.js`, y `.floating-nav` funciona como enlaces ancla HTML estándar incluso si JavaScript está desactivado.

---

## 5. Reglas para futuros cambios

1. **No agregar herramientas de build ni dependencias adicionales.**
   - La única librería externa permitida es **Bootstrap 5 vía CDN** (jsDelivr con `integrity` SRI).
   - No reintroducir `package.json`, `npm`, `vite`, bundlers, preprocesadores CSS ni otros frameworks JS/CSS o fuentes externas.
   - Todo cambio debe funcionar abriendo o sirviendo los archivos estáticos directamente.

2. **Mantener el diseño responsive y flexible con Bootstrap 5.**
   - Toda nueva sección o componente (incluida la próxima sección de infraestructura: Gitea, Seafile, n8n, DbGate, etc.) debe ser *mobile-first*, sin desbordamiento horizontal en móviles y bien distribuida en tablet y escritorio.
   - Usar las rejillas y componentes flexibles de Bootstrap (`.row`, `.row-cols-*`, `.col-*`, `.card.glass-card.h-100`, `.card-body.d-flex.flex-column`, `.badge.tech-badge`, `.btn.rounded-pill.btn-cta`) respetando los tokens de `css/tokens.css` para conservar la estética *dark glassmorphism*.

3. **Mantener el diseño imprimible (`@media print`).**
   - Conservar y actualizar los bloques `@media print` en `css/base.css`, `css/layout.css` y `css/components.css` ante cualquier sección nueva:
     - Forzar visibilidad de elementos animados (`.reveal { opacity: 1 !important; transform: none !important; }`).
     - Ocultar elementos decorativos y navegación fijos (`.bg-aurora`, `.floating-nav { display: none !important; }`).
     - Mantener fondo blanco, texto oscuro de alto contraste y tarjetas sin `backdrop-filter`.
     - Evitar cortes de página dentro de tarjetas (`break-inside: avoid`) y asegurar que la información de contacto y enlaces sean legibles en papel o PDF.

4. **No cambiar el contenido personal sin que el propietario lo pida.**
   - No reescribir, resumir, traducir, corregir ni reemplazar textos personales, biografía, proyectos, enlaces (LinkedIn, GitHub, correo) ni datos de perfil salvo solicitud explícita del usuario.
   - Al añadir nuevas secciones (como los servicios de infraestructura), usar solo los datos, nombres y enlaces que indique el usuario; no inventar métricas, descripciones personales ni URLs.

5. **Conservar la semántica, accesibilidad y estructura modular.**
   - Mantener la separación de responsabilidades entre Bootstrap CDN, `tokens.css`, `base.css`, `layout.css`, `components.css` y `js/main.js`.
   - Mantener enlaces externos con `target="_blank" rel="noopener noreferrer"`, atributos `alt` descriptivos en imágenes y encabezados jerárquicos (`h1` → `h2` → `h3`).
   - Si se añade JS propio, mantenerlo mínimo, en Vanilla JS, sin estado global innecesario y con degradación elegante si JS está desactivado.
