let urls = [];

chrome.storage.local.get(["savedUrls"]).then(({ savedUrls }) => {
	urls = savedUrls || [];
});

chrome.storage.onChanged.addListener((changes) => {
	urls = changes.savedUrls.newValue;
});

chrome.webNavigation.onCommitted.addListener(({ tabId, url }) => {
	const origin = new URL(url).origin;

	if (urls.includes(origin)) {
		chrome.scripting.executeScript({
			target: { tabId },
			world: "MAIN",
			injectImmediately: true,
			func: () => localStorage.clear(),
		});
	}
});
