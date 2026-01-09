document.getElementById('unlockBtn').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url) {
        const freediumUrl = `https://freedium.cfd/${tab.url}`;
        chrome.tabs.create({ url: freediumUrl });
    }
});

document.getElementById('clearCookiesBtn').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: "clearCookies" }, (response) => {
        const status = document.getElementById('statusMsg');
        status.innerText = "Cookies cleared! Reloading...";
        setTimeout(() => {
            chrome.tabs.reload();
            window.close();
        }, 1500);
    });
});
