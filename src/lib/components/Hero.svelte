<script>
    import { onMount } from 'svelte';
    import { fly, fade } from 'svelte/transition';
    import { locale, t } from '$lib/i18n/index.js';
    import { createViewportGate, releaseCanvas } from '$lib/motion.js';

    // --- ROTATING HERO FACTS ---
    // Short facts about Celaut that cycle in place of the old static
    // paragraph, rotated every 10s with a subtle fade + vertical slide.
    // The card wrapper below is sized with a fixed min-height so swapping
    // facts never shifts the surrounding layout.
    $: facts = $t('home.hero.facts');
    let factIndex = 0;
    let factsTimer;
    // The lists are the same length in every locale, but clamp anyway so a
    // future shorter translation can never leave the index out of range.
    $: safeFactIndex = factIndex % facts.length;

    // The tagline's reveal is choreographed to land after the wordmark on
    // first paint. A later replay (a language switch) should be immediate —
    // the visitor is already looking at it.
    let taglineDelay = 800;

    // --- 1. LÓGICA PARA EL EFECTO PARALLAX ---
    let parallaxX = 0;
    let parallaxY = 0;

    /**
     * Actualiza las coordenadas para el efecto parallax basándose en la posición del ratón.
     * Las coordenadas se normalizan (-0.5 a 0.5) para un cálculo más sencillo.
     */
    function handleMousemove(event) {
        // The parallax only moves the hero's own content wrapper, so once
        // the hero has scrolled off there is nothing to update — and this
        // is a reactive assignment, which would otherwise re-render the
        // hero subtree on every single mouse move for the whole visit.
        if (!heroLive) return;
        const { clientX, clientY } = event;
        const { innerWidth, innerHeight } = window;
        parallaxX = (clientX / innerWidth) - 0.5;
        parallaxY = (clientY / innerHeight) - 0.5;
    }


    // --- 2. ACCIÓN PERSONALIZADA PARA ANIMACIÓN DE TEXTO "STAGGER" ---

    /**
     * Una acción de Svelte que divide el texto de un nodo en palabras y caracteres,
     * y los anima secuencialmente para un efecto de aparición escalonada,
     * manteniendo la integridad de las palabras para evitar saltos de línea incorrectos.
     * @param {HTMLElement} node - El elemento DOM.
     * @param {object} params - Parámetros de configuración.
     * @param {number} params.delay - Retraso inicial antes de que comience la animación.
     * @param {number} params.duration - Duración de la animación de cada carácter.
     * @param {number} params.stagger - Retraso entre la animación de cada carácter.
     */
    function staggeredFadeIn(node, { delay = 0, duration = 300, stagger = 30 }) {
        // Splitting Arabic (and any RTL script) into per-character spans
        // destroys letter joining. Fade the whole string instead.
        const isRTL =
            typeof document !== 'undefined' &&
            document.documentElement.getAttribute('dir') === 'rtl';
        if (isRTL) {
            node.style.opacity = '0';
            const timer = setTimeout(() => {
                node.style.transition = `opacity ${duration}ms ease-out`;
                node.style.opacity = '1';
            }, delay);
            return {
                destroy() {
                    clearTimeout(timer);
                }
            };
        }

        const text = node.textContent;
        // Dividimos por espacios para obtener un array de palabras
        const words = text.split(' '); 

        node.textContent = ''; // Limpiar el nodo
        node.style.opacity = 1; // Hacemos visible el contenedor

        let charIndex = 0; // Contador global de caracteres para el 'stagger'

        words.forEach((word, wordIndex) => {
            // Creamos un contenedor para cada palabra
            const wordWrapper = document.createElement('span');
            wordWrapper.style.display = 'inline-block'; // Las palabras se comportan como bloques en línea
            
            const chars = word.split('');
            chars.forEach((char) => {
                const span = document.createElement('span');
                span.textContent = char;
                span.style.display = 'inline-block';
                span.style.opacity = '0';
                span.style.transform = 'translateY(25px)';
                // Usamos el contador global para que la animación sea fluida entre palabras
                span.style.transition = `all ${duration}ms ease-out ${delay + charIndex * stagger}ms`;
                wordWrapper.appendChild(span);

                setTimeout(() => {
                    span.style.opacity = '1';
                    span.style.transform = 'translateY(0)';
                }, 20);

                charIndex++; // Incrementamos el contador por cada carácter
            });

            node.appendChild(wordWrapper);

            // Añadimos un espacio real después de cada palabra, excepto la última
            if (wordIndex < words.length - 1) {
                node.appendChild(document.createTextNode(' '));
            }
        });

        taglineDelay = 0;

        return {
            destroy() {
                // Lógica de limpieza si fuera necesaria
            }
        };
    }

    // --- 3. LÓGICA PARA EL FONDO DE AUTÓMATAS CELULARES (JUEGO DE LA VIDA) ---
    
    let canvas; // Variable para enlazar con el elemento <canvas>

    // Smooth-scroll the Hero's "Learn More" CTA down to the first content
    // section (respects reduced-motion). A glide reads better than a jump.
    function scrollToLearnMore(event) {
        event.preventDefault();
        const target = document.getElementById('foundations') || document.getElementById('learn-more');
        if (!target) return;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }

    // "Start to use it" glides to the audience fork, where visitors pick the
    // role that matches them (node maintainer / developer / user) and leave
    // for the dedicated page, rather than being dropped onto /install.
    function scrollToRoles(event) {
        event.preventDefault();
        const target =
            document.getElementById('user-roles') || document.getElementById('applications');
        if (!target) return;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }

    // True only while the hero backdrop is on screen; the parallax handler
    // and the automata loop both read it. The hero is one viewport tall at
    // the very top of a very long page, so for most of a visit this is
    // false and all of this work can simply not happen.
    let heroLive = false;

    onMount(() => {
        let ctx = canvas.getContext('2d');
        let cols, rows, grid;
        const resolution = 25; // Tamaño en píxeles de cada celda
        // Cell colour comes from the theme's decorative --viz-grid channel
        // rather than a pair of hardcoded hexes, so it tracks the palette.
        const cellColor = () =>
            getComputedStyle(document.documentElement)
                .getPropertyValue('--viz-grid')
                .trim() || 'rgba(255,255,255,0.08)';

        // Whether the canvas currently owns a pixel buffer. The hero is a
        // full-window canvas (~8MB at 1920x1080, and four times that on a
        // retina panel), so it is worth handing back once it has scrolled
        // away — the reader is nine scenes deep and cannot see it.
        let allocated = false;

        function setup() {
            if (!allocated) return;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            const nextCols = Math.ceil(canvas.width / resolution);
            const nextRows = Math.ceil(canvas.height / resolution);
            // Only re-seed when the grid's shape actually changed. Releasing
            // the backing store must not restart the simulation: a reader
            // who scrolls back to the top should find the automata where
            // they left it, not a fresh random field.
            if (!grid || nextCols !== cols || nextRows !== rows) {
                cols = nextCols;
                rows = nextRows;
                grid = createGrid(cols, rows);
            }
        }

        function allocate() {
            if (allocated) return;
            allocated = true;
            setup();
            draw(grid);
        }

        function release() {
            if (!allocated) return;
            allocated = false;
            releaseCanvas(canvas);
        }

        // Crea una retícula 2D con un estado inicial aleatorio
        function createGrid(cols, rows) {
            return new Array(cols).fill(null)
                .map(() => new Array(rows).fill(null)
                .map(() => Math.floor(Math.random() * 1.4))); // Más ceros que unos para un look más disperso
        }

        // Bucle principal de la animación.
        // Throttled to one generation every 0.2s (instead of once per frame)
        // so the automata background evolves at a calmer, more readable pace.
        const stepInterval = 200; // ms between generations
        let lastStep = 0;
        let raf = 0;
        function gameLoop(now) {
            if (now - lastStep >= stepInterval) {
                lastStep = now;
                grid = computeNextGeneration(grid);
                draw(grid);
            }
            raf = requestAnimationFrame(gameLoop);
        }

        // This loop used to run for the entire visit, recomputing a
        // full-window cellular automaton five times a second behind nine
        // scenes of content. Now it runs only while the hero is on screen
        // and the tab is in the foreground.
        function startLoop() {
            if (raf) return;
            lastStep = 0;
            raf = requestAnimationFrame(gameLoop);
        }
        function stopLoop() {
            if (!raf) return;
            cancelAnimationFrame(raf);
            raf = 0;
        }

        // Calcula el estado de la siguiente generación basándose en las reglas del Juego de la Vida
        function computeNextGeneration(grid) {
            const nextGen = grid.map(arr => [...arr]);
            for (let col = 0; col < grid.length; col++) {
                for (let row = 0; row < grid[col].length; row++) {
                    const cell = grid[col][row];
                    let numNeighbors = 0;
                    for (let i = -1; i < 2; i++) {
                        for (let j = -1; j < 2; j++) {
                            if (i === 0 && j === 0) continue;
                            const x_cell = col + i;
                            const y_cell = row + j;

                            if (x_cell >= 0 && y_cell >= 0 && x_cell < cols && y_cell < rows) {
                                const currentNeighbor = grid[x_cell][y_cell];
                                numNeighbors += currentNeighbor;
                            }
                        }
                    }

                    // Reglas del Juego de la Vida
                    if (cell === 1 && (numNeighbors < 2 || numNeighbors > 3)) {
                        nextGen[col][row] = 0;
                    } else if (cell === 0 && numNeighbors === 3) {
                        nextGen[col][row] = 1;
                    }
                }
            }
            return nextGen;
        }

        // Dibuja la retícula en el canvas
        function draw(grid) {
            if (!allocated || !grid) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let col = 0; col < grid.length; col++) {
                for (let row = 0; row < grid[col].length; row++) {
                    if (grid[col][row] === 1) {
                        ctx.fillStyle = cellColor();
                        ctx.fillRect(col * resolution, row * resolution, resolution - 1, resolution - 1);
                    }
                }
            }
        }
        
        // Inicialización — allocation and the loop are both driven by the
        // viewport gate, which fires immediately with the current state.
        const stopGate = createViewportGate(canvas, {
            onNear: (near) => (near ? allocate() : release()),
            onLive: (live) => {
                heroLive = live;
                live ? startLoop() : stopLoop();
            }
        });

        // Manejar redimensionamiento de la ventana. Debounced: a drag-resize
        // fires this continuously, and each call reallocates a full-window
        // backing store and re-seeds the grid.
        let resizeTimer;
        function onResize() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                setup();
                draw(grid);
            }, 150);
        }
        window.addEventListener('resize', onResize);

        // Rotate the hero facts every 10 seconds.
        factsTimer = setInterval(() => {
            factIndex = factIndex + 1;
        }, 10000);

        return () => {
            stopLoop();
            stopGate();
            clearTimeout(resizeTimer);
            window.removeEventListener('resize', onResize);
            clearInterval(factsTimer);
            releaseCanvas(canvas);
        };
    });
