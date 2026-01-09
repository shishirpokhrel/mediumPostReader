// Detect paywall patterns
const paywallSelectors = [
    '.pw-unlocked-post-overlay',
    '.pw-multi-link-post-overlay',
    '#paywall-background-color',
    '[data-test-id="post-sidebar-cta-model"]'
];

function checkPaywall() {
    const isPaywalled = paywallSelectors.some(selector => document.querySelector(selector));
    if (isPaywalled) {
        injectUnlockButton();
    }
}

function injectUnlockButton() {
    if (document.getElementById('medium-post-reader-unlock-btn')) return;

    const btn = document.createElement('div');
    btn.id = 'medium-post-reader-unlock-btn';
    btn.innerHTML = `
    <div style="position: fixed; bottom: 20px; right: 20px; z-index: 9999; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; border-radius: 30px; cursor: pointer; font-family: 'Inter', sans-serif; font-weight: 600; box-shadow: 0 4px 15px rgba(0,0,0,0.3); transition: transform 0.2s;">
      🔓 Read with Freedium
    </div>
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
