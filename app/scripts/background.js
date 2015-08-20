chrome.tabs.onUpdated.addListener(function(tabId, state, tab) {
  if (tab.url.match(/github\.com\/([a-z0-9_\-\.]+)\/([a-z0-9_\-\.]+)\/issues\/(\d+)/i)) {
    chrome.pageAction.show(tabId);
  } else {
    chrome.pageAction.hide(tabId);
  }
});