</script>

<svelte:window on:mousemove={handleMousemove} />

<section>
    <canvas bind:this={canvas} id="automata-bg"></canvas>

    <div
        class="content-wrapper"
        style="transform: translate({parallaxX * -30}px, {parallaxY * -20}px);"
    >
        <h1 dir="ltr" use:staggeredFadeIn={{ delay: 200, stagger: 70 }}>CELAUT</h1>

        <!-- staggeredFadeIn rewrites the element's children into per-character
             spans, so Svelte can no longer patch the text in place. Keying on
             the locale remounts the heading instead, which re-runs the action
             and replays the reveal in the new language. -->
        {#key $locale}
            <h2 use:staggeredFadeIn={{ delay: taglineDelay, stagger: 20 }}>
                {$t('home.hero.tagline')}
            </h2>
        {/key}
        
        <div class="facts" in:fly={{ y: 20, duration: 600, delay: 1600 }} aria-live="polite">
            {#key `${$locale}-${safeFactIndex}`}
                <p
                    class="fact"
                    in:fly={{ y: 14, duration: 500, delay: 180 }}
                    out:fade={{ duration: 260 }}
                >
                    {facts[safeFactIndex]}
                </p>
            {/key}
        </div>

        <div class="buttons" in:fly={{ y: 20, duration: 600, delay: 2600 }}>
            <a class="button primary" href="#user-roles" on:click={scrollToRoles}
                >{$t('home.hero.primary')}</a
            >
            <a class="button secondary" href="#foundations" on:click={scrollToLearnMore}
                >{$t('home.hero.secondary')}</a
            >
        </div>
    </div>
</section>

<style>
    section {
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
        background-color: var(--surface-deep); /* Fondo sólido como fallback */
        overflow: hidden; /* Oculta lo que se salga de la sección */
        position: relative;
    }

    #automata-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
    }

    .content-wrapper {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        color: var(--on-surface);
        transition: transform 0.2s ease-out; /* Transición suave para el parallax */
    }

    h1 {
		direction: ltr;
		unicode-bidi: isolate;
        font-size: clamp(3.5rem, 10vw, 6rem);
        /* Weight + tighter tracking carry the emphasis now, not a heavy glow. */
        font-weight: 800;
        margin: 0;
        letter-spacing: 0.03em;
        color: var(--accent-text);
        /* Halo in the surface colour, so it lifts the type off the busy
           automata canvas in BOTH themes (a black shadow read as grime on
           the cream light surface). */
        text-shadow: 0 2px 10px rgba(var(--surface-rgb), 0.85);
        /* Sharper edges on high-DPI displays. */
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        opacity: 0; /* Oculto inicialmente, la acción 'staggeredFadeIn' lo hará visible */
    }

    /* Both themes now resolve the title through --accent-text (lifted coral in
       dark, deep terracotta in light), so no per-theme hex override is needed. */

    h2 {
        font-size: clamp(1.2rem, 4vw, 1.75rem);
        margin: 20px 0;
        font-weight: 400;
        max-width: 600px;
        color: var(--on-surface);
        text-shadow: 0 1px 8px rgba(var(--surface-rgb), 0.9);
        opacity: 0;
    }



    /* Translucent card holds the rotating facts above the busy automata
       background, so the body copy stays readable in both themes. Fixed
       min-height reserves the space, so cycling facts never shift layout. */
    .facts {
        position: relative;
        width: 100%;
        max-width: 720px;
        min-height: 6.5em;
        margin: 28px auto 0;
        border-radius: 14px;
        background: rgba(var(--surface-rgb), 0.72);
        border: 1px solid var(--border);
        box-shadow: var(--shadow-md);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
    }

    .fact {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0;
        padding: 20px 28px;
        text-align: center;
        font-size: clamp(1rem, 2.4vw, 1.2rem);
        line-height: 1.6;
        /* Full-strength on-surface colour + no text-shadow: crisp and high
           contrast against the card in both light and dark themes. */
        color: var(--on-surface);
    }

    .buttons {
        margin-top: 40px;
        display: flex;
        justify-content: center;
        gap: 20px;
        flex-wrap: wrap;
    }

    .button {
        display: inline-block;
        text-decoration: none;
        padding: 12px 28px;
        font-size: 1rem;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 700;
        transition: all 0.3s ease;
        border: 2px solid transparent;
        box-shadow: var(--shadow-sm);
    }

    .primary {
        background-color: var(--accent);
        color: var(--on-accent);
        border-color: var(--accent);
    }

    .primary:hover {
        background-color: var(--accent-hover);
        border-color: var(--accent-hover);
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
    }

    .secondary {
        background-color: rgba(var(--surface-rgb), 0.55);
        color: var(--on-surface);
        border-color: var(--border-strong);
    }

    .secondary:hover {
        background-color: var(--on-surface);
        color: var(--surface);
        border-color: var(--on-surface);
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
    }
</style>
