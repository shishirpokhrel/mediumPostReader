document.getElementById('forceUnlockBtn').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url) {
        // Default to Freedium for force unlock
        window.open(`https://freedium.cfd/${tab.url}`, '_blank');
    }
});

document.getElementById('clearCookiesBtn').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: "clearCookies" }, (response) => {
        const status = document.getElementById('statusMsg');
        status.innerText = "Deep Reset Complete!";
        status.style.color = "#4ade80";
        setTimeout(() => {
            chrome.tabs.reload();
            window.close();
        }, 1500);
    });
});

// Diagnostics
async function updateStatus() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const domainInfo = document.getElementById('domainInfo');
    const statusMsg = document.getElementById('statusMsg');

    if (tab && tab.url) {
        const url = new URL(tab.url);
        domainInfo.innerText = `Current Domain: ${url.hostname}`;

        // We can't easily check meta tags from here without scripting
        // But we show that we are ready
        statusMsg.innerText = "Monitoring current page...";
    }
}

updateStatus();
