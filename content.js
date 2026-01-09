// Detect paywall patterns
const paywallSelectors = [
    '.pw-unlocked-post-overlay',
    '.pw-multi-link-post-overlay',
    '#paywall-background-color',
    '[data-test-id="post-sidebar-cta-model"]',
    '.extreme-blur',
    'div[style*="background-color: rgba(255, 255, 255, 0.9)"]',
    'div.l.bg-cover'
];

function checkPaywall() {
    const isPaywalled = paywallSelectors.some(selector => document.querySelector(selector));

    // Also check for hidden overflow on body/html which usually indicates an overlay
    const hasHiddenOverflow = document.body.style.overflow === 'hidden' ||
        document.documentElement.style.overflow === 'hidden';

    if (isPaywalled || hasHiddenOverflow) {
        // Force cleanup
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';

        // Hide known overlays
        paywallSelectors.forEach(selector => {
            const el = document.querySelector(selector);
            if (el) el.style.display = 'none';
        });

        injectUnlockButton();
    }
}

function injectUnlockButton() {
    if (document.getElementById('medium-post-reader-unlock-btn')) return;

    const btn = document.createElement('div');
    btn.id = 'medium-post-reader-unlock-btn';
    btn.innerHTML = `
    <div style="position: fixed; bottom: 30px; right: 30px; z-index: 10000; background: linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%); color: white; padding: 15px 30px; border-radius: 50px; cursor: pointer; font-family: 'Inter', sans-serif; font-weight: bold; box-shadow: 0 10px 25px rgba(255, 65, 108, 0.5); border: 2px solid white; animation: pulse 2s infinite;">
      🚀 FULL UNLOCK (FREEDIUM)
    </div>
    <style>
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
    </style>
  `;

    btn.onclick = () => {
        const currentUrl = window.location.href;
        window.location.href = `https://freedium.cfd/${currentUrl}`;
    };

    document.body.appendChild(btn);
}

// Check on load
checkPaywall();

// Observe for dynamic changes
const observer = new MutationObserver(checkPaywall);
observer.observe(document.body, { childList: true, subtree: true });
