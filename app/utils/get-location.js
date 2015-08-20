export default function getLocation() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      let tab = tabs[0];
      if (! tab) {
        return reject(new Error('Could not find tab'));
      }

      let matches = tab.url.match(/github\.com\/([a-z0-9_\-\.]+)\/([a-z0-9_\-\.]+)\/issues\/(\d+)/i);
      if (matches.length !== 4) {
        return reject(new Error('Location does not match'));
      }

      let owner = matches[1];
      let repo = matches[2];
      let issue = matches[3];

      return resolve({
        owner, repo, issue,
      });
    });
  });
}
