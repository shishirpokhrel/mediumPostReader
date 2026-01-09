chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "clearCookies") {
    chrome.cookies.getAll({ domain: "medium.com" }, (cookies) => {
      for (const cookie of cookies) {
        const url = `http${cookie.secure ? "s" : ""}://${cookie.domain}${cookie.path}`;
        chrome.cookies.remove({ url: url, name: cookie.name });
      }
      sendResponse({ status: "done" });
    });
    return true; // Keep channel open for async response
  }
});

// Optional: Auto-redirect logic can be added here if needed
