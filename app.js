/**
 * Portfolio orchestration with cover sequence and ambient systems
 */

const Portfolio = (() => {
    
    const STATE = { current: 'COVER', hasEntered: false };
    const TRANSITION_DURATION = 1600;
    
    const ui = {
        cover: null,
        portfolio: null,
        enterBtn: null,
        tabs: null,
        indicator: null,
        title: null,
        cards: null,
        blobs: null,
        discordBtn: null,
        tooltip: null
    };

    const contentMap = {};

    const titleMap = {
        'trading': 'trading infrastructure',
        'dev': 'design / dev projects',
        'gaming': 'gaming achievements'
    };

    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    const triggerReflow = (el) => {
        el.classList.remove('content-fade');
        void el.offsetWidth;
        el.classList.add('content-fade');
    };

    const rand = (min, max) => Math.random() * (max - min) + min;

    // --- Cover ---
    const initCoverAmbient = () => {
        const container = $('.cover-particles');
        if (!container) return;

        for (let i = 0; i < 40; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                left: ${rand(0, 100)}%;
                top: ${rand(0, 100)}%;
                width: ${rand(2, 6)}px;
                height: ${rand(2, 6)}px;
                animation-delay: ${rand(0, 3)}s;
                animation-duration: ${rand(8, 15)}s;
            `;
            container.appendChild(particle);
        }
    };

    const executeCoverTransition = () => {
        if (STATE.hasEntered) return;
        STATE.hasEntered = true;

        ui.cover.classList.add('cover-exit');
        
        setTimeout(() => {
            ui.cover.style.display = 'none';
            ui.portfolio.style.display = 'flex';

            requestAnimationFrame(() => {
                ui.portfolio.classList.add('portfolio-enter');
                STATE.current = 'PORTFOLIO';
            });
        }, TRANSITION_DURATION);
    };

    // --- Tabs ---
    const initTabSystem = () => {
        ui.tabs.forEach((tab, index) => {
            tab.addEventListener('change', (e) => {
                const value = e.target.value;

                ui.indicator.style.transform = `translateX(${index * 100}%)`;
                ui.title.textContent = titleMap[value];

                Object.values(contentMap).forEach(el => el.style.display = 'none');
                const target = contentMap[value];
                target.style.display = 'flex';
                triggerReflow(target);
            });
        });
    };

    // --- Discord redirect ---
    const initDiscord = () => {
        if (!ui.discordBtn) return;

        ui.discordBtn.addEventListener('click', (e) => {
            e.preventDefault();

            window.open('https://dsc.gg/rei', '_blank');

            ui.tooltip.textContent = "Join";
            ui.tooltip.style.color = "var(--accent-glow)";

            setTimeout(() => {
                ui.tooltip.textContent = "Discord";
                ui.tooltip.style.color = "white";
            }, 2000);
        });
    };

    const initAmbientGlow = () => {
        ui.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
            });
        });
    };

    const initBlobParallax = () => {
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) - 0.5;
            const y = (e.clientY / window.innerHeight) - 0.5;

            if (ui.blobs[0]) ui.blobs[0].style.transform = `translate(${x * 80}px, ${y * 80}px)`;
            if (ui.blobs[1]) ui.blobs[1].style.transform = `translate(${x * -100}px, ${y * -60}px)`;
            if (ui.blobs[2]) ui.blobs[2].style.transform = `translate(${x * 60}px, ${y * -120}px)`;
        });
    };

    const init = () => {
        ui.cover = $('.cover-page');
        ui.portfolio = $('.portfolio-main');
        ui.enterBtn = $('.enter-btn');
        ui.tabs = $$('input[name="category"]');
        ui.indicator = $('.slider-indicator');
        ui.title = $('#section-title');
        ui.cards = $$('.bento-card');
        ui.blobs = $$('.blob');
        ui.discordBtn = $('#discord-btn');
        ui.tooltip = $('#copy-tooltip');

        contentMap.trading = $('#trading-content');
        contentMap.dev = $('#dev-content');
        contentMap.gaming = $('#gaming-content');

        initCoverAmbient();
        ui.enterBtn?.addEventListener('click', executeCoverTransition);

        initTabSystem();
        initDiscord();
        initAmbientGlow();
        initBlobParallax();

        // OBSŁUGA KLAWIATURY (ENTER + SPACJA)
        document.addEventListener('keydown', (e) => {
            if ((e.key === 'Enter' || e.code === 'Space') && STATE.current === 'COVER') {
                // Zapobiega przewijaniu strony przy naciśnięciu spacji
                if (e.code === 'Space') e.preventDefault();
                
                executeCoverTransition();
            }
        });
    };

    return { init };
})();

document.addEventListener('DOMContentLoaded', Portfolio.init);