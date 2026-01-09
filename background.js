chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "clearCookies") {
    // Attempt to clear and then alert user to refresh
    chrome.browsingData.remove({
      "since": 0
    }, {
      "cookies": true,
      "cache": true,
      "localStorage": true
    }, () => {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'Medium Reader',
        message: 'Cookies and Cache cleared for ALL sites (most reliable for custom domains).'
      });
      sendResponse({ status: "done" });
    });
    return true;
  }
});

// Optional: Auto-redirect logic can be added here if needed
