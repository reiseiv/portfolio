/**
 * @file overview UI Logic for Portfolio
 * Handles segmented control tabs, clipboard copy, ambient mouse glow, and background parallax.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Config & DOM Elements ---
    const NICKNAME = "reiseiv";
    
    const ui = {
        tabs: document.querySelectorAll('input[name="category"]'),
        indicator: document.querySelector('.slider-indicator'),
        title: document.getElementById('section-title'),
        cards: document.querySelectorAll('.bento-card'),
        blobs: document.querySelectorAll('.blob'),
        discordBtn: document.getElementById('discord-btn'),
        tooltip: document.getElementById('copy-tooltip'),
    };

    const contentMap = {
        'trading': document.getElementById('trading-content'),
        'dev': document.getElementById('dev-content'),
        'gaming': document.getElementById('gaming-content')
    };

    const titleMap = {
        'trading': 'trading achievements',
        'dev': 'design / dev projects',
        'gaming': 'gaming achievements'
    };

    // --- Utils ---
    
    /**
     * Forces reflow to restart CSS animations
     * @param {HTMLElement} element 
     */
    const triggerAnimation = (element) => {
        element.classList.remove('content-fade');
        void element.offsetWidth; // trigger reflow
        element.classList.add('content-fade');
    };

    // --- Event Listeners ---

    // 1. Segmented Control Handler
    ui.tabs.forEach((tab, index) => {
        tab.addEventListener('change', (e) => {
            const selectedValue = e.target.value;
            
            // Move indicator background
            ui.indicator.style.transform = `translateX(${index * 100}%)`;
            
            // Update title
            ui.title.textContent = titleMap[selectedValue];

            // Toggle visibility
            Object.values(contentMap).forEach(el => el.style.display = 'none');
            const targetEl = contentMap[selectedValue];
            targetEl.style.display = 'flex';

            // Trigger enter animation
            triggerAnimation(targetEl);
        });
    });

    // 2. Clipboard Handler (Discord)
    ui.discordBtn?.addEventListener('click', async (e) => {
        e.preventDefault(); 
        
        try {
            await navigator.clipboard.writeText(NICKNAME);
            
            // Success state
            ui.tooltip.textContent = "Copied!";
            ui.tooltip.style.color = "var(--accent-glow)"; 
            
            // Button bounce effect
            ui.discordBtn.style.transform = "scale(0.95)";
            setTimeout(() => { ui.discordBtn.style.transform = "scale(1.1)"; }, 100);
            
            // Reset state
            setTimeout(() => {
                ui.tooltip.textContent = "Copy tag";
                ui.tooltip.style.color = "white";
                ui.discordBtn.style.transform = "";
            }, 2000);

        } catch (err) {
            console.error('Clipboard write failed: ', err);
        }
    });

    // 3. Dynamic Ambient Light Effect
    ui.cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            // Pass mouse coords to CSS custom props
            card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        });
    });

    // 4. Background Blob Parallax
    document.addEventListener('mousemove', (e) => {
        // Normalize mouse coordinates (-0.5 to 0.5)
        const x = (e.clientX / window.innerWidth) - 0.5;
        const y = (e.clientY / window.innerHeight) - 0.5;

        // Apply distinct translation vectors for parallax depth
        if(ui.blobs[0]) ui.blobs[0].style.transform = `translate(${x * 80}px, ${y * 80}px)`;
        if(ui.blobs[1]) ui.blobs[1].style.transform = `translate(${x * -100}px, ${y * -60}px)`;
        if(ui.blobs[2]) ui.blobs[2].style.transform = `translate(${x * 60}px, ${y * -120}px)`;
    });
});