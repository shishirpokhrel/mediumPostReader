// 1. Detection Logic with broad meta & link checks
function isMedium() {
  const metaTags = [
    'meta[property="og:site_name"][content*="Medium"]',
    'meta[name="al:ios:app_name"][content="Medium"]',
    'meta[property="al:ios:app_name"][content="Medium"]',
    'meta[name="twitter:app:id:googleplay"][content="com.medium.reader"]',
    'meta[name="medium-site"]',
    'link[rel="search"][type="application/opensearchdescription+xml"][href*="medium.com"]'
  ];
  const detected = metaTags.some(selector => document.querySelector(selector)) ||
    window.location.hostname.includes('medium.com');

  if (detected) console.log("%c[Medium Reader]%c Medium platform detected!", "color: purple; font-weight: bold", "color: inherit");
  return detected;
}

function hasPaywall() {
  const selectors = [
    '.pw-unlocked-post-overlay',
    '.pw-multi-link-post-overlay',
    '[data-test-id="post-sidebar-cta-model"]',
    '.extreme-blur',
    'div.pw-regwall',
    '#paywall-wrapper',
    'div[style*="rgba(255, 255, 255, 0.9)"]',
    '#paywall-background-color'
  ];
  const foundPaywall = selectors.some(s => document.querySelector(s)) ||
    document.body?.style.overflow === 'hidden' ||
    document.documentElement?.style.overflow === 'hidden';

  if (foundPaywall) console.log("%c[Medium Reader]%c Paywall elements detected!", "color: red; font-weight: bold", "color: inherit");
  return foundPaywall;
}

// 2. Shadow DOM Banner Injection (Shield-proof)
function injectTopBanner() {
  if (document.getElementById('medium-reader-host')) return;

  const host = document.createElement('div');
  host.id = 'medium-reader-host';
  host.style = 'position: fixed; top: 0; left: 0; width: 100%; z-index: 2147483647;';

  const shadow = host.attachShadow({ mode: 'closed' });

  const banner = document.createElement('div');
  banner.innerHTML = `
    <style>
      .banner {
        background: linear-gradient(90deg, #1e3a8a 0%, #7e22ce 100%);
        color: white; padding: 12px 20px; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        display: flex; justify-content: space-between; align-items: center;
        box-shadow: 0 4px 15px rgba(0,0,0,0.5); font-weight: bold; font-size: 14px;
      }
      .btns { display: flex; gap: 8px; }
      button {
        background: white; color: #1e3a8a; border: none; padding: 6px 14px; 
        border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 12px;
        transition: transform 0.1s, background 0.2s;
      }
      button:hover { transform: translateY(-1px); background: #f3f4f6; }
      button.smry { color: #7e22ce; }
      button.archive { color: #ef4444; }
      .close { background: transparent; color: white; border: none; font-size: 20px; cursor: pointer; padding: 0 5px; }
    </style>
    <div class="banner">
      <div>🔓 Medium Reader: Paywall Detected</div>
      <div class="btns">
        <button id="proxy-freedium">Freedium</button>
        <button id="proxy-smry" class="smry">Smry.ai</button>
        <button id="proxy-archive" class="archive">Archive.is</button>
        <button id="proxy-google">Google Cache</button>
        <button class="close" id="close-btn">×</button>
      </div>
    </div>
  `;

  shadow.appendChild(banner);

  // Wait for body to exist
  const target = document.body || document.documentElement;
  target.prepend(host);
  if (document.body) document.body.style.marginTop = '45px';

  shadow.getElementById('proxy-freedium').onclick = () => window.location.href = `https://freedium.cfd/${window.location.href}`;
  shadow.getElementById('proxy-smry').onclick = () => window.location.href = `https://smry.ai/proxy?url=${encodeURIComponent(window.location.href)}`;
  shadow.getElementById('proxy-archive').onclick = () => window.location.href = `https://archive.is/latest/${window.location.href}`;
  shadow.getElementById('proxy-google').onclick = () => window.location.href = `https://webcache.googleusercontent.com/search?q=cache:${encodeURIComponent(window.location.href)}`;
  shadow.getElementById('close-btn').onclick = () => {
    host.remove();
    if (document.body) document.body.style.marginTop = '0';
  };
}

// 3. Execution Loop
function loop() {
  if (isMedium()) {
    // Initial cleanup of body overflow
    if (document.body) document.body.style.overflow = 'auto';
    if (document.documentElement) document.documentElement.style.overflow = 'auto';

    if (hasPaywall()) {
      injectTopBanner();
    }
  }
}

// Polling is most reliable for SPA-like navigation in Medium
setInterval(loop, 2000);
setTimeout(loop, 500); // Initial fast check
